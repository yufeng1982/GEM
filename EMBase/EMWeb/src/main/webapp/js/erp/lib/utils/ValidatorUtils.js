Ext.define('ERP.ValidatorUtils' , {
	
	globalValidate : {},
	ignoredFields : {},
	formaters : [],
	validators : [],
	
	addIgnoredField : function(id) {
		this.ignoredFields[id] = true;
	},
	removeIgnoredField : function(id) {
		this.ignoredFields[id] = false;
	},
	
	addField : function(id, obj) {
		this.globalValidate[id] = obj;
		this.ignoredFields[id] = false;
		this.formateData(obj);
		this.addKeyDownEvent(obj);
	},
	
	addColumn : function(cfg) {
		this.globalValidate[cfg.gridId] = this.globalValidate[cfg.gridId] || new Array();
		var validateData = {gridId : cfg.gridId, dataIndex: cfg.dataIndex, type: 'grid', notNull: cfg.notNull, fieldLength : cfg.fieldLength, minValue: cfg.minValue, maxValue : cfg.maxValue, positiveNumber : cfg.positiveNumber};
		this.globalValidate[cfg.gridId].push(validateData);
//		this.formateData(globalValidate[cfg.dataIndex]);
	},
	
	addGrid : function(cfg) {
		var unique = cfg.uniqueColumns.length > 0 ? "true" : "false";
		this.globalValidate[cfg.id + "_unique"] = {id : cfg.id, label: '', type: 'grid', unique: unique, uniqueColumnsArray: cfg.uniqueColumns, grid: cfg.grid, notNull: cfg.notNull};
	},
	
	constructor : function() {
		this.formaters['Integer'] = 'formatersInteger';
		this.formaters['Float'] = 'formatersFloat';
		
		this.validators['text'] = [];
		var text = this.validators['text'];
		text['notNull'] = 'validateNotNull';
		text['Integer'] = 'validateTextInteger';
		text['Float'] = 'validateTextFloat';
		text['decimalNumber'] = 'validateTextDecimalNumber';
		text['minValue'] = 'validateTextMinValue';
		text['maxValue'] = 'validateTextMaxValue';
		text['unique'] = 'validateTextUnique';
		text['positiveNumber'] = 'validateTextPositiveNumber';
		
		this.validators['select'] = [];
		var select = this.validators['select'];
		select['notNull'] = 'validateComboboxNotNull';
		
		this.validators['date'] = [];
		var date = this.validators['date'];
		date['notNull'] = 'validateDateNotNull';
		
		this.validators['time'] = [];
		var time = this.validators['time'];
		time['notNull'] = 'validateTimeNotNull';
		
		this.validators['dateTime'] = [];
		var dateTime = this.validators['dateTime'];
		dateTime['notNull'] = 'validateDateTimeNotNull';
		
		this.validators['searchingSelect'] = [];
		var searchingSelect = this.validators['searchingSelect'];
		searchingSelect['notNull'] = 'validateSearchingSelectNotNull';
		
		this.validators['find'] = [];
		var find = this.validators['find'];
		find['notNull'] = 'validateFindNotNull';
		
		this.validators['currency'] = [];
		var currency = this.validators['currency'];
		currency['notNull'] = 'validateComboboxNotNull';
		
		this.validators['minMax'] = [];
		var minMax = this.validators['minMax'];
		minMax['notNull'] = 'validateMinMaxNotNull';
		minMax['decimalNumber'] = 'validateMinMaxdecimalNumber';
		minMax['Integer'] = 'validateMinMaxInteger';
		minMax['Float'] = 'validateMinMaxFloat';
		minMax['notGT'] = 'validateMinMaxNotGT';
		minMax['minValue'] = 'validateMinMaxMinValue';
		minMax['maxValue'] = 'validateMinMaxMaxValue';
		
		this.validators['grid'] = [];
		var grid = this.validators['grid'];
		grid['notNull'] = 'validateGridNotNull';
		grid['minValue'] = 'validateGridMinValue';
		grid['maxValue'] = 'validateGridMaxValue';
		grid['fieldLength'] = 'validateGridLength';
		grid['positiveNumber'] = 'validateGridPositiveNumber';
		/////for all grid/////
		grid['gridNotNull'] = 'validateGridEmpty';
		grid['unique'] = 'validateGridUniqueValue';
	},
	isDemicial : function(val) {
		if (Strings.isEmpty(val)) return false;
		return (val == String(val).match(new RegExp("[+-]{0,1}\\d*\\.{0,1}\\d*"))[0]);
	},
	validateNotNull : function(id, label) {
		var msgarray = new Array();
		if(Strings.isEmpty($(id).value)){
			msgarray.push({fieldname:id,message: label + PRes["NotEmpty"], arg:null});
		}
		return msgarray;
	},
	
	validateTextInteger : function(id, label){
		var msgarray = new Array();
		if(!Strings.isEmpty($(id).value) && !this.isInteger($(id).value)){
			msgarray.push({fieldname:id,message: label + " is an invalid integer number ", arg: null});
		}
		return msgarray;
	},
	validateTextFloat : function(id, label){
		var msgarray = new Array();
		if(!Strings.isEmpty($(id).value) && !this.isFloat($(id).value)) {
			msgarray.push({fieldname: id, message: label + " is an invalid float number ", arg: null});
		}
		return msgarray;
	},
	validateTextDecimalNumber : function(id, label, decimalNumber){
		var msgarray = new Array();
		if(!Strings.isEmpty($(id).value)) {
			var value = parseFloat($(id).value);
			var pow = Math.pow(10, decimalNumber);
			var newValue = Math.round(value * pow) / pow;
			if(newValue != value) {
				msgarray.push({fieldname: id, message: label + " 's decimal place must be a maximum of " + decimalNumber + " digits", arg: null});
			}
		}
		return msgarray;
	},
	validateTextMinValue : function(id, label, minValue) {
		var msgarray = new Array();
		if(!Strings.isEmpty($(id).value) && this.isFloat($(id).value)) {
			if(CUtils.dv($(id).value) < minValue) {
				msgarray.push({fieldname: id, message: label + " must not be less than " + minValue, arg: null});
			}
		}
		return msgarray;
	},
	validateTextMaxValue : function(id, label, maxValue) {
		var msgarray = new Array();
		if(!Strings.isEmpty($(id).value) && this.isFloat($(id).value)) {
			var value = CUtils.dv($(id).value);
			if( value > maxValue) {
				msgarray.push({fieldname: id, message: label + " must not be greater than " + maxValue, arg: null});
			}
		}
		return msgarray;
	},
	validateTextUnique : function(id, label, param) {
		var msgarray = new Array();
		msgarray.push({fieldname: id, message: label + " is not unique", arg: null});
		return msgarray;
	},
	validateTextPositiveNumber : function(id, label) {
		var msgarray = new Array();
		var value = $(id).value;
		if(Strings.isEmpty(value)) return msgarray;
		
		if(isNaN(value) || !this.isPositiveNumber(value)) {
			msgarray.push({fieldname: id, message: label + " must be a positive number!", arg: null});
		}
		return msgarray;
	},
	
	validateComboboxNotNull : function(id, label) {
		var msgarray = new Array();
		if(Strings.isEmpty(CUtils.getSValue(id))){
			msgarray.push({fieldname:id,message:label+PRes["NotEmpty"], arg:null});
		}
		return msgarray;
	},
	validateDateNotNull : function(id, label){
		var msgarray = new Array();
		if(Strings.isEmpty(CUtils.getDateValue(id))){
			msgarray.push({fieldname: id, message: label + PRes["NotEmpty"], arg:null});
		}
		return msgarray;
	},
	validateTimeNotNull : function(id, label){
		var msgarray = new Array();
		if(Strings.isEmpty(CUtils.getTimeValue(id))){
			msgarray.push({fieldname: "TF_" + id, message: label + PRes["NotEmpty"], arg:null});
		}
		return msgarray;
	},
	validateDateTimeNotNull : function(id, label){
		var msgarray = new Array();
		msgarray.addAll(this.validateDateNotNull(id+'_date', label));
		if(msgarray && msgarray.length == 0){
			msgarray.addAll(this.validateTimeNotNull(id+'_time', label));
		}
		return msgarray;
	},
	validateSearchingSelectNotNull : function(id, label){
		var msgarray = new Array();
		if(Strings.isEmpty(CUtils.getSSValue(id))){
			msgarray.push({fieldname:id,message:label+PRes["NotEmpty"], arg: null});
		}
		return msgarray;
	},
	validateFindNotNull : function(id, label){
		var msgarray = new Array();
		if(Strings.isEmpty(CUtils.getSSValue(id))){
			msgarray.push({fieldname:id,message:label+PRes["NotEmpty"], arg: null});
		}
		return msgarray;
	},
	validateMinMaxNotNull : function(id, label) {
		var msgarray = new Array();
		var minId = id + 'Min';
		var maxId = id + 'Max';
		msgarray.addAll(this.validateNotNull(minId, label + ' Min'));
		msgarray.addAll(this.validateNotNull(maxId, label + ' Max'));
		return msgarray;
	},
	validateMinMaxdecimalNumber : function(id, label, decimalNumber){
		var msgarray = new Array();
		var minId = id + 'Min';
		var maxId = id + 'Max';
		msgarray.addAll(this.validateTextDecimalNumber(minId, label + ' Min', decimalNumber));
		msgarray.addAll(this.validateTextDecimalNumber(maxId, label + ' Max', decimalNumber));
		return msgarray;
	},
	validateMinMaxInteger : function(id, label) {
		var msgarray = new Array();
		var minId = id + 'Min';
		var maxId = id + 'Max';
		msgarray.addAll(this.validateTextInteger(minId, label + ' Min'));
		msgarray.addAll(this.validateTextInteger(maxId, label + ' Max'));
		return msgarray;
	},
	validateMinMaxFloat : function(id, label){
		var msgarray = new Array();
		var minId = id + 'Min';
		var maxId = id + 'Max';
		msgarray.addAll(this.validateTextFloat(minId, label + ' Min'));
		msgarray.addAll(this.validateTextFloat(maxId, label + ' Max'));
		return msgarray;
	},
	validateMinMaxNotGT : function(id, label) {
		var msgarray = new Array();
		var minId = id + 'Min';
		var maxId = id + 'Max';
		var thicknessMin = $(minId).value;
		var thicknessMax = $(maxId).value;
		if(!Strings.isEmpty(thicknessMin) && !Strings.isEmpty(thicknessMax) && this.isFloat(thicknessMin) && this.isFloat(thicknessMax)) {
			if(CUtils.dv(thicknessMin) > CUtils.dv(thicknessMax)) msgarray.push({fieldname: id, message: label + "'s min value must be less than max value.", arg: null});
		}
		return msgarray;
	},
	validateMinMaxMinValue : function(id, label, minValue) {
		var msgarray = new Array();
		var minId = id + "Min";
		msgarray.addAll(this.validateTextMinValue(minId, label + ' Min', minValue));
		return msgarray;
	},
	validateMinMaxMaxValue : function(id, label, maxValue) {
		var msgarray = new Array();
		var maxId = id + "Max";
		msgarray.addAll(this.validateTextMaxValue(maxId, label + ' Max', maxValue));
		return msgarray;
	},
	validateGridField : function(params) {
		var me = this;
		var msgarray = new Array();
		var lineNum = 1;
		var grid = CUtils.getExtObj(params[0].gridId);
		if(!grid) return msgarray;
		var store = grid.getStore();
		store.each(function(record) {
			var strLineNum = !Strings.isEmpty(record.get('sequence')) ? record.get('sequence') : lineNum;
			for(i = 0; i < params.length; i++) {
				var param = params[i];
				if(CUtils.isTrueVal(param.notNull)){
					arr = me[me.validators[param.type]['notNull']](grid, record, strLineNum, param.dataIndex);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.decimalNumber)) {
					arr = me[me.validators[param.type]['decimalNumber']](grid, record, strLineNum, param.dataIndex, param.decimalNumber);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.minValue)) {
					arr = me[me.validators[param.type]['minValue']](grid, record, strLineNum, param.dataIndex, param.minValue);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.maxValue)) {
					arr = me[me.validators[param.type]['maxValue']](grid, record, strLineNum, param.dataIndex, param.maxValue);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.fieldLength)) {
					arr = me[me.validators[param.type]['fieldLength']](grid, record, strLineNum, param.dataIndex, param.fieldLength);
				    msgarray.addAll(arr);
				}
				if(CUtils.isTrueVal(param.positiveNumber)) {
					arr = me[me.validators[param.type]['positiveNumber']](grid, record, strLineNum, param.dataIndex);
				    msgarray.addAll(arr);
				}
			}
			lineNum++;
		});
		return msgarray;
	},
	validateGridNotNull : function(grid, record, lineNum, field) {
		var msgarray = new Array();
		if(Ext.isEmpty(record.get(field))) {
			var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
			var label = GUtils.getHeader(field, grid);
			msgarray.push({fieldname: grid.id, message: gridName + PRes["Line"] + lineNum + ": " + label + PRes["NotEmpty"], arg:null});
		}
		return msgarray;
	},
	validateGridMinValue : function(grid, record, lineNum, field, minValue) {
		var me = this;
		var msgarray = new Array();
		if(!Strings.isEmpty(record.get(field)) && me.isFloat(record.get(field))) {
			if(CUtils.dv(record.get(field)) < minValue)  {
				var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
				var label = GUtils.getHeader(field, grid);
				msgarray.push({fieldname: grid.id, message: gridName + "Line " + lineNum + ": " + label + " min value must not be less than" + minValue, arg:null});
			}
		}
		return msgarray;
	},
	validateGridMaxValue : function(grid, record, lineNum, field, maxValue) {
		var me = this;
		var msgarray = new Array();
		if(!Strings.isEmpty(record.get(field)) && me.isFloat(record.get(field))) {
			if(CUtils.dv(record.get(field)) > maxValue) {
				var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
				var label = GUtils.getHeader(field, grid);
				msgarray.push({fieldname: grid.id, message: gridName + "Line " + lineNum + ": " + label + " max value must not be greater than " + maxValue, arg: null});
			}
		}
		return msgarray;
	},
	validateGridLength : function(grid, record, lineNum, field, length) { 
		var me = this;
		var msgarray = new Array();
		if(!Strings.isEmpty(record.get(field)) && record.get(field).length != length) {
			var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
			var label = GUtils.getHeader(field, grid);
			msgarray.push({fieldname: grid.id, message: gridName + PRes["Line"] + lineNum + ": " + label + " leng should be " + length + " characters", arg: null});
		}
		return msgarray;
	},
	validateGridPositiveNumber : function(grid, record, lineNum, field) {
		var me = this;
		var msgarray = new Array();
		var value = record.get(field);
		if(!Strings.isEmpty(value) && !isNaN(value) && !this.isPositiveNumber(value) ) {
			var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
			var label = GUtils.getHeader(field, grid);
			msgarray.push({fieldname: grid.id, message: gridName + PRes["Line"] + lineNum + ": " + label + PRes["PositiveNumber"], arg: null});
		}
		return msgarray;
	},
	validateGridEmpty : function(grid) {
		var me = this;
		var msgarray = new Array();
		if(grid.getStore().getCount() == 0) {
			var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
			msgarray.push({fieldname: grid.id, message: gridName + " need least one line!", arg: null});
		}
		return msgarray;
	},
	
	validateGridUniqueValue : function(id, field, param) {
		var msgarray = new Array();
		var uniqueColumnsArray = param.uniqueColumnsArray;
		var theGrid = param.grid;
		for(var i = 0; i < uniqueColumnsArray.length; i ++) {
			var uniqueColumns = uniqueColumnsArray[i];
			msgarray.addAll(this.validateUniqueRecords(theGrid, uniqueColumns));
		}
		return msgarray;
	},
	
	formatFloat : function(d, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero, keepZero) {
		var r = 0;
		notNull = notNull || false;
		ignoreEndZeros = ignoreEndZeros || false;
		ignoreBeginZero = ignoreBeginZero || false;
		decimalNumber = decimalNumber || 2;
		keepZero = keepZero || false;
		var a = parseFloat(d);
		if (!isNaN(a)) {
	 		var pow = Math.pow(10, decimalNumber);
			a = (Math.round(a*pow)/pow);
		} else {
			a = 0;
		}
		r = a.toFixed(decimalNumber);

		if(ignoreEndZeros === 'true' || ignoreEndZeros === true) {
			for(var i = decimalNumber - 1; i >= 0; i --) {
				if(a == a.toFixed(i)) {
					r = a.toFixed(i);
				}
			}
		}
		if(ignoreBeginZero === 'true' || ignoreBeginZero === true) {
			if(a > -1 && a < 1) return  r.replace('0.', '.');
		}
		return notNull ? r : (a == 0 && !keepZero ? "" : r);
	},
	
	commonValidateUnique : function(propertyName, elementId, type, corporation, args, fieldType) {//fieldType for special validate component type, e.x. SearchingSelect
		var me = this;
		args = args || {};
		var newValue = '';
		if(fieldType == 'SearchingSelect'){
			newValue = CUtils.getSSValue(elementId);
		}else{
			newValue = $(elementId).value;
		}
		if(Strings.isEmpty(newValue)) return;
			
		var UniqueUrl = args['url'];
		var propType = type || 'string';
		var cor = corporation || '';
		if(Strings.isEmpty(UniqueUrl)) {
			UniqueUrl = document.forms[0].action  + "isUnique/" + propType;
		}
		var params = {propertyName : propertyName, newValue : newValue, elementId : elementId, corporation: cor};
		var otherParams = args.otherParams || {};
		Ext.apply(params, otherParams);
		Ext.Ajax.request ({
			url : UniqueUrl,
			params : params,
			success : args['callBack'] ? 
					function(response, options) {
						PAction[args['callBack']](response, options);
					} 
					: 
					function(response, options) {
						var returnVal = CUtils.jsonDecode(response.responseText);
						var elementId = returnVal.elementId;
						var msgLabel = $('label_' + elementId); 

				        me.removeFieldErrorCls(elementId);
				        me.removeTooltip(elementId);
				        delete me.globalValidate[elementId]['unique'];
				        
					    if(returnVal && !returnVal.isUnique) {
					    	if(fieldType != 'SearchingSelect'){
					    		me.globalValidate[elementId]['unique'] = "true";
					    	}
					        me.markErrorFields([{fieldname: elementId, message: msgLabel.innerHTML + " is not unique.", arg:null}]);
					    }else{
					    	if(fieldType == 'SearchingSelect'){
					    		CUtils.setSSValue(elementId,returnVal.value,returnVal.text);
					    	}
					    }
					}
		});
	},

	commonComponentValidate : function() {
		var msgarray = new Array();
		for(var p in this.globalValidate) {
			var param = this.globalValidate[p];
			var arr;
			if(param && !Strings.isEmpty(param.id) && this.validators[param.type]) {
				if(this.ignoredFields[param.id] === true) continue;
				
				if(!Strings.isEmpty(param.notNull) && param.notNull.toString() == 'true'){
					if(param.type == 'grid') {
						arr = this[this.validators[param.type]['gridNotNull']](param.grid);
					} else {
						arr = this[this.validators[param.type]['notNull']](param.id, param.label);
					}
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.dataType) && this.validators[param.type][param.dataType]){
					arr = this[this.validators[param.type][param.dataType]](param.id, param.label);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.notGT) && param.notGT == 'true') {
					arr = this[this.validators[param.type]['notGT']](param.id, param.label);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.decimalNumber)) {
					arr = this[this.validators[param.type]['decimalNumber']](param.id, param.label, param.decimalNumber);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.minValue)) {
					arr = this[this.validators[param.type]['minValue']](param.id, param.label, param.minValue);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.maxValue)) {
					arr = this[this.validators[param.type]['maxValue']](param.id, param.label, param.maxValue);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.dataType) && CUtils.isTrueVal(param.positiveNumber)) {
					arr = this[this.validators[param.type]['positiveNumber']](param.id, param.label);
				    msgarray.addAll(arr);
				}
				if(!Strings.isEmpty(param.unique) && param.unique == 'true') {
					arr = this[this.validators[param.type]['unique']](param.id, param.label, param);
					msgarray.addAll(arr);
				}
			} else if(Ext.isArray(param)) {
				arr = this.validateGridField(param);
				msgarray.addAll(arr);
			}
		}
		return msgarray;
	},
	
	processValidateMessages : function(ida , callback){
		if(!ida || ida.length == 0) {
			return;
		}
		var msg = PRes["Alert.WeCannotProcessYourRequest"] + "<br><br>";
		for (var i=0,l=ida.length; i < l; i++) {
			//shoudl combine the msg with arg later on
			//%propname%  %[arridx]% in msg, going to bind with stuff in arg.
			var msgI = ida[i].message;
			var arg = ida[i].arg;
			if (arg) {
				if(typeof(arg) == "string") {
					msgI = msgI.replace(new RegExp("%1","g"), arg);
				} else {
					//array
					for(var x=0,y=arg.length;x<y;x++) {
						msgI = msgI.replace(new RegExp("%"  + (x+1),"g"), arg[x]);
					}
				}
			}
			msg += "\t" + msgI + "<br>";
		}
		//Ext.MessageBox.alert("Warning", msg);
		CUtils.warningAlert(msg , callback);
		
		try {
//			this.processHighlightFieldRow(ida);
			this.markErrorFields(ida);
		} catch (ex) {}
	},
	
	markErrorFields : function(errors){
		var tooltips = [];
		var me = this;
		Ext.each(errors, function(item,index) {
			var elm = Ext.get(item.fieldname);
			if(!elm){
				elm = Ext.getCmp(item.fieldname).bodyEl;
			}
			if(elm){
				elm.addCls('fieldError');
			}
			
			var tooltipId = 'tooltip_' + item.fieldname;
			var index = me._tooltipExisted(tooltips , tooltipId);
			if(index < 0){
				tooltips.push({
					id : tooltipId,
					target: item.fieldname,
					anchor : 'left',
//					autoShow : true,
					anchorToTarget : true,
//					autoHide : false,
					width : 200,
			        html: '<p class="tipErrorMsg">' + item.message + '</p>'
				});
			}else{
				tooltips[index].html += '<p class="tipErrorMsg">' + item.message + '</p>';
			}
		});
		
		Ext.each(tooltips, function(config) {
	        var tip = Ext.create('Ext.tip.ToolTip', config);
	        tip.addCls('fieldError');
	    });
	},
	
	_tooltipExisted : function(tooltips , tooltipId){
		var index = -1;
		
		if(!tooltips) return index;
		
		for(var i = 0 ; i < tooltips.length ; i++){
			if(tooltips[i].id == tooltipId){
				index = i;
				break;
			}
		}
		return index;
	},
	
	removeAllErrorFields : function() {
		var me = this;
		var fields = Ext.query('.fieldError');
		Ext.each(fields, function(item, index) {
			me.removeFieldErrorCls(item.id);
		});
		
		var tips = Ext.ComponentQuery.query('tooltip');
		Ext.each(tips, function(item, index) {
			me.removeTooltip(item.id);
		});
	},
	removeFieldErrorCls : function(itemId) {
		var elm = Ext.get(itemId);
		if(!elm) {
			elm = Ext.getCmp(itemId).bodyEl;
		}
		if(elm){
			elm.removeCls('fieldError');
		}
	},
	removeTooltip : function(itemId) {
		var elm = null;
		if(itemId.indexOf('tooltip_') == 0){
			elm = Ext.getCmp(itemId);
		}else{
			elm = Ext.getCmp('tooltip_' + itemId);
		}
		if(elm) {
			elm.destroy();
		}
	},
	
	processHighlightFieldRow : function(ar) {
	    for (var i = 0; i < ar.length; i++) {
	        var elm =$(ar[i].fieldname) ? $(ar[i].fieldname) : $('VAL_' + ar[i].fieldname);
			if (elm && elm != null && elm.tagName != "DIV") {
				if(elm.parentNode.className.indexOf("x-form-field") == -1) {
					elm = elm.parentNode;
				}
				if(typeof(elm) != 'undefined') {
					Ext.get(elm).highlight("ffff66", {
						attr: "backgroundColor",
						duration: 10000
					});
				}
			}
	    }
	},
