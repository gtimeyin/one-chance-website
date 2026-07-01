<?php
/**
 * Plugin deactivator
 */

if (!defined('ABSPATH')) {
    exit;
}

class YVP_Deactivator
{

    /**
     * Deactivate the plugin
     */
    public static function deactivate()
    {
        // Flush rewrite rules
        flush_rewrite_rules();

        // Clear any scheduled hooks
        wp_clear_scheduled_hook('yvp_daily_cleanup');
    }
}
