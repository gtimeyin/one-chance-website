/**
 * YVP Sales Booster - Public JavaScript
 */

(function ($) {
    'use strict';

    const YVPPublic = {
        init: function () {
            this.initFBT();
            this.initOrderBumps();
            this.initUpsellAddToCart();
        },

        /**
         * Initialize Frequently Bought Together
         */
        initFBT: function () {
            // Handle checkbox changes
            $(document).on('change', '.yvp-fbt-checkbox', function () {
                YVPPublic.updateFBTTotal();
            });

            // Handle Add All to Cart
            $(document).on('click', '.yvp-fbt-add-all', function (e) {
                e.preventDefault();
                YVPPublic.addFBTToCart($(this));
            });
        },

        /**
         * Update FBT total price
         */
        updateFBTTotal: function () {
            const $section = $('.yvp-fbt-section');
            let total = 0;
            let count = 0;

            // Main product is always included
            total += parseFloat($section.data('main-price') || 0);
            count++;

            // Add checked items
            $section.find('.yvp-fbt-checkbox:checked').each(function () {
                total += parseFloat($(this).data('price') || 0);
                count++;
            });

            // Apply discount if all items selected
            const allChecked = $section.find('.yvp-fbt-checkbox').length ===
                $section.find('.yvp-fbt-checkbox:checked').length;

            if (allChecked && $section.data('discount-type')) {
                const discountType = $section.data('discount-type');
                const discountValue = parseFloat($section.data('discount-value') || 0);

                if (discountType === 'percentage') {
                    total = total * (1 - discountValue / 100);
                } else if (discountType === 'fixed') {
                    total = total - discountValue;
                }

                $section.find('.yvp-fbt-savings').show();
            } else {
                $section.find('.yvp-fbt-savings').hide();
            }

            // Update display
            $section.find('.discounted-price').text(YVPPublic.formatPrice(total));
        },

        /**
         * Add FBT products to cart
         */
        addFBTToCart: function ($button) {
            const $section = $button.closest('.yvp-fbt-section');
            const mainProductId = $section.data('main-product-id');

            // Get selected product IDs
            const selectedIds = [];
            $section.find('.yvp-fbt-checkbox:checked').each(function () {
                selectedIds.push($(this).val());
            });

            $button.prop('disabled', true).text('Adding...');

            $.ajax({
                url: yvpPublic.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'yvp_add_fbt_to_cart',
                    nonce: yvpPublic.nonce,
                    main_product_id: mainProductId,
                    fbt_product_ids: selectedIds
                },
                success: function (response) {
                    if (response.success) {
                        // Update cart fragments
                        if (response.data.fragments) {
                            $.each(response.data.fragments, function (key, value) {
                                $(key).replaceWith(value);
                            });
                        }

                        // Show success message or redirect
                        $button.text('Added!');
                        setTimeout(function () {
                            if (response.data.cart_url) {
                                window.location.href = response.data.cart_url;
                            } else {
                                $button.prop('disabled', false).text('Add All to Cart');
                            }
                        }, 1000);
                    } else {
                        $button.prop('disabled', false).text('Add All to Cart');
                        alert('Error adding to cart');
                    }
                },
                error: function () {
                    $button.prop('disabled', false).text('Add All to Cart');
                    alert('Error adding to cart');
                }
            });
        },

        /**
         * Initialize Order Bumps
         */
        initOrderBumps: function () {
            $(document).on('change', '.yvp-bump-checkbox input', function () {
                const $bump = $(this).closest('.yvp-order-bump');
                const bumpId = $bump.data('bump-id');
                const isChecked = $(this).is(':checked');

                if (isChecked) {
                    YVPPublic.acceptBump(bumpId, $bump);
                } else {
                    YVPPublic.removeBump(bumpId, $bump);
                }
            });
        },

        /**
         * Accept order bump
         */
        acceptBump: function (bumpId, $bump) {
            $bump.addClass('loading');

            $.ajax({
                url: yvpPublic.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'yvp_accept_bump',
                    nonce: yvpPublic.nonce,
                    bump_id: bumpId
                },
                success: function (response) {
                    $bump.removeClass('loading');
                    if (response.success) {
                        $bump.addClass('accepted');

                        // Trigger WooCommerce cart update
                        $(document.body).trigger('update_checkout');
                    }
                },
                error: function () {
                    $bump.removeClass('loading');
                    $bump.find('.yvp-bump-checkbox input').prop('checked', false);
                }
            });
        },

        /**
         * Remove order bump
         */
        removeBump: function (bumpId, $bump) {
            $bump.addClass('loading');

            $.ajax({
                url: yvpPublic.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'yvp_remove_bump',
                    nonce: yvpPublic.nonce,
                    bump_id: bumpId
                },
                success: function (response) {
                    $bump.removeClass('loading accepted');
                    $(document.body).trigger('update_checkout');
                },
                error: function () {
                    $bump.removeClass('loading');
                }
            });
        },

        /**
         * Initialize upsell add to cart buttons
         */
        initUpsellAddToCart: function () {
            $(document).on('click', '.yvp-upsell-add', function (e) {
                e.preventDefault();
                const $button = $(this);
                const productId = $button.data('product-id');

                $button.prop('disabled', true).text('Adding...');

                $.ajax({
                    url: yvpPublic.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'woocommerce_ajax_add_to_cart',
                        product_id: productId,
                        quantity: 1
                    },
                    success: function (response) {
                        if (response.fragments) {
                            $.each(response.fragments, function (key, value) {
                                $(key).replaceWith(value);
                            });
                        }
                        $button.text('Added!');
                        setTimeout(function () {
                            $button.prop('disabled', false).text('Add to Cart');
                        }, 2000);
                    },
                    error: function () {
                        $button.prop('disabled', false).text('Add to Cart');
                    }
                });
            });
        },

        /**
         * Format price
         */
        formatPrice: function (price) {
            // Simple formatting - could be enhanced with WooCommerce settings
            return '$' + price.toFixed(2);
        }
    };

    // Initialize on document ready
    $(document).ready(function () {
        YVPPublic.init();
    });

})(jQuery);
