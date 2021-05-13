function page_OnLoad() {
	PRes["tel"] = "${f:getText('Com.Telephone')}";
	PRes["pk"] = "${f:getText('Com.Primary')}";
	PRes["saltKey"] = "${f:getText('Com.Validate.SaltSource')}";
	PRes["orgCode"] = "${f:getText('Com.Validate.OrgCode')}";
	var actionBarItems = [];
	var actionBar = new ERP.FormActionBar(actionBarItems);
	PAction = new ERP.security.organization.OrganizationAction({});
	PApp =  new ERP.FormApplication({
		pageLayout : {
			bodyItems : [ {
				xtype : "portlet",
				id : "generalPanel",
				height : 500,
				title : ss_icon('ss_application_form') + PRes["general"],
				contentEl : "infoDiv"
			}]
		},
		actionBar : actionBar
	});
}

function page_AfterLoad() {
}