function page_OnLoad() {
	var actionBarItems = [];
	
	var actionBar = new ERP.FormActionBar(actionBarItems);
	
	PApp =  new ERP.FormApplication({
		pageLayout : {
			bodyItems : [ {
				xtype : "portlet",
				id : "generalPanelId",
				title : ss_icon('ss_application_form') + PRes["general"],
				contentEl : "divGeneral"
			}]
		},
		actionBar : actionBar
	});
	
	PAction= new ERP.common.eventLog.EventLogAction({});
}

function page_AfterLoad() {
	
}
