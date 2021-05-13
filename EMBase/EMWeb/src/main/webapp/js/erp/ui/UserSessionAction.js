Ext.define('ERP.ui.UserSessionAction', {
	extend : 'ERP.FormAction',
	
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	
	doResume : function() {
		this.save('resume');
	},
	
	doSaveToUser :function() {
		this.save("saveToUser");
	}
});


