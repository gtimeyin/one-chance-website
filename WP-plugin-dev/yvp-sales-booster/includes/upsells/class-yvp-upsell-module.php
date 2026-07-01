<?php
/**
 * Upsells & Cross-sells Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Upsell_Module extends YVP_Module
{

    protected $name = 'upsells';

    /**
     * Initialize the module
     */
    protected function init()
    {
        if (!$this->is_enabled()) {
            return;
        }

        // Product page hooks
        $this->loader->add_action('woocommerce_after_single_product_summary', $this, 'display_upsells', 15);
        $this->loader->add_action('woocommerce_after_single_product_summary', $this, 'display_cross_sells', 16);

        // Cart page hooks
        $this->loader->add_action('woocommerce_after_cart_table', $this, 'display_cart_upsells');

        // AJAX handlers
        $this->loader->add_action('wp_ajax_yvp_save_upsell_rule', $this, 'ajax_save_rule');
        $this->loader->add_action('wp_ajax_yvp_delete_upsell_rule', $this, 'ajax_delete_rule');
    }

    /**
     * Display upsells on product page
     */
    public function display_upsells()
    {
        global $product;

        if (!$product) {
            return;
        }

        $upsells = $this->get_product_recommendations($product->get_id(), 'upsell');

        if (empty($upsells)) {
            return;
        }

        $heading = __('You may also like', 'yvp-sales-booster');
        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/upsells-display.php';
    }

    /**
     * Display cross-sells on product page
     */
    public function display_cross_sells()
    {
        global $product;

        if (!$product) {
            return;
        }

        $cross_sells = $this->get_product_recommendations($product->get_id(), 'cross_sell');

        if (empty($cross_sells)) {
            return;
        }

        $heading = __('Pairs well with', 'yvp-sales-booster');
        $products = $cross_sells;
        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/upsells-display.php';
    }

    /**
     * Display upsells on cart page
     */
    public function display_cart_upsells()
    {
        $cart_items = WC()->cart->get_cart();
        $product_ids = wp_list_pluck($cart_items, 'product_id');

        $upsells = [];
        foreach ($product_ids as $product_id) {
            $product_upsells = $this->get_product_recommendations($product_id, 'upsell', 'cart_page');
            $upsells = array_merge($upsells, $product_upsells);
        }

        // Remove duplicates and items already in cart
        $upsells = array_unique($upsells, SORT_REGULAR);
        $upsells = array_filter($upsells, function ($item) use ($product_ids) {
            return !in_array($item['product_id'], $product_ids);
        });

        if (empty($upsells)) {
            return;
        }

        $upsells = array_slice($upsells, 0, 4);
        $heading = __('Add these to your order', 'yvp-sales-booster');
        $products = $upsells;
        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/cart-upsells-display.php';
    }

    /**
     * Get product recommendations based on rules
     */
    public function get_product_recommendations($product_id, $type = 'upsell', $location = 'product_page')
    {
        global $wpdb;
        $table = $wpdb->prefix . 'yvp_upsell_rules';

        $product = wc_get_product($product_id);
        if (!$product) {
            return [];
        }

        // Get applicable rules
        $rules = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE rule_type = %s AND display_location = %s AND status = 'active' ORDER BY priority DESC",
            $type,
            $location
        ));

        $recommendations = [];

        foreach ($rules as $rule) {
            if (!$this->rule_applies($rule, $product)) {
                continue;
            }

            $product_ids = json_decode($rule->product_ids, true) ?: [];

            foreach ($product_ids as $rec_product_id) {
                $rec_product = wc_get_product($rec_product_id);
                if (!$rec_product || !$rec_product->is_purchasable()) {
                    continue;
                }

                $discount = null;
                if ($rule->discount_type && $rule->discount_value) {
                    $discount = [
                        'type' => $rule->discount_type,
                        'value' => floatval($rule->discount_value),
                    ];
                }

                $recommendations[] = [
                    'product_id' => $rec_product_id,
                    'product' => $rec_product,
                    'discount' => $discount,
                    'rule_id' => $rule->id,
                ];
            }
        }

        return $recommendations;
    }

    /**
     * Check if rule applies to product
     */
    private function rule_applies($rule, $product)
    {
        $trigger_value = json_decode($rule->trigger_value, true) ?: [];

        switch ($rule->trigger_type) {
            case 'specific_products':
                return in_array($product->get_id(), $trigger_value);

            case 'categories':
                $product_cats = $product->get_category_ids();
                return !empty(array_intersect($product_cats, $trigger_value));

            case 'tags':
                $product_tags = $product->get_tag_ids();
                return !empty(array_intersect($product_tags, $trigger_value));

            case 'price_range':
                $price = floatval($product->get_price());
                $min = floatval($trigger_value['min'] ?? 0);
                $max = floatval($trigger_value['max'] ?? PHP_INT_MAX);
                return $price >= $min && $price <= $max;

            case 'all':
                return true;

            default:
                return false;
        }
    }

    /**
     * AJAX save rule
     */
    public function ajax_save_rule()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_upsell_rules';

        $data = [
            'rule_name' => sanitize_text_field($_POST['rule_name']),
            'rule_type' => sanitize_text_field($_POST['rule_type']),
            'trigger_type' => sanitize_text_field($_POST['trigger_type']),
            'trigger_value' => wp_json_encode($_POST['trigger_value'] ?? []),
            'product_ids' => wp_json_encode(array_map('absint', $_POST['product_ids'] ?? [])),
            'discount_type' => sanitize_text_field($_POST['discount_type'] ?? ''),
            'discount_value' => floatval($_POST['discount_value'] ?? 0),
            'display_location' => sanitize_text_field($_POST['display_location']),
            'priority' => absint($_POST['priority'] ?? 0),
            'status' => sanitize_text_field($_POST['status'] ?? 'active'),
        ];

        $rule_id = absint($_POST['rule_id'] ?? 0);

        if ($rule_id) {
            $wpdb->update($table, $data, ['id' => $rule_id]);
        } else {
            $wpdb->insert($table, $data);
            $rule_id = $wpdb->insert_id;
        }

        wp_send_json_success(['rule_id' => $rule_id]);
    }

    /**
     * AJAX delete rule
     */
    public function ajax_delete_rule()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'yvp_upsell_rules';

        $rule_id = absint($_POST['rule_id']);
        $wpdb->delete($table, ['id' => $rule_id]);

        wp_send_json_success();
    }
}
