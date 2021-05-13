Ext.define('Erp.ui.SearchingSelect', {
	extend : 'Erp.ui.BaseComboBox',
	
	gridUrl : null,
	gridConfigName : null,
	
	alias : 'widget.searchingSelect',
//	triggerCls : 'x-form-brower-trigger',

	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	
	secondOnchange : '',
	mtype : '',
	seType : '',
	onchangedFun : '',
	initParametersFun : '',
	
	comboboxBlur : function(combo) {
		if(Strings.isEmpty(combo.findUrl)) {
			this.callParent([combo]);
		} else {
			combo.doFind(combo);
		}
	},
	
    doFind : function(combo) {
    	var comboId = combo.cfg.id;
    	var originalValue = $('H_' + comboId + '_Text').value;
    	var originalId = $('H_' + comboId).value;
    	var query = combo.getRawValue();
		if (Strings.isEmpty(query) && Strings.isEmpty(originalValue)) {
			VUtils.removeFieldErrorCls(comboId);
			VUtils.removeTooltip(comboId);
			return;
		}
		if (!Strings.isEmpty(query) && (query.toLowerCase() === originalValue.toLowerCase())) {
			return;
		}
		
		if (Strings.isEmpty(query)) {
			combo.clearValues();
			VUtils.removeFieldErrorCls(comboId);
			VUtils.removeTooltip(comboId);
			return;
		}

		var otherParameters = {query: query};
		var initParamsFun = combo.initParametersFun;
		if (initParamsFun) {
			otherParameters = Ext.apply(otherParameters, PAction[initParamsFun]());
		} 
		beginWaitCursor(CUtils.sv(PAction.maskText));
		Ext.Ajax.request({
			url : combo.findUrl,
			params : otherParameters,
			success : function(response) {
				endWaitCursor();
				var data = {};
				if(!Strings.isEmpty(response.responseText)) {
					data = CUtils.jsonDecode(response.responseText);
					if(data && data.data && Ext.isArray(data.data)) {
						var len = (data.data).length;
						if(len == 1) {
							data = data.data[0];
						} else {
							data = {};
							if(len > 1) {
								data.errorMsg = "Find more than one record, please change it.";
							}
						}
					}
				}
				if (Strings.isEmpty(CUtils.sv(data.id))) {
					var errorMsg = "is not found!";
					var isSuccess = true;
					combo.originalValue = $('H_' + comboId).value;
					combo.originalText = $('H_' + comboId + '_Text').value;
					combo.setSelectValue("", "");
					if (combo.onchangedFun) {
						isSuccess = PAction[combo.onchangedFun]('', query, {}, combo);
					}
					if(!isSuccess) {
						combo.setSelectValue(combo.originalValue, combo.originalText);
					}
					if(!Strings.isEmpty(CUtils.sv(data.errorMsg))) {
						errorMsg = data.errorMsg;
					}
					VUtils.markErrorFields([{fieldname: comboId, message:  $('label_' + comboId).innerHTML + " " + errorMsg, arg:null}]);
				} else {
					var isSuccess = true;
					combo.originalValue = $('H_' + comboId).value;
					combo.originalText = $('H_' + comboId + '_Text').value;	
					combo.setSelectValue(data[combo.valueField], data[combo.displayField]);
					if (combo.onchangedFun) {
						isSuccess = PAction[combo.onchangedFun](data[combo.valueField], data[combo.displayField], data, combo);
					}
					if(isSuccess) {
						VUtils.removeFieldErrorCls(comboId);
						VUtils.removeTooltip(comboId);
					} else {
						combo.setSelectValue(combo.originalValue, combo.originalText);
					}
				}
			},
	   		failure: function(request,  response,  options) {
				endWaitCursor();
				$('H_' + comboId).value = '';
				$('H_' + comboId + '_Text').value = '';
	   			VUtils.markErrorFields([{fieldname: comboId, message:  $('label_' + comboId).innerHTML + " is not find.", arg:null}]);
	   		}
		});
	}
});

