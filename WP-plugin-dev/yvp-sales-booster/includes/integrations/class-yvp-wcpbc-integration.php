<?php
/**
 * WCPBC Integration Helper
 * 
 * Provides integration with WooCommerce Product Price Based on Countries plugin.
 * Allows YVP Sales Booster to respect zone-based pricing in bundles, upsells, etc.
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_WCPBC_Integration
{
    /**
     * Check if WCPBC plugin is active
     */
    public static function is_active()
    {
        return class_exists('WC_Product_Price_Based_Country') || function_exists('wcpbc');
    }

    /**
     * Get current pricing zone
     */
    public static function get_current_zone()
    {
        if (!self::is_active()) {
            return null;
        }

        if (function_exists('WCPBC') && WCPBC()->current_zone) {
            return WCPBC()->current_zone;
        }

        return null;
    }

    /**
     * Get zone ID
     */
    public static function get_current_zone_id()
    {
        $zone = self::get_current_zone();

        if ($zone && method_exists($zone, 'get_id')) {
            return $zone->get_id();
        }

        return null;
    }

    /**
     * Get zone currency
     */
    public static function get_zone_currency()
    {
        $zone = self::get_current_zone();

        if ($zone && method_exists($zone, 'get_currency')) {
            return $zone->get_currency();
        }

        return get_woocommerce_currency();
    }

    /**
     * Get zone-adjusted price for a product
     * 
     * WCPBC already handles this via filters, so we just need to get the product price
     * and it will be automatically adjusted by WCPBC
     */
    public static function get_product_price($product)
    {
        if (!$product || !is_a($product, 'WC_Product')) {
            return 0;
        }

        // WCPBC hooks into woocommerce_product_get_price filter
        // So getting the price will already return zone-adjusted price
        return $product->get_price();
    }

    /**
     * Get zone-adjusted regular price
     */
    public static function get_product_regular_price($product)
    {
        if (!$product || !is_a($product, 'WC_Product')) {
            return 0;
        }

        return $product->get_regular_price();
    }

    /**
     * Get zone-adjusted sale price
     */
    public static function get_product_sale_price($product)
    {
        if (!$product || !is_a($product, 'WC_Product')) {
            return null;
        }

        return $product->get_sale_price();
    }

    /**
     * Format price with zone currency
     */
    public static function format_price($price)
    {
        return wc_price($price);
    }

    /**
     * Get all available zones
     */
    public static function get_zones()
    {
        if (!self::is_active() || !class_exists('WCPBC_Pricing_Zones')) {
            return [];
        }

        return WCPBC_Pricing_Zones::get_zones();
    }

    /**
     * Get zone data for REST API
     */
    public static function get_zone_data_for_api()
    {
        $zone = self::get_current_zone();

        if (!$zone) {
            return [
                'zone_id' => null,
                'zone_name' => null,
                'currency' => get_woocommerce_currency(),
                'currency_symbol' => get_woocommerce_currency_symbol(),
                'exchange_rate' => 1,
            ];
        }

        return [
            'zone_id' => $zone->get_id(),
            'zone_name' => $zone->get_name(),
            'currency' => $zone->get_currency(),
            'currency_symbol' => get_woocommerce_currency_symbol($zone->get_currency()),
            'exchange_rate' => method_exists($zone, 'get_exchange_rate') ? $zone->get_exchange_rate() : 1,
        ];
    }

    /**
     * Get product data with zone-adjusted pricing for API
     */
    public static function get_product_api_data($product)
    {
        if (!$product || !is_a($product, 'WC_Product')) {
            return null;
        }

        return [
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'price' => self::get_product_price($product),
            'regular_price' => self::get_product_regular_price($product),
            'sale_price' => self::get_product_sale_price($product),
            'price_html' => $product->get_price_html(),
            'on_sale' => $product->is_on_sale(),
            'currency' => self::get_zone_currency(),
        ];
    }
}
