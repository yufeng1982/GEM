Ext.define('Erp.ui.BaseComboBox', {
	extend : 'Ext.form.field.ComboBox',
	
	initComponent : function() {
		Erp.ui.BaseComboBox.superclass.initComponent.call(this);
		var combo = this;
		var id = combo.cfg.id;
		var config = combo.cfg;
		var onchangedFun = combo.cfg.onchange;
		var valueField = combo.valueField;
		var displayField = combo.displayField;
		combo.on('select', function(combo, record) {
			var isSuccess = true;
			combo.isPopup = false;
			if(record && record[0] && $('H_' + id).value != record[0].get(valueField)) {
				combo.originalValue = $('H_' + id).value;
				combo.originalText = $('H_' + id + '_Text').value;	
				combo.setSelectValue(record[0].get(valueField), record[0].get(displayField));
				if (onchangedFun) {
					if (combo.getXType() == 'searchingSelect') {
						isSuccess = PAction[onchangedFun](record[0].get(valueField), record[0].get(displayField), record[0].raw, combo);
					} else {
						isSuccess = PAction[onchangedFun](record[0].get(valueField), record[0].get(displayField), record[0], combo);
					}
				}
			}
			
			// if failed, recovery
			if (!isSuccess) {
				combo.setSelectValue(combo.originalValue, combo.originalText);
			}
		});
		combo.on('blur', combo.comboboxBlur);
		
		combo.on('focus', function(combo) {
			if (combo.getXType() != 'searchingSelect') {
				combo.onTriggerClick();
			}
		});
		combo.clearValues = function() {
			var isSuccess = true;
			if (!Strings.isEmpty($('H_' + id).value)) {
				combo.originalValue = $('H_' + id).value;
				combo.originalText = $('H_' + id + '_Text').value;
				this.setSelectValue("", "");
				
				if (onchangedFun) {
					isSuccess = PAction[onchangedFun]('', '', {}, combo);
				}
				if (isSuccess) {
					if (config['onClear']) {
						PAction[config['onClear']](combo.originalValue, combo.originalText);
					}
				} else {
					// if failed, recovery
					this.setSelectValue(combo.originalValue, combo.originalText);
				}
			} else {
				this.setSelectValue("", "");
			}
		};
		combo.setSelectValue = function(value, text) {
			if (typeof value == "undefined") value = '';
			combo.setValue(value);
			$('H_' + id).value = value;
			if(text) {
				combo.setRawValue(text);
			} else {
				text = combo.getRawValue();
			}
			$('H_' + id + '_Text').value = text;
		};
		combo.getValue = function() {
			return $('H_' + id).value;
		};
		
		if(combo.store) {
			combo.store.on('load',function(a,b) {
				var bar = combo.picker.pagingToolbar;
				if(bar) {
					if(this.getTotalCount()>0) {
						bar.el.update('Total number : ' + this.getTotalCount());
					} else {
						bar.el.update('No record found');
					}
				}
			});
		}
	},
	
	comboboxBlur : function(combo) {
		if(combo.getRawValue() == '')  {
			combo.clearValues();
		} else if (combo.getRawValue() != $('H_' + combo.cfg.id+ '_Text').value) {
			combo.setValue($('H_' + combo.cfg.id).value);
			combo.setRawValue($('H_' + combo.cfg.id + '_Text').value);
		}
		combo.collapse();
	},
	
    createPicker: function() {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply({
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.create('Erp.ui.SSList', opts);
        
        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), {
            selectionChange: me.onListSelectionChange,
            scope: me
        });

        return picker;
    }
});
Ext.define('Erp.ui.SSList', {
	extend : 'Ext.view.BoundList',
	alias : 'searchingSelectList',

	createPagingToolbar: function() {
        return new Ext.toolbar.TextItem({
          height:15,
          cls: 'x-searchingFieldToolbar',
          text: ''
      });
    }
});

Ext.define('Erp.ui.ComboBox', {
	extend : 'Erp.ui.BaseComboBox',
	alias : 'widget.customerComboBox',

	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	}
});

function initComboboxField(config) {
	var id = config.id;
	var displayField = config['itemLabel'] || "text";
	var valueField = config['itemValue'] || "name";
	var dcntId = 'DCNT_' + id;
	var width = config['width'] || DEFAULT_S_WIDTH;
	var d = config.datas;
	if(d && d.length > 0 && d[0][0] != '') {
		d.unshift(['','']);
	}
	var store = new Ext.data.ArrayStore({
        id: 'ComboStore' + id, 
        fields: [
            valueField,
            displayField
        ],
        data: d  // data is local
    });

	var resultTpl = config['XTemplate'] || 
			'<tpl for="."><div class="x-combo-list-item">{' + displayField + '}</div></tpl>';
	
	var combo = Ext.create('Erp.ui.ComboBox', {
		cfg : config,
//		id : 'Comb_' + id,
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
		width : width,
		disabled : config.disabled,
		readOnly : config.readOnly,
		tabIndex : config.tabIndex,
		name : 'DESP_' + id,
		
		// new Ext4 custom quick search template
		listConfig: {
            getInnerTpl: function() {
                return resultTpl;
            }
        }
	});
	return combo;
};
///////////////////////////////////////////////////////////////////////////
// TODO - to be removed
function getComboBoxCmp(cmpId) {
//	return Ext.getCmp('Comb_' + cmpId);
	return Ext.getCmp(cmpId);
}
function getComboBoxId() {
	return this.id.lastStr();
}
function getComboBoxFieldValue(cmpId) {
	return getComboBoxCmp(cmpId).getValue();
}

function setComboBoxFieldValue(cmpId, value) {
	return getComboBoxCmp(cmpId).setValue(value);
}
// override the set value method of select tag.
function setSelectElmValue(elm, value) {
	return getComboBoxCmp(elm.id).setValue(value);
}
///////////////////////////////////////////////////////////////////////////