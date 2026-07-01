<?php
/**
 * Plugin activator
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Activator
{

    /**
     * Activate the plugin
     */
    public static function activate()
    {
        self::create_tables();
        self::set_default_options();
        self::register_product_type();

        // Flush rewrite rules for REST API
        flush_rewrite_rules();
    }

    /**
     * Register bundle product type term
     */
    private static function register_product_type()
    {
        if (!term_exists('yvp_bundle', 'product_type')) {
            wp_insert_term('yvp_bundle', 'product_type');
        }
    }

    /**
     * Create database tables
     */
    private static function create_tables()
    {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // Note: Pricing zones are now handled by WooCommerce Product Price Based on Countries plugin
        // No custom zone tables needed

        // Upsell Rules table
        $table_upsells = $wpdb->prefix . 'yvp_upsell_rules';
        $sql_upsells = "CREATE TABLE $table_upsells (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            rule_name varchar(255) NOT NULL,
            rule_type varchar(20) NOT NULL DEFAULT 'upsell',
            trigger_type varchar(50) NOT NULL,
            trigger_value text NOT NULL,
            product_ids text NOT NULL,
            discount_type varchar(20) DEFAULT NULL,
            discount_value decimal(19,4) DEFAULT NULL,
            display_location varchar(50) NOT NULL DEFAULT 'product_page',
            priority int(11) NOT NULL DEFAULT 0,
            status varchar(20) NOT NULL DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY status (status),
            KEY rule_type (rule_type)
        ) $charset_collate;";
        dbDelta($sql_upsells);

        // Frequently Bought Together table
        $table_fbt = $wpdb->prefix . 'yvp_fbt_pairs';
        $sql_fbt = "CREATE TABLE $table_fbt (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            product_id bigint(20) unsigned NOT NULL,
            paired_products text NOT NULL,
            discount_type varchar(20) DEFAULT NULL,
            discount_value decimal(19,4) DEFAULT NULL,
            status varchar(20) NOT NULL DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY product_id (product_id),
            KEY status (status)
        ) $charset_collate;";
        dbDelta($sql_fbt);

        // BOGO Deals table
        $table_bogo = $wpdb->prefix . 'yvp_bogo_deals';
        $sql_bogo = "CREATE TABLE $table_bogo (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_name varchar(255) NOT NULL,
            buy_type varchar(50) NOT NULL,
            buy_value text NOT NULL,
            buy_quantity int(11) NOT NULL DEFAULT 1,
            get_type varchar(50) NOT NULL,
            get_value text NOT NULL,
            get_quantity int(11) NOT NULL DEFAULT 1,
            discount_type varchar(20) NOT NULL DEFAULT 'free',
            discount_value decimal(19,4) DEFAULT NULL,
            start_date datetime DEFAULT NULL,
            end_date datetime DEFAULT NULL,
            priority int(11) NOT NULL DEFAULT 0,
            status varchar(20) NOT NULL DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY status (status),
            KEY dates (start_date, end_date)
        ) $charset_collate;";
        dbDelta($sql_bogo);

        // Order Bumps table
        $table_bumps = $wpdb->prefix . 'yvp_order_bumps';
        $sql_bumps = "CREATE TABLE $table_bumps (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            bump_name varchar(255) NOT NULL,
            product_id bigint(20) unsigned NOT NULL,
            trigger_type varchar(50) NOT NULL DEFAULT 'all',
            trigger_value text DEFAULT NULL,
            discount_type varchar(20) DEFAULT NULL,
            discount_value decimal(19,4) DEFAULT NULL,
            display_location varchar(50) NOT NULL DEFAULT 'before_payment',
            headline varchar(255) DEFAULT NULL,
            description text DEFAULT NULL,
            priority int(11) NOT NULL DEFAULT 0,
            status varchar(20) NOT NULL DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY status (status),
            KEY product_id (product_id)
        ) $charset_collate;";
        dbDelta($sql_bumps);

        // Store the database version
        update_option('yvp_sales_booster_db_version', YVP_SALES_BOOSTER_VERSION);
    }

    /**
     * Set default plugin options
     */
    private static function set_default_options()
    {
        $defaults = [
            'yvp_enable_bundles' => 'yes',
            'yvp_enable_zones' => 'yes',
            'yvp_enable_upsells' => 'yes',
            'yvp_enable_fbt' => 'yes',
            'yvp_enable_bogo' => 'yes',
            'yvp_enable_bumps' => 'yes',
            'yvp_zone_detection_method' => 'woocommerce',
        ];

        foreach ($defaults as $key => $value) {
            if (get_option($key) === false) {
                add_option($key, $value);
            }
        }
    }
}
