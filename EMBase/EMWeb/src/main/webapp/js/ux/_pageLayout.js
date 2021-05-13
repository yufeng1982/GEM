Ext.namespace('ERP.ui');


ERP.ui.SidePortal = Ext.extend(Ext.ux.Portal, {
	defaultType : 'sidecolumn',
	initEvents : function() {
		ERP.ui.SidePortal.superclass.initEvents.call(this);
		this.dd = new Ext.ux.Portal.DropZone(this, Ext.apply( {
			ddGroup : 'sideportal'
		}, this.dropConfig));
	}
});
Ext.reg('sideportal', ERP.ui.SidePortal);

ERP.ui.SideColumn = Ext.extend(Ext.ux.PortalColumn, {
	defaultType : 'sideportlet'
});
Ext.reg('sidecolumn', ERP.ui.SideColumn);

ERP.ui.SidePortlet = Ext.extend(Ext.ux.Portlet, {
	draggable : {
		ddGroup : 'sideportal'
	},
	initComponent : function() {
		ERP.ui.SidePortlet.superclass.initComponent.call(this);
		if (this.titleObj && this.headerTemplate) {
			this.setLinkedTitle(this.titleObj);
		}
	},
	setLinkedTitle : function(titleObj) {
		if (this.headerTemplate) {
			var t;
			if (this.headerTemplate.apply) {
				t = this.headerTemplate.apply(titleObj);
			} else {
				t = (new Ext.XTemplate(this.headerTemplate.html))
						.apply(titleObj);
			}
			this.setTitle(t);
		} else {
			this.setTitle(titleObj.text);
		}
		return this;
	}
});
Ext.reg('sideportlet', ERP.ui.SidePortlet);

ERP.ui.Chrome = function(cfg) {
	Ext.apply(this, cfg);
	this.addEvents( {
		'ready' : true,
		'beforeunload' : true
	});
	// Ext.onReady(this.initApp, this);
};

Ext.extend(ERP.ui.Chrome, Ext.util.Observable, {
	sideBar : true,
	ribbonBar : true,
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
			if (!itm.id)
				itm.id = "CHR" + Ext.id();
			controlItems
					.push( {

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
			layout : "vbox",
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
				xtype : "sideportal",
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
		}
		;
		vpItems.push( {
			xtype : "container",
			height : 34,
			id : "actionBar",
			region : "south",
			cls : "divWinFooter",
			layout : "hbox",
			defaults : {
				margins : '0 5 0 5'
			},
			layoutConfig : {
				align : "middle"
			},
			items : this.actionBarItems
		});

		var vp = new Ext.Viewport( {
			id : "vp",
			layout : 'fit',
			items : [ {
				el : 'form1',
				layout : 'border',
				items : vpItems
			} ]
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