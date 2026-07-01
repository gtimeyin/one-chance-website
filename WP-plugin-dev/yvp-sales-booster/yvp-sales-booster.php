<?php
/**
 * Plugin Name: YVP Sales Booster
 * Plugin URI: https://yvpgame.com
 * Description: Product bundling, pricing zones, upsells, cross-sells, frequently bought together, BOGO deals, and order bumps for WooCommerce.
 * Version: 1.0.0
 * Author: YVP Game
 * Author URI: https://yvpgame.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: yvp-sales-booster
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * WC requires at least: 7.0
 * WC tested up to: 8.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('YVP_SALES_BOOSTER_VERSION', '1.0.0');
define('YVP_SALES_BOOSTER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('YVP_SALES_BOOSTER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('YVP_SALES_BOOSTER_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Check if WooCommerce is active
 */
function yvp_sales_booster_check_woocommerce() {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', 'yvp_sales_booster_woocommerce_notice');
        return false;
    }
    return true;
}

/**
 * Admin notice for missing WooCommerce
 */
function yvp_sales_booster_woocommerce_notice() {
    ?>
    <div class="notice notice-error">
        <p><?php _e('YVP Sales Booster requires WooCommerce to be installed and activated.', 'yvp-sales-booster'); ?></p>
    </div>
    <?php
}

/**
 * Plugin activation
 */
function yvp_sales_booster_activate() {
    require_once YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/class-yvp-activator.php';
    YVP_Activator::activate();
}
register_activation_hook(__FILE__, 'yvp_sales_booster_activate');

/**
 * Plugin deactivation
 */
function yvp_sales_booster_deactivate() {
    require_once YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/class-yvp-deactivator.php';
    YVP_Deactivator::deactivate();
}
register_deactivation_hook(__FILE__, 'yvp_sales_booster_deactivate');

/**
 * Autoloader for plugin classes
 */
spl_autoload_register(function ($class) {
    // Only autoload our classes
    if (strpos($class, 'YVP_') !== 0) {
        return;
    }
    
    // Convert class name to filename
    $class_file = 'class-' . strtolower(str_replace('_', '-', $class)) . '.php';
    
    // Define possible paths
    $paths = [
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/bundles/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/pricing-zones/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/upsells/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/fbt/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/bogo/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/order-bumps/',
        YVP_SALES_BOOSTER_PLUGIN_DIR . 'includes/api/',
    ];
    
    foreach ($paths as $path) {
        $file = $path . $class_file;
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

/**
 * Initialize the plugin
 */
function yvp_sales_booster_init() {
    if (!yvp_sales_booster_check_woocommerce()) {
        return;
    }
    
    // Load text domain
    load_plugin_textdomain('yvp-sales-booster', false, dirname(YVP_SALES_BOOSTER_PLUGIN_BASENAME) . '/languages');
    
    // Initialize core plugin class
    $plugin = new YVP_Sales_Booster();
    $plugin->run();
}
add_action('plugins_loaded', 'yvp_sales_booster_init');

/**
 * Declare HPOS compatibility
 */
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});
