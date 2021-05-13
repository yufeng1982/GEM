Ext.namespace('Erp.common.ext.util');

function __initDateField(cfg) {
	
	var dateField = Ext.create('Ext.form.field.Date', {
		id: cfg.id,
		name : cfg.name,
		width: cfg.width ? cfg.width : DEFAULT_DATE_WIDTH, 
	    value : cfg.value ? cfg.value : null,
        allowBlank : !cfg.notNull || true,
        disabled : cfg.disabled,
	    renderTo: 'DCNT_' + cfg.id,
        tabIndex : cfg.tabIndex,
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
			flag = PAction[cfg.onchange](obj, newValue, oldValue);
		}
		
		if ((typeof(flag) == 'undefined') || flag) {
			dateField.setValue(newValue);
		} else {
			dateField.setValue(oldValue);
			return flag;
		}
		return flag;
	});

	return dateField;
}


function getDateFieldValue(cmpId){
	var cmp =Ext.getCmp(cmpId);
	return cmp.getValue();
}

function getDateFieldCmp(cmpId){
	return Ext.getCmp(cmpId);
}