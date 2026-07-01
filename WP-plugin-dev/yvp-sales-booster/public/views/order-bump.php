<?php
/**
 * Order Bump Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="yvp-order-bump <?php echo $in_cart ? 'accepted' : ''; ?>" data-bump-id="<?php echo esc_attr($bump->id); ?>">
    <div class="yvp-bump-header">
        <label class="yvp-bump-checkbox">
            <input type="checkbox" <?php checked($in_cart); ?>>
        </label>
        <div class="yvp-bump-content">
            <div class="yvp-bump-headline">
                <?php echo esc_html($bump->headline ?: __('Add this to your order!', 'yvp-sales-booster')); ?>
            </div>
            <?php if ($bump->description): ?>
                <div class="yvp-bump-description">
                    <?php echo esc_html($bump->description); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div class="yvp-bump-product">
        <?php echo $product->get_image('thumbnail'); ?>
        <div class="yvp-bump-product-info">
            <div class="yvp-bump-product-name"><?php echo esc_html($product->get_name()); ?></div>
        </div>
        <div class="yvp-bump-pricing">
            <?php if ($savings > 0): ?>
                <div class="yvp-bump-original-price"><?php echo wc_price($original_price); ?></div>
                <div class="yvp-bump-discounted-price"><?php echo wc_price($discounted_price); ?></div>
                <div class="yvp-bump-savings"><?php printf(__('Save %s', 'yvp-sales-booster'), wc_price($savings)); ?></div>
            <?php else: ?>
                <div class="yvp-bump-discounted-price"><?php echo wc_price($original_price); ?></div>
            <?php endif; ?>
        </div>
    </div>
</div>