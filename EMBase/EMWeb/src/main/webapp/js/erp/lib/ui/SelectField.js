Ext.define('Erp.ui.SelectField', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.SelectField',

	valueField:'name',
	displayField:'text',
	queryMode:'local',
	
	initComponent : function() {
		var me = this;
		me.store = me.buildStore();
		Erp.ui.SelectField.superclass.initComponent.call(this);
		me.emptyText = 'Select ...';
		this.on('focus', function(combo) {
			me.onTriggerClick();
		});
        me.on('select', function(combo, record) {
			if (me.onchange) {
				PAction[me.onchange](record[0].get(me.valueField), record[0].get(me.displayField), record[0].raw, combo);
			}
    	});
		me.matchFieldWidth = false;
		var listWidth = 190;
		me.defaultListConfig = {minWidth: listWidth, maxWidth: listWidth};
		me.HValue='';
	},
	
	
	setSelectValue : function(value, text) {
    	this.setValue(value);
    	this.HValue = value;
    },
    
    getSelectValue : function() {
    	return this.HValue;
    },
	buildStore : function(){
		var me = this;
		var d = me.data;
		if(d && d.length > 0 && d[0][0] != '') {
			d.unshift(['','']);
		}
		return new Ext.data.ArrayStore({
		
		    id: 'ComboStore' + me.name, 
		    fields: [
		        me.valueField,
		        me.displayField
		    ],
		    data: d
		});
	}
});