<?php
/**
 * FBT Product Panel Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div id="yvp_fbt_data" class="panel woocommerce_options_panel">
    <div class="options_group">
        <h4><?php _e('Frequently Bought Together Products', 'yvp-sales-booster'); ?></h4>
        <p class="description">
            <?php _e('Add products that are often purchased with this item.', 'yvp-sales-booster'); ?></p>

        <div class="yvp-fbt-products">
            <?php if (!empty($paired_products)): ?>
                <?php foreach ($paired_products as $index => $item):
                    $item_product = wc_get_product($item['product_id']);
                    ?>
                    <div class="yvp-fbt-item">
                        <select class="yvp-product-search product-select"
                            name="yvp_fbt_products[<?php echo $index; ?>][product_id]">
                            <?php if ($item_product): ?>
                                <option value="<?php echo esc_attr($item['product_id']); ?>" selected>
                                    <?php echo esc_html($item_product->get_name()); ?>
                                </option>
                            <?php endif; ?>
                        </select>
                        <input type="number" class="quantity-input" name="yvp_fbt_products[<?php echo $index; ?>][quantity]"
                            value="<?php echo esc_attr($item['quantity'] ?? 1); ?>" min="1"
                            placeholder="<?php esc_attr_e('Qty', 'yvp-sales-booster'); ?>">
                        <span class="remove-item dashicons dashicons-trash"
                            title="<?php esc_attr_e('Remove', 'yvp-sales-booster'); ?>"></span>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <button type="button" class="button yvp-add-fbt-item">
            <span class="dashicons dashicons-plus"></span>
            <?php _e('Add Product', 'yvp-sales-booster'); ?>
        </button>
    </div>

    <div class="options_group">
        <h4><?php _e('Bundle Discount', 'yvp-sales-booster'); ?></h4>
        <p class="description">
            <?php _e('Optionally offer a discount when customers buy all FBT products together.', 'yvp-sales-booster'); ?>
        </p>

        <p class="form-field">
            <label for="yvp_fbt_discount_type"><?php _e('Discount Type', 'yvp-sales-booster'); ?></label>
            <select id="yvp_fbt_discount_type" name="yvp_fbt_discount_type">
                <option value=""><?php _e('No Discount', 'yvp-sales-booster'); ?></option>
                <option value="percentage" <?php selected($discount ? $discount['type'] : '', 'percentage'); ?>>
                    <?php _e('Percentage', 'yvp-sales-booster'); ?>
                </option>
                <option value="fixed" <?php selected($discount ? $discount['type'] : '', 'fixed'); ?>>
                    <?php _e('Fixed Amount', 'yvp-sales-booster'); ?>
                </option>
            </select>
        </p>

        <p class="form-field">
            <label for="yvp_fbt_discount_value"><?php _e('Discount Value', 'yvp-sales-booster'); ?></label>
            <input type="number" id="yvp_fbt_discount_value" name="yvp_fbt_discount_value"
                value="<?php echo esc_attr($discount ? $discount['value'] : ''); ?>" step="0.01" min="0" class="short">
        </p>
    </div>
</div>