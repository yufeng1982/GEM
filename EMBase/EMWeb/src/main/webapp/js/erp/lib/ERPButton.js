Ext.define('ERP.Button' , {
	extend : 'Ext.Button',
	
	constructor : function(config) {
		var btnId = config.id;
		if(btnId == "okBtn" || btnId == "applyBtn") {
			btnId = "save";
		}
		if(!CUtils.isHiddenCmp(btnId)) {
			if(CUtils.isDisableCmp(btnId)) {
				config.disabled = true;
			}
		} else {
			config = {hidden:true};
		}
		ERP.Button.superclass.constructor.call(this, config);
	}
});