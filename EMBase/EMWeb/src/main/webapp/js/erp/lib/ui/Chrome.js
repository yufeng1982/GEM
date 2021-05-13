Ext.define('ERP.ui.Chrome', {
	
	extend : 'Ext.util.Observable', 
	
	sideBar : true,
	ribbonBar : true,
	showActionBar : true,
	sideBarCollaspe : false,
	ribbonBarCollaspe : false,
	vNavBar : false,
	sideBarItems : [],
	ribbonItems : [],
	bodyItems : [],
	actionBarItems : [],

	initApp : function() {

		var topContainerItems = [];
		if (this.ribbonBar) {
			topContainerItems.push( {
				xtype : "toolbar",
				id : "ribbonBar",
				height : 52,
				items : []
			});
			if (this.ribbonItems && (this.ribbonItems.length > 0)) {
				topContainerItems[0].items = this.ribbonItems;
			}
		}
		topContainerItems.push( {
			id : "xHeader",
			contentEl : "divWinHeader"
		});

		// /////////////
		var controlItems = [];
		for ( var i = 0, l = this.bodyItems.length; i < l; i++) {
			var itm = this.bodyItems[i];
			if (!itm.id) itm.id = "CHR" + Ext.id();
			itm.closable = false;
			controlItems.push( {

						xtype : "button",
						enableToggle : true,
						cls : 'reference-btn',
						text : ((i + 1) < 10) ? "0" + (i + 1) : (i + 1) + "",
						pnlId : itm.id,
						id : "NavBtn"
								+ (((i + 1) < 10) ? "0" + (i + 1) : (i + 1)
										+ ""),
						toggleHandler : function(button, state) {

							if (state) {
								Ext.get(button.pnlId).scrollIntoView(
										Ext.getCmp("center-portal").body);
							}
						}

					});

		}
		var bodyCnt = null;

		if (this.bodyLayout == "vbox") {
			bodyCnt = {
				region : "center",
				id : "center-portal",
				xtype : "container",
				layout : {
					type : 'vbox',
					padding : '3',
					align : 'stretch'
				},
				items : this.bodyItems
			};
		} else {
			bodyCnt = {
				region : "center",
				id : "center-portal",
				xtype : "portal",
				items : [ {
					columnWidth : 1,
					padding : '10',
					items : this.bodyItems
				} ]
			};
		}
		var vpItems = [ {
			xtype : "container",
			id : "topC",
			region : "north",

			bufferResize : true,
			layout : "fit",
			layoutConfig : {
				align : "stretch",
				pack : "start"
			},
			height : ((this.ribbonBar && !this.ribbonBarCollaspe) ? 90 : 52),
			items : topContainerItems

		}, bodyCnt ];

		// ////
		var sbCfg = null;
		if (this.sideBar) {
			sbCfg = {
				region : "east",
//				xtype : "sideportal",
				xtype :'panel',
				id : "east-sidebar",
				useArrows : false,
				collapsible : true,
				collapseMode : "mini",
				split : true,
				width : 200,
				title : '',
				titleCollapse : false,
				header : false,
				bufferResize : true,
				items : [ {
					columnWidth : 1,
					items : []
				} ]
			};
			if (this.sideBarItems && (this.sideBarItems.length > 0)) {
				sbCfg.items[0].items = this.sideBarItems;
			}
			vpItems.push(sbCfg);
		}
		if (this.vNavBar) {
			// experimental
			vpItems.push( {
				region : "west",
				useArrows : false,
				collapsible : true,
				collapseMode : "mini",
				header : false,
				bufferResize : true,
				split : true,
				width : 24,
				// xtype : "box",
				layout : "vbox",
				title : "",
				defaults : {
					margin : '0 3 0 3'
				},
				// title: 'Side',
				titleCollapse : false,
				items : controlItems,
				id : "west_navbar"
			});
		};
		if(this.showActionBar){
			vpItems.push( {
				xtype : "container",
				height : 34,
				id : "actionBar",
				region : "south",
				cls : "divWinFooter",
				layout : "hbox",
				defaults : {
					margins : '5 5 0 5'
				},
				layoutConfig : {
					align : "middle"
				},
				pack : 'center',
				items : this.actionBarItems
			});
		};
		var vp = Ext.create('Ext.container.Viewport', {
			id : "vp",
			layout : 'fit',
			items : [{
			el : 'form1',
			layout : 'border',
			    items : vpItems
			}]
		});

		vp.doLayout();
		this.init();

		Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
	},

	init : Ext.emptyFn,

	onReady : function(fn, scope) {
		if (!this.isReady) {
			this.on('ready', fn, scope);
		} else {
			fn.call(scope, this);
		}
	},

	onUnload : function(e) {
		if (this.fireEvent('beforeunload', this) === false) {
			e.stopEvent();
		}
	}
});