Ext.namespace('ERP.ux.grid');

var ExtHelper = {};
//doesn't include CheckColumn, can use the Ext.ux.grid.CheckColumn and use plugin to do it like the edit-grid example
ERP.ux.grid.Column = Ext.extend(Ext.grid.Column, {
	constructor: function(cfg){
		if(cfg.id && !cfg.dataIndex){
			cfg.dataIndex = cfg.id;
		}
		if(cfg.hidden){
			cfg.hideable = false;
			
		 }
		if(!cfg.fieldType){
			cfg.fieldType = "string";
		}
		cfg.sortable = (cfg.sortable === false) ? false : true;
		if(cfg.editable){
			switch(cfg.fieldType){
				case "combobox": 
//					debugger;
					//hack, transfer the dataset select into ext combobox
					var comboBoxData = Ext.util.JSON.decode(cfg.controlData);
					var comboBoxDataStore = new Ext.data.JsonStore({ 
						fields: ['name', 'text'] 
						,data : comboBoxData
					});
					var combo = new Ext.form.ComboBox({
						store: comboBoxDataStore,
						valueField:'name',
						displayField:'text',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
		           		lazyRender:true,
		           		editable:false,
		           		allowBlank : (cfg.allowBlank === false) ? false : true
	            	});
					cfg.editor = combo;
					cfg.renderer = ExtHelper.comboBoxRenderer(combo);
					break;
				case "browerButton"://handle later
					if (cfg.clearable) {
						cfg.editor = new Ext.ux.form.TBrowseField ({
							dataIndex : cfg.dataIndex,
							onTrigger1Click:function (e) {
								if(cfg.popupSelectOnClick) {
									cfg.popupSelectOnClick(this.dataIndex);
								} else {
									popupSelect_onclick(this.dataIndex);
								}
							},
							onTrigger2Click:function (e){
								var g = Ext.getCmp(cfg.gridId);
								if (g) {
									var record = g.getSelectionModel().getSelected();
									if (record) {
										ERP.ux.grid.Column.setPopupColumn(record, this.dataIndex, "", "");
									}
								}
							},
							allowBlank : (cfg.allowBlank === false) ? false : true
						});
					} else {
						cfg.editor = new Ext.ux.form.BrowseField ({
							dataIndex : cfg.dataIndex,
							onTriggerClick:function (e){
								if(cfg.popupSelectOnClick) {
									cfg.popupSelectOnClick(this.dataIndex);
								} else {
									popupSelect_onclick(this.dataIndex);
								} 
							},
							allowBlank : (cfg.allowBlank === false) ? false : true
						});
					}
					break;
				case "date":
					cfg.renderer = ERP.ext.util.extFormatDate;
					var editorConfig = {format: 'Y-m-d'};
					editorConfig.allowBlank = (cfg.allowBlank === false) ? false : true;
					if(cfg.minValue){
						editorConfig.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						editorConfig.maxValue = cfg.maxValue;
					}
					cfg.editor = new Ext.form.DateField(editorConfig);
					break;
				case "number"://Should named float later
					var editorConfig = {};
					editorConfig.allowNegative = (cfg.allowNegative === true) ? true : false;
					editorConfig.allowBlank = (cfg.allowBlank === false) ? false : true;
					if(cfg.minValue){
						editorConfig.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						editorConfig.maxValue = cfg.maxValue;
					}
					if(cfg.decimalPrecision){
						editorConfig.decimalPrecision = cfg.decimalPrecision;
					}
					cfg.editor = new Ext.form.NumberField(editorConfig);
					cfg.renderer = function(value) {
						if(cfg.decimalPrecision) {
							var nan = isNaN(value);
					        if (cfg.decimalPrecision == -1 || nan || !value) {
					            return nan ? '' : value;
					        }
					        return parseFloat(value).toFixed(cfg.decimalPrecision);
						}
						return value;
					};
					break;
				case "integer":
					var editorConfig = {allowNegative: false,allowDecimals: false};
					editorConfig.allowBlank = (cfg.allowBlank === false) ? false : true;
					if(cfg.minValue){
						editorConfig.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						editorConfig.maxValue = cfg.maxValue;
					}
					cfg.editor = new Ext.form.NumberField(editorConfig);
					break;
				case "colorField":
					cfg.editor = new Ext.form.ColorField({
						dataIndex : cfg.dataIndex,
						showHexValue : true,
						autoShow : true
						
					});
					break;
				case "numberField":
					var editorConfig = {};
					editorConfig.allowNegative = (cfg.allowNegative === true) ? true : false;
					editorConfig.allowBlank = (cfg.allowBlank === false) ? false : true;
					if(cfg.minValue){
						editorConfig.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						editorConfig.maxValue = cfg.maxValue;
					}
					if(cfg.decimalPrecision){
						editorConfig.decimalPrecision = cfg.decimalPrecision;
					}
					cfg.editor = new ERP.ux.grid.NumberField(editorConfig);
					cfg.renderer = function(value) {
						if(cfg.decimalPrecision) {
							var nan = isNaN(value);
					        if (cfg.decimalPrecision == -1 || nan || !value) {
					            return nan ? '' : value;
					        }
					        return parseFloat(value).toFixed(cfg.decimalPrecision);
						}
					};
					break;
				default:
					var editorConfig = {};
					editorConfig.allowBlank = (cfg.allowBlank === false) ? false : true;
					editorConfig.selectOnFocus = (cfg.selectOnFocus === true) ? true : false;
					editorConfig.enableKeyEvents = (cfg.enableKeyEvents === true) ? true : false;
					editorConfig.vtype = cfg['vtype'] || null;
					cfg.editor = new Ext.form.TextField(editorConfig);
					cfg.editor.gridName = cfg['gridName'] || null;
					cfg.editor.fieldColumnName = cfg['fieldColumnName'] || null;
			}
		}
		ERP.ux.grid.Column.superclass.constructor.call(this, cfg);
	}
});

