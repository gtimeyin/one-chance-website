<?php
/**
 * Admin Page Template
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap yvp-admin-wrap">
    <div class="yvp-admin-header">
        <h1>
            <span class="dashicons dashicons-chart-area"></span>
            <?php _e('YVP Sales Booster', 'yvp-sales-booster'); ?>
        </h1>
    </div>

    <nav class="yvp-admin-tabs nav-tab-wrapper">
        <a href="#bundles" class="nav-tab <?php echo $active_tab === 'bundles' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Bundles', 'yvp-sales-booster'); ?>
        </a>
        <a href="#zones" class="nav-tab <?php echo $active_tab === 'zones' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Pricing Zones', 'yvp-sales-booster'); ?>
        </a>
        <a href="#upsells" class="nav-tab <?php echo $active_tab === 'upsells' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Upsells', 'yvp-sales-booster'); ?>
        </a>
        <a href="#fbt" class="nav-tab <?php echo $active_tab === 'fbt' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Bought Together', 'yvp-sales-booster'); ?>
        </a>
        <a href="#bogo" class="nav-tab <?php echo $active_tab === 'bogo' ? 'nav-tab-active' : ''; ?>">
            <?php _e('BOGO Deals', 'yvp-sales-booster'); ?>
        </a>
        <a href="#bumps" class="nav-tab <?php echo $active_tab === 'bumps' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Order Bumps', 'yvp-sales-booster'); ?>
        </a>
        <a href="#settings" class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Settings', 'yvp-sales-booster'); ?>
        </a>
    </nav>

    <!-- Bundles Tab -->
    <div id="tab-bundles" class="yvp-tab-content <?php echo $active_tab === 'bundles' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('Product Bundles', 'yvp-sales-booster'); ?></h2>
                <a href="<?php echo admin_url('post-new.php?post_type=product'); ?>" class="yvp-btn yvp-btn-primary">
                    <span class="dashicons dashicons-plus"></span>
                    <?php _e('Create Bundle', 'yvp-sales-booster'); ?>
                </a>
            </div>
            <p><?php _e('Create bundles by adding a new product and selecting "Product Bundle" as the product type.', 'yvp-sales-booster'); ?></p>
            
            <?php
            $bundles = get_posts([
                'post_type' => 'product',
                'posts_per_page' => 20,
                'tax_query' => [
                    [
                        'taxonomy' => 'product_type',
                        'field' => 'slug',
                        'terms' => 'yvp_bundle',
                    ],
                ],
            ]);
            
            if (!empty($bundles)): ?>
            <table class="yvp-table">
                <thead>
                    <tr>
                        <th><?php _e('Bundle Name', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Items', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Price', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Actions', 'yvp-sales-booster'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bundles as $bundle_post): 
                        $product = wc_get_product($bundle_post->ID);
                        $bundle_items = get_post_meta($bundle_post->ID, '_yvp_bundle_items', true) ?: [];
                    ?>
                    <tr>
                        <td><?php echo esc_html($product->get_name()); ?></td>
                        <td><?php echo count($bundle_items); ?> <?php _e('items', 'yvp-sales-booster'); ?></td>
                        <td><?php echo $product->get_price_html(); ?></td>
                        <td>
                            <a href="<?php echo get_edit_post_link($bundle_post->ID); ?>" class="button button-small">
                                <?php _e('Edit', 'yvp-sales-booster'); ?>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <p><em><?php _e('No bundles created yet.', 'yvp-sales-booster'); ?></em></p>
            <?php endif; ?>
        </div>
    </div>

    <!-- Zones Tab -->
    <div id="tab-zones" class="yvp-tab-content <?php echo $active_tab === 'zones' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('Pricing Zones', 'yvp-sales-booster'); ?></h2>
                <button type="button" class="yvp-btn yvp-btn-primary" data-modal="zone-modal">
                    <span class="dashicons dashicons-plus"></span>
                    <?php _e('Add Zone', 'yvp-sales-booster'); ?>
                </button>
            </div>
            
            <?php
            global $wpdb;
            $zones = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}yvp_pricing_zones ORDER BY priority DESC");
            
            if (!empty($zones)): ?>
            <table class="yvp-table">
                <thead>
                    <tr>
                        <th><?php _e('Zone Name', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Countries', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Priority', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Status', 'yvp-sales-booster'); ?></th>
                        <th><?php _e('Actions', 'yvp-sales-booster'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($zones as $zone): 
                        $countries = json_decode($zone->countries, true) ?: [];
                    ?>
                    <tr>
                        <td><?php echo esc_html($zone->zone_name); ?></td>
                        <td><?php echo count($countries); ?> <?php _e('countries', 'yvp-sales-booster'); ?></td>
                        <td><?php echo esc_html($zone->priority); ?></td>
                        <td>
                            <span class="yvp-status yvp-status-<?php echo esc_attr($zone->status); ?>">
                                <?php echo esc_html(ucfirst($zone->status)); ?>
                            </span>
                        </td>
                        <td>
                            <button type="button" class="button button-small yvp-edit-zone" data-zone-id="<?php echo esc_attr($zone->id); ?>">
                                <?php _e('Edit', 'yvp-sales-booster'); ?>
                            </button>
                            <button type="button" class="button button-small yvp-delete-zone" data-zone-id="<?php echo esc_attr($zone->id); ?>">
                                <?php _e('Delete', 'yvp-sales-booster'); ?>
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <p><em><?php _e('No pricing zones created yet.', 'yvp-sales-booster'); ?></em></p>
            <?php endif; ?>
        </div>
    </div>

    <!-- Other tabs follow same pattern... -->
    <div id="tab-upsells" class="yvp-tab-content <?php echo $active_tab === 'upsells' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('Upsell & Cross-sell Rules', 'yvp-sales-booster'); ?></h2>
                <button type="button" class="yvp-btn yvp-btn-primary" data-modal="upsell-modal">
                    <span class="dashicons dashicons-plus"></span>
                    <?php _e('Add Rule', 'yvp-sales-booster'); ?>
                </button>
            </div>
            <p><?php _e('Create rules to show upsells and cross-sells on product and cart pages.', 'yvp-sales-booster'); ?></p>
        </div>
    </div>

    <div id="tab-fbt" class="yvp-tab-content <?php echo $active_tab === 'fbt' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('Frequently Bought Together', 'yvp-sales-booster'); ?></h2>
            </div>
            <p><?php _e('Configure FBT pairs by editing individual products and using the "Bought Together" tab.', 'yvp-sales-booster'); ?></p>
        </div>
    </div>

    <div id="tab-bogo" class="yvp-tab-content <?php echo $active_tab === 'bogo' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('BOGO Deals', 'yvp-sales-booster'); ?></h2>
                <button type="button" class="yvp-btn yvp-btn-primary" data-modal="bogo-modal">
                    <span class="dashicons dashicons-plus"></span>
                    <?php _e('Add Deal', 'yvp-sales-booster'); ?>
                </button>
            </div>
            <p><?php _e('Create Buy One Get One deals with flexible conditions and discounts.', 'yvp-sales-booster'); ?></p>
        </div>
    </div>

    <div id="tab-bumps" class="yvp-tab-content <?php echo $active_tab === 'bumps' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('Order Bumps', 'yvp-sales-booster'); ?></h2>
                <button type="button" class="yvp-btn yvp-btn-primary" data-modal="bump-modal">
                    <span class="dashicons dashicons-plus"></span>
                    <?php _e('Add Bump', 'yvp-sales-booster'); ?>
                </button>
            </div>
            <p><?php _e('Create checkout offers that appear during the payment process.', 'yvp-sales-booster'); ?></p>
        </div>
    </div>

    <div id="tab-settings" class="yvp-tab-content <?php echo $active_tab === 'settings' ? 'active' : ''; ?>">
        <div class="yvp-card">
            <div class="yvp-card-header">
                <h2><?php _e('General Settings', 'yvp-sales-booster'); ?></h2>
            </div>
            <form method="post" action="options.php">
                <?php settings_fields('yvp_settings'); ?>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_bundles" value="yes" 
                               <?php checked(get_option('yvp_enable_bundles', 'yes'), 'yes'); ?>>
                        <?php _e('Enable Product Bundling', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_zones" value="yes" 
                               <?php checked(get_option('yvp_enable_zones', 'yes'), 'yes'); ?>>
                        <?php _e('Enable Pricing Zones', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_upsells" value="yes" 
                               <?php checked(get_option('yvp_enable_upsells', 'yes'), 'yes'); ?>>
                        <?php _e('Enable Upsells & Cross-sells', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_fbt" value="yes" 
                               <?php checked(get_option('yvp_enable_fbt', 'yes'), 'yes'); ?>>
                        <?php _e('Enable Frequently Bought Together', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_bogo" value="yes" 
                               <?php checked(get_option('yvp_enable_bogo', 'yes'), 'yes'); ?>>
                        <?php _e('Enable BOGO Deals', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <div class="yvp-form-row">
                    <label>
                        <input type="checkbox" name="yvp_enable_bumps" value="yes" 
                               <?php checked(get_option('yvp_enable_bumps', 'yes'), 'yes'); ?>>
                        <?php _e('Enable Order Bumps', 'yvp-sales-booster'); ?>
                    </label>
                </div>
                
                <?php submit_button(); ?>
            </form>
        </div>
    </div>
</div>

<!-- Zone Modal -->
<div id="zone-modal" class="yvp-modal-overlay">
    <div class="yvp-modal">
        <div class="yvp-modal-header">
            <h2><?php _e('Add Pricing Zone', 'yvp-sales-booster'); ?></h2>
            <span class="yvp-modal-close">&times;</span>
        </div>
        <div class="yvp-modal-body">
            <form class="yvp-zone-form">
                <input type="hidden" name="zone_id" value="">
                
                <div class="yvp-form-row">
                    <label for="zone_name"><?php _e('Zone Name', 'yvp-sales-booster'); ?></label>
                    <input type="text" name="zone_name" id="zone_name" required>
                </div>
                
                <div class="yvp-form-row">
                    <label for="zone_countries"><?php _e('Countries', 'yvp-sales-booster'); ?></label>
                    <select name="countries[]" id="zone_countries" multiple class="wc-enhanced-select">
                        <?php foreach (WC()->countries->get_countries() as $code => $name): ?>
                        <option value="<?php echo esc_attr($code); ?>"><?php echo esc_html($name); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="yvp-form-row">
                    <label for="zone_priority"><?php _e('Priority', 'yvp-sales-booster'); ?></label>
                    <input type="number" name="priority" id="zone_priority" value="0" min="0">
                    <p class="description"><?php _e('Higher priority zones take precedence.', 'yvp-sales-booster'); ?></p>
                </div>
                
                <div class="yvp-form-row">
                    <label for="zone_status"><?php _e('Status', 'yvp-sales-booster'); ?></label>
                    <select name="status" id="zone_status">
                        <option value="active"><?php _e('Active', 'yvp-sales-booster'); ?></option>
                        <option value="inactive"><?php _e('Inactive', 'yvp-sales-booster'); ?></option>
                    </select>
                </div>
            </form>
        </div>
        <div class="yvp-modal-footer">
            <button type="button" class="yvp-btn yvp-btn-secondary yvp-modal-close">
                <?php _e('Cancel', 'yvp-sales-booster'); ?>
            </button>
            <button type="button" class="yvp-btn yvp-btn-primary yvp-save-zone">
                <?php _e('Save Zone', 'yvp-sales-booster'); ?>
            </button>
        </div>
    </div>
</div>
