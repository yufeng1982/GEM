function page_OnLoad() {
	var actionBarItems = [];
	var selectAll = new Ext.Action( {
		text : "${f:getText('Com.CheckAll')}",
		iconCls: 'ss_sprite ss_bell_add',
		handler: function() {
			PAction.checkedAll();
		}
	});
	var removeAll = new Ext.Action( {
		text : "${f:getText('Com.UncheckAll')}",
		iconCls: 'ss_sprite ss_bell_delete',
		handler: function() {
			PAction.uncheckedAll();
		}
	});
	actionBarItems[52] = new Ext.Button(selectAll);
	actionBarItems[53] = new Ext.Button(removeAll);
	
	var actionBar = new ERP.FormActionBar(actionBarItems);

	var FUNCTION_NODE_TREE_ID = "FUNCTION_NODE_TREE_ID";
	var APP_RESOURCE_TREE_GRID_ID = "APP_RESOURCE_TREE_GRID_ID";
	
	var functionNodeTree = Ext.create('Ext.tree.Panel', {
        store: Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: '/app/${APP_NAME}/ui/menu/tree/byRole',
                extraParams: {functionNodeIds: $("functionNodeIds").value}
            },
            autoLoad : true
        }),
		id: FUNCTION_NODE_TREE_ID,
        singleExpand: false,
        multiSelect: true,
        rootVisible: false,
        frame: true,
        useArrows: true
    });
	
	Ext.define('AppResource', {
       extend: 'Ext.data.Model',
       fields: [
        	{name: 'title'},
          	{name: 'id'},
          	{name: '_id'},
          	{name: '_parent'},
          	{name: '_category'},
          	{name: '_level', type: 'int'},
          	{name: 'leaf', type: 'bool'},
          	{name: '_enable', type: 'bool'},
          	{name: '_visible', type: 'bool'}
       ]
   });
   var store = Ext.create('Ext.data.TreeStore', {
       model: 'AppResource',
       proxy: {
           type: 'ajax',
           url: '/app/${APP_NAME}/ui/menu/tree/allResources',
           extraParams: {role: '${entity.id}'}
       },
       autoLoad : true
   });
    
    // create the Grid
    var appResourceTreeGrid = Ext.create('Ext.tree.Panel', {
    	id : APP_RESOURCE_TREE_GRID_ID,
        useArrows: true,
        rootVisible: false,
        store: store,
        multiSelect: true,
        singleExpand: false,
        columns: [
      	        {
      	        	dataIndex : 'title', 
      	        	xtype: 'treecolumn',
        	        	text: "${f:getText('AppResource.Name')}", 
                  	flex: 2,
        	        	width: 100, 
        	        	sortable: true
      	    	}, {
      	    		text: "${f:getText('Com.Enable')}",
      	    		flex: 1, 
      	    		width: 45, 
      	    		sortable: true, 
      	    		dataIndex: '_enable', 
      	    		renderer: function(value, metadata, record, rowIndex, colIndex, store) {
      	    			return PAction.enableRenderer(value, metadata, record, rowIndex, colIndex, store); 
      	    		},
      	    		align:'center'
      	    	}, {
      	    		text: "${f:getText('Com.Visible')}", 
      	    		flex: 1, 
      	    		width: 45, 
      	    		sortable: true, 
      	    		dataIndex: '_visible', 
      	    		renderer: function(value, metadata, record, rowIndex, colIndex, store) {
      	    			return PAction.visibleRenderer(value, metadata, record, rowIndex, colIndex, store); 
      	    		},
      	    		align:'center'
      	    	}
      	    ]
    });
    var gridTreeHeight = screen.availHeight - 350;
	PApp =  new ERP.FormApplication({
		functionNodeTree : functionNodeTree,
		appResourceTreeGrid : appResourceTreeGrid,
		pageLayout : {
			bodyItems: [{
				xtype : "portlet",
				id : "role_general",
				title : ss_icon('ss_application_form') + "${f:getText('Com.General')}",
				height : 120,
				contentEl : "infoDiv"
			}, {
				xtype : "portlet",
				id : "top_panel_id",
				title : ss_icon('ss_application_form') + "${f:getText('Com.Details')}",
				height : gridTreeHeight + 30,
				width : 1024,
				layout:'column',
				items: [{
					id : 'panel_fn_tree',
					xtype : "portlet",
					closable : false,
					collapseFirst: false,
					tools: [{type:'expand', handler: function(event, toolEl, panel){PApp.functionNodeTree.expandAll();}}, 
					        {type:'collapse', handler: function(event, toolEl, panel){PApp.functionNodeTree.collapseAll();}}],
					columnWidth: .5,
					height : gridTreeHeight-15,
					margin : "0 3 3 0",
					layout : 'fit',
					title : "${f:getText('Com.FunctionNodeList')}",
					items : [functionNodeTree]
				}, {
					id : 'panel_ap_tree',
					xtype : "portlet",
					closable : false,
					collapseFirst: false,
					tools: [{type:'expand', handler: function(event, toolEl, panel){PApp.appResourceTreeGrid.expandAll();}}, 
					        {type:'collapse', handler: function(event, toolEl, panel){PApp.appResourceTreeGrid.collapseAll();}}],
					columnWidth: .48,
					height : gridTreeHeight -15,
					layout : 'fit',
					title : "${f:getText('AppResource.List')}",
					items : [appResourceTreeGrid]
				}],
				
	    		listeners : {
					'resize': function (pnl) {
						var tree = Ext.getCmp("panel_fn_tree");
						if (tree) {
							tree.setSize(pnl.getWidth() * 0.5);
						}
						tree = Ext.getCmp("panel_ap_tree");
						if (tree) {
							tree.setSize(pnl.getWidth() * 0.5);
						}
					}
				}
			}]
		},
		actionBar : actionBar
	});
	
	PAction = new ERP.security.user.RoleAction({
		resources : ${entity.resources},
		allResources : {}
	});
	
//	PAction.getFunctionNodeTree().expandAll();
//	PAction.getAppResourceTreeGrid().expandAll();
}

function page_AfterLoad() {
	// handle those disable process ...
}
