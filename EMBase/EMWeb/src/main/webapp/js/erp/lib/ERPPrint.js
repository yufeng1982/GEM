Ext.define('ERP.Print' ,{

	args : null,
	
	id : null,
	
	printerStore : null,
		
	label : null, 
	constructor : function(config) {
		Ext.apply(this , config);
	},	
	buildPrintMenu : function() {
		var _printMenu = new Ext.menu.Menu();
		var arg;
		if (this.args.length == 1) 
			return {items: this.buildItems(this.args[0])};
		
		for (var i = 0; i < this.args.length; i++) {
			arg = this.args[i];
			_printMenu.add({
				id: arg.id,
			    text: arg.text,
			    iconCls : "ss_icon ss_page_gear",
			    menu: {items: this.buildItems(arg)}
			});
		}
		
		return _printMenu;
	},
	buildItems : function(arg) {
		var items = this._buildPrintMenuItem(arg);	
		return items;
	},
	handleView : function(arg, isFromList) {
	
	},
	_buildPrintMenuItem : function(arg) {
		var me = this;
		return [{
		   id : arg.id + '_view',
		   iconCls : 'ss_sprite ss_accept',
		   text : "View",
		   handler: function() {
            
		   }
		}, {
		   id : arg.id + '_print',
		   iconCls : 'ss_sprite ss_accept',
		   text : "Print",
		   scope: me,
		   handler : function() {
			   
		   }
	   	}];
	},

	createPrintBtn : function() {
		return new ERP.Button({
			id : 'printBtn',
			text : this.label || PRes["report"],
			iconCls : 'ss_sprite ss_accept',
			menu : this.buildPrintMenu(false)
		});
	}
});