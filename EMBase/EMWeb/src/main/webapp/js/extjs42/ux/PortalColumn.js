/**
 * @class ERP.ui.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.app.PortalPanel}.
 */
Ext.define('ERP.ui.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
/*
    requires: [
        'Ext.layout.container.Anchor',
        'Ext.app.Portlet'
    ],
*/
    layout: 'anchor',
    defaultType: 'portlet',
    cls: 'x-portal-column'//,
    //autoHeight: true
    //
    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
    //
});