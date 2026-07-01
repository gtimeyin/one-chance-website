<?php
/**
 * Frequently Bought Together Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_FBT_Module extends YVP_Module
{

    protected $name = 'fbt';

    /**
     * Initialize the module
     */
    protected function init()
    {
        if (!$this->is_enabled()) {
            return;
        }

        // Product page display
        $this->loader->add_action('woocommerce_after_single_product_summary', $this, 'display_fbt', 12);

        // Admin hooks for product meta
        $this->loader->add_action('woocommerce_product_data_tabs', $this, 'add_fbt_tab');
        $this->loader->add_action('woocommerce_product_data_panels', $this, 'add_fbt_panel');
        $this->loader->add_action('woocommerce_process_product_meta', $this, 'save_fbt_data');

        // AJAX handlers
        $this->loader->add_action('wp_ajax_yvp_add_fbt_to_cart', $this, 'ajax_add_fbt_to_cart');
        $this->loader->add_action('wp_ajax_nopriv_yvp_add_fbt_to_cart', $this, 'ajax_add_fbt_to_cart');
    }

    /**
     * Display FBT section on product page
     */
    public function display_fbt()
    {
        global $product;

        if (!$product) {
            return;
        }

        $fbt_data = $this->get_fbt_data($product->get_id());

        if (empty($fbt_data) || empty($fbt_data['products'])) {
            return;
        }

        $products = $fbt_data['products'];
        $discount = $fbt_data['discount'];
        $main_product = $product;

        // Calculate total and savings
        $original_total = floatval($product->get_price());
        $fbt_products = [];

        foreach ($products as $fbt_item) {
            $fbt_product = wc_get_product($fbt_item['product_id']);
            if ($fbt_product && $fbt_product->is_purchasable()) {
                $fbt_products[] = [
                    'product' => $fbt_product,
                    'quantity' => $fbt_item['quantity'] ?? 1,
                ];
                $original_total += floatval($fbt_product->get_price()) * ($fbt_item['quantity'] ?? 1);
            }
        }

        if (empty($fbt_products)) {
            return;
        }

        // Calculate discounted total
        $discounted_total = $original_total;
        if ($discount) {
            if ($discount['type'] === 'percentage') {
                $discounted_total = $original_total * (1 - $discount['value'] / 100);
            } else {
                $discounted_total = $original_total - $discount['value'];
            }
        }

        $savings = $original_total - $discounted_total;

        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/fbt-display.php';
    }

    /**
     * Get FBT data for a product
     */
    public function get_fbt_data($product_id)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'yvp_fbt_pairs';

        $fbt = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE product_id = %d AND status = 'active'",
            $product_id
        ));

        if (!$fbt) {
            return null;
        }

        return [
            'products' => json_decode($fbt->paired_products, true) ?: [],
            'discount' => $fbt->discount_type ? [
                'type' => $fbt->discount_type,
                'value' => floatval($fbt->discount_value),
            ] : null,
        ];
    }

    /**
     * Add FBT tab to product data
     */
    public function add_fbt_tab($tabs)
    {
        $tabs['yvp_fbt'] = [
            'label' => __('Bought Together', 'yvp-sales-booster'),
            'target' => 'yvp_fbt_data',
            'class' => [],
            'priority' => 75,
        ];
        return $tabs;
    }

    /**
     * Add FBT panel content
     */
    public function add_fbt_panel()
    {
        global $post;

        $fbt_data = $this->get_fbt_data($post->ID);
        $paired_products = $fbt_data ? $fbt_data['products'] : [];
        $discount = $fbt_data ? $fbt_data['discount'] : null;

        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'admin/views/fbt-product-panel.php';
    }

    /**
     * Save FBT data
     */
    public function save_fbt_data($post_id)
    {
        if (!isset($_POST['yvp_fbt_products'])) {
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_fbt_pairs';

        // Delete existing
        $wpdb->delete($table, ['product_id' => $post_id]);

        // Parse products
        $products = [];
        foreach ($_POST['yvp_fbt_products'] as $item) {
            if (!empty($item['product_id'])) {
                $products[] = [
                    'product_id' => absint($item['product_id']),
                    'quantity' => max(1, absint($item['quantity'] ?? 1)),
                ];
            }
        }

        if (empty($products)) {
            return;
        }

        // Insert new data
        $wpdb->insert($table, [
            'product_id' => $post_id,
            'paired_products' => wp_json_encode($products),
            'discount_type' => sanitize_text_field($_POST['yvp_fbt_discount_type'] ?? ''),
            'discount_value' => floatval($_POST['yvp_fbt_discount_value'] ?? 0),
            'status' => 'active',
        ]);
    }

    /**
     * AJAX add FBT products to cart
     */
    public function ajax_add_fbt_to_cart()
    {
        check_ajax_referer('yvp_public_nonce', 'nonce');

        $main_product_id = absint($_POST['main_product_id']);
        $fbt_product_ids = array_map('absint', $_POST['fbt_product_ids'] ?? []);

        // Add main product
        WC()->cart->add_to_cart($main_product_id);

        // Add FBT products
        $fbt_data = $this->get_fbt_data($main_product_id);
        $fbt_products = $fbt_data ? $fbt_data['products'] : [];

        foreach ($fbt_products as $item) {
            if (in_array($item['product_id'], $fbt_product_ids)) {
                WC()->cart->add_to_cart($item['product_id'], $item['quantity']);
            }
        }

        // Apply discount via coupon if configured
        if ($fbt_data && $fbt_data['discount']) {
            // Could implement temporary coupon or direct cart discount
            // For now, discount is shown in display but full implementation
            // would require a dynamic coupon system
        }

        wp_send_json_success([
            'cart_url' => wc_get_cart_url(),
            'fragments' => WC_AJAX::get_refreshed_fragments(),
        ]);
    }
}
