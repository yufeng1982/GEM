Ext.define('ERP.ui.TreeInfoLog' , {
	openExtWindowWithTreeInfoLog : function (treeJsonArray, config){

		var children = CUtils.jsonDecode(treeJsonArray);
		var store = Ext.create('Ext.data.TreeStore', {
		    root: {
		        text: config['rootText'] ? config['rootText'] : 'Created',
		        children:children
		    }
		});
		var tree = Ext.create('Ext.tree.TreePanel', {
 			autoScroll: true,
 			store: store,
 			id:'infoLogTree',
 			layout:'fit',
		    width: config['width']  ? config['width'] : 300,
		    height: config['height'] ? config['height'] : 400,
		    listeners: {
			   itemclick: function (view, record, item, index, e) {
				   if (record && record.data.leaf && config['onClickLeaf']) {
					   config['onClickLeaf'](record.data);
				   }
			   }
	    	}
		});
		
		 var win = Ext.create('Ext.Window' ,{
			 id: config['windowId'] ? config['windowId'] : 'windowId',
	         title: config['winTitle'] ? config['winTitle'] : "Info Log",
	         closable:true,
	         width: config['width'] ? config['width'] : 300,
	         height: config['height'] ? config['height'] : 400,
	         plain:true,
	         items: [tree]
	     });
		 tree.expandAll();
		 win.show();
	}
});