<?php
/**
 * Base module class
 */

if (!defined('ABSPATH')) {
    exit;
}

abstract class YVP_Module
{

    /**
     * Hook loader
     */
    protected $loader;

    /**
     * Module name
     */
    protected $name;

    /**
     * Constructor
     */
    public function __construct(YVP_Loader $loader)
    {
        $this->loader = $loader;
        $this->init();
    }

    /**
     * Initialize the module - to be overridden by child classes
     */
    abstract protected function init();

    /**
     * Check if module is enabled
     */
    public function is_enabled()
    {
        return get_option('yvp_enable_' . $this->name, 'yes') === 'yes';
    }
}
