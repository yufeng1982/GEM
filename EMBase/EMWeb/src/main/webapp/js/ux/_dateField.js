/**
 * extjs 4 version
 */
Ext.namespace('Erp.common.ext.util');
Erp.common.ext.util.initDateField = function(cfg) {
	var dateField = new Ext.form.DateField({
		renderTo : 'DCNT_' + cfg.id, 
		id:  cfg.id,
		name : cfg.name,
		anchor : '50%',
		startDateField: cfg.startDateField || null,
		endDateField: cfg.endDateField || null,
		width : cfg.width ? cfg.width : 123, 
		value : cfg.value,
		vtype : cfg['validateType'] || null, 
		allowBlank : !cfg.notNull || true,
		disabled : cfg.disabled,
        format : cfg.format || 'Y-m-d',
    	beforeBlur : function() {
    		var v = this.getRawValue();
    		if (v.length == 1)
    			v = '0' + v;
    		v = this.parseDate(v);
    		if (v) {
    			this.setValue(v);
    		}
    	}
	});
	dateField.on('change', function(obj, newValue, oldValue) {
		var flag = true;
		if(cfg.onchange) {
			flag = cfg.onchange(obj, newValue, oldValue);
		}
		
		if ((typeof(flag) == 'undefined') || flag) {
			dateField.setDateValue(newValue);
		} else {
			dateField.setDateValue(oldValue);
			return flag;
		}
	});
	dateField.on('select', function(obj) {
		dateField.setDateValue(obj.getValue());
	});
	dateField.setDateValue = function(value) {
		dateField.setValue(value);
	};
	
	return dateField;
};


Erp.common.ext.util.initTimeField = function(cfg) {
	var timeField = new Ext.form.TimeField({
		renderTo : 'DCNT_' + cfg.id, 
		id:  cfg.id,
		name : cfg.name,
		minValue : '0:00',
    	maxValue : '23:50',
    	format : cfg.format || 'H:i',
    	initDate : new Date(),
		increment : 10,
		width : cfg.width ? cfg.width : 60, 
		tabIndex : cfg.tabIndex,
		value : cfg.value, 
		disabled : cfg.disabled
	});
	timeField.on('change', function(obj, newValue, oldValue) {
		
		var flag = true;
	
		if(cfg.onchange) {
			flag = cfg.onchange(obj, newValue, oldValue);
		}
		if ((typeof(flag) == 'undefined') || flag) {
			timeField.setTimeValue(newValue);
		} else {
			timeField.setTimeValue(oldValue);
			return flag;
		}
	});
	timeField.on('select', function(obj) {
		timeField.setTimeValue(obj.getValue());
	});
	
	timeField.setTimeValue = function(value) {
		timeField.setValue(value);
	};
	
	return timeField;
};


function getDateFieldValue(cmpId){
	var cmp =Ext.getCmp(cmpId);
	return cmp.getValue();
}

function getTimeFieldValue(cmpId){
	var cmp =Ext.getCmp(cmpId);
	return cmp.getValue();
}
function getDateFieldCmp(cmpId){
	return Ext.getCmp(cmpId);
}
function getTimeFieldCmp(cmpId){
	return Ext.getCmp(cmpId);
}