<?php
/**
 * Bundle Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Bundle_Module extends YVP_Module
{

    protected $name = 'bundles';

    /**
     * Initialize the module
     */
    protected function init()
    {
        if (!$this->is_enabled()) {
            return;
        }

        // Register bundle product type
        $this->loader->add_filter('product_type_selector', $this, 'add_bundle_product_type');
        $this->loader->add_filter('woocommerce_product_class', $this, 'get_bundle_product_class', 10, 2);

        // Admin hooks
        $this->loader->add_action('woocommerce_product_data_tabs', $this, 'add_bundle_tab');
        $this->loader->add_action('woocommerce_product_data_panels', $this, 'add_bundle_panel');
        $this->loader->add_action('woocommerce_process_product_meta', $this, 'save_bundle_data');

        // Frontend hooks
        $this->loader->add_action('woocommerce_single_product_summary', $this, 'display_bundle_items', 25);

        // Cart hooks
        $this->loader->add_filter('woocommerce_add_cart_item_data', $this, 'add_bundle_cart_data', 10, 3);

        // AJAX handlers - register directly for immediate availability
        add_action('wp_ajax_yvp_search_products', [$this, 'ajax_search_products']);
    }

    /**
     * Add bundle to product type selector
     */
    public function add_bundle_product_type($types)
    {
        $types['yvp_bundle'] = __('Product Bundle', 'yvp-sales-booster');
        return $types;
    }

    /**
     * Get bundle product class
     */
    public function get_bundle_product_class($classname, $product_type)
    {
        if ($product_type === 'yvp_bundle') {
            return 'YVP_Bundle_Product';
        }
        return $classname;
    }

    /**
     * Add bundle tab to product data
     */
    public function add_bundle_tab($tabs)
    {
        $tabs['yvp_bundle'] = [
            'label' => __('Bundle Items', 'yvp-sales-booster'),
            'target' => 'yvp_bundle_data',
            'class' => ['show_if_yvp_bundle'],
            'priority' => 25,
        ];
        return $tabs;
    }

    /**
     * Add bundle panel content
     */
    public function add_bundle_panel()
    {
        global $post;

        $bundle_items = get_post_meta($post->ID, '_yvp_bundle_items', true);
        $pricing_mode = get_post_meta($post->ID, '_yvp_bundle_pricing_mode', true) ?: 'fixed';
        $discount_value = get_post_meta($post->ID, '_yvp_bundle_discount_value', true);

        // Base + per-zone fixed prices. We render our own inputs inline in the
        // Bundle Items tab (see bundle-data-panel.php) and save to WCPBC's
        // standard meta keys so the storefront and reports see them as native
        // WCPBC prices — no dependency on WCPBC's admin UI cooperating.
        $base_regular_price = get_post_meta($post->ID, '_regular_price', true);
        $base_sale_price    = get_post_meta($post->ID, '_sale_price', true);
        $zones              = YVP_WCPBC_Integration::get_zones();
        $zone_prices        = [];
        foreach ($zones as $zone) {
            $slug = self::zone_slug($zone);
            if (!$slug) {
                continue;
            }
            $zone_prices[$slug] = [
                'name'          => method_exists($zone, 'get_name') ? $zone->get_name() : $slug,
                'currency'      => method_exists($zone, 'get_currency') ? $zone->get_currency() : '',
                'regular_price' => get_post_meta($post->ID, '_' . $slug . '_regular_price', true),
                'sale_price'    => get_post_meta($post->ID, '_' . $slug . '_sale_price', true),
            ];
        }

        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'admin/views/bundle-data-panel.php';
    }

    /**
     * WCPBC zone objects expose different accessors depending on version.
     * Prefer explicit slug/key methods; fall back to sanitizing the name so
     * the meta prefix matches what WCPBC itself writes (e.g. "united-kingdom").
     */
    private static function zone_slug($zone)
    {
        if (method_exists($zone, 'get_slug')) {
            return (string) $zone->get_slug();
        }
        if (method_exists($zone, 'get_key')) {
            return (string) $zone->get_key();
        }
        if (method_exists($zone, 'get_id')) {
            $id = $zone->get_id();
            if (is_string($id) && $id !== '') {
                return $id;
            }
        }
        if (method_exists($zone, 'get_name')) {
            return sanitize_title($zone->get_name());
        }
        return '';
    }

    /**
     * Save bundle data
     */
    public function save_bundle_data($post_id)
    {
        // Security check - verify user can edit and nonce is valid
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // WooCommerce handles its own nonce verification in process_product_meta
        $product_type = empty($_POST['product-type']) ? 'simple' : sanitize_text_field($_POST['product-type']);

        if ($product_type !== 'yvp_bundle') {
            return;
        }

        // Save bundle items
        if (isset($_POST['yvp_bundle_items'])) {
            $items = [];
            foreach ($_POST['yvp_bundle_items'] as $item) {
                if (!empty($item['product_id'])) {
                    $items[] = [
                        'product_id' => absint($item['product_id']),
                        'quantity' => max(1, absint($item['quantity'])),
                    ];
                }
            }
            update_post_meta($post_id, '_yvp_bundle_items', $items);
        }

        // Save pricing mode
        $mode = isset($_POST['yvp_bundle_pricing_mode'])
            ? sanitize_text_field($_POST['yvp_bundle_pricing_mode'])
            : 'fixed';
        update_post_meta($post_id, '_yvp_bundle_pricing_mode', $mode);

        // Save discount value
        if (isset($_POST['yvp_bundle_discount_value'])) {
            update_post_meta($post_id, '_yvp_bundle_discount_value', floatval($_POST['yvp_bundle_discount_value']));
        }

        // Save fixed-mode prices: base + per-zone. We write to the STANDARD
        // WooCommerce / WCPBC meta keys so the storefront and reports treat
        // them as native prices — no WCPBC admin-UI cooperation required.
        if ($mode === 'fixed') {
            $normalise = function ($raw) {
                if (!isset($raw) || $raw === '' || $raw === null) return '';
                $raw = wp_unslash($raw);
                return function_exists('wc_format_decimal') ? wc_format_decimal($raw) : (string) floatval($raw);
            };

            // Base regular / sale price → WooCommerce standard fields
            $base_regular = $normalise($_POST['yvp_bundle_base_regular_price'] ?? '');
            $base_sale    = $normalise($_POST['yvp_bundle_base_sale_price'] ?? '');
            update_post_meta($post_id, '_regular_price', $base_regular);
            update_post_meta($post_id, '_sale_price', $base_sale);
            // `_price` is the active price — set to sale if present, otherwise regular.
            $active = ($base_sale !== '' && $base_sale !== null) ? $base_sale : $base_regular;
            update_post_meta($post_id, '_price', $active);

            // Per-zone prices → WCPBC meta keys (_<slug>_regular_price etc.)
            $zone_prices = isset($_POST['yvp_bundle_zone_prices']) && is_array($_POST['yvp_bundle_zone_prices'])
                ? $_POST['yvp_bundle_zone_prices']
                : [];
            foreach ($zone_prices as $slug => $prices) {
                $slug = sanitize_key($slug);
                if ($slug === '') continue;
                $regular = $normalise($prices['regular_price'] ?? '');
                $sale    = $normalise($prices['sale_price'] ?? '');
                update_post_meta($post_id, '_' . $slug . '_regular_price', $regular);
                update_post_meta($post_id, '_' . $slug . '_sale_price', $sale);
                // Zone active price
                $zone_active = ($sale !== '' && $sale !== null) ? $sale : $regular;
                update_post_meta($post_id, '_' . $slug . '_price', $zone_active);
            }
        }
    }

    /**
     * Display bundle items on product page
     */
    public function display_bundle_items()
    {
        global $product;

        if (!$product || $product->get_type() !== 'yvp_bundle') {
            return;
        }

        $bundle_items = get_post_meta($product->get_id(), '_yvp_bundle_items', true);

        if (empty($bundle_items)) {
            return;
        }

        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'public/views/bundle-items-display.php';
    }

    /**
     * Add bundle data to cart item
     */
    public function add_bundle_cart_data($cart_item_data, $product_id, $variation_id)
    {
        $product = wc_get_product($product_id);

        if ($product && $product->get_type() === 'yvp_bundle') {
            $cart_item_data['yvp_bundle'] = true;
            $cart_item_data['yvp_bundle_items'] = get_post_meta($product_id, '_yvp_bundle_items', true);
        }

        return $cart_item_data;
    }

    /**
     * AJAX product search
     */
    public function ajax_search_products()
    {
        check_ajax_referer('yvp_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        $search = sanitize_text_field($_GET['q'] ?? '');

        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => 20,
            's' => $search,
        ];

        $products = get_posts($args);
        $results = [];

        foreach ($products as $product_post) {
            $product = wc_get_product($product_post->ID);
            if ($product && $product->get_type() !== 'yvp_bundle') {
                $results[] = [
                    'id' => $product->get_id(),
                    'text' => $product->get_name() . ' (' . $product->get_price_html() . ')',
                    'name' => $product->get_name(),
                    'price' => $product->get_price(),
                ];
            }
        }

        wp_send_json(['results' => $results]);
    }
}
