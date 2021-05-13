Ext.namespace('ERP.ext.util');

ERP.ext.util.Grid =function(){
	return {
		/**
		 * 
		 * @param {EditorGridPanel}
		 * @param {String} direction can be "top" or "bottom", default to "top" for now
		 * @param {Object} the default value for the record, like: {id:'id', code: 'xxx'}
		 * @param {Store} the store need add the record
		 */
		addLine: function(grid, direction, defaultValue, store,unSelected){
			if(grid){
				var T = grid.getStore().recordType;
                var t = new T((defaultValue || {}));
                unSelected = unSelected?unSelected:false;
                grid.stopEditing();
                store = store || grid.getStore();
                direction = direction || 'top';
                var count = direction == 'top' ? 0 : store.getCount();
                store.insert(count, t);
                if(!unSelected){
                	if(grid.getSelectionModel()){
                    	grid.getSelectionModel().selectRow(count, false);
                    }
                    grid.getView().focusRow(count);
                   	if(grid.startEditing){
                   		grid.startEditing(count, 1);//since the first one always is a hidden id, so start editing from 1
                   	}
                }
                
			}
		},
		removeLine: function(grid, lineToDelete, recordToRemove,unSelectFirstRow) {
			unSelectFirstRow = unSelectFirstRow?unSelectFirstRow:false;
			if(grid.stopEditing) { //hack
				grid.stopEditing();
			}
			if (Ext.isEmpty(recordToRemove)) {
				recordToRemove = grid.getSelectionModel().getSelected();
			}
			if (recordToRemove) {
				//remove it
				grid.getStore().remove(recordToRemove);
				
				//remove the recordToRemove in ModifiedRecords too.
				var records = grid.getStore().getModifiedRecords();
				ERP.ext.util.removeFromArray(records,recordToRemove.id);
				
				if(grid.getStore().getCount() > 0 && !unSelectFirstRow) {
					grid.getSelectionModel().selectFirstRow();
				}
				//set to hidden fields
				if (lineToDelete) {
					var obj = document.forms[0][lineToDelete];
					if (obj) {
						var deletedLines = obj.value;
						var id = recordToRemove.get("id");
						if(!Strings.isEmpty(id)) {
							if (Strings.isEmpty(deletedLines)) {
								deletedLines="";
							}
							if(deletedLines.length > 0) {
								obj.value = deletedLines+","+id;
							}else{
								obj.value = id;
							}
						}
					}
				}
			}
		},
		//copied from ext2_helper for now
		modifiedRecordsToJson: function(extGrid, id){
			id = id || "id";
			var records=extGrid.getStore().getModifiedRecords();
			var data = [];
			for(var i = 0;i<records.length;i++){
				var record = records[i].getChanges();
				record[id]=records[i].get(id);
				data.push(record);
			}
			if (data.length>0){
				return jsonEncode(data);
			} else {
				return "";
			}
		},
		validateRequiredColumn: function(store, field, message){
			var success = true;
			if(store && field){
				store.each(function(record){//ie7 has problem with this code, seems because of Ext.Msg
					if(Ext.isEmpty(record.get(field))){
						Ext.MessageBox.alert('Error', '<nobr>' + (message||(field + " can't be empty.")) + '</nobr>');
						success = false;
						return false;
					}
				});
			}
			return success;
		},
		validateUniqueColumn: function(store, field, message){
			var success = true;
			if(store && field){
				var records = store.getRange();
				store.each(function(record){
					for(var i=0;i<records.length;i++){
						if(records[i].id == record.id)continue;
						if(records[i].get(field)==record.get(field)){
							Ext.MessageBox.alert('Error', '<nobr>' + (message||(field + " should be unique.")) + '</nobr>');
							success = false;
							return false;
						}
					}
					       
		        });
		    }
			return success;
		},
		allRecordsToJson : function(extGrid) {
			var records=extGrid.getStore().data.getRange();
			return Ext.encode(this.dataToArray(records));
		},
		
		dataToArray : function(records){
			if(!records) return null;
			var dataArray = [];
			for(var i = 0;i < records.length;i++){
				if(records[i].data){
					dataArray.push(records[i].data);
				}
			}
			return dataArray;
		}
	};
}();