////////////////////////////////////////////////////////////////	
	formateData : function(args) {
		var me = this;
		
		if(this.formaters[args["dataType"]]) {
			if(args["type"] && args["type"] == "minMax") {
				this[this.formaters[args["dataType"]]](args["id"] + "Min", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
				this[this.formaters[args["dataType"]]](args["id"] + "Max", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
			} else if(args["type"] && args["type"] == "inOutOn") {
				this[this.formaters[args["dataType"]]](args["id"] + "In", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
				this[this.formaters[args["dataType"]]](args["id"] + "Out", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
			} else {
				this[this.formaters[args["dataType"]]](args["id"], args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"], args["keepZero"]);
			}
		}
	},
	
	formatersInteger : function(id, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero) {
		if($(id) && !Strings.isEmpty($(id).value)) {
			$(id).value = parseFloat($(id).value).toFixed(0);
		}
	},
	formatersFloat : function(id, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero, keepZero) {
		if($(id) && !Strings.isEmpty($(id).value)) {
			notNull = notNull || false;
			ignoreEndZeros = ignoreEndZeros || false;
			ignoreBeginZero = ignoreBeginZero || false;
			keepZero = keepZero || false;
			decimalNumber = decimalNumber || 2;
			$(id).value = this.formatFloat($(id).value, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero, keepZero);
		}
	},
/////////////////////////////////////////////////////////////////	
	isFloat : function(val) {
		if (Strings.isEmpty(val)) return false;
		return (val == String(val).match(new RegExp("[+-]{0,1}\\d*\\.{0,1}\\d*"))[0]);
	},
	
	isBankAcount : function(val){
		var reg = /^\d{19}$/g;
		return reg.test(val);
	},
	
	isInteger : function (val) {
	if (Strings.isEmpty(val)) return false;
		return val==parseInt(val,10);
	},
	isPositiveFloat : function (val){
		return (this.isFloat(val) && (parseFloat(val) >= 0));
	},
	isPositiveFloatWithoutZero : function (val){
		return (this.isFloat(val) && (parseFloat(val) > 0));
	},
	isPositiveIntegerWithoutZero : function (val){
		if (this.isInteger(val) && (parseInt(val) > 0)){
			if(typeof val == "number"){
				return true;
			} else if (val.indexOf('.')>=0){
				return false;
			} else return true;
		}else return false;
	},
	isPositiveNumber : function (val) {
		return this.isPositiveFloatWithoutZero(val) || this.isPositiveIntegerWithoutZero(val);
	},
	
	isValidTime : function (val){
		if(Strings.isEmpty(val)) return true;
		var reg = new RegExp("^([0-1][0-9]|[2][0-3])((:[0-5][0-9]){1,2})$");
		if(reg.test(val)){
			return true;
		} else {
			return false;
		}
	},
	isPositiveInteger : function (val){
		if (this.isInteger(val) && (parseInt(val) >= 0)){
			if(typeof val == "number"){
				return true;
			} else if (val.indexOf('.')>=0){
				return false;
			} else return true;
		}else return false;
	},
/////////////////////////////////////////////////////////////////
	validatePositiveValue : function(value, helpStr){
		if(this.isFloat(value) && (parseFloat(value) >= 0)) {
			value = parseFloat(value).toFixed(2);
			return true;
		}
		
		alert(helpStr + " is expecting a positive number.");
		return false;
	},
	
	validateFloatDecimalNumber : function(value, decimalNumber) {
		var reg = new RegExp("^[0-9]+(.[0-9]{1," + decimalNumber + "})?$");
		return this.isFloat(value) && reg.test(value);
	},

	validateFloatDecimal : function(value, decimal){
		if(this.isFloat(value)) {
			var valueStr = value.toString();
			var subFloat = valueStr.substring(0,valueStr.indexOf(".")+1+decimal);
			if(value == parseFloat(subFloat)){
				return true;
			}
		}
		return false;
	},

	validatePositivePercent : function(percent){
		if((this.isFloat(percent) && (parseFloat(percent) >= 0) && (parseFloat(percent) <= 100))) {
			value = parseFloat(percent).toFixed(2);
			return true;
		}
		return false;
	},

	validatePositivePercentValue : function(value, helpStr){
		if(this.validatePositivePercent(value)) {
			return true;
		}
		
		alert(helpStr + " must be between 0 and 100.");
		return false;
	},

	validatePercent : function(percent){
		if((this.isFloat(percent) && (parseFloat(percent) >= -100) && (parseFloat(percent) <= 100))) {
			value = parseFloat(percent).toFixed(2);
			return true;
		}
		return false;
	},

	verifyNumString : function(numString){
		var firstDot = true;
		//TODO: can use regex base checking
		for (var i = 0; i <= numString.length -1 ; i++){ //verifies for every element of the String if its a character or number.
			if(numString.charAt(i)== '.' && firstDot == false){ //if there is more then 1 dot in the numString the string must be rejected.
				return false;
			}
			if(isNaN(parseInt(numString.charAt(i))) && numString.charAt(i)!= '.'){
				return false;
			}
			if(numString.charAt(i)== '.'){
				firstDot = false;
			}
		}
		return true;
	},

	validateStringDuration : function(stringDuration, helpStr) {
		stringDuration = stringDuration.trim();
		var numString = stringDuration.substring(0,stringDuration.length - 1);
		var periodUnit = stringDuration.charAt(stringDuration.length-1).toUpperCase();
		var validString = "DWMQY";
		//(validString.indexOf(periodUnit) < 0) == true	: invalid periodUnit
		//(validString.indexOf(periodUnit) < 0) == false: valid periodUnit
		//stringDuration.indexOf(".")<0 added by AF to force interger values
		if((numString.length != 0 && verifyNumString(numString) && !(validString.indexOf(periodUnit) < 0)) && stringDuration.indexOf(".")<0 || stringDuration == ''){
			return true;
		}
		alert("'" + stringDuration + "' is not a valid "+helpStr+".\nThe "+helpStr+" should be composed of a positive integer followed\nby a valid period unit where a period unit can be:\n 	D for days\n 	W for weeks\n 	M for months\n 	Q for quarters\n 	and Y for Years.");
		return false;

	},

	validateNonPositiveStringDuration : function(stringDuration, helpStr) {
		stringDuration = stringDuration.trim();
		var numString = stringDuration.substring(0,stringDuration.length - 1);
		var periodUnit = stringDuration.charAt(stringDuration.length-1).toUpperCase();
		var validString = "DWMQY";
		if((numString.length != 0 && this.isFloat(numString) && !(validString.indexOf(periodUnit) < 0)) || stringDuration == ''){
			return true;
		}
		alert("'" + stringDuration + "' is not a valid "+helpStr+".\nThe "+helpStr+" should be composed of a positive number followed\nby a valid period unit where a period unit can be:\n 	D for days\n 	W for weeks\n 	M for months\n 	Q for quarters\n 	and Y for Years.");
		return false;
	},

	isDateAfter : function(startDate,currentDate){
		return this.compareDates(startDate,currentDate,true);
		
	},
	
	isDateStrictlyAfter : function(startDate,currentDate){
		return compareDates(startDate,currentDate,false);
		
	},
	
	compareDates :function(startDate,endDate,bSuperiorOrEqual){
		//retire this soon, ugly code, this guy need to spank.
		
		//format of the date 2005-6-23
		//var startDate = startingDate.edit.value;
		var startMD = startDate.substring(startDate.indexOf("-")+1,startDate.length);
		//var endDate = endingDate.edit.value;
		var endMD = endDate.substring(endDate.indexOf("-")+1,endDate.length);
		var startY = startDate.substring(0,4);
		var endY = endDate.substring(0,4);
		var startM = startMD.substring(0,startMD.indexOf("-"));
		var endM = endMD.substring(0,endMD.indexOf("-"));
		var startD = startMD.substring(startMD.indexOf("-")+1,startMD.length);
		var endD = endMD.substring(endMD.indexOf("-")+1,endMD.length);
		var start = new Date(startY, startM, startD);
		var end = new Date(endY, endM, endD); 
		
		if(bSuperiorOrEqual){
		   if(end < start) 
		   	{ 
		      return false; 
		   	}else{
		   		return true;
		   	}
	   	}else{
	   		if(end <= start) 
		   	{ 
		      return false; 
		   	}else{
		   		return true;
		   	}
	   	
	   	}
	},
	
	compareDateTime : function(date1,date2){
		var d1 = date1.substring(0,date1.indexOf("T"));
		var t1 = date1.substring(date1.indexOf("T")+1,date1.length);
		var d2 = date2.substring(0,date2.indexOf("T"));
		var t2 = date2.substring(date2.indexOf("T")+1,date2.length);
		return (this.compareDates(d1,d2,false) && this.compareTimes(t1,t2,false));
	},
	
	compareTimes : function(t1,t2,bSuperiorOrEqual){
		if(this.validateTime(t1) && this.validateTime(t2)){
			t1=t1.split(':');
			var h1 = parseInt(t1[0],"10");
			var m1 = parseInt(t1[1],"10");
			var s1 = 0;
			if (t1.length == 3) {
				s1 = parseInt(t1[2],"10");
			}
			
			t2=t2.split(':');
			var h2 = parseInt(t2[0],"10");
			var m2 = parseInt(t2[1],"10");
			var s2 = 0;
			if (t2.length == 3) {
				s2 = parseInt(t2[2],"10");
			}
			if(bSuperiorOrEqual){
				return ((h2>h1) || (h2==h1&&m2>m1) || (h2==h1&&m2==m1&&s2>=s1));
			}else{
				return ((h2>h1) || (h2==h1&&m2>m1) || (h2==h1&&m2==m1&&s2>s1));
			}
			
		}
		return false;

	},
	validatePostCode : function(str, country) {
		if(Strings.isEmpty(str) || Strings.isEmpty(country)) return true;
		
		if(country == 'USA') {
			return (/^\d{5}(-\d{4})?$/.test(str));
		} else if(country == 'CAN') {
			return (/^[A-Z]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/.test(str));
		}
		return true;
	},
	validateEmail : function(str) {
		/*
	     var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
	     
	     var regex = new RegExp(emailReg);
	    
	     return regex.test(src);
	     
		*/
		var r1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
		var r2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
		return (!r1.test(str) && r2.test(str));
	},
	validateMobile : function (str) {
		var r = new RegExp("/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/");
		return r.test(str);
	},
	validatePhone : function(str) {
		var r = new RegExp("^(?!-)(?!.*?-$)[-0-9]+$");
		return r.test(str);
	},
	validateNumAndChar : function(str) {
		var r = new RegExp("^[A-Z0-9]+$");
		return r.test(str);
	},
	validateNum : function(str) {
		var r = new RegExp("^(?!0)[0-9]+$");
		return r.test(str);
	},
	validatePDFType : function(str){
		var r = new RegExp(".+\\.(pdf|PDF)");
		return r.test(str);
	},
	validatePDFAndImangeType : function(str){
		var r = new RegExp(".+\\.(pdf|PDF|jpg|bmp|png|JPG|BMP|PNG)");
		return r.test(str);
	},
	validateImageType : function(str){
		var r = new RegExp(".+\\.(jpg|bmp|png|JPG|BMP|PNG)");
		return r.test(str);
	},
	validateAttachmentType : function(str){
		var r = new RegExp(".+\\.(ZIP|zip|rar|RAR|7z|png|JPG|jpg|bmp|BMP|PNG|doc|DOC|docx|DOCX|pdf|PDF)");
		return r.test(str);
	},
	//validate file type,if it's diffrent,return false
	//fileName and fileType are the arguments,
	//important: we can extend the file type list, what we need to do is only putting the file type into the list.
	//example: extend image list, add "jiff", just append "jiff" into imageList
	fileTypeValidate : function(fileName,fileType){

		//get file name and extention name
		//var fileName=$("PB__FileInput").value;
		var fileExName=this.getFileExName(fileName);
		fileExName=fileExName.toLowerCase();
		
		//define file type list
		//image file list
		var imageList=new Array("jpg","gif","jpeg","bmp","png");


		//text file list
		var textList=new Array("txt","log","text","csv");

		
		//binary file list
		var binList=new Array("exe","swf","zip","rar");
		
		//other file list
		var oList=new Array("doc","docx","xls","xlsx","ppt","pptx","pdf","odt","ods","odp","zip","rar");
		
		//image file validate
		if(fileType=="IMAGE"){
			for(var i=0;i<imageList.length;i++){
				if(imageList[i].toString()==fileExName){
					return true;

				}
			}
		//text file validate
		}else if(fileType=="TEXT_FILE"){
			for(var i=0;i<textList.length;i++){
				if(textList[i].toString()==fileExName){
					return true;
				}
			}
		//binary file validate
		}else if(fileType=="BINARY_FILE"){
			for(var i=0;i<textList.length;i++){
				if(textList[i].toString()==fileExName){
					return false;
				}
			}
			return true;
		}else if(fileType=="PRODUCT_BROCHURE" || fileType=="ASSEMBLY_LIST" || fileType=="QUALITY_ASSURANCE" ){
			for(var i=0;i<oList.length;i++){
				if(oList[i].toString()==fileExName){
					return true;
				}
			}	
		}
		
		return false;
	},

	//get one file's extention name, filename is the argument
	getFileExName : function(fileName){
		var dotIndex=fileName.lastIndexOf(".");
		return fileName.substring(dotIndex+1);
	},
	
	validateTime : function(n){

		//HT: 2007-03-17, this is a function that pretty bad written
		//it is more belong to VUtil 
		n=n.split(':');
		if (n.length >3) 
		return false;
		
		var hour = parseInt(n[0],10);
		var minute = parseInt(n[1],10);
		var second = 0;
		if (n.length == 3) 
			second = parseInt(n[2],10);
		if (isNaN(hour) || isNaN(minute) || isNaN(second))
			return false;
			
		if (hour<0||hour>=24) 
			return false;
		if (minute<0||minute>=60)
			return false;
		if (second<0||second>=60)
			return false;
		
		return true;
	},
	
	/**
	 * validate array element uniqueness
	 * if it is not unique, return false
	 */
	validateArrayValueUnique : function(arr){
	    var i = 0, j = 0;
	    while (undefined !== arr[i]){
	        j = i + 1;
	        while(undefined !== arr[j]){
	            if (arr[i] == arr[j]) {
	               return false;
	            }
	            ++j;
	        }
	        ++i;
	    }
	    return true;
	},
	
	/**
	 * validate records data unique base on colnames
	 * @param records record[], like extGrid.getStore().data.getRange();
	 * @param colNames array, like ["colName1","colName2"];
	 */
	validateUniqueRecords : function(grid, colNames, isNot) {
		var msgarray = new Array();
		if(!colNames || colNames.length == 0) return msgarray;
		var records = grid.getStore().data.getRange();
		if(records.length <= 1) return msgarray;

		var values = new Array();
		var gridName = !Strings.isEmpty(PRes[grid.id])?  PRes[grid.id] + " " : "";
		for(var i = 0; i < records.length; i ++) {
			var value = this.getColumnsCombineValue(records[i], colNames);
			var sameLineNo;
			if(isNot) {
				sameLineNo = this.isCombineValuesNotExist(values, value);
			} else {
				sameLineNo = this.isCombineValuesExist(values, value);
			}
			if(sameLineNo > -1) {
				var label = this.getColumnsCombineLabel(grid, colNames);
				var line1 = sameLineNo + 1;
				var line2 = i + 1;
				if(isNot) {
					msgarray.push({fieldname: grid.id, message: gridName + PRes["Column"] + label + PRes["InLine"] + line1 + PRes["AndLine"] + line2 + PRes["Line"] + PRes["SameValue"], arg: null});
				} else {
					msgarray.push({fieldname: grid.id, message: gridName + PRes["Column"] + label + PRes["InLine"] + line1 + PRes["AndLine"] + line2 + PRes["Line"] + PRes["UniqueValue"], arg: null});
				}
			}
			values.push(value);
		}
		
		return msgarray;
	},
	getColumnsCombineLabel : function(grid, colNames) {
		var label = '[';
		for(var i = 0; i < colNames.length; i ++) {
			var name = colNames[i];
			if(label != '[') label += ', ';
			label += GUtils.getHeader(name, grid);
		}
		label += ']';
		return label;
	},
	getColumnsCombineValue : function(record, colNames) { // toUpperCase(); toLowerCase();
		var value = '';
		for(var i = 0; i < colNames.length; i ++) {
			var name = colNames[i];
			value += '|';
			value += record.get(name);
			value += '|';
		}
		return value.toUpperCase();
	},
	isCombineValuesExist : function(values, value) {
		for(var i = 0; i < values.length; i ++) {
			var v = values[i];
			if(v ==  value)return i;
		}
		return -1;
	},
	isCombineValuesNotExist : function(values, value) {
		for(var i = 0; i < values.length; i ++) {
			var v = values[i];
			if(v ==  value) {
				continue;
			} else {
				return i;
			}
		}
		return -1;
	},
	isCellValid : function(col, row) {
    	var grid = PApp.grid;
        if(!grid.columns[col].editable) {
            return true;
        }
        var record = grid.store.getAt(row);
        if(!record) {
            return true;
        }
        var field = grid.columns[col].getEditor(record);
        if(!field) {
            return true;
        }
        var xtype = field.getXType();
        // only support textfield and numberfield
        if(xtype && (xtype == 'textfield' || xtype == 'numberfield')){
        	field.setValue(record.data[field.name]);
            field.validateOnSave = true;
            return field.isValid();
        }
        return true;
	},
	isValid : function(editInvalid) {
    	var grid = PApp.grid;
        var cols = grid.columns.length;
        var rows = grid.store.getCount();
        var r, c;
        var valid = true;
        for(r = 0; r < rows; r++) {
            for(c = 0; c < cols; c++) {
                valid = this.isCellValid(c, r);
                if(!valid) {
                    break;
                }
            }
            if(!valid) {
                break;
            }
        }
        if(editInvalid && !valid) {
        	grid.plugins[0].startEditByPosition({row: r, column: c});
        }
        return valid;
	},
	addKeyDownEvent : function(obj) {
		if (obj.dataType == 'Float' || obj.dataType == 'Integer') {
			if($(obj.id)) {
				if (Ext.isIE) {
					$(obj.id).attachEvent("onkeydown", VUtils.numberInput);
				} else {
					$(obj.id).addEventListener("keydown", VUtils.numberInput);
				}
			}
		}
	},
	numberInput : function(e) {
		e = e || window.event;
		var key = e.keyCode;
		var isOK = (key >= 48 && key <= 57) || (key >= 96 && key <= 105)
			|| key == 8 || key == 9 || key == 13 || key == 35 || key == 189 
			|| key == 36 || key == 37 || key == 39 || key == 46 
			|| key == 45 || key == 190 || key == 188 || key == 109 || key == 110 || key == 190;
		
		if (!isOK) {
			if( e.preventDefault ) { 
				e.preventDefault(); 
			}
			e.returnValue = false;
		}
	}
    ///////////////////////////////////////////////////////////////////
});

Ext.apply(Ext.form.field.VTypes, {
	gridColumnUnique: function(v, field) {
		var grid = Ext.getCmp(GRID_ID);
		var store = grid.getStore();
		var records = store.getRange();
		if(field.validateOnSave){
			var values = [];
			for(var i=0;i<records.length;i++){
				var record = records[i];
				values.push(record.get(field.name));
			}
			var count = 0;
			for(var i=0;i<values.length;i++){
				if(values[i] == v) count++;
				if(count > 1) return false;
			}
		} else {
			var record = grid.getSelectionModel().getSelection()[0];
			if(record){
				for(var i=0;i<records.length;i++){
					if(records[i].id == record.id)continue;
					if(records[i].get(field.name)==v){
						return false;
					}
				}
			}
			
		}
		field.validateOnBlur = false;
    	return true;
    },
    gridColumnUniqueText: 'This column value must be unique.'
});