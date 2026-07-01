<?php
/**
 * Zone Pricing Product Panel
 * 
 * Allows setting zone-specific prices on products
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div id="yvp_zones_data" class="panel woocommerce_options_panel">
    <div class="options_group">
        <h4 style="padding-left: 12px;"><?php _e('Zone-Specific Prices', 'yvp-sales-booster'); ?></h4>
        <p style="padding-left: 12px; color: #666; font-style: italic;">
            <?php _e('Leave empty to use zone adjustment instead.', 'yvp-sales-booster'); ?>
        </p>

        <?php foreach ($zones as $zone): ?>
            <?php
            $zone_price = get_post_meta($post->ID, '_yvp_zone_price_' . $zone->get_id(), true);
            ?>
            <p class="form-field">
                <label for="yvp_zone_price_<?php echo esc_attr($zone->get_id()); ?>">
                    <?php echo esc_html($zone->get_name()); ?>
                    <span style="color: #999; font-weight: normal;">
                        (<?php
                        $countries = $zone->get_countries();
                        echo count($countries) . ' ' . _n('country', 'countries', count($countries), 'yvp-sales-booster');
                        ?>)
                    </span>
                </label>
                <input type="text" class="wc_input_price short"
                    name="yvp_zone_price_<?php echo esc_attr($zone->get_id()); ?>"
                    id="yvp_zone_price_<?php echo esc_attr($zone->get_id()); ?>"
                    value="<?php echo esc_attr($zone_price); ?>" placeholder="<?php _e('Auto', 'yvp-sales-booster'); ?>">
            </p>
        <?php endforeach; ?>

        <?php if (empty($zones)): ?>
            <p style="padding: 20px; text-align: center; color: #666;">
                <?php _e('No pricing zones configured.', 'yvp-sales-booster'); ?>
                <a href="<?php echo admin_url('admin.php?page=wc-settings&tab=yvp_zones'); ?>">
                    <?php _e('Create zones', 'yvp-sales-booster'); ?>
                </a>
            </p>
        <?php endif; ?>
    </div>
</div>