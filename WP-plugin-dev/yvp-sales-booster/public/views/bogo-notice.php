<?php
/**
 * BOGO Notice Template
 */

if (!defined('ABSPATH')) {
    exit;
}

// Build deal description
$description = '';
if ($deal->discount_type === 'free') {
    $description = sprintf(
        __('Buy %d, Get %d FREE!', 'yvp-sales-booster'),
        $deal->buy_quantity,
        $deal->get_quantity
    );
} elseif ($deal->discount_type === 'percentage') {
    $description = sprintf(
        __('Buy %d, Get %d at %s%% off!', 'yvp-sales-booster'),
        $deal->buy_quantity,
        $deal->get_quantity,
        $deal->discount_value
    );
} else {
    $description = sprintf(
        __('Buy %d, Save %s on the next %d!', 'yvp-sales-booster'),
        $deal->buy_quantity,
        wc_price($deal->discount_value),
        $deal->get_quantity
    );
}
?>
<div class="yvp-bogo-notice">
    <h4><?php echo esc_html($deal->deal_name); ?></h4>
    <p><?php echo esc_html($description); ?></p>
</div>