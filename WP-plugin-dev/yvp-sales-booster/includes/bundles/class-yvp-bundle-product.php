<?php
/**
 * Bundle Product Type
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Bundle_Product extends WC_Product
{

    /**
     * Product type
     */
    public function get_type()
    {
        return 'yvp_bundle';
    }

    /**
     * Get bundled items
     */
    public function get_bundle_items()
    {
        return get_post_meta($this->get_id(), '_yvp_bundle_items', true) ?: [];
    }

    /**
     * Get pricing mode
     */
    public function get_pricing_mode()
    {
        return get_post_meta($this->get_id(), '_yvp_bundle_pricing_mode', true) ?: 'fixed';
    }

    /**
     * Get discount value
     */
    public function get_discount_value()
    {
        return floatval(get_post_meta($this->get_id(), '_yvp_bundle_discount_value', true));
    }

    /**
     * Calculate bundle price
     */
    public function get_price($context = 'view')
    {
        $pricing_mode = $this->get_pricing_mode();

        if ($pricing_mode === 'fixed') {
            return parent::get_price($context);
        }

        // Calculate based on bundled items
        $items_total = $this->get_items_total();
        $discount_value = $this->get_discount_value();

        if ($pricing_mode === 'percentage') {
            return $items_total * (1 - ($discount_value / 100));
        }

        if ($pricing_mode === 'fixed_discount') {
            return max(0, $items_total - $discount_value);
        }

        return parent::get_price($context);
    }

    /**
     * Get total price of all bundled items
     */
    public function get_items_total()
    {
        $items = $this->get_bundle_items();
        $total = 0;

        foreach ($items as $item) {
            $product = wc_get_product($item['product_id']);
            if ($product) {
                $total += floatval($product->get_price()) * intval($item['quantity']);
            }
        }

        return $total;
    }

    /**
     * Get savings amount
     */
    public function get_savings()
    {
        $items_total = $this->get_items_total();
        $bundle_price = $this->get_price();

        return max(0, $items_total - $bundle_price);
    }

    /**
     * Check if bundle is purchasable
     */
    public function is_purchasable()
    {
        if (!parent::is_purchasable()) {
            return false;
        }

        // Check if all bundled items are available
        $items = $this->get_bundle_items();

        foreach ($items as $item) {
            $product = wc_get_product($item['product_id']);
            if (!$product || !$product->is_purchasable()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check stock status
     */
    public function is_in_stock()
    {
        $items = $this->get_bundle_items();

        foreach ($items as $item) {
            $product = wc_get_product($item['product_id']);
            if (!$product || !$product->is_in_stock()) {
                return false;
            }

            // Check if enough stock for bundle quantity
            if ($product->managing_stock()) {
                if ($product->get_stock_quantity() < $item['quantity']) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get stock status
     */
    public function get_stock_status($context = 'view')
    {
        return $this->is_in_stock() ? 'instock' : 'outofstock';
    }

    /**
     * Bundle is virtual if all items are virtual
     */
    public function is_virtual()
    {
        $items = $this->get_bundle_items();

        foreach ($items as $item) {
            $product = wc_get_product($item['product_id']);
            if ($product && !$product->is_virtual()) {
                return false;
            }
        }

        return true;
    }
}
