Ext.define('ERP.security.organization.OrganizationAction' ,{
	extend : 'ERP.FormAction',
	
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},

	formValidationBeforeSave : function() {
		var msgarray = new Array();
		var saltSource = $("saltSource").value;
		var code = $("code").value;
		if(!Strings.isEmpty(code) && (CUtils.sv(code).length > 2 || !VUtils.validateNumAndChar(code))){
			msgarray.push({fieldname: "code" , message: PRes["orgCode"], arg: null});
		}
		if(CUtils.sv(saltSource).length < 8) {
			msgarray.push({fieldname: "saltSource" , message: PRes["saltKey"], arg: null});
		}
		
		return msgarray;
	},
	
	formProcessingBeforeSave : function(){
		var phoneArray = [];
		var telephones = document.getElementsByName("telephoneCode");
		for(var i = 0; i < telephones.length; i++){
			var phone ={};
			phone.id = $('telephoneH'+(i+1)).value;
			phone.code=$('telephone'+(i+1)).value;
			phone.primaryKey = $('primaryKey'+(i+1)).checked;
			phone.sortNo = (i+1);
			phoneArray.push(phone);
		}
		$('phoneJsons').value = CUtils.jsonEncode(phoneArray);
	}
});