ERP.ux.grid.Column.setPopupColumn = function(record, field, text, value) {
 	if(record) {
 		record.set(field,text);
 		record.set(field+"-popup-value",value);
 	}
};

ExtHelper.comboBoxRenderer = function(combo) {
  return function(value) {
    var idx = combo.store.find(combo.valueField, value);
    var rec = combo.store.getAt(idx);
    if(!Ext.isEmpty(rec)){
    	return rec.get(combo.displayField);
    }else{
    	return value;
    }
  };
};

ERP.ux.grid.NumberField = Ext.extend(Ext.form.NumberField, {
	
	decimalPrecisionText : "The decimal for this field is {0}",
	
	getErrors: function(value) {
        var errors = Ext.form.NumberField.superclass.getErrors.apply(this, arguments);
        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
        
        if (value.length < 1) { 
             return errors;
        }
        
        value = String(value).replace(this.decimalSeparator, ".");
        
        if(isNaN(value)){
            errors.push(String.format(this.nanText, value));
        }
        
        var num = this.parseValue(value);
        
        if (num < this.minValue) {
            errors.push(String.format(this.minText, this.minValue));
        }
        
        if (num > this.maxValue) {
            errors.push(String.format(this.maxText, this.maxValue));
        }
        var reg = new RegExp("^[0-9]+(.[0-9]{1," + this.decimalPrecision + "})?$");
        if (this.allowDecimals && !reg.test(num)) {
        	errors.push(String.format(this.decimalPrecisionText, this.decimalPrecision));
        }
        return errors;
    },
    
	beforeBlur : function() {
        var v = this.parseValue(this.getRawValue());
        
        if (!Ext.isEmpty(v)) {
            this.setValue(v);
        }
        var message = "";
        for(var i = 0; i < this.getErrors(v).length; i++) {
        	message += this.getErrors(v)[i] +"<br/>";
        };
        if(!Strings.isEmpty(message)) {
        	Ext.MessageBox.alert('Error', message);
        }
    }
});