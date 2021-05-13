/**
 * @author FengYu
 */
Ext.define('ERP.article.article.ArticleAction' ,{
	extend : 'ERP.FormAction',
	userNameUnique: false,
	checkMsgCount : 0,
	resetWin : null,
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	
	addLine :  function() {
		GUtils.addLine(this.getChaptersGrid());
	},
	removeLine : function() {
		var record = GUtils.getSelected();
		if(record) {
			GUtils.removeLine(this.getChaptersGrid());
		}
	},
	getChaptersGrid : function() {
		return PApp.chaptersGrid;
	},
	loadChaptersGrid : function() {
		this.getChaptersGrid().getStore().load();
	},
	
	formValidationBeforeSave : function() {
		var msgarray = [];
		if(!Strings.isEmpty( $('name').value) && $('entityId').value == 'NEW' && !CUtils.isTrueVal(PAction.userNameUnique)){
			msgarray.push({fieldname:"name", message: PRes["NameUnique"], arg:null});
		}
		var records = this.getRoleGrid().getStore().data.getRange();
		if(records.length == 0){
			msgarray.push({fieldname:"ROLE_GRID_PANEL_ID", message: PRes["RoleListValidation"], arg:null});
		}
		if($('entityId').value == 'NEW'){
			var confirmPassword = $('plainPassword').value;
			var password = $('password').value;
			if(!Strings.isEmpty(confirmPassword) && !Strings.isEmpty(password) && password != confirmPassword){
				msgarray.push({fieldname:"plainPassword", message: PRes["validationPassword"], arg:null});
			}
		}
		if(!VUtils.validateEmail($('email').value)) {
			msgarray.push({fieldname:"email", message: PRes["ValidationEmail"], arg:null});
		}
		return msgarray;
	},
	formProcessingBeforeSave : function() {
		$("roleListJSON").value = GUtils.allRecordsToJson(this.getRoleGrid());
	}
});