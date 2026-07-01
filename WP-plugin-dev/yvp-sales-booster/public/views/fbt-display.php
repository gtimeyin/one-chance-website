<?php
/**
 * FBT Display Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="yvp-fbt-section" data-main-product-id="<?php echo esc_attr($main_product->get_id()); ?>"
    data-main-price="<?php echo esc_attr($main_product->get_price()); ?>" <?php if ($discount): ?>
        data-discount-type="<?php echo esc_attr($discount['type']); ?>"
        data-discount-value="<?php echo esc_attr($discount['value']); ?>" <?php endif; ?>>

    <h3><?php _e('Frequently Bought Together', 'yvp-sales-booster'); ?></h3>

    <div class="yvp-fbt-products">
        <!-- Main Product -->
        <div class="yvp-fbt-item">
            <div class="yvp-fbt-product main-product">
                <?php echo $main_product->get_image('thumbnail'); ?>
                <div class="yvp-fbt-product-info">
                    <div class="yvp-fbt-product-name"><?php echo esc_html($main_product->get_name()); ?></div>
                    <div class="yvp-fbt-product-price"><?php echo $main_product->get_price_html(); ?></div>
                </div>
            </div>
        </div>

        <?php foreach ($fbt_products as $fbt_item):
            $product = $fbt_item['product'];
            $quantity = $fbt_item['quantity'];
            ?>
            <span class="yvp-fbt-plus">+</span>

            <div class="yvp-fbt-item">
                <input type="checkbox" class="yvp-fbt-checkbox" value="<?php echo esc_attr($product->get_id()); ?>"
                    data-price="<?php echo esc_attr($product->get_price() * $quantity); ?>" checked>
                <div class="yvp-fbt-product">
                    <?php echo $product->get_image('thumbnail'); ?>
                    <div class="yvp-fbt-product-info">
                        <div class="yvp-fbt-product-name"><?php echo esc_html($product->get_name()); ?></div>
                        <div class="yvp-fbt-product-price">
                            <?php if ($quantity > 1): ?>
                                <?php echo $quantity; ?> ×
                            <?php endif; ?>
                            <?php echo $product->get_price_html(); ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="yvp-fbt-summary">
        <div class="yvp-fbt-total">
            <span class="original-price"><?php echo wc_price($original_total); ?></span>
            <span class="discounted-price"><?php echo wc_price($discounted_total); ?></span>

            <?php if ($savings > 0): ?>
                <span class="yvp-fbt-savings" <?php echo $savings > 0 ? '' : 'style="display:none;"'; ?>>
                    <?php printf(__('Save %s', 'yvp-sales-booster'), wc_price($savings)); ?>
                </span>
            <?php endif; ?>
        </div>

        <button type="button" class="yvp-fbt-add-all">
            <?php _e('Add All to Cart', 'yvp-sales-booster'); ?>
        </button>
    </div>
</div>