function __initDateTimeField(cfg) {
	var timeField = Ext.create('Ext.form.Time', {
		renderTo : 'DCNT_' + cfg.id, 
		id:  cfg.id,
		name : cfg.name,
		minValue : '00:00',
    	maxValue : '23:50',
    	format : cfg.format || 'H:i',
		increment : 10,
		width : cfg.width ? cfg.width : 60, 
		tabIndex : cfg.tabIndex,
		value : cfg.value, 
		disabled : cfg.disabled
	});
	timeField.on('change', function(obj, newValue, oldValue) {
		
		var flag = true;
	
		if(cfg.onchange) {
			flag = PAction[cfg.onchange](obj, newValue, oldValue);
		}
		if ((typeof(flag) == 'undefined') || flag) {
			timeField.setValue(newValue);
		} else {
			timeField.setValue(oldValue);
			return flag;
		}
	});
	timeField.on('select', function(obj) {
		timeField.setValue(obj.getValue());
	});
	
	return timeField;
};

function getTimeFieldValue(cmpId){
	var cmp =Ext.getCmp(cmpId);
	return cmp.getValue();
}

function getTimeFieldCmp(cmpId){
	return Ext.getCmp(cmpId);
}