PRes['Com.Logoff'] = '${f:getText('Com.Logoff')}';
PRes['switchColors'] = '${f:getText('Com.SwitchColors')}'; 
PRes['Gray'] = '${f:getText('Com.Gray')}'; 
PRes['Blue'] = '${f:getText('Com.Blue')}'; 
window.onbeforeunload = function (e) {
	if(PAction && PAction.isLogoff) {
		return;
	}
	return PRes['Com.Logoff'];
};
function page_OnLoad() {
	LUtils.resizeToWindow(0, 0, screen.availWidth, screen.availHeight);
	var cs = "${cs}";
	if(!Strings.isEmpty(cs)) {
		cs = CUtils.jsonDecode(CUtils.myDecodeURI(cs));
	} else {
		cs =[];
	}
	PAction = new ERP.ui.MainAction({
		appName : '${APP_NAME}',
		currentUserId : "${currentUser.id}",
		currentUser : "${currentUser.username}",
		currentENo : "${currentUser.employeeNo}",
		currentCorporationId : "${currentCorporation.id}",
		currentCorporation : "${currentCorporation.shortName}",
		availableCorporationrray : cs,
		workDate : '${workDate}',
		isSuperAdmin: CUtils.bv("${isSuperAdmin}"),
	});
	
//	if(Strings.isEmpty(PAction.currentCorporationId) && !PAction.isSuperAdmin) {
//		setTimeout('PAction.launchCorporationSelector()', 500);
//	} else {
		displayMainFramePage();
//	}
	
	
}
function displayMainFramePage() {


	var centerPanel = Ext.createWidget('tabpanel', {
		xtype     :'tabpanel',
        id        : 'centerPanel',
        activeTab : 0,
        region    : 'center',
        frame: false,
        layoutOnTabChange : true,
        items: [ PAction.mkIframePanelo('dashboardId', PRes['dashboard'], '/app/gem/article/list/show')],
        listeners: {
			tabchange: function(panel, newTab, currentTab) {
			}
		}
	});
	
	var westPanel = {
		xtype:'panel',
		region: 'west',
		id: 'westPanel',
		collapsible: true,
		autoScroll:true,
		border: true,
		title: PRes['menu'],
		split: true,
		width: 220,
		minSize: 160,
		maxSize: 400,
		margins: '0 0 0 0',
		//tbar: new Ext.form.TextField({fieldLabel:"Filter",width:100,height:18}),
		layout: 'accordion',
		//layoutConfig : {autoWidth:true},
		items: buildWestPanel()
	};

	var viewport = Ext.create('Ext.container.Viewport', {
		id : 'viewport',
	    layout: 'border',
	    renderTo: Ext.getBody(),
		items:[
		    PAction.mMenu,
		    westPanel,
			centerPanel 
		] 
	}); 
}

function buildWestPanel() { 
	var ds = ${rootTree};
	var colLength = ds.length;
	var tpnls = [];
	for (var i = 0; i < colLength; i++) {
		//typeUrl = '';
		var typeUrl = '/app/${APP_NAME}/ui/menu/tree/json';
		
		var trPanel = Ext.create('Ext.tree.Panel', {
	        store: Ext.create('Ext.data.TreeStore', {
				defaultRootId : ds[i].functionTypeId,
	            proxy: {
	                type: 'ajax',
	                url: typeUrl
	            },
	            autoLoad: false
	        }),
	        id: "Tree" + ds[i].treePanelId,
	        title: ss_icon( ds[i].treePanelIconCls) + ds[i].treePanelTitle,
	        //border: true,
	        rootVisible: false,
			autoScroll:true,
			collapsible: true,
			margins:'0 0 0 0',
	        listeners: { 
	        	itemclick : function(node, record, item, index, e) {
	        		var nodeUrl = record.raw.url;
					if (nodeUrl == '') {
						return;
					}
					if(nodeUrl.indexOf('LUtils.') > -1) {
				        eval(nodeUrl);
				    } else {
				    	PAction.showMainFramePage(record.raw.id, nodeUrl, record.raw.text);
				    }
			    },
			    itemcontextmenu : function(node, record, item, index, e) {
					if(!record.isLeaf()) return;
					
					e.preventDefault();
					PAction.selectedNode = record;
					if(record.raw.url.indexOf('LUtils.') > -1) {
						PAction.toolsFNRightClick.showAt(e.getXY());
					} else {
						PAction.fuctionNodeRightClick.showAt(e.getXY());
					}
					
			    }
		    }
		});
		
		trPanel.on('itemcontextmenu', function(view, record, item, index, event) {
		});
		
		tpnls.push(trPanel);
    }
	return tpnls;
		
}
