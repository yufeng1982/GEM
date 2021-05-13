<script type="text/javascript">
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.state.*'
         ]);
Ext.state.Manager.setProvider( 
    Ext.create('ERP.state.HttpProvider', { 
        app_rootp: '/app/${APP_NAME}/',
        pageName:'${__CONTROLLER_NAME__}',
        scopeObjectType:"${fn:contains(__CONTROLLER_NAME__, 'PopupSelectController') ? gridUrl : _SCOPE_OBJECT_TYPE_}"//HACK for popup select
    }) 
);
</script>