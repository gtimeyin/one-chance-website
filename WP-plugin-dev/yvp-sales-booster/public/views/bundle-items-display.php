<?php
/**
 * Bundle Items Display Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="yvp-bundle-items-display">
    <h4><?php _e('This bundle includes:', 'yvp-sales-booster'); ?></h4>

    <div class="yvp-bundle-item-list">
        <?php foreach ($bundle_items as $item):
            $item_product = wc_get_product($item['product_id']);
            if (!$item_product)
                continue;
            ?>
            <div class="yvp-bundle-item-row">
                <?php echo $item_product->get_image('thumbnail'); ?>
                <div class="yvp-bundle-item-details">
                    <div class="yvp-bundle-item-name"><?php echo esc_html($item_product->get_name()); ?></div>
                    <div class="yvp-bundle-item-qty">
                        <?php printf(__('Qty: %d', 'yvp-sales-booster'), $item['quantity']); ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>