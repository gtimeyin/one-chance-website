<?php
/**
 * REST API Module
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_REST_API extends YVP_Module
{

    protected $name = 'api';

    /**
     * API namespace
     */
    const NAMESPACE = 'yvp/v1';

    /**
     * Initialize the module
     */
    protected function init()
    {
        $this->loader->add_action('rest_api_init', $this, 'register_routes');
    }

    /**
     * Register REST API routes
     */
    public function register_routes()
    {
        // Bundles
        register_rest_route(self::NAMESPACE , '/bundles', [
            'methods' => 'GET',
            'callback' => [$this, 'get_bundles'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE , '/bundles/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_bundle'],
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'validate_callback' => function ($param) {
                        return is_numeric($param);
                    }
                ],
            ],
        ]);

        // Pricing Zones
        register_rest_route(self::NAMESPACE , '/zones', [
            'methods' => 'GET',
            'callback' => [$this, 'get_zones'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE , '/zones/detect', [
            'methods' => 'GET',
            'callback' => [$this, 'detect_zone'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE , '/products/(?P<id>\d+)/prices', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_zone_prices'],
            'permission_callback' => '__return_true',
        ]);

        // Upsells & Cross-sells
        register_rest_route(self::NAMESPACE , '/products/(?P<id>\d+)/upsells', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_upsells'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE , '/products/(?P<id>\d+)/cross-sells', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_cross_sells'],
            'permission_callback' => '__return_true',
        ]);

        // Frequently Bought Together
        register_rest_route(self::NAMESPACE , '/products/(?P<id>\d+)/fbt', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_fbt'],
            'permission_callback' => '__return_true',
        ]);

        // BOGO Deals
        register_rest_route(self::NAMESPACE , '/bogo/active', [
            'methods' => 'GET',
            'callback' => [$this, 'get_active_bogo_deals'],
            'permission_callback' => '__return_true',
        ]);

        // Order Bumps
        register_rest_route(self::NAMESPACE , '/cart/bumps', [
            'methods' => 'GET',
            'callback' => [$this, 'get_cart_bumps'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Get all bundles
     */
    public function get_bundles($request)
    {
        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => $request->get_param('per_page') ?: 20,
            'paged' => $request->get_param('page') ?: 1,
            'tax_query' => [
                [
                    'taxonomy' => 'product_type',
                    'field' => 'slug',
                    'terms' => 'yvp_bundle',
                ],
            ],
        ];

        $query = new WP_Query($args);
        $bundles = [];

        foreach ($query->posts as $post) {
            $bundles[] = $this->format_bundle(wc_get_product($post->ID));
        }

        return new WP_REST_Response([
            'bundles' => $bundles,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages,
        ]);
    }

    /**
     * Get single bundle
     */
    public function get_bundle($request)
    {
        $product = wc_get_product($request['id']);

        if (!$product || $product->get_type() !== 'yvp_bundle') {
            return new WP_Error('not_found', 'Bundle not found', ['status' => 404]);
        }

        return new WP_REST_Response($this->format_bundle($product));
    }

    /**
     * Format bundle for API response
     */
    private function format_bundle($product)
    {
        if (!$product instanceof YVP_Bundle_Product) {
            return null;
        }

        $items = [];
        $bundle_items = $product->get_bundle_items();

        foreach ($bundle_items as $item) {
            $item_product = wc_get_product($item['product_id']);
            if ($item_product) {
                $items[] = [
                    'product_id' => $item['product_id'],
                    'name' => $item_product->get_name(),
                    'quantity' => $item['quantity'],
                    'price' => $item_product->get_price(),
                    'image' => wp_get_attachment_url($item_product->get_image_id()),
                ];
            }
        }

        // Get zone prices
        $zone_prices = $this->get_all_zone_prices($product->get_id());

        return [
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_items_total(),
            'savings' => $product->get_savings(),
            'pricing_mode' => $product->get_pricing_mode(),
            'discount_value' => $product->get_discount_value(),
            'items' => $items,
            'zone_prices' => $zone_prices,
            'image' => wp_get_attachment_url($product->get_image_id()),
            'permalink' => $product->get_permalink(),
            'in_stock' => $product->is_in_stock(),
        ];
    }

    /**
     * Get all pricing zones (from WCPBC if available)
     */
    public function get_zones($request)
    {
        // Use WCPBC integration if available
        if (YVP_WCPBC_Integration::is_active()) {
            $zones = YVP_WCPBC_Integration::get_zones();
            $formatted = [];

            foreach ($zones as $zone) {
                $formatted[] = [
                    'id' => $zone->get_id(),
                    'name' => $zone->get_name(),
                    'countries' => $zone->get_countries(),
                    'currency' => $zone->get_currency(),
                    'enabled' => $zone->is_enabled() ? 'yes' : 'no',
                ];
            }

            return new WP_REST_Response($formatted);
        }

        // WCPBC not available
        return new WP_REST_Response([
            'message' => 'WooCommerce Product Price Based on Countries plugin is required for zone pricing.',
            'wcpbc_active' => false,
            'zones' => [],
        ]);
    }

    /**
     * Detect customer zone
     */
    public function detect_zone($request)
    {
        // Use WCPBC integration
        if (YVP_WCPBC_Integration::is_active()) {
            $zone_data = YVP_WCPBC_Integration::get_zone_data_for_api();

            return new WP_REST_Response([
                'zone' => $zone_data['zone_id'] ? [
                    'id' => $zone_data['zone_id'],
                    'name' => $zone_data['zone_name'],
                ] : null,
                'currency' => $zone_data['currency'],
                'currency_symbol' => $zone_data['currency_symbol'],
                'detected' => $zone_data['zone_id'] !== null,
            ]);
        }

        // Fallback to WooCommerce geolocation
        $ip = $request->get_param('ip') ?: $this->get_client_ip();
        $geolocation = class_exists('WC_Geolocation') ? WC_Geolocation::geolocate_ip($ip) : [];
        $country = $geolocation['country'] ?? '';

        return new WP_REST_Response([
            'zone' => null,
            'country' => $country,
            'detected' => !empty($country),
            'wcpbc_active' => false,
        ]);
    }

    /**
     * Get product zone prices (all zones from WCPBC)
     */
    public function get_product_zone_prices($request)
    {
        $product_id = $request['id'];
        $product = wc_get_product($product_id);

        if (!$product) {
            return new WP_Error('not_found', 'Product not found', ['status' => 404]);
        }

        // Get current zone price using WCPBC
        $current_price_data = YVP_WCPBC_Integration::get_product_api_data($product);
        $zone_data = YVP_WCPBC_Integration::get_zone_data_for_api();

        return new WP_REST_Response([
            'product_id' => $product_id,
            'wcpbc_active' => YVP_WCPBC_Integration::is_active(),
            'current_zone' => $zone_data,
            'price' => $current_price_data['price'],
            'regular_price' => $current_price_data['regular_price'],
            'sale_price' => $current_price_data['sale_price'],
            'price_html' => $current_price_data['price_html'],
            'on_sale' => $current_price_data['on_sale'],
            'currency' => $current_price_data['currency'],
        ]);
    }

    /**
     * Get product upsells
     */
    public function get_product_upsells($request)
    {
        $product_id = $request['id'];

        // Query upsell rules directly instead of creating new module instance
        $upsells = $this->get_upsell_recommendations($product_id, 'upsell');

        return new WP_REST_Response($this->format_recommendations($upsells));
    }

    /**
     * Get upsell recommendations from database
     */
    private function get_upsell_recommendations($product_id, $type)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'yvp_upsell_rules';

        $product = wc_get_product($product_id);
        if (!$product) {
            return [];
        }

        $rules = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE rule_type = %s AND status = 'active' ORDER BY priority DESC",
            $type
        ));

        $recommendations = [];

        foreach ($rules as $rule) {
            $trigger_value = json_decode($rule->trigger_value, true) ?: [];
            $matches = false;

            switch ($rule->trigger_type) {
                case 'specific_products':
                    $matches = in_array($product_id, $trigger_value);
                    break;
                case 'categories':
                    $product_cats = $product->get_category_ids();
                    $matches = !empty(array_intersect($product_cats, $trigger_value));
                    break;
                case 'all':
                    $matches = true;
                    break;
            }

            if (!$matches)
                continue;

            $product_ids = json_decode($rule->product_ids, true) ?: [];
            foreach ($product_ids as $rec_product_id) {
                $rec_product = wc_get_product($rec_product_id);
                if (!$rec_product || !$rec_product->is_purchasable())
                    continue;

                $recommendations[] = [
                    'product_id' => $rec_product_id,
                    'product' => $rec_product,
                    'discount' => $rule->discount_type ? [
                        'type' => $rule->discount_type,
                        'value' => floatval($rule->discount_value),
                    ] : null,
                ];
            }
        }

        return $recommendations;
    }

    /**
     * Get product cross-sells
     */
    public function get_product_cross_sells($request)
    {
        $product_id = $request['id'];

        $upsell_module = new YVP_Upsell_Module($this->loader);
        $cross_sells = $upsell_module->get_product_recommendations($product_id, 'cross_sell');

        return new WP_REST_Response($this->format_recommendations($cross_sells));
    }

    /**
     * Get product FBT
     */
    public function get_product_fbt($request)
    {
        $product_id = $request['id'];
        $product = wc_get_product($product_id);

        if (!$product) {
            return new WP_Error('not_found', 'Product not found', ['status' => 404]);
        }

        $fbt_module = new YVP_FBT_Module($this->loader);
        $fbt_data = $fbt_module->get_fbt_data($product_id);

        if (!$fbt_data) {
            return new WP_REST_Response([
                'main_product' => $this->format_product($product),
                'paired_products' => [],
                'discount' => null,
            ]);
        }

        $paired = [];
        foreach ($fbt_data['products'] as $item) {
            $paired_product = wc_get_product($item['product_id']);
            if ($paired_product) {
                $paired[] = [
                    'product' => $this->format_product($paired_product),
                    'quantity' => $item['quantity'],
                ];
            }
        }

        return new WP_REST_Response([
            'main_product' => $this->format_product($product),
            'paired_products' => $paired,
            'discount' => $fbt_data['discount'],
        ]);
    }

    /**
     * Get active BOGO deals
     */
    public function get_active_bogo_deals($request)
    {
        $bogo_module = new YVP_BOGO_Module($this->loader);
        $deals = $bogo_module->get_active_deals();

        $formatted = [];
        foreach ($deals as $deal) {
            $formatted[] = [
                'id' => intval($deal->id),
                'name' => $deal->deal_name,
                'buy' => [
                    'type' => $deal->buy_type,
                    'value' => json_decode($deal->buy_value, true),
                    'quantity' => intval($deal->buy_quantity),
                ],
                'get' => [
                    'type' => $deal->get_type,
                    'value' => json_decode($deal->get_value, true),
                    'quantity' => intval($deal->get_quantity),
                ],
                'discount' => [
                    'type' => $deal->discount_type,
                    'value' => floatval($deal->discount_value),
                ],
                'start_date' => $deal->start_date,
                'end_date' => $deal->end_date,
            ];
        }

        return new WP_REST_Response($formatted);
    }

    /**
     * Get cart order bumps
     */
    public function get_cart_bumps($request)
    {
        $bump_module = new YVP_Bump_Module($this->loader);

        $bumps_before = $bump_module->get_applicable_bumps('before_payment');
        $bumps_after = $bump_module->get_applicable_bumps('after_total');

        return new WP_REST_Response([
            'before_payment' => $this->format_bumps($bumps_before),
            'after_total' => $this->format_bumps($bumps_after),
        ]);
    }

    /**
     * Format recommendations for API
     */
    private function format_recommendations($recommendations)
    {
        $formatted = [];

        foreach ($recommendations as $rec) {
            $product = $rec['product'];
            $formatted[] = [
                'product' => $this->format_product($product),
                'discount' => $rec['discount'],
            ];
        }

        return $formatted;
    }

    /**
     * Format product for API
     */
    private function format_product($product)
    {
        return [
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_regular_price(),
            'sale_price' => $product->get_sale_price(),
            'image' => wp_get_attachment_url($product->get_image_id()),
            'permalink' => $product->get_permalink(),
            'in_stock' => $product->is_in_stock(),
        ];
    }

    /**
     * Format bumps for API
     */
    private function format_bumps($bumps)
    {
        $formatted = [];

        foreach ($bumps as $bump) {
            $product = wc_get_product($bump->product_id);
            if (!$product)
                continue;

            $formatted[] = [
                'id' => intval($bump->id),
                'name' => $bump->bump_name,
                'headline' => $bump->headline,
                'description' => $bump->description,
                'product' => $this->format_product($product),
                'discount' => $bump->discount_type ? [
                    'type' => $bump->discount_type,
                    'value' => floatval($bump->discount_value),
                ] : null,
            ];
        }

        return $formatted;
    }

    /**
     * Get client IP
     */
    private function get_client_ip()
    {
        $ip = '';

        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($ips[0]);
        } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }
}
