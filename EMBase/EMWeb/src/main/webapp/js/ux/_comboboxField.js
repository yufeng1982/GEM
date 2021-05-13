Ext.namespace('Erp.common.ext.util');

Erp.common.ext.util.initComboboxField = function(config){
	var store = new Ext.data.JsonStore({
	    fields: [config.itemValue, config.itemLabel],
	    data : config.datas 
	});
	var dcntId = 'DCNT_'+config.id;
	var combo = new Ext.form.ComboBox({
		id : 'Comb_' + config.id, 
		hiddenName : config.path,
	    store: store,
	    fieldClass : config.fieldClass,
	    displayField: config.itemLabel,
	    valueField: config.itemValue,
	    typeAhead: true,
	    mode: 'local',
		value: config.value,
	    triggerAction: 'all',
	    emptyText:'Select ...',
	    selectOnFocus:true,
	    tabIndex : config.tabIndex,
	    renderTo: dcntId,
		forceSelection: config.forceSelection ? true : false,
		disabled : config.disabled,
		listeners: {
		    beforeselect: function(combo, record, index) {
				this.oldVal = this.value;
		    }
		  }
	});
	
	combo.on("select", function(field, selectedVal) {
		if (config.onchange && this.oldVal != combo.value) {
			config.onchange(combo, combo.value, this.oldVal);
		}
	});
	
//	combo.on("change", function(/*Ext.form.Field*/ combo, /*Ext.Object*/newValue, /*Ext.Object*/ oldValue) {
//		if (config.onchange) {
//			config.onchange(combo, newValue,oldValue);
//		}
//	});
	
	combo.on("blur", function(combo) {
		if (config.onblur) {
			config.onblur(combo);
		}
	});
	

	return combo;
};

Erp.common.ext.util.initSimpleComboboxField = function(config){
	var store = new Ext.data.JsonStore({
		    fields: [config.id],
		    data : config.datas 
		});
	
	var dcntId = 'DCNT_'+config.id;
	var combo = new Ext.form.ComboBox({
		id : 'Comb_' + config.id,
		name: config.path,
		hiddenName : config.path ,
	    store: store,
	    fieldClass : config.fieldClass,
	    displayField: config.id,
	    typeAhead: true,
	    mode: 'local',
		value: config.value,
	    triggerAction: 'all',
	    emptyText:'Select ...',
	    selectOnFocus:true,
	    tabIndex : config.tabIndex,
	    renderTo: dcntId,
		forceSelection: config.forceSelection ? true : false,
		disabled : config.disabled,
		listeners: {
		    beforeselect: function(combo, record, index) {
				this.oldVal = combo.value;
		    }
		}
	});
	
	combo.on("select", function(field, selectedVal) {
		if (config.onchange && this.oldVal != combo.value) {
			config.onchange(combo, combo.value, this.oldVal);
		}
	});
	
//	combo.on("change", function(/*Ext.form.Field*/ combo, /*Ext.Object*/newValue, /*Ext.Object*/ oldValue) {
//		if (config.onchange) {
//			config.onchange(combo, newValue,oldValue);
//		}
//	});
	
	combo.on("blur", function(combo) {
		if (config.onblur) {
			config.onblur(combo);
		}
	});

	return combo;
}

function getComboBoxCmp(cmpId){
	return Ext.getCmp('Comb_' + cmpId);
}

function getComboBoxFieldValue(cmpId){
	return getComboBoxCmp(cmpId).getValue();
}

function setComboBoxFieldValue(cmpId,value){
	return getComboBoxCmp(cmpId).setValue(value);
}

//override the set value method of select tag.
function setSelectElmValue(elm, value) {
	return getComboBoxCmp(elm.id).setValue(value);
}