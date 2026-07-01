<?php
/**
 * Order Bumps Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Bump_Module extends YVP_Module
{

    protected $name = 'bumps';

    /**
     * Initialize the module
     */
    protected function init()
    {
        if (!$this->is_enabled()) {
            return;
        }

        // Checkout display hooks
        $this->loader->add_action('woocommerce_review_order_before_payment', $this, 'display_bumps_before_payment');
        $this->loader->add_action('woocommerce_review_order_after_order_total', $this, 'display_bumps_after_total');

        // AJAX handlers
        $this->loader->add_action('wp_ajax_yvp_accept_bump', $this, 'ajax_accept_bump');
        $this->loader->add_action('wp_ajax_nopriv_yvp_accept_bump', $this, 'ajax_accept_bump');
        $this->loader->add_action('wp_ajax_yvp_remove_bump', $this, 'ajax_remove_bump');
        $this->loader->add_action('wp_ajax_nopriv_yvp_remove_bump', $this, 'ajax_remove_bump');

        // Admin AJAX
        $this->loader->add_action('wp_ajax_yvp_save_bump', $this, 'ajax_save_bump');
        $this->loader->add_action('wp_ajax_yvp_delete_bump', $this, 'ajax_delete_bump');
    }

    /**
     * Display bumps before payment section
     */
    public function display_bumps_before_payment()
    {
        $this->display_bumps('before_payment');
    }

    /**
     * Display bumps after order total
     */
    public function display_bumps_after_total()
    {
        $this->display_bumps('after_total');
    }

    /**
     * Display bumps for a specific location
     */
    private function display_bumps($location)
    {
        $bumps = $this->get_applicable_bumps($location);

        if (empty($bumps)) {
            return;
        }

        foreach ($bumps as $bump) {
            $this->render_bump($bump);
        }
    }

    /**
     * Render a single bump
     */
    private function render_bump($bump)
    {
        $product = wc_get_product($bump->product_id);

        if (!$product || !$product->is_purchasable()) {
            return;
        }

        // Check if already in cart
        $in_cart = $this->is_bump_in_cart($bump->id);

        // Calculate discounted price
        $original_price = floatval($product->get_price());
        $discounted_price = $original_price;

        if ($bump->discount_type && $bump->discount_value) {
            if ($bump->discount_type === 'percentage') {
                $discounted_price = $original_price * (1 - floatval($bump->discount_value) / 100);
            } else {
                $discounted_price = $original_price - floatval($bump->discount_value);
            }
        }

        $savings = $original_price - $discounted_price;

        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/order-bump.php';
    }

    /**
     * Get applicable bumps for cart and location
     */
    public function get_applicable_bumps($location)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'yvp_order_bumps';

        $bumps = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE display_location = %s AND status = 'active' ORDER BY priority DESC",
            $location
        ));

        $cart_items = WC()->cart->get_cart();
        $cart_product_ids = wp_list_pluck($cart_items, 'product_id');
        $cart_total = WC()->cart->get_cart_contents_total();

        $applicable = [];

        foreach ($bumps as $bump) {
            // Don't show if bump product is already in cart
            if (in_array($bump->product_id, $cart_product_ids)) {
                continue;
            }

            // Check trigger conditions
            if (!$this->bump_applies($bump, $cart_product_ids, $cart_total)) {
                continue;
            }

            $applicable[] = $bump;
        }

        return $applicable;
    }

    /**
     * Check if bump applies to current cart
     */
    private function bump_applies($bump, $cart_product_ids, $cart_total)
    {
        $trigger_value = json_decode($bump->trigger_value, true);

        switch ($bump->trigger_type) {
            case 'all':
                return true;

            case 'products':
                return !empty(array_intersect($cart_product_ids, $trigger_value));

            case 'categories':
                foreach ($cart_product_ids as $product_id) {
                    $product_cats = wc_get_product_term_ids($product_id, 'product_cat');
                    if (!empty(array_intersect($product_cats, $trigger_value))) {
                        return true;
                    }
                }
                return false;

            case 'cart_total_min':
                return $cart_total >= floatval($trigger_value);

            case 'cart_total_max':
                return $cart_total <= floatval($trigger_value);

            default:
                return true;
        }
    }

    /**
     * Check if bump is already in cart
     */
    private function is_bump_in_cart($bump_id)
    {
        foreach (WC()->cart->get_cart() as $cart_item) {
            if (!empty($cart_item['yvp_order_bump']) && $cart_item['yvp_order_bump']['bump_id'] == $bump_id) {
                return true;
            }
        }
        return false;
    }

    /**
     * AJAX accept bump
     */
    public function ajax_accept_bump()
    {
        check_ajax_referer('yvp_public_nonce', 'nonce');

        $bump_id = absint($_POST['bump_id']);

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_order_bumps';

        $bump = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE id = %d",
            $bump_id
        ));

        if (!$bump) {
            wp_send_json_error('Bump not found');
        }

        $product = wc_get_product($bump->product_id);
        if (!$product || !$product->is_purchasable()) {
            wp_send_json_error('Product not available');
        }

        // Calculate discounted price
        $original_price = floatval($product->get_price());
        $discounted_price = $original_price;

        if ($bump->discount_type && $bump->discount_value) {
            if ($bump->discount_type === 'percentage') {
                $discounted_price = $original_price * (1 - floatval($bump->discount_value) / 100);
            } else {
                $discounted_price = $original_price - floatval($bump->discount_value);
            }
        }

        // Add to cart with bump data
        $cart_item_data = [
            'yvp_order_bump' => [
                'bump_id' => $bump_id,
                'bump_name' => $bump->bump_name,
                'original_price' => $original_price,
                'discounted_price' => $discounted_price,
            ],
        ];

        $cart_item_key = WC()->cart->add_to_cart($bump->product_id, 1, 0, [], $cart_item_data);

        if ($cart_item_key) {
            // Apply the discounted price
            WC()->cart->cart_contents[$cart_item_key]['data']->set_price($discounted_price);

            wp_send_json_success([
                'cart_item_key' => $cart_item_key,
                'fragments' => WC_AJAX::get_refreshed_fragments(),
            ]);
        }

        wp_send_json_error('Could not add to cart');
    }

    /**
     * AJAX remove bump
     */
    public function ajax_remove_bump()
    {
        check_ajax_referer('yvp_public_nonce', 'nonce');

        $bump_id = absint($_POST['bump_id']);

        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            if (!empty($cart_item['yvp_order_bump']) && $cart_item['yvp_order_bump']['bump_id'] == $bump_id) {
                WC()->cart->remove_cart_item($cart_item_key);
                break;
            }
        }

        wp_send_json_success([
            'fragments' => WC_AJAX::get_refreshed_fragments(),
        ]);
    }

    /**
     * AJAX save bump
     */
    public function ajax_save_bump()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_order_bumps';

        $data = [
            'bump_name' => sanitize_text_field($_POST['bump_name']),
            'product_id' => absint($_POST['product_id']),
            'trigger_type' => sanitize_text_field($_POST['trigger_type']),
            'trigger_value' => wp_json_encode($_POST['trigger_value'] ?? []),
            'discount_type' => sanitize_text_field($_POST['discount_type'] ?? ''),
            'discount_value' => floatval($_POST['discount_value'] ?? 0),
            'display_location' => sanitize_text_field($_POST['display_location']),
            'headline' => sanitize_text_field($_POST['headline'] ?? ''),
            'description' => sanitize_textarea_field($_POST['description'] ?? ''),
            'priority' => absint($_POST['priority'] ?? 0),
            'status' => sanitize_text_field($_POST['status'] ?? 'active'),
        ];

        $bump_id = absint($_POST['bump_id'] ?? 0);

        if ($bump_id) {
            $wpdb->update($table, $data, ['id' => $bump_id]);
        } else {
            $wpdb->insert($table, $data);
            $bump_id = $wpdb->insert_id;
        }

        wp_send_json_success(['bump_id' => $bump_id]);
    }

    /**
     * AJAX delete bump
     */
    public function ajax_delete_bump()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_order_bumps';

        $bump_id = absint($_POST['bump_id']);
        $wpdb->delete($table, ['id' => $bump_id]);

        wp_send_json_success();
    }
}
