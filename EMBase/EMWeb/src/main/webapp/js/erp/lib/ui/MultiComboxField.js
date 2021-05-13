Ext.define("Erp.ui.BaseMultiComboBox", {
	extend: "Ext.ux.form.field.BoxSelect",
	initComponent: function() {
		var combo = this,
			id = combo.cfg.id,
			config = combo.cfg,
			onchangedFun = combo.cfg.onchange,
			valueField = combo.valueField,
			displayField = combo.displayField;
		
		combo.on("keydown", function(cmp, e) {
			if (config['onkeydown']) {
				PAction[config['onkeydown']](cmp, e);
			}
		});
		
		combo.on('select', function(combo, record) {
			var isSuccess = true,
				value = CUtils.getRecordsDataByFieldName(record, valueField),
				text = CUtils.getRecordsDataByFieldName(record, displayField);
			if (onchangedFun && record && $('H_' + id).value != value) {
				isSuccess = PAction[onchangedFun](value, text, record, combo);
				}
			if (isSuccess) {
				combo.setSelectValue(record);
			}
		});
		
		combo.clearValues = function() {
			var isSuccess = true;
			if (!Strings.isEmpty($('H_' + id).value)) {
				if (onchangedFun) {
					isSuccess = PAction[onchangedFun]('', '', {}, combo);
				}
				var oldValue = $('H_' + id).value;
				var oldDisplayText = $('H_' + id + '_Text').value;
				if (isSuccess) {
					$('H_' + id).value = "";
					$('H_' + id + '_Text').value = "";
					if (config['onClear']) {
						PAction[config['onClear']](oldValue, oldDisplayText);
					}
					this.clearValue();
				} else {
					this.setSelectValue(oldValue, oldDisplayText);
				}
			} else {
				this.setSelectValue("", "");
			}
		};
		combo.setSelectValue = function(value, text) {
			combo.setValue(value);
			$('H_' + id).value = combo.value;
			$('H_' + id + '_Text').value = this.getRawValue();
		};
		combo.getValue = function() {
			return $('H_' + id).value;
		};
		combo.callParent();
	},
	onItemListClick : function(evt, el, o) {
		var onchangedFun = this.cfg.onchange,
			id = this.cfg.id;
		this.callParent([evt, el, o]);
		if (onchangedFun && $('H_' + id).value != this.value) {
			isSuccess = PAction[onchangedFun](this.value, this.getRawValue(), null, this);
		}
		this.setSelectValue(this.value);
	}
});

Ext.define('Erp.ui.MultiComboBox', {
	extend : 'Erp.ui.BaseMultiComboBox',
	alias : 'widget.MultiComboBox',

	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	}
});

function initMultiComboboxField(config) {
	var id = config.id;
	var displayField = config['itemLabel'] || "text";
	var valueField = config['itemValue'] || "name";
	var dcntId = 'DCNT_' + id;

	var store = new Ext.data.ArrayStore({
        id: 'ComboStore' + id, 
        fields: [
            valueField,
            displayField
        ],
        data: config.datas  // data is local
    });
    
	var combo = Ext.create('Erp.ui.MultiComboBox', {
		cfg : config,
		id : id,
		renderTo : dcntId,
		displayField : displayField,
		valueField : valueField,
		value : config.value,
		fieldClass : config.fieldClass,
		store : store,
		queryMode : 'local',
		typeAhead : true,
		enableKeyEvents : true,
		emptyText : 'Select ...',
		baseCls : 'searchingSelectPosition',
		baseBodyCls : 'searchingSelectPosition',
		openCls : 'comboboxBody4SelectField',
		// forceSelection: config.forceSelection ? true : false,
		disabled : config.disabled,
		tabIndex : config.tabIndex,
		name : 'DESP_' + id,
		multiSelect: true
	});
	return combo;
};