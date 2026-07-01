/**
 * YVP Sales Booster - Admin JavaScript
 */

(function ($) {
    'use strict';

    // Set default yvpAdmin if not defined
    if (typeof window.yvpAdmin === 'undefined') {
        console.warn('YVP Admin: yvpAdmin not found, using defaults');
        window.yvpAdmin = {
            ajaxUrl: '/wp-admin/admin-ajax.php',
            nonce: '',
            i18n: {
                searchProducts: 'Search for a product...',
                noResults: 'No products found',
                remove: 'Remove'
            }
        };
    }

    const YVPAdmin = {
        init: function () {
            console.log('YVP Admin initialized', yvpAdmin); // Debug
            this.initProductSearch();
            this.initBundleItems();
            this.initFBTItems();
            this.initZoneManager();
            this.initModals();
            this.initTabs();
        },

        /**
         * Initialize product search with Select2
         */
        initProductSearch: function () {
            $('.yvp-product-search').each(function () {
                $(this).select2({
                    ajax: {
                        url: yvpAdmin.ajaxUrl,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                action: 'yvp_search_products',
                                q: params.term,
                                nonce: yvpAdmin.nonce
                            };
                        },
                        processResults: function (data) {
                            return data;
                        }
                    },
                    minimumInputLength: 2,
                    placeholder: yvpAdmin.i18n.searchProducts
                });
            });
        },

        /**
         * Initialize bundle items management
         */
        initBundleItems: function () {
            const $container = $('#yvp_bundle_data');

            $container.on('click', '.yvp-add-bundle-item', function (e) {
                e.preventDefault();
                YVPAdmin.addBundleItem();
            });

            $container.on('click', '.remove-item', function (e) {
                e.preventDefault();
                $(this).closest('.yvp-bundle-item').remove();
            });

            $container.find('.yvp-product-search').each(function () {
                YVPAdmin.initSingleProductSearch($(this));
            });
        },

        /**
         * Add a new bundle item row
         */
        addBundleItem: function () {
            const index = $('.yvp-bundle-item').length;
            const $template = $(`
                <div class="yvp-bundle-item">
                    <select class="yvp-product-search product-select" 
                            name="yvp_bundle_items[${index}][product_id]">
                    </select>
                    <input type="number" 
                           class="quantity-input" 
                           name="yvp_bundle_items[${index}][quantity]" 
                           value="1" 
                           min="1" 
                           placeholder="Qty">
                    <span class="remove-item dashicons dashicons-trash"></span>
                </div>
            `);

            $('.yvp-bundle-items').append($template);
            this.initSingleProductSearch($template.find('.yvp-product-search'));
        },

        /**
         * Initialize a single product search field
         */
        initSingleProductSearch: function ($element) {
            $element.select2({
                ajax: {
                    url: yvpAdmin.ajaxUrl,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            action: 'yvp_search_products',
                            q: params.term,
                            nonce: yvpAdmin.nonce
                        };
                    },
                    processResults: function (data) {
                        return data;
                    }
                },
                minimumInputLength: 2,
                placeholder: yvpAdmin.i18n.searchProducts,
                allowClear: true
            });
        },

        /**
         * Initialize FBT items management
         */
        initFBTItems: function () {
            const $container = $('#yvp_fbt_data');

            $container.on('click', '.yvp-add-fbt-item', function (e) {
                e.preventDefault();
                YVPAdmin.addFBTItem();
            });

            $container.on('click', '.remove-item', function (e) {
                e.preventDefault();
                $(this).closest('.yvp-fbt-item').remove();
            });

            $container.find('.yvp-product-search').each(function () {
                YVPAdmin.initSingleProductSearch($(this));
            });
        },

        /**
         * Add a new FBT item row
         */
        addFBTItem: function () {
            const index = $('.yvp-fbt-item').length;
            const $template = $(`
                <div class="yvp-fbt-item">
                    <select class="yvp-product-search product-select" 
                            name="yvp_fbt_products[${index}][product_id]">
                    </select>
                    <input type="number" 
                           class="quantity-input" 
                           name="yvp_fbt_products[${index}][quantity]" 
                           value="1" 
                           min="1" 
                           placeholder="Qty">
                    <span class="remove-item dashicons dashicons-trash"></span>
                </div>
            `);

            $('.yvp-fbt-products').append($template);
            this.initSingleProductSearch($template.find('.yvp-product-search'));
        },

        /**
         * Initialize zone manager
         */
        initZoneManager: function () {
            console.log('Zone manager initialized'); // Debug

            // Save zone button click
            $(document).on('click', '.yvp-save-zone', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Save zone clicked'); // Debug

                const $modal = $(this).closest('.yvp-modal-overlay');
                const $form = $modal.find('form.yvp-zone-form');

                if ($form.length === 0) {
                    console.error('Form not found');
                    return;
                }

                YVPAdmin.saveZone($form);
            });

            // Delete zone
            $(document).on('click', '.yvp-delete-zone', function (e) {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this zone?')) {
                    const zoneId = $(this).data('zone-id');
                    YVPAdmin.deleteZone(zoneId, $(this));
                }
            });
        },

        /**
         * Save zone via AJAX
         */
        saveZone: function ($form) {
            console.log('saveZone called'); // Debug

            // Get form values
            const zoneName = $form.find('#zone_name').val();
            const zoneId = $form.find('[name="zone_id"]').val() || '0';
            const priority = $form.find('#zone_priority').val() || '0';
            const status = $form.find('#zone_status').val() || 'active';

            // Get countries from Select2
            let countries = $form.find('#zone_countries').val();
            console.log('Selected countries:', countries); // Debug

            if (!countries) {
                countries = [];
            } else if (!Array.isArray(countries)) {
                countries = [countries];
            }

            // Validate
            if (!zoneName || zoneName.trim() === '') {
                alert('Please enter a zone name');
                return;
            }

            console.log('Sending AJAX request...'); // Debug

            // Build form data manually for proper array handling
            const formData = new FormData();
            formData.append('action', 'yvp_save_zone');
            formData.append('nonce', yvpAdmin.nonce);
            formData.append('zone_id', zoneId);
            formData.append('zone_name', zoneName);
            formData.append('priority', priority);
            formData.append('status', status);

            // Append countries as array
            countries.forEach(function (country) {
                formData.append('countries[]', country);
            });

            $.ajax({
                url: yvpAdmin.ajaxUrl,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('Response:', response); // Debug
                    if (response.success) {
                        location.reload();
                    } else {
                        alert('Error saving zone: ' + (response.data || 'Unknown error'));
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', xhr.responseText);
                    alert('AJAX error: ' + error);
                }
            });
        },

        /**
         * Delete zone via AJAX
         */
        deleteZone: function (zoneId, $button) {
            $.ajax({
                url: yvpAdmin.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'yvp_delete_zone',
                    nonce: yvpAdmin.nonce,
                    zone_id: zoneId
                },
                success: function (response) {
                    if (response.success) {
                        $button.closest('tr, .yvp-zone-row').fadeOut(function () {
                            $(this).remove();
                        });
                    }
                }
            });
        },

        /**
         * Initialize modals
         */
        initModals: function () {
            // Open modal
            $(document).on('click', '[data-modal]', function (e) {
                e.preventDefault();
                const modalId = $(this).data('modal');
                const $modal = $('#' + modalId);

                console.log('Opening modal:', modalId); // Debug
                $modal.addClass('active');

                // Initialize Select2 for countries when zone modal opens
                if (modalId === 'zone-modal') {
                    YVPAdmin.initCountriesSelect($modal);
                }
            });

            // Close modal on X button click
            $(document).on('click', '.yvp-modal-close', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).closest('.yvp-modal-overlay').removeClass('active');
            });

            // Close modal on overlay click (but not on modal content click)
            $(document).on('click', '.yvp-modal-overlay', function (e) {
                if (e.target === this) {
                    $(this).removeClass('active');
                }
            });
        },

        /**
         * Initialize countries Select2 with tags/badges style
         */
        initCountriesSelect: function ($modal) {
            const $select = $modal.find('#zone_countries');

            // Destroy existing Select2 if any
            if ($select.hasClass('select2-hidden-accessible')) {
                $select.select2('destroy');
            }

            setTimeout(function () {
                $select.select2({
                    placeholder: 'Search and select countries...',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $modal.find('.yvp-modal-body'),
                    multiple: true,
                    tags: false,
                    tokenSeparators: [','],
                    closeOnSelect: false
                });
                console.log('Select2 initialized for countries'); // Debug
            }, 150);
        },

        /**
         * Initialize admin tabs
         */
        initTabs: function () {
            $('.yvp-admin-tabs .nav-tab').on('click', function (e) {
                e.preventDefault();

                const target = $(this).attr('href');

                // Update URL without reload
                history.pushState(null, null, target);

                // Switch tabs
                $('.yvp-admin-tabs .nav-tab').removeClass('nav-tab-active');
                $(this).addClass('nav-tab-active');

                // Switch content
                $('.yvp-tab-content').removeClass('active');
                $(target.replace('#', '#tab-')).addClass('active');
            });

            // Handle initial tab from URL
            const hash = window.location.hash;
            if (hash) {
                $(`.yvp-admin-tabs .nav-tab[href="${hash}"]`).trigger('click');
            }
        }
    };

    // Initialize on document ready
    $(document).ready(function () {
        YVPAdmin.init();
    });

})(jQuery);
