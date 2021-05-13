PRes["resume"] = "${f:getText('Com.Resume')}";
PRes["saveToUser"] = "${f:getText('Com.SaveToUser')}";

function page_OnLoad() {
	initErrorMessageTips();
	layoutProcess();
}

function layoutProcess() {

	var resumeButton = Ext.create('Ext.Button', {
	    text: PRes["resume"],
	    iconCls : 'ss_sprite ss_accept',
	    handler: function() {
	    	PAction.doResume();
	    }
	});
	
	var saveToUserButton = Ext.create('Ext.Button', {
		text: PRes["saveToUser"],
		iconCls : 'ss_sprite ss_accept',
	    handler: function() {
	    	PAction.doSaveToUser();
	    }
	});
	
	var actionBarItems = []; 
	actionBarItems[10] = new Ext.Button(resumeButton);
	actionBarItems[7] = new Ext.Button(saveToUserButton);
	var actionBar = new ERP.FormActionBar(actionBarItems);
	
	PApp = new ERP.FormApplication(
			{
				pageLayout : {
					bodyItems : [
							{
								xtype : "portlet",
								id : "userSessionInfoDiv",
								height : 150,
								title : ss_icon('ss_application_form')
										+ PRes["general"],
								contentEl : "infoDiv"
							} ]
				},
				actionBar : actionBar
			});
	PAction = new ERP.ui.UserSessionAction();

}