/**
 * FengYu
 */
Ext.define('ERP.prop.PropAction' ,{
	extend : 'ERP.ListAction',
	ableToClosePage : false,
	isAbleToRemoveLine : true,
	specialValidate : '',
	
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		
		var me = this;
		
		if(CUtils.isTrueVal(isPopupEditor)){
			PApp.grid.on('itemdblclick', function(view,record, item, index, e) {
				PAction["showForm"](record.get("id") , propUrl);
		    });
		} else {
//			PApp.grid.getSelectionModel().on('select', function (/*Ext.selection.RowSelectionModel*/ rm, record, index){
//				var id = record.get("id");
//				if(CUtils.isTrueVal(me.isAbleToRemoveLine)) {
//					var cmp = Ext.getCmp('removeLine');
//					if(!Strings.isEmpty(id)) {
//						cmp.setDisabled(true);
//					} else {
//						cmp.setDisabled(false);
//					}
//				}
//			});
			PApp.grid.on('beforeedit', function(editor, e, eOpts) {
				if(editor.column){
					if(e.column.resetableAfterSaved === false && !Strings.isEmpty(e.record.data.id)){
						return false;
					}
				}
				return true;
			});
			PApp.grid.on('edit', function(editor, obj) {
				if (obj.value == obj.originalValue || (Strings.isEmpty(obj.value) && Strings.isEmpty(obj.originalValue))) {
					return;
				}
				if(obj.column) {
					var onAfterEditMethodName = obj.column.onAfterEdit;
					if(!Strings.isEmpty(onAfterEditMethodName)){
						PAction[onAfterEditMethodName](obj);
					}
				}
				return true;
			});
		}
		return this;
	},
	addLine :  function() {
		if(CUtils.isTrueVal(isPopupEditor)){
			this.showForm("", propUrl);
		}else{
			GUtils.addLine(this.getPropGrid(), {});
		}
	},
	removeLine : function () {
		var record = GUtils.getSelected(this.getPropGrid());
		GUtils.removeLine(this.getPropGrid());
		if (!Strings.isEmpty(record.get('id'))) {
			Ext.Ajax.request({
			    url: document.forms[0].action + '/delete',
			    params: {
			    	id: record.get('id')
			    },
			    success : function(response) {
			    	this.getPropGrid().store.load();
			    }
			});
		}
		
	},

	save : function(action) {
		if(action == 'apply' || action == 'ok') {
			var msg = new Array();
			msg.addAll(VUtils.commonComponentValidate());
			
			if (!Strings.isEmpty(this.specialValidate)) {
				msg.addAll(this[this.specialValidate]());
			}
			if (msg.length == 0) {
				var lineToDelete = $("lineToDelete").value; 
				$("modifiedRecords").value = GUtils.modifiedRecordsToJson(this.getPropGrid());
				
				this.redirectFormSubmit(action , false);
			} else {
				VUtils.processValidateMessages(msg);
			}
		}
	},
	redirectFormSubmit : function(action, showMainFrameMask) {
		if(typeof(showMainFrameMask) == 'undefined') {
			showMainFrameMask = true;
		}
		beginWaitCursor("Processing", showMainFrameMask);
		document.forms[0].action += '/' + action;
		document.forms[0].submit();
	},
	
	getPropGrid : function () {
		return PApp.grid;
	},
	
	getCurrentGridTypeId : function () {
		return GUtils.getSelectedId(CUtils.getExtObj(GRID_ID));
	},
	
	getGridSearchPara : function () {
		var elements = document.getElementsByTagName("input");
		var params = {};
		for (var i = 0, l = elements.length; i < l; i ++) {
			var ele = elements[i];
			if(ele.id.startWith('fp_')) params[elements[i].name] = elements[i].value;
		}
		return params;
	},
	showForm : function (id , url , arg) {
		if(Strings.isEmpty(id)) {
			url += "/new/" + DEFAULT_NEW_ID;
		} else {
			url += "/form/"+id+"/show";
		}
		var launcher = new ERP.Launcher({
			varName : 'maintenceFormWin',
			url : url
		});
		var sizeJsonStr = sizeJsonStr;
		if(!Strings.isEmpty(sizeJsonStr)){
			launcher.setCord(CUtils.jsonDecode(sizeJsonStr));
		} else {
			launcher.setCord({y:10, x:10, w:800, h:600});
		}
		launcher.callBack = this.showForm_CallBack;
		launcher.open();
	},
	showForm_CallBack : function (action, returnVal) {
		if (action == "ok") {
			PApp.grid.getStore().load();
		}
		maintenceFormWin = null;
	},
	popupSelect_onclick : function(cmpId){
		var arg = {};
		var cmConfig = CUtils.getExtObj(GRID_ID + '_' + cmpId);
		arg['cmpId'] = cmpId;
		arg['callBack'] = "popupSelect_callBack";
		arg['gridUrl'] = cmConfig.gridUrl;
		arg['gridConfigName'] = cmConfig.gridConfigName;
		arg['parameters'] = Ext.apply(cmConfig.parameters, cmConfig.extraParameters && this[cmConfig.extraParameters] && this[cmConfig.extraParameters]());
		arg['searchable'] = cmConfig.searchable;
		arg['multiple'] = cmConfig.multiple;
		arg['mtype'] = cmConfig.mtype;
		LUtils.showPopupSelector(arg);
	},
	popupSelect_callBack : function(cmpId, action, returnVal){
		if (action == "ok") {
			var grid = Ext.getCmp(GRID_ID);
			var record = grid.getSelectionModel().getSelection()[0];
			if(record){
				var id = cmpId.substring(0,cmpId.indexOf(GUtils.BROWSER_COLUMN_SUBFIX));
				GUtils.setPopupValue(record, id, returnVal[0].id, cmpId,returnVal[0].displayString);
			}
			grid.plugins[0].cancelEdit();
		}
	},
	
	plantWarehouseExtraParameters : function() {
		var grid = Ext.getCmp(GRID_ID);
		var record = grid.getSelectionModel().getSelection()[0];
		var plantId = record.get('id');
		return {plant: Strings.isEmpty(plantId) ? "NULL_PLANT" : plantId};
	},
	
	corporationIgnoreExtraParameters : function() {
		return {ignoreCorporation: true};
	},
	
	onNamePrintedColumnAfterEdit : function(obj) {
		var grid = Ext.getCmp(GRID_ID);
		var lineRecords = grid.getStore().data.getRange();
		for(var i = 0; i < lineRecords.length; i ++) {
			var record = lineRecords[i];
			if(record){
				if(console){
					console.log(record);
				}
				record.set('namePrinted', obj.value);
			}
		}
	},
	
	onGaugeAfterEdit : function(obj) {
		if(Strings.isEmpty(obj.value)) return;
		var record = obj.record;
		if(VUtils.isThickness(obj.value) == false) {
			CUtils.warningAlert("The " + obj.value + " is not a valid gauge value.");
			record.set('code', "");
		} else {
			if(VUtils.isDemicial(obj.value)) {
				record.set('code', VUtils.formatFloat(obj.value, 5, true, false, false));
			} else {
				var v = obj.value;
				v = v.toUpperCase().trim();
				v = v.removeLastStr('GA');
				v = v.trim();
				v = v + " GA";
				
				record.set('code', v);
			}
		}
		
	}
	
});