<?php
/**
 * Bundle Data Panel Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div id="yvp_bundle_data" class="panel woocommerce_options_panel">
    <div class="options_group">
        <h4><?php _e('Bundle Items', 'yvp-sales-booster'); ?></h4>
        <p class="description"><?php _e('Add products to include in this bundle.', 'yvp-sales-booster'); ?></p>

        <div class="yvp-bundle-items">
            <?php if (!empty($bundle_items)): ?>
                <?php foreach ($bundle_items as $index => $item):
                    $item_product = wc_get_product($item['product_id']);
                    ?>
                    <div class="yvp-bundle-item">
                        <select class="yvp-product-search product-select"
                            name="yvp_bundle_items[<?php echo $index; ?>][product_id]">
                            <?php if ($item_product): ?>
                                <option value="<?php echo esc_attr($item['product_id']); ?>" selected>
                                    <?php echo esc_html($item_product->get_name()); ?>
                                </option>
                            <?php endif; ?>
                        </select>
                        <input type="number" class="quantity-input" name="yvp_bundle_items[<?php echo $index; ?>][quantity]"
                            value="<?php echo esc_attr($item['quantity']); ?>" min="1"
                            placeholder="<?php esc_attr_e('Qty', 'yvp-sales-booster'); ?>">
                        <span class="remove-item dashicons dashicons-trash"
                            title="<?php esc_attr_e('Remove', 'yvp-sales-booster'); ?>"></span>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <button type="button" class="button yvp-add-bundle-item">
            <span class="dashicons dashicons-plus"></span>
            <?php _e('Add Product', 'yvp-sales-booster'); ?>
        </button>
    </div>

    <div class="options_group yvp-pricing-options">
        <h4><?php _e('Bundle Pricing', 'yvp-sales-booster'); ?></h4>

        <p class="form-field">
            <label><?php _e('Pricing Mode', 'yvp-sales-booster'); ?></label>
        </p>

        <p class="form-field">
            <label>
                <input type="radio" name="yvp_bundle_pricing_mode" value="fixed" <?php checked($pricing_mode, 'fixed'); ?>>
                <?php _e('Fixed Price', 'yvp-sales-booster'); ?>
            </label>
            <span class="description">
                <?php _e('Charge a specific total for the whole bundle. Set the base price and, optionally, a per-country price for each configured pricing zone.', 'yvp-sales-booster'); ?>
            </span>
        </p>

        <div class="yvp-fixed-price-fields"
            style="<?php echo $pricing_mode === 'fixed' ? '' : 'display:none;'; ?>">
            <p class="form-field yvp-price-row">
                <label for="yvp_bundle_base_regular_price">
                    <?php printf(__('Base Regular Price (%s)', 'yvp-sales-booster'), get_woocommerce_currency_symbol()); ?>
                </label>
                <input type="text" class="wc_input_price short"
                    id="yvp_bundle_base_regular_price"
                    name="yvp_bundle_base_regular_price"
                    value="<?php echo esc_attr($base_regular_price); ?>"
                    placeholder="0.00">
            </p>
            <p class="form-field yvp-price-row">
                <label for="yvp_bundle_base_sale_price">
                    <?php printf(__('Base Sale Price (%s)', 'yvp-sales-booster'), get_woocommerce_currency_symbol()); ?>
                </label>
                <input type="text" class="wc_input_price short"
                    id="yvp_bundle_base_sale_price"
                    name="yvp_bundle_base_sale_price"
                    value="<?php echo esc_attr($base_sale_price); ?>"
                    placeholder="<?php esc_attr_e('optional', 'yvp-sales-booster'); ?>">
            </p>

            <?php if (!empty($zone_prices)): ?>
                <div class="yvp-zone-prices" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #eee;">
                    <h4 style="margin: 0 0 8px 12px;"><?php _e('Per-Country Prices', 'yvp-sales-booster'); ?></h4>
                    <p style="margin: 0 0 12px 12px; color: #666; font-style: italic; font-size: 12px;">
                        <?php _e('Leave blank to fall back to the base price for that region.', 'yvp-sales-booster'); ?>
                    </p>
                    <?php foreach ($zone_prices as $slug => $zone): ?>
                        <p class="form-field yvp-price-row">
                            <label for="yvp_bundle_zone_<?php echo esc_attr($slug); ?>_regular_price">
                                <?php echo esc_html($zone['name']); ?>
                                <?php if (!empty($zone['currency'])): ?>
                                    <span style="color:#999; font-weight:normal;">
                                        (<?php echo esc_html($zone['currency']); ?>)
                                    </span>
                                <?php endif; ?>
                            </label>
                            <input type="text" class="wc_input_price short"
                                id="yvp_bundle_zone_<?php echo esc_attr($slug); ?>_regular_price"
                                name="yvp_bundle_zone_prices[<?php echo esc_attr($slug); ?>][regular_price]"
                                value="<?php echo esc_attr($zone['regular_price']); ?>"
                                placeholder="<?php esc_attr_e('Regular', 'yvp-sales-booster'); ?>"
                                style="margin-right: 4px;">
                            <input type="text" class="wc_input_price short"
                                id="yvp_bundle_zone_<?php echo esc_attr($slug); ?>_sale_price"
                                name="yvp_bundle_zone_prices[<?php echo esc_attr($slug); ?>][sale_price]"
                                value="<?php echo esc_attr($zone['sale_price']); ?>"
                                placeholder="<?php esc_attr_e('Sale (opt.)', 'yvp-sales-booster'); ?>">
                        </p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <p class="form-field">
            <label>
                <input type="radio" name="yvp_bundle_pricing_mode" value="percentage" <?php checked($pricing_mode, 'percentage'); ?>>
                <?php _e('Percentage Discount', 'yvp-sales-booster'); ?>
            </label>
            <span
                class="description"><?php _e('Apply a percentage discount on the combined price of items.', 'yvp-sales-booster'); ?></span>
        </p>

        <p class="form-field">
            <label>
                <input type="radio" name="yvp_bundle_pricing_mode" value="fixed_discount" <?php checked($pricing_mode, 'fixed_discount'); ?>>
                <?php _e('Fixed Discount', 'yvp-sales-booster'); ?>
            </label>
            <span
                class="description"><?php _e('Subtract a fixed amount from the combined price.', 'yvp-sales-booster'); ?></span>
        </p>

        <p class="form-field yvp-discount-value-field"
            style="<?php echo $pricing_mode === 'fixed' ? 'display:none;' : ''; ?>">
            <label for="yvp_bundle_discount_value"><?php _e('Discount Value', 'yvp-sales-booster'); ?></label>
            <input type="number" id="yvp_bundle_discount_value" name="yvp_bundle_discount_value"
                value="<?php echo esc_attr($discount_value); ?>" step="0.01" min="0" class="short">
            <span class="description" id="discount-value-desc">
                <?php echo $pricing_mode === 'percentage' ? '%' : get_woocommerce_currency_symbol(); ?>
            </span>
        </p>
    </div>
</div>

<script>
    jQuery(function ($) {
        // Toggle field visibility on pricing-mode change
        $('input[name="yvp_bundle_pricing_mode"]').on('change', function () {
            var mode = $(this).val();
            if (mode === 'fixed') {
                $('.yvp-discount-value-field').hide();
                $('.yvp-fixed-price-fields').show();
            } else {
                $('.yvp-discount-value-field').show();
                $('.yvp-fixed-price-fields').hide();
                $('#discount-value-desc').text(mode === 'percentage' ? '%' : '<?php echo get_woocommerce_currency_symbol(); ?>');
            }
        });
    });
</script>