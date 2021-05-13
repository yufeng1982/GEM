var ACTION_BAR_INDEX = {
	create : 1,
	spacer : 51,
	ok  : 80,
    cancel : 90,
    apply : 100
};

Ext.define('ERP.ActionBar' ,{
	
	actionBarItems : [],
	
	spacer : {xtype : 'tbspacer',flex : 1},
	
	getActionBarItems : function(){
		var barItems = [];
		for(var i = 0 ; i <= this.actionBarItems.length ; i++){
			if(this.actionBarItems[i]) {
				barItems.push(this.actionBarItems[i]);
			}
		}
		return barItems;
	}
	
});

Ext.define('ERP.ListActionBar' ,{
	
	extend : 'ERP.ActionBar',

	constructor : function(config) {
		
		this.callParent([config]);
		
		btnCreate = new ERP.Button({
			id : 'newBtn',
		    text: '<strong><font color="red">' + PRes["new"] + '</font></strong>',
		    width : 60,
		    iconCls : 'ss_sprite ss_add',
		    hidden: CUtils.isTrueVal($F('historical')),
		    handler: function() {
		    	PAction.doCreate();
		    }
		});
		
		this.actionBarItems[ACTION_BAR_INDEX.create] = btnCreate;
		this.actionBarItems[ACTION_BAR_INDEX.spacer] = this.spacer;
		if(config){
			Ext.apply(this.actionBarItems , config);
		}
		return this;
	}
	
});

Ext.define('ERP.FormActionBar' ,{
	
	extend : 'ERP.ActionBar',

	constructor : function(config) {
		
		this.callParent([config]);
		
		var btnOk = new ERP.Button({
			id : 'okBtn',
		    text: PRes["ok"],
		    iconCls : 'ss_sprite ss_accept',
		    handler: function() {
		    	PAction.doOk();
		    }
		});
		var btnApply = new ERP.Button({
			id : 'applyBtn',
			text: PRes["apply"],
			iconCls : 'ss_sprite ss_accept',
		    handler: function() {
		    	PAction.doApply();
		    }
		});
		
		var btnCancel = new ERP.Button({
			id : 'cancelBtn',
		    text: PRes["cancel"],
		    iconCls : 'ss_sprite ss_cancel',
		    handler: function() {
		    	PAction.doCancel();
//		    	if(me._callBack) {
//		    		_callBack();
//		    	}
		    }
		});
		
		this.actionBarItems[ACTION_BAR_INDEX.spacer] = this.spacer;
		this.actionBarItems[ACTION_BAR_INDEX.ok] = btnOk;
		this.actionBarItems[ACTION_BAR_INDEX.cancel] = btnCancel;
		this.actionBarItems[ACTION_BAR_INDEX.apply] = btnApply;
		
		if(config) {
			Ext.apply(this.actionBarItems , config);
		}
		return this;
	}
	
});