/**
 * remove an element from an Array base on delete of id
 */
ERP.ext.util.removeFromArray = function(records, id) {
	for(var i = 0; i < records.length; i ++) {
		if(records[i] && records[i].id) {
			if(id == records[i].id) {
				records.splice(i,1);
				break;
			}
		}
	}
};
//just copy this function from ext2_helper for now
ERP.ext.util.extFormatDate = function(value) {
	if(!Ext.isDate(value)) {
		// this potion is to workaround the ext date format functions, ugly
       if (isNaN(Date.parse(value))) {
       	 value = Date.parseDate(value, 'Y-m-d');
       } else {
       	 value = new Date(Date.parse(value));
       }
               
    }
    return value ? Ext.util.Format.date(value,'Y-m-d') : '';
};
ERP.ext.util.extFormatTime = function(value) {

   if (isNaN(Date.parse(value))) {
   	 value = Date.parseDate(value, 'H:i');
   } else {
   	 value = new Date(Date.parseDate(value,'H:i'));//g:i A
   }

    return value ? Ext.util.Format.date(value,'H:i') : '';
};
//just copy this function from ext2_helper for now
ERP.ext.util.allRecordsToJson = function(extGrid) {
	var records = extGrid.getStore().data.getRange();
	return Ext.encode(ERP.ext.util.dataToArray(records));
};
//just copy this function from ext2_helper for now
ERP.ext.util.dataToArray = function(records) {
	if(!records) return null;
	var dataArray = [];
	for(var i = 0;i < records.length; i ++) {
		if(records[i].data) {
			dataArray.push(records[i].data);
		}
	}
	return dataArray;
}

Erp.common.ext.util.initColorField = function(cfg) {
	var colorField = new Ext.form.ColorField({
		renderTo : 'DCNT_' + cfg.id, 
		id:  'CF_' + cfg.id,
		value : cfg.value,
		allowBlank : !cfg.notNull || true,
		showHexValue : (CUtils.isTrueVal(cfg.showHexValue) ? true : false) || false,
		autoShow :(CUtils.isTrueVal(cfg.autoShow) ? true : false) || true,
		disabled : cfg.disabled || false
	});
	colorField.on('change', function(/*Ext.form.Field*/ obj, /*Ext.Object*/newValue, /*Ext.Object*/ oldValue) {
		var flag = true;
		if(cfg.onchange) {
			flag = cfg.onchange(obj, newValue, oldValue);
		}
		
		if ((typeof(flag) == 'undefined') || flag) {
			colorField.setColorValue(newValue);
		} else {
			colorField.setColorValue(oldValue);
			return flag;
		}
	});
	colorField.on('select', function(/*Ext.form.Field*/ obj) {
		colorField.setColorValue(obj.getValue());
	});
	colorField.setColorValue = function(value) {
		colorField.setValue(value);
		$("H_"+cfg.id).value = value;
	};
	return colorField;
}

 

//Case when line grid column is a hyper link to popup;
function getHyperLinkText(objId, objName,func_name){
	return "<a href='#' onclick='"+func_name+"(\""+objId+"\")'>" + objName + "</a>";
}


function getHyperLink(objId, objName, type, subType, func_name){
	return "<a href='#' onclick='" + func_name+"(\"" + objId + "\",\"" + type + "\",\"" + subType + "\")'>" + objName + "</a>";
	
}

// ----------------------------------------------------------------------------------------------------------------
// this block is used for the source component tag
// added by Lei

// a global various for save the available source type's properties
var gSourceTypeVars = {};


/**
 * default source component on click, 
 * @param cmp, which searching select you click
 * @param gridArg, these default values from your searching select for popup the grid selector
 * @return
 */
function defaultSourceComponentOnClick(cmp, gridArg) {
	var cmpId = cmp.getId();
	var sourceCode = $(cmpId+'_type').value;
	if (sourceCode == '') {
		alert("Please select the type first!");
		return ;
	}
	var sourceParams = gSourceTypeVars[cmpId][sourceCode];
	gridArg['gridUrl'] = sourceParams.gridUrl;
	gridArg['initMethodName'] = sourceParams.gridInitMethod;
	
	popupSelector(gridArg);
}

