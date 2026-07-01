<?php
/**
 * Cart Upsells Display Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="yvp-cart-upsells">
    <h3><?php echo esc_html($heading); ?></h3>

    <div class="yvp-upsells-grid">
        <?php foreach ($products as $upsell):
            $upsell_product = $upsell['product'];
            $discount = $upsell['discount'];
            ?>
            <div class="yvp-upsell-item">
                <a href="<?php echo esc_url($upsell_product->get_permalink()); ?>">
                    <?php echo $upsell_product->get_image('woocommerce_thumbnail'); ?>
                </a>
                <div class="yvp-upsell-info">
                    <div class="yvp-upsell-name">
                        <a href="<?php echo esc_url($upsell_product->get_permalink()); ?>">
                            <?php echo esc_html($upsell_product->get_name()); ?>
                        </a>
                    </div>

                    <div class="yvp-upsell-price">
                        <?php echo $upsell_product->get_price_html(); ?>
                    </div>

                    <?php if ($upsell_product->is_purchasable() && $upsell_product->is_in_stock()): ?>
                        <button type="button" class="yvp-upsell-add button"
                            data-product-id="<?php echo esc_attr($upsell_product->get_id()); ?>">
                            <?php _e('Add', 'yvp-sales-booster'); ?>
                        </button>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>