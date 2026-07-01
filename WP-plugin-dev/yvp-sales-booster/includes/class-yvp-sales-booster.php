<?php
/**
 * Main plugin class
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Sales_Booster
{

    /**
     * The loader that's responsible for maintaining and registering all hooks.
     */
    protected $loader;

    /**
     * Plugin modules
     */
    protected $modules = [];

    /**
     * Initialize the plugin
     */
    public function __construct()
    {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->init_modules();
    }

    /**
     * Load required dependencies
     */
    private function load_dependencies()
    {
        $this->loader = new YVP_Loader();
    }

    /**
     * Register admin hooks
     */
    private function define_admin_hooks()
    {
        if (is_admin()) {
            // Enqueue admin styles and scripts
            $this->loader->add_action('admin_enqueue_scripts', $this, 'enqueue_admin_assets');

            // Add admin menu
            $this->loader->add_action('admin_menu', $this, 'add_admin_menu');
        }
    }

    /**
     * Register public hooks
     */
    private function define_public_hooks()
    {
        // Enqueue public styles and scripts
        $this->loader->add_action('wp_enqueue_scripts', $this, 'enqueue_public_assets');
    }

    /**
     * Initialize all modules
     */
    private function init_modules()
    {
        // Load WCPBC integration helper. The class exposes read-only helpers
        // (get_zones, get_current_zone, get_zone_currency) that the bundle
        // module uses to render per-zone price inputs inline. We deliberately
        // don't wire WCPBC's admin UI to bundle products — the Bundle Items
        // panel owns bundle pricing end-to-end and writes to WCPBC's standard
        // meta keys directly.
        require_once YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/integrations/class-yvp-wcpbc-integration.php';

        // Product Bundling
        $this->modules['bundles'] = new YVP_Bundle_Module($this->loader);

        // Upsells & Cross-sells
        $this->modules['upsells'] = new YVP_Upsell_Module($this->loader);

        // Frequently Bought Together
        $this->modules['fbt'] = new YVP_FBT_Module($this->loader);

        // BOGO Deals
        $this->modules['bogo'] = new YVP_BOGO_Module($this->loader);

        // Order Bumps
        $this->modules['bumps'] = new YVP_Bump_Module($this->loader);

        // REST API
        $this->modules['api'] = new YVP_REST_API($this->loader);
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook)
    {
        // Load on our admin pages and WooCommerce product pages
        $screen = get_current_screen();

        // Check if we should load assets
        $should_load = false;

        if ($screen) {
            $allowed_screens = [
                'woocommerce_page_yvp-sales-booster',
                'product',
                'edit-product',
            ];

            if (in_array($screen->id, $allowed_screens)) {
                $should_load = true;
            }

            // Also load if screen id contains yvp
            if (strpos($screen->id, 'yvp') !== false) {
                $should_load = true;
            }
        }

        // Also check the hook parameter
        if (strpos($hook, 'yvp-sales-booster') !== false) {
            $should_load = true;
        }

        if (!$should_load) {
            return;
        }

        // Enqueue Select2/SelectWoo (WooCommerce includes this)
        wp_enqueue_style('select2');
        wp_enqueue_script('select2');

        wp_enqueue_style(
            'yvp-admin',
            YVP_SALES_BOOSTER_PLUGIN_URL . 'admin/css/yvp-admin.css',
            ['select2'],
            YVP_SALES_BOOSTER_VERSION
        );

        // Use select2 as dependency (WooCommerce registers it as both select2 and selectWoo)
        $script_deps = ['jquery', 'wp-util'];
        if (wp_script_is('selectWoo', 'registered')) {
            $script_deps[] = 'selectWoo';
        } elseif (wp_script_is('select2', 'registered')) {
            $script_deps[] = 'select2';
        }

        wp_enqueue_script(
            'yvp-admin',
            YVP_SALES_BOOSTER_PLUGIN_URL . 'admin/js/yvp-admin.js',
            $script_deps,
            YVP_SALES_BOOSTER_VERSION,
            true
        );

        wp_localize_script('yvp-admin', 'yvpAdmin', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('yvp_admin_nonce'),
            'i18n' => [
                'searchProducts' => __('Search for a product...', 'yvp-sales-booster'),
                'noResults' => __('No products found', 'yvp-sales-booster'),
                'remove' => __('Remove', 'yvp-sales-booster'),
            ],
        ]);
    }

    /**
     * Enqueue public assets
     */
    public function enqueue_public_assets()
    {
        if (!is_woocommerce() && !is_cart() && !is_checkout()) {
            return;
        }

        wp_enqueue_style(
            'yvp-public',
            YVP_SALES_BOOSTER_PLUGIN_URL . 'public/css/yvp-public.css',
            [],
            YVP_SALES_BOOSTER_VERSION
        );

        wp_enqueue_script(
            'yvp-public',
            YVP_SALES_BOOSTER_PLUGIN_URL . 'public/js/yvp-public.js',
            ['jquery'],
            YVP_SALES_BOOSTER_VERSION,
            true
        );

        wp_localize_script('yvp-public', 'yvpPublic', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('yvp_public_nonce'),
        ]);
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu()
    {
        add_submenu_page(
            'woocommerce',
            __('YVP Sales Booster', 'yvp-sales-booster'),
            __('Sales Booster', 'yvp-sales-booster'),
            'manage_woocommerce',
            'yvp-sales-booster',
            [$this, 'render_admin_page']
        );
    }

    /**
     * Render admin page
     */
    public function render_admin_page()
    {
        $active_tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'bundles';
        include YVP_SALES_BOOSTER_PLUGIN_DIR . 'admin/views/admin-page.php';
    }

    /**
     * Run the plugin
     */
    public function run()
    {
        $this->loader->run();
    }

    /**
     * Get a specific module
     */
    public function get_module($name)
    {
        return isset($this->modules[$name]) ? $this->modules[$name] : null;
    }
}