function getSource(cmp) {
	var cmpId = cmp.getId();
	var sourceCode = $(cmpId+'_type').value;
	if (sourceCode == '') {
		return null;
	}
	return gSourceTypeVars[cmpId][sourceCode];
}

function defaultSourceTypeOnChange(cmpSourceId) {
	var cmpSource = Ext.getCmp(cmpSourceId);
	cmpSource.clearValues();

	cmpSource.replaceStoreUrl(getSource(cmpSource));
}

function getSourceComponentValue(cmpId) {
	var cmp = Ext.getCmp(cmpId + "_source");
	return cmp.getValue();
}
function setSourceComponentValue(cmpId, newValue, newText) {
	var cmp = Ext.getCmp(cmpId + "_source");
	cmp.setSelectValue(newValue,newText);
}
function getSourceComponentTypeValue(cmpId) {
	return $F(cmpId + "_source_type");
}
function setSourceComponentTypeValue(cmpId, newValue) {
	var cmp=$(cmpId + "_source_type");
	setSelectElmValue(cmp, newValue);
}
function getDateFieldValue(cmpId){
//	return $("H_"+cmpId).value;
	return Ext.getCmp("shipDate").value;
}

function getTimeFieldValue(cmpId){
	var cmp =Ext.getCmp("TF_"+cmpId);
	return cmp.getValue();
}
function getDateFieldCmp(cmpId){
	return Ext.getCmp("DF_"+cmpId);
}
function getTimeFieldCmp(cmpId){
	return Ext.getCmp("TF_"+cmpId);
}
function clickToolButton(panel, handleFunction){
	panel.expand(true);
	handleFunction();
}
//-----------------------------------------------------------------------------------------------------------------
function sv(value) {
	return value ? value : "";
}
function dv(value) {
	return value ? parseFloat(value) : 0.0;
}
function iv(value) {
	return value ? parseInt(value) : 0;
}

ERP.ext.util.contrastColor = function(color) {
	var colorRGB = this.hex2rgb(color);
	return ((colorRGB.R * 299) + (colorRGB.G * 587) + (colorRGB.B * 114)) / 1000 - 125 < 0 ? "FFFFFF" : "000000"; 
}

ERP.ext.util.hex2dec = function(hexchar) {
    return "0123456789ABCDEF".indexOf(hexchar.toUpperCase());
}

ERP.ext.util.hex2rgb = function(color) { 
    color = color.replace("#", "");
    return {
        R : (this.hex2dec(color.substr(0, 1)) * 16) + this.hex2dec(color.substr(1, 1)),
        G : (this.hex2dec(color.substr(2, 1)) * 16) + this.hex2dec(color.substr(3, 1)),
        B : (this.hex2dec(color.substr(4, 1)) * 16) + this.hex2dec(color.substr(5, 1))
    }
}
function formatFloat(d, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero) {
	var r = 0;
	notNull = notNull || false;
	ignoreEndZeros = ignoreEndZeros || false;
	ignoreBeginZero = ignoreBeginZero || false;
	decimalNumber = decimalNumber || 2;
	var a = parseFloat(d);
	if (!isNaN(a)) {
 		var pow = Math.pow(10, decimalNumber);
		a = (Math.round(a*pow)/pow);
	} else {
		a = 0;
	}
	r = a.toFixed(decimalNumber);
	
	if(ignoreEndZeros) {
		for(var i = decimalNumber - 1; i >= 0; i --) {
			if(a == a.toFixed(i)) {
				r = a.toFixed(i);
			}
		}
	}
	if(ignoreBeginZero) {
		if(a > -1 && a < 1) return  r.replace('0.', '.');
	}
	return notNull ? r : (a == 0 ? "" : r);
}

