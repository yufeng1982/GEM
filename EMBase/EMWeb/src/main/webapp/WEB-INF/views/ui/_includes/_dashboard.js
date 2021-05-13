function page_OnLoad() {
	var managementReportGrid = GUtils.initErpGrid('managementReportGrid', {}, G_MANAGEMENT_REPORT_STATS_CONFIG);
	var actionBarItems = [];
	var btnSearch = Ext.create('Ext.Button', {
		id : '_searchBtn',
		iconCls : 'ss_search',
		renderTo : 'searchBtn',
		text : "Search",
		width : 70,
		height:25,
		handler: function() {
	    	PAction.doSearch();
	    }
	});
	actionBarItems[ACTION_BAR_INDEX.ok] = null;
	actionBarItems[ACTION_BAR_INDEX.cancel] = null;
	actionBarItems[ACTION_BAR_INDEX.apply] = null;
	var actionBar = new ERP.FormActionBar(actionBarItems);
	PApp =  new ERP.FormApplication({
		actionBar : actionBar,
		grid: managementReportGrid,
		pageLayout : {
			bodyItems : [{xtype : "portlet",
				id : "managementReport",
				title : "Management Report KPI",
				height:318,
				layout : 'vbox',
				items : [
						{id : "searchDiv",
							xtype : 'fieldset',
							layout : "fit",
							contentEl : "divGeneral"
						},
				         {id : 'flashReportGrid',
							layout : "fit",
		    		 		items:managementReportGrid}
		    	],
		    	listeners : {
					'resize': function (pnl) {
						var fieldSet = Ext.getCmp("searchDiv");
						fieldSet.setSize(pnl.getWidth() - 8);
						var grid = Ext.getCmp("flashReportGrid");
						grid.setSize(pnl.getWidth() - 8, 225);
					}
				}
			}],
			sideBar : false,
			actionBar : actionBar
		}
	});
	PAction = new ERP.FormAction({
		getSearchParams : function(){
				var fd = CUtils.getDateText("fiscalDate");
		       return {fiscalDate:fd};},
		       
       doSearch : function() {
       	   var searchParams =  this.getSearchParams();
       	   PApp.grid.store.proxy.extraParams = {};
   	       Ext.apply(PApp.grid.store.proxy.extraParams, searchParams);
   	       PApp.grid.getStore().loadPage(1);
       }
	});
}
function page_AfterLoad() {

}

function page_AfterProcessSecurityResources(){
	if(Ext.getCmp("managementReport").isVisible()){
		CUtils.setDateValue('fiscalDate', CUtils.formatDate(new Date(), 'Y-m-d'));
		PAction.doSearch();
	}
}