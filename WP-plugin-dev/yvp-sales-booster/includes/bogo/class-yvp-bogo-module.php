<?php
/**
 * BOGO Deals Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_BOGO_Module extends YVP_Module
{

    protected $name = 'bogo';

    /**
     * Initialize the module
     */
    protected function init()
    {
        if (!$this->is_enabled()) {
            return;
        }

        // Cart hooks
        $this->loader->add_action('woocommerce_before_calculate_totals', $this, 'apply_bogo_deals', 20);
        $this->loader->add_action('woocommerce_cart_item_removed', $this, 'check_bogo_on_remove', 10, 2);

        // Display deal badge on products
        $this->loader->add_action('woocommerce_before_shop_loop_item_title', $this, 'display_bogo_badge', 5);
        $this->loader->add_action('woocommerce_single_product_summary', $this, 'display_bogo_notice', 6);

        // Admin AJAX
        $this->loader->add_action('wp_ajax_yvp_save_bogo_deal', $this, 'ajax_save_deal');
        $this->loader->add_action('wp_ajax_yvp_delete_bogo_deal', $this, 'ajax_delete_deal');
    }

    /**
     * Apply BOGO deals to cart
     */
    public function apply_bogo_deals($cart)
    {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        if (did_action('woocommerce_before_calculate_totals') >= 2) {
            return;
        }

        $deals = $this->get_active_deals();

        foreach ($deals as $deal) {
            $this->process_deal($cart, $deal);
        }
    }

    /**
     * Process a single BOGO deal
     */
    private function process_deal($cart, $deal)
    {
        $buy_items = $this->find_qualifying_items($cart, $deal, 'buy');

        if (empty($buy_items)) {
            return;
        }

        // Calculate how many times the deal applies
        $buy_quantity_required = intval($deal->buy_quantity);
        $total_buy_quantity = array_sum(wp_list_pluck($buy_items, 'quantity'));
        $times_applied = floor($total_buy_quantity / $buy_quantity_required);

        if ($times_applied < 1) {
            return;
        }

        // Find or add the "get" items
        $get_quantity = intval($deal->get_quantity) * $times_applied;

        $this->apply_deal_discount($cart, $deal, $get_quantity);
    }

    /**
     * Find qualifying items in cart
     */
    private function find_qualifying_items($cart, $deal, $type)
    {
        $qualifying_value = $type === 'buy' ?
            json_decode($deal->buy_value, true) :
            json_decode($deal->get_value, true);

        $qualifying_type = $type === 'buy' ? $deal->buy_type : $deal->get_type;

        $qualifying_items = [];

        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            $product = $cart_item['data'];
            $product_id = $cart_item['product_id'];

            $matches = false;

            switch ($qualifying_type) {
                case 'products':
                    $matches = in_array($product_id, $qualifying_value);
                    break;

                case 'categories':
                    $product_cats = wc_get_product_term_ids($product_id, 'product_cat');
                    $matches = !empty(array_intersect($product_cats, $qualifying_value));
                    break;

                case 'all':
                    $matches = true;
                    break;
            }

            if ($matches) {
                $qualifying_items[$cart_item_key] = [
                    'product_id' => $product_id,
                    'quantity' => $cart_item['quantity'],
                    'price' => floatval($product->get_price()),
                ];
            }
        }

        return $qualifying_items;
    }

    /**
     * Apply deal discount to qualifying items
     */
    private function apply_deal_discount($cart, $deal, $get_quantity)
    {
        $get_items = $this->find_qualifying_items($cart, $deal, 'get');

        if (empty($get_items)) {
            // If no specific get items, use same as buy items
            $get_items = $this->find_qualifying_items($cart, $deal, 'buy');
        }

        if (empty($get_items)) {
            return;
        }

        // Sort by price (ascending) to discount cheapest items
        uasort($get_items, function ($a, $b) {
            return $a['price'] <=> $b['price'];
        });

        $discounted_quantity = 0;

        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            if (!isset($get_items[$cart_item_key])) {
                continue;
            }

            $item_quantity = $cart_item['quantity'];
            $to_discount = min($item_quantity, $get_quantity - $discounted_quantity);

            if ($to_discount <= 0) {
                break;
            }

            $product = $cart_item['data'];
            $original_price = floatval($product->get_price());

            // Calculate discounted price
            $discount_amount = 0;

            switch ($deal->discount_type) {
                case 'free':
                    $discount_amount = $original_price;
                    break;

                case 'percentage':
                    $discount_amount = $original_price * (floatval($deal->discount_value) / 100);
                    break;

                case 'fixed':
                    $discount_amount = floatval($deal->discount_value);
                    break;
            }

            // Apply to cart item (for discounted quantity only)
            // This is simplified - a more complex implementation would split cart items
            if ($to_discount === $item_quantity) {
                $cart_item['data']->set_price($original_price - $discount_amount);
            }

            // Store deal info in cart item
            WC()->cart->cart_contents[$cart_item_key]['yvp_bogo_deal'] = [
                'deal_id' => $deal->id,
                'deal_name' => $deal->deal_name,
                'discount_amount' => $discount_amount,
                'discounted_quantity' => $to_discount,
            ];

            $discounted_quantity += $to_discount;
        }
    }

    /**
     * Check BOGO deals when item removed
     */
    public function check_bogo_on_remove($cart_item_key, $cart)
    {
        // Recalculate deals on next cart calculation
    }

    /**
     * Display BOGO badge on product
     */
    public function display_bogo_badge()
    {
        global $product;

        if (!$product) {
            return;
        }

        $deals = $this->get_product_deals($product->get_id());

        if (empty($deals)) {
            return;
        }

        $deal = $deals[0];
        echo '<span class="yvp-bogo-badge">' . esc_html($deal->deal_name) . '</span>';
    }

    /**
     * Display BOGO notice on single product
     */
    public function display_bogo_notice()
    {
        global $product;

        if (!$product) {
            return;
        }

        $deals = $this->get_product_deals($product->get_id());

        if (empty($deals)) {
            return;
        }

        $deal = $deals[0];
        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/bogo-notice.php';
    }

    /**
     * Get active BOGO deals
     */
    public function get_active_deals()
    {
        global $wpdb;
        $table = $wpdb->prefix . 'yvp_bogo_deals';
        $now = current_time('mysql');

        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table 
             WHERE status = 'active' 
             AND (start_date IS NULL OR start_date <= %s)
             AND (end_date IS NULL OR end_date >= %s)
             ORDER BY priority DESC",
            $now,
            $now
        ));
    }

    /**
     * Get deals that apply to a specific product
     */
    public function get_product_deals($product_id)
    {
        $deals = $this->get_active_deals();
        $product_deals = [];

        $product_cats = wc_get_product_term_ids($product_id, 'product_cat');

        foreach ($deals as $deal) {
            $buy_value = json_decode($deal->buy_value, true) ?: [];

            $matches = false;

            switch ($deal->buy_type) {
                case 'products':
                    $matches = in_array($product_id, $buy_value);
                    break;

                case 'categories':
                    $matches = !empty(array_intersect($product_cats, $buy_value));
                    break;

                case 'all':
                    $matches = true;
                    break;
            }

            if ($matches) {
                $product_deals[] = $deal;
            }
        }

        return $product_deals;
    }

    /**
     * AJAX save deal
     */
    public function ajax_save_deal()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_bogo_deals';

        $data = [
            'deal_name' => sanitize_text_field($_POST['deal_name']),
            'buy_type' => sanitize_text_field($_POST['buy_type']),
            'buy_value' => wp_json_encode($_POST['buy_value'] ?? []),
            'buy_quantity' => absint($_POST['buy_quantity']),
            'get_type' => sanitize_text_field($_POST['get_type']),
            'get_value' => wp_json_encode($_POST['get_value'] ?? []),
            'get_quantity' => absint($_POST['get_quantity']),
            'discount_type' => sanitize_text_field($_POST['discount_type']),
            'discount_value' => floatval($_POST['discount_value'] ?? 0),
            'start_date' => !empty($_POST['start_date']) ? sanitize_text_field($_POST['start_date']) : null,
            'end_date' => !empty($_POST['end_date']) ? sanitize_text_field($_POST['end_date']) : null,
            'priority' => absint($_POST['priority'] ?? 0),
            'status' => sanitize_text_field($_POST['status'] ?? 'active'),
        ];

        $deal_id = absint($_POST['deal_id'] ?? 0);

        if ($deal_id) {
            $wpdb->update($table, $data, ['id' => $deal_id]);
        } else {
            $wpdb->insert($table, $data);
            $deal_id = $wpdb->insert_id;
        }

        wp_send_json_success(['deal_id' => $deal_id]);
    }

    /**
     * AJAX delete deal
     */
    public function ajax_delete_deal()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_bogo_deals';

        $deal_id = absint($_POST['deal_id']);
        $wpdb->delete($table, ['id' => $deal_id]);

        wp_send_json_success();
    }
}