function formatCurrency(d,decimalNumber, currencySymbol) {
	var a = parseFloat(d);
	if (isNaN(a)) {
		return "";
	}
	decimalNumber = decimalNumber || 2;
	currencySymbol = currencySymbol || "$";
	if(parseFloat(d) == 0) return currencySymbol + formatMoney(0, decimalNumber);	
	d = formatMoney(d,decimalNumber);
	var absVal = 0;
	var sign = (d == (absVal = Math.abs(d)));//whether positive or negative
	absVal = formatMoney(absVal, decimalNumber);//get back decimal point after absolute value
	var idx = absVal.indexOf(".");
	while (absVal.substring(0, idx++).length % 3) {
	    absVal = "0" + absVal;
	}		
	var sReturn = absVal.replace(/(\d{3})/g, "$1,").replace(/,\./, ".").replace(/(^0*)|(,$)/g, "");
	if(parseFloat(sReturn) > 0 && parseFloat(sReturn) < 1) {
		sReturn = "0" + sReturn;
	}	
	return ((sign)?'':'-') + currencySymbol + sReturn;
	//return Ext.util.Format.usMoney(a);
}

function formatMoney(d, decimalNumber) {
	var a = parseFloat(d);
	if (!isNaN(a)) {
		decimalNumber = decimalNumber || 2;
 		var pow = Math.pow(10, decimalNumber);
		var r = (Math.round(a*pow)/pow);
		return r.toFixed(decimalNumber);		
	}
	return "";
}

function getCmp(cmpId) {
	return Ext.getCmp(cmpId);
}

function disableEditGrid(grid, exceptions) {
	var columns = grid.getColumnModel().getColumnsBy(function(c) {
		if(exceptions) {
			for(var p in exceptions) {
				if(exceptions[p] == c.id) return false;
			}
		}
		return c.editable == true;
	});
	for(var i = 0; i < columns.length; i ++) {
		columns[i].editable = false;
	}
}

function gridRendererProcess(grid) {
	var columns = grid.getColumnModel().getColumnsBy(function(c) {
		var length = c.id.length;
		return c.id.substr(0, 3) == 'qty' || c.id.substr(length - 3, length) == 'Qty' || c.id == 'quantity';
	});
	for(var i = 0; i < columns.length; i ++) {
		columns[i].renderer = qtyColumnRenderer;
	}
}

function qtyColumnRenderer(qtyValue, metadata, record, rowIndex, colIndex, store) {
	var val = formatFloat(qtyValue);
	if(Strings.isEmpty(val)) return "";
	return val;
//	if(val > 0) {
//	    return '<span style="color:green;">' + val + '</span>';
//	} else if(val < 0) {
//	    return '<span style="color:red;">' + val + '</span>';
//	} else {
//		return '<span style="color:#BBBBBB;">' + val + '</span>';
//	}
	
}

function gridHeaderSelectAll(grid, columnHeaderElm, fn) {
	var records = grid.getStore().data;
	
	for(var i = 0; i < records.length; i++) {
		if(columnHeaderElm.checked)
			records.get(i).set("select", true);
		else
			records.get(i).set("select", false);
		
	}
	if(fn && typeof(fn) == 'function') {
		fn();
	}
}

function isSelectedRecord(grid) {
	var records = grid.getStore().data;
	for(var i = 0; i < records.length; i++) {
		if(records.get(i).get('select'))
			return true;
	}
	
	return false;
}

function isSelectedDate(dateCmp, msg) {
	if(Strings.isEmpty(dateCmp.getRawValue())) {
		Ext.MessageBox.show({
			title: 'Warning',
			msg: msg,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.WARNING
		});
		return false;	
	}
	return true; 
}

function usMoney(value, metadata, record, rowIndex, colIndex, store) {	
	if(Strings.isEmpty(value) || isNaN(value)) return value;
	return formatCurrency(value);
}

function renderDate(value, metadata, record, rowIndex, colIndex, store) {
	if(Strings.isEmpty(value) || isNaN(value)) return value;
	if(value == 0) return "";
	var val = [];
	val.push(value.toString().substring(0, 4));
	val.push(value.toString().substring(4, 6));
	val.push(value.toString().substring(6, 8));
	
	return val.join("-");
}