function initSearchingSelect(arg) {
	var displayField = arg['displayField'] || "name";
	var valueField = arg['valueField'] || "id";
	var url = arg['url'];
	var findUrl = arg['findUrl'];
	var onchangedFun = arg['onchange'];
	var minChars = Strings.isEmpty(findUrl) ? 1 : 100;
	var id = arg['id'];
	var txtId = arg['textFieldId'] ? arg['textFieldId'] : 'H_' + id + '_Text';
	var pageSize = arg['pageSize'] ? arg['pageSize'] : 10;
	var value = arg['value'] ? arg['value'] : "";
	var text = arg['text'] ? arg['text'] : "";
	var width = arg['width'] || DEFAULT_SS_WIDTH;
	var listWidth = width;
	var tabIndex = arg["tabIndex"];
	if (pageSize != 0) {
		listWidth = width + 100;
	}
	var dcntId = 'DCNT_' + arg['id'];
	// Custom rendering Template
	var resultTpl = arg['XTemplate'] || 
			'<tpl for="."><div class="x-combo-list-item">{' + displayField + '}</div></tpl>';
	
	Ext.define('SSM' + id, {
		extend: 'Ext.data.Model',
		fields : arg["fieldArray"]
	});

	var store = new Ext.data.Store({
		model : 'SSM' + id,
		proxy : {
			type : 'ajax',
			url : url,
			reader : {
				type : 'json',
				root : 'data',
				totalProperty : 'totalRecordSize'
			},
			startParam: 'beginIndex',
			limitParam: 'pageSize'
		},
		pageSize : pageSize
	});
	store.on('beforeload', function(e) {
		var initParamsFun = arg['initParameters'];
		Ext.apply(store.proxy.extraParams, {paged : true});
		if (initParamsFun) {
			var otherParameters = PAction[initParamsFun]();
			Ext.apply(store.proxy.extraParams, otherParameters);
		} 
	});

	var gridArg = {};
	var gridUrl = arg['gridUrl'] ? arg['gridUrl'] : "";
	gridArg["cmpId"] = id;
//	gridArg["searchUrl"] = url;
	gridArg["gridUrl"] = gridUrl;
	gridArg["valueField"] = valueField;
	gridArg["displayField"] = displayField;
	gridArg["searchable"] = !arg['readOnly'];
	gridArg["onchange"] = onchangedFun;
	gridArg["mtype"] = arg['mtype'] || '';
	gridArg["seType"] = arg['seType'] || '';
	gridArg["parameters"] = {};
	gridArg["gridConfigName"] = arg['gridConfigName'];
	gridArg["popupLoadBySourceEntity"] = arg['popupLoadBySourceEntity'];

	var searchComboBox = new Erp.ui.SearchingSelect({
		cfg : arg,
		store : store,
		valueField : valueField,
		id : id,
		renderTo : dcntId,
		displayField : displayField,
		tabIndex : tabIndex,
		typeAhead : arg['readOnly'] ? false : true, //arg['typeAhead'] ? arg['typeAhead'] : false,
		typeAheadDelay : arg['typeAheadDelay'] || 1000,
		readOnly : arg['readOnly'] ? arg['readOnly'] : false,
		editable : arg['readOnly'] ? !arg['readOnly'] : true,
		minChars : minChars,
		findUrl : findUrl,
		onchangedFun : onchangedFun,
		initParametersFun : arg['initParameters'] || '',
		matchFieldWidth : false,
		defaultListConfig : {minWidth: listWidth, maxWidth: listWidth},
		pageSize : pageSize,
		enableKeyEvents : true,
		width : width,
		hideTrigger : (arg['hideTrigger'] ? arg['hideTrigger'] : false),
		queryParam : 'sf_LIKE_query',
		//renderSelectors : arg['list-item-css'] || 'div.x-combo-list-item', 
		//forceSelection : true, // this one not work very well for us, couldn't make searching select empty
		name : 'DESP_' + id,
		gridUrl : gridUrl,
		gridConfigName : arg['gridConfigName'],
		popupLoadBySourceEntity : arg['popupLoadBySourceEntity'],
		secondOnchange : arg['secondOnchange'] || '',
		mtype : arg['mtype'] || '',
		seType : arg['seType'] || '',
		onTriggerClick : function() {
			
			// collapse quick searching list
			searchComboBox.collapse();
			searchComboBox.isPopup = true;
			
			// make sure each time when you click the trigger button, call the initParameter method
			if(arg['popupLoadBySourceEntity'] != 'T') {
				gridArg["searchUrl"] = searchComboBox.store.proxy.url;
			}
			
			if (arg['gridInitParameters']) {
				var otherParameters = PAction[arg['gridInitParameters']]();
				for ( var p in otherParameters) {
					gridArg["parameters"][p] = otherParameters[p];
				}
			}
			
			gridArg["gridConfigName"] = this.gridConfigName;
			if (arg['onTriggerClick']) {
				PAction[arg['onTriggerClick']](this, gridArg);
			} else {
				if (this.gridUrl != "") {
					LUtils.showPopupSelector(gridArg);
				}
			}
		},
		// new Ext4 custom quick search template
		listConfig: {
            getInnerTpl: function() {
                return resultTpl;
            }
        },
        listeners: {
            // delete the previous query in the beforequery event or set
            // combo.lastQuery = null (this will reload the store the next time it expands)
            beforequery: function(qe){
                delete qe.combo.lastQuery;
            }
        }
	});
	searchComboBox.replaceStoreUrl = function(source) {
		if(source) {
			if (source.searchUrl) store.proxy.url = source.searchUrl;
			if (source.tpl) {
				if (searchComboBox.view) {
					searchComboBox.view.tpl = new Ext.XTemplate(source.tpl);
					searchComboBox.view.refresh();
				}
			}
			if (source.gridUrl) searchComboBox.gridUrl = source.gridUrl;
			if (source.gridConfigName) searchComboBox.gridConfigName = source.gridConfigName;
		}
		delete searchComboBox.lastQuery;
	};
	
	if (arg['disabled'] && arg['disabled'] == true) {
		searchComboBox.setDisabled(true);
	} else {
		searchComboBox.setDisabled(false);
	}
	return searchComboBox;
}