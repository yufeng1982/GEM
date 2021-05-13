
Ext.define('ERP.CommonUtils' , {
	
	mixins : {
		treeInfoLog : 'ERP.ui.TreeInfoLog'
	},
	
	DEF_SCALE : 2,
	DEF_MONEY_SCALE : 2,//default 2 for nova
	CALCULATION_SCALE : 8,
	disableCmp : function(cmpId, disabled) {
		disabled = disabled === false ? false : true;
		var cmp = this.getExtObj(cmpId);
		if(!cmp) {
			if(cmpId.startWith('H_')) {
				cmp = this.getExtObj(cmpId.removeFirstStr('H_'));
			} else if(cmpId.endWith('Date-inputEl')) { // HACK for Date field
				cmp = this.getExtObj(cmpId.removeLastStr('-inputEl'));
			}
		}
		if(cmp) {
			cmp.setDisabled(disabled);
		} else {
			cmp = document.getElementById(cmpId);
			if(cmp) {
				if(cmp.type == 'hidden'){
					return;
				}
				cmp.disabled = disabled;
				if(cmp.type == 'checkbox') {
					var hiddenCmps = document.getElementsByName('_' + cmpId);
					if(hiddenCmps && hiddenCmps.length == 1) hiddenCmps[0].disabled = disabled;
				}
			}
		}	
	},
	hideField : function (cmpId, hidden) {
		if($("fr_" + cmpId)) $("fr_" + cmpId).style.display = hidden === false ? '' : 'none';
	},
	readOnlyCmp : function(cmpId, readOnly) {
		readOnly = readOnly === false ? false : true;
		var cmp = this.getExtObj(cmpId);
		if(!cmp) {
			if(cmpId.startWith('H_')) {
				cmp = this.getExtObj(cmpId.removeFirstStr('H_'));
			}
		}
		if(cmp) {
			cmp.setReadOnly(readOnly);
		} else {
			if(console){
				console.log(cmpId);
			}
			cmp = document.getElementById(cmpId);
			if(console){
				console.log(cmp);
			}
			if(cmp) {
				cmp.readOnly = readOnly;
			}
		}
	},
	getExtObj : function (cmpId) {
		return Ext.getCmp(cmpId);
	},
	// S<->Select(comboBox)
	getS : function (cmpId) {
//		return this.getExtObj('Comb_' + cmpId);
		return this.getExtObj(cmpId);
	},
	// S<->Select(comboBox)
	getSValue : function (cmpId) {
		return this.sv(this.getS(cmpId).getValue());
	},
	getSText : function (cmpId) {
		return this.sv(this.getS(cmpId).getRawValue());
	},
	// S<->Select(comboBox) normally, you don't need pass the text parameter for this kind of combobox
	setSValue : function (cmpId, value, text) { 
		this.getS(cmpId).setSelectValue(value, text);
	},
	// S<->Select(comboBox)
	clearSValue : function (cmpId) {
		this.getS(cmpId).clearValues();
	},
	disableS : function (cmpId, disabled) {
		disabled = disabled === false ? false : true;
		this.getS(cmpId).setDisabled(disabled);
	},
	readOnlyS : function(cmpId, readOnly) {
		readOnly = readOnly === false ? false : true;
		this.getS(cmpId).setReadOnly(readOnly);
	},
	// SS<->searchingSelect
	getSS : function (cmpId) {
		return this.getExtObj(cmpId);
	},
	// SS<->searchingSelect
	getSSValue : function (cmpId) {
		if(this.getSS(cmpId)){
			if(this.getSS(cmpId).getXType() == 'findUnique' || this.getSS(cmpId).getXType() == 'erpsearchingselect') {
				return this.sv(this.getSS(cmpId).getSelectValue());
			}
			return this.sv(this.getSS(cmpId).getValue());
		}
		return null;
		
	},
	// SS<->searchingSelect
	getSSText : function (cmpId) {
		return this.sv(this.getSS(cmpId).getRawValue());
	},
	// SS<->searchingSelect
	setSSValue : function (cmpId, value, text) {
		this.getSS(cmpId).setSelectValue(value, text);
	},
	// SS<->searchingSelect
	clearSSValue : function (cmpId) {
		// TODO - may don't have this method in current extjs version. - Lei
		this.getSS(cmpId).clearValues();
	},
	clearSSValAndCache :function(cmpId){
		this.clearSSValue(cmpId);
		delete this.getSS(cmpId).lastQuery;//this avoid the cache problem.
	},
	clearSSCache : function(cmpId){
		delete this.getSS(cmpId).lastQuery;
	},
	disableSS : function (cmpId, disabled) {
		disabled = disabled === false ? false : true;
		if(this.getSS(cmpId)){
			this.getSS(cmpId).setDisabled(disabled);
		}
	},
	readOnlySS : function(cmpId, readOnly) {
		readOnly = readOnly === false ? false : true;
		this.getSS(cmpId).setReadOnly(readOnly);
	},
	getLabel : function(id) {
		return document.getElementById("label_" + id);
	},
	getTextNi : function(id) {
		return document.getElementById(id + "_value");
	},
	getTextNiValue : function (id) {
		return this.sv(this.getTextNi(id).innerHTML);
	},
	setTextNiValue : function (id, value) {
		this.getTextNi(id).innerHTML = this.sv(value);
	},
	getCheckBoxVal : function(id){
		return document.getElementById(id).checked;
	},
	setCheckBoxVal : function(id, val){
		document.getElementById(id).checked = val;
	},
	getDate : function (cmpId) {
		return this.getExtObj(cmpId);
	},
	getDateValue : function (cmpId) {
		return this.getDate(cmpId).getValue();
	},
	getDateText : function (cmpId) {
		return this.getDate(cmpId).getRawValue();
	},
	setDateValue : function (cmpId, value) {
		if(!Strings.isEmpty(value) && value instanceof String && value.indexOf("T") > 0) {
			value = value.substring(0, value.indexOf("T"));
		}
		this.getDate(cmpId).setValue(value);
	},
	clearDateValue : function (cmpId) {
		this.getDate(cmpId).setValue("");
	},
	getTime : function (cmpId) {
		return this.getExtObj(cmpId);
	},
	getTimeValue : function (cmpId) {
		return this.getTime(cmpId).getValue();
	},
	setTimeValue : function (cmpId, value) {
		this.getTime(cmpId).setValue(value);
	},
	clearTimeValue : function (cmpId) {
		this.getTime(cmpId).setValue("");
	},
	getColor : function (cmpId) {
		return this.getExtObj(cmpId);
	},
	getColorValue : function (cmpId) {
		return this.getColor(cmpId).getValue();
	},
	getFiscalMonthIndex: function(id){
		var index = document.getElementById("FDCNT_"+id).innerHTML;
		return index;
	},
	setColorValue : function(cmpId, value) {
		this.getColor(cmpId).setValue(value);
	},
	clearColorValue : function (cmpId) {
		this.getColor(cmpId).setValue("");
	},
	sv : function(value) {
		if(typeof value == "undefined" ) return "";
		return value || !isNaN(value) ? value : "";
	},
	dv : function(value) {
		return value ? parseFloat(value) : 0.0;
	},
	iv : function(value) {
		return value ? parseInt(value) : 0;
	},	
	bv : function(value) {
		return  (/true/i.test(value));
	},
	add : function(a,b,c,d,e) {
		var value = this.dv(a) + this.dv(b);
		if(!Strings.isEmpty(c)) {
			value = value + this.dv(c);
		}
		if(!Strings.isEmpty(d)) {
			value = value + this.dv(d);
		}
		if(!Strings.isEmpty(e)) {
			value = value + this.dv(e);
		}
		return this.dv(VUtils.formatFloat(value, this.CALCULATION_SCALE, true, true, false, true));
	},
	sub : function(a,b,c,d,e) {
		var value = this.dv(a) - this.dv(b);
		if(!Strings.isEmpty(c)) {
			value = value - this.dv(c);
		}
		if(!Strings.isEmpty(d)) {
			value = value - this.dv(d);
		}
		if(!Strings.isEmpty(e)) {
			value = value - this.dv(e);
		}
		return this.dv(VUtils.formatFloat(value, this.CALCULATION_SCALE, true, true, false, true));
	},
	mul : function(a,b,c,d,e) {
		var value = this.dv(a) * this.dv(b);
		var len = arguments.length;
		if(len > 2) {
			value = value * this.dv(c);
		}
		if(len > 3) {
			value = value * this.dv(d);
		}
		if(len > 4) {
			value = value * this.dv(e);
		}
		return this.round(value, this.CALCULATION_SCALE);
	},
	div : function(a,b,c,d,e) {
		var value = this.dv(a) / this.dv(b);
		var len = arguments.length;
		if(len > 2) {
			value = value / this.dv(c);
		}
		if(len > 3) {
			value = value / this.dv(d);
		}
		if(len > 4) {
			value = value / this.dv(e);
		}
		return this.round(value, this.CALCULATION_SCALE);
	},
	round : function(value, scale) {
		if(Strings.isEmpty(value)) {
			return 0.0;
		}
		if(Strings.isEmpty(scale)) {
			scale = this.DEF_SCALE;
		}
		value = this.dv(value);
		
		var a = parseFloat(value);
 		var pow = Math.pow(10, scale);
		return (Math.round(a*pow)/pow).toFixed(scale);
	},
	floor : function(value, scale) {
		if(Strings.isEmpty(value)) {
			return 0.0;
		}
		if(Strings.isEmpty(scale)) {
			scale = 0;
		}
		value = this.dv(value);
		var a = parseFloat(value);
 		var pow = Math.pow(10, scale);
		return this.round(this.div(Math.floor(a*pow), pow), scale);
	},
	roundMoney : function(value, scale) {
		if(Strings.isEmpty(scale)) {
			scale = this.DEF_MONEY_SCALE;
		}
		return this.round(value, scale);
	},
	jsonEncode : function(o) {
		if(Ext.encode) {
			return Ext.encode(o);
		} else {
			return Ext.util.JSON.encode(o);
		}
	},
	jsonDecode : function(o) {
		if(Ext.decode) {
			return Ext.decode(o);
		} else {
			return Ext.util.JSON.decode(o);
		}
	},
	isObjectEmpty : function(obj) {
		if(!Strings.isEmpty(obj)) {
		    for(var prop in obj) {
		        if(obj.hasOwnProperty(prop))
		            return false;
		    }
		}
	    return true;
	},
	htmlDecode : function(iStr) {
		return Ext.htmlDecode(iStr);
	},
	formatDate : function(date, format) {
		if(date){
			return Ext.Date.format(date, format);
		}
		return "";
	},
	// new format, but don't use it for now - Ryan
//	formatDate : function(date, format) {
//		if(date) {
//			var strDate = Ext.Date.format(date, format);
//			if(Strings.isEmpty(strDate)) {
//				var regex = /[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,2}/; 
//				if( regex.test(date) ) {
//					var noArr = date.split("-");
//					if(noArr.length == 3) {
//					    var year = noArr[0] || '';
//					    var month = noArr[1] || '';
//					    var day = noArr[2] || '';
//					    for(var i = 4; i > year.length; i --) {
//					    	year = year + "0";
//					    }
//					    for(var i = 2; i > month.length; i --) {
//					    	month = "0" + month;
//					    }
//					    for(var i = 2; i > day.length; i --) {
//					    	day = "0" + day;
//					    }
//					    strDate = year + "-" + month + "-" + day;
//					}
//				}
//				return strDate;
//			} else {
//				return strDate;
//			}
//		}
//		return "";
//	},
	////////////////////////////////////Utils for nova start ////////////////////////////////////////////////////////////////////////
	calcTubeLength : function(quantity, dimD) {
		return this.floor(this.div(this.mul(quantity, dimD), 12), 2);// in. to ft.
	},
	calcTubeWeight : function(factor, length) {
		return this.floor(this.mul(factor, length), 0);
	},
	calcSheetPlateWeight : function(isAlternativeFormula, quantity, factor, dimA, dimB, dimC) {
		if(this.isTrueVal(isAlternativeFormula)) {
			return this.round(this.mul(quantity, factor, dimA, dimB, dimC), 0);
		}
		return this.round(this.div(this.mul(quantity, factor, dimB, dimC), 144.0), 0);
	},
	
	updateDims : function(configuration, dimAId, dimBId, dimCId, dimDId, isDisabled, isArchive) {
		var isEditable = false;
		if (typeof(isArchive) != "undefined" || typeof(isArchive) != undefined) {
			isEditable = isArchive;
		}
		for(var i = 1; i <= 4; i++) {
			if(!Strings.isEmpty(arguments[i])){
				var obj = $(arguments[i]);
				if(obj == null) continue;
				var flag = Strings.isEmpty(configuration.substring(i, i+1));				
				if(isDisabled){						
					obj.disabled = flag || isEditable;	
					
				}else{
					obj.readOnly = flag || isEditable;
				}
				if(flag) {
					obj.value = "";
				}
			}
		}
		this.formatDimsValue(configuration, dimAId, dimBId, dimCId, dimDId);
		this.formatDimLabel(configuration, dimAId, dimBId, dimCId, dimDId);
	},
	updateRecordDims : function(record){
		if(record){
			var con = record.get("sourceOwnerName");
			if(Strings.isEmpty(con)) {
				con = record.get("configuration");
			}
			for(var i = 1; i <= 4; i++) {
				var flag = Strings.isEmpty(con.substring(i, i+1));
				if(flag) {
					var id  = "dim" + String.fromCharCode(i+64);
					record.set(id,"");
				}
			}
		}
	},
	getRecordDisplayDims : function(record){
		if(record) {
			return this.getDisplayDims(record.get("sourceOwnerName"),record.get("dimA"),record.get("dimB"),record.get("dimC"),record.get("dimD"));
		}
		return "";
	},
	getDisplayDims : function (configuration, dimAVal, dimBVal, dimCVal, dimDVal) {
		var result = "";
		var separator = " x ";
		if(this.isTube(configuration)) {
			result = this.getRealDimValue(dimAVal);
			if(!this.isRoundTube(configuration)) {
				result = result + separator + this.getRealDimValue(dimBVal);
			}
			var dimc = this.getRealDimValue(dimCVal)=='VAR' ? 'VAR' : CUtils.round(this.getRealDimValue(dimCVal),3);
			result = result + separator + dimc + separator + this.getRealDimValue(dimDVal);
		} else if(this.isSheetPlate(configuration)) {
			result = this.getRealDimValue(dimAVal) + separator + this.getRealDimValue(dimBVal) + separator + this.getRealDimValue(dimCVal);
		} else if(this.isCoil(configuration)) {
			result = this.getRealDimValue(dimAVal) + separator + this.getRealDimValue(dimBVal);
		}
		return result;
	},
	
	getRealDimValue : function(dimValue) {
		dimValue = this.remTrailingZeros(dimValue);
		if(dimValue == "99999") {
			dimValue = "VAR";
		}
		return dimValue;
	},
	
	isCoatingType : function(coatingType) {
		if(Strings.isEmpty(coatingType)) return false;
		return this.isGalvanizedCoating(coatingType) || this.isGalvannealCoating(coatingType) || this.isGalvalumeCoating(coatingType);
	},
	isGalvanizedCoating :  function(coatingType) {
		if(Strings.isEmpty(coatingType)) return false;
		return coatingType.startWith("GC") || coatingType.startWith("Galvanized");
	},
	isGalvannealCoating :  function(coatingType) {
		if(Strings.isEmpty(coatingType)) return false;
		return coatingType.startWith("GNC") || coatingType.startWith("Galvanneal");
	},
	isGalvalumeCoating :  function(coatingType) {
		if(Strings.isEmpty(coatingType)) return false;
		return coatingType.startWith("GVC") || coatingType.startWith("Galvalume");
	},
	getCoatingType : function(coatingType) {
		if(this.isGalvanizedCoating(coatingType)) {
			return "Galvanized";
		}
		if(this.isGalvannealCoating(coatingType)) {
			return "Galvanneal";
		}
		if(this.isGalvalumeCoating(coatingType)) {
			return "Galvalume";
		}
		return "";
	},
	isTube : function(configuration) {
		return configuration.startWith("8");
	},
	isRoundTube : function(configuration) {
		return configuration.startWith("8D ");
	},
	isOvalTube : function(configuration) {
		return configuration.startWith("8DD");
	},
	isRectSquareTube : function(configuration) {
		return configuration.startWith("8WW");
	},
	isCoil : function(configuration) {
		return configuration.startWith("0");
	},
	isSheetPlate : function(configuration) {
		return configuration.startWith("1");
	},
	is1TLLSheetPlate : function(configuration) {
		return configuration == "1TLL";
	},
	is1TWLSheetPlate : function(configuration) {
		return configuration== "1TWL";
	},
	isIrregularlyShapedBlanks : function(configuration) {
		return configuration.startWith("2");
	},
	getThicknessValue : function(configuration, dimA, dimC) {
		var thickness = dimA;
		
		if(configuration.indexOf('T') == 3) thickness = dimC;
		
		if(!Strings.isEmpty(thickness) && VUtils.isDemicial(thickness)) {
			thickness = CUtils.round(thickness, 5);
		}
		
		return thickness;
	},
	getSteelLineType : function(configuration) {
		var me = this;
		if(me.isTube(configuration)) {
			return "Tube";
		}
		if(me.isSheetPlate(configuration)) {
			return "SheetPlate";
		}
		if(me.isCoil(configuration)) {
			return "Coil";
		}
		return "";
	},
	
	formatDimLabel: function(configuration, dimAId, dimBId, dimCId, dimDId) {

		this.clearLabelUnit(dimAId, dimBId, dimCId, dimDId);
		
		for(var i = 1; i <= 4; i++) {
			if(!Strings.isEmpty(arguments[i]) && $("label_" + arguments[i])) {
				var label = $("label_" + arguments[i]).innerHTML;
				var unit = configuration[i] || "";
				label += " (" + unit + ")";
				$("label_" + arguments[i]).innerHTML = label + " (in.)";
			}
		}
	},
	clearLabelUnit : function(dimAId, dimBId, dimCId, dimDId){
		if(arguments.length == 0) return;
		for (var i = 0, j = arguments.length; i < j; i++){
			if(!Strings.isEmpty(arguments[i]) && $("label_" + arguments[i])) {
				var label = $("label_" + arguments[i]).innerHTML;
				var position = label.indexOf("(");
				if(position > 0)  $("label_" + arguments[i]).innerHTML = label.substring(0, position);
			}
		}
	},
	formatDimsValue : function(configuration, dimAId, dimBId, dimCId, dimDId) {
		if(configuration.indexOf('T') == 1) {
			if(dimAId && $(dimAId) && VUtils.isDemicial($(dimAId).value)) {
				$(dimAId).value = CUtils.round($(dimAId).value, 5);
			}
			if(dimCId && $(dimCId) && VUtils.isDemicial($(dimCId).value)) {
				$(dimCId).value = CUtils.round($(dimCId).value, 4);
			}
		}
		if(configuration.indexOf('T') == 3) {
			if($(dimCId) && VUtils.isDemicial($(dimCId).value)) {
				$(dimCId).value = CUtils.round($(dimCId).value, 5);
			}
			if(dimAId && $(dimAId) && VUtils.isDemicial($(dimAId).value)) {
				$(dimAId).value = CUtils.round($(dimAId).value, 4);
			}
		}
		if(dimBId && $(dimBId) && VUtils.isDemicial($(dimBId).value)) {
			$(dimBId).value = CUtils.round($(dimBId).value, 4);
		}
		if(dimDId && $(dimDId) && VUtils.isDemicial($(dimDId).value)) {
			$(dimDId).value = CUtils.round($(dimDId).value, 3);
		}
	},
	
	formatGridDimsValue : function(record, dimAId, dimBId, dimCId, dimDId, configuration) {
		var me = this;
		var dimA = record.get(dimAId);
		var dimB = record.get(dimBId);
		var dimC = record.get(dimCId);
		var dimD = record.get(dimDId);
		var configuration = Strings.isEmpty(configuration)? record.get("sourceOwnerName") : configuration;
		if(!Strings.isEmpty(configuration)) {
			 if(configuration.indexOf('T') == 1 && !Strings.isEmpty(dimA)) {
				 if(VUtils.isDemicial(dimA)) {
					 record.set(dimAId, me.dv(dimA).toFixed(5));
				 }
				 if(!Strings.isEmpty(dimC)) {
					 record.set(dimCId, me.dv(dimC).toFixed(4));
				 }
			 } else if(configuration.indexOf('T') == 3 && !Strings.isEmpty(dimC)) {
				 if(VUtils.isDemicial(dimC)) {
					 record.set(dimCId, me.dv(dimC).toFixed(5));
				 }
				 if(!Strings.isEmpty(dimA)) {
					 record.set(dimAId, me.dv(dimA).toFixed(4));
				 }
			 }
			 if(!Strings.isEmpty(dimB)) {
				 record.set(dimBId, me.dv(dimB).toFixed(4));
			 }
			 if(!Strings.isEmpty(dimD)) {
				 record.set(dimDId, me.dv(dimD).toFixed(4));
			 }
		}
	},
	calcTotalCost : function(totalCostPerLbs, weight, scale) {
		return this.round(this.div(this.mul(weight, totalCostPerLbs), 100.0), scale || 4);
	},
	calcCostCWT : function(totalCost, weight, scale) {
		return this.round(this.mul(this.div(totalCost, weight), 100.0), scale || 4);
	},
    ////////////////////////////////////Utils for nova end ////////////////////////////////////////////////////////////////////////
	initProvinceField : function(countryId, provinceId) {
		var me = this;
		var combox = CUtils.getS(provinceId);
		var country = CUtils.getSValue(countryId);
		combox.on("beforequery", function(obj) {
			obj.query = obj.query || '';
			country = CUtils.getSValue(countryId);
			combox.store.clearFilter();
			combox.store.filterBy(function(record,id){
				if(record.get('id').indexOf(country) > -1
						&& record.get('name').toLowerCase().indexOf(obj.query.toLowerCase()) > -1) {
					return true;
				}
				return false;
			});
			obj.cancel = true;
			combox.expand();
            if (combox.getRawValue() !== combox.getDisplayValue()) {
            	combox.ignoreSelection++;
            	combox.picker.getSelectionModel().deselectAll();
            	combox.ignoreSelection--;
            }

            combox.doAutoSelect();
            if (combox.typeAhead) {
            		combox.doTypeAhead();
            }
            combox.inputEl.focus();
		});
		
		var countryBox = CUtils.getS(countryId);
		countryBox.on('select', function(combo, record) {
			CUtils.clearSValue(provinceId);
			combox.store.load();
		});
		countryBox.on('blur', function(combo) {
			if(combo.getRawValue() == '')  {
				CUtils.clearSValue(provinceId);
			}
			me.filterProvinceAfterCountryChange(provinceId, countryId);
		});
	},
	filterProvinceAfterCountryChange: function(provinceId, countryId) {
		var country = this.getSSValue(countryId);
		this.getS(provinceId).store.filterBy(function(record,id) {
			if (record.get('id').indexOf(country) > -1) {
				return true;
			}
			return false;
		});
	},
	formatCurrency : function(d, decimalNumber, currencySymbol) {
		var a = parseFloat(d);
		if (isNaN(a)) {
			return "";
		}
		decimalNumber = decimalNumber || 2;
		currencySymbol = currencySymbol || "$";
		if(parseFloat(d) == 0) return currencySymbol + this.formatMoney(0, decimalNumber);	
		d = this.formatMoney(d,decimalNumber);
		var absVal = 0;
		var sign = (d == (absVal = Math.abs(d)));//whether positive or negative
		absVal = this.formatMoney(absVal, decimalNumber);//get back decimal point after absolute value
		var idx = absVal.indexOf(".");
		while (absVal.substring(0, idx++).length % 3) {
		    absVal = "0" + absVal;
		}		
		var intPart = absVal.substring(0, idx-1);
		var cents = absVal.substring(idx);
		intPart = intPart.replace(/(\d{3})/g, "$1,").replace(/,\./, ".").replace(/(^0*)|(,$)/g, "");
		var sReturn = intPart + "." + cents;
		if(parseFloat(sReturn) > 0 && parseFloat(sReturn) < 1) {
			sReturn = "0" + sReturn;
		}	
		return ((sign)?'':'-') + currencySymbol + sReturn;
		//return Ext.util.Format.usMoney(a);
	},
	formatMoney : function(d, decimalNumber) {
		var a = parseFloat(d);
		if (!isNaN(a)) {
			decimalNumber = decimalNumber || 2;
	 		var pow = Math.pow(10, decimalNumber);
			var r = (Math.round(a*pow)/pow);
			return r.toFixed(decimalNumber);		
		}
		return "";
	},
	fomatCommasNumeric: function(d) {
		var absVal, sign, idx, intPart, cents, sReturn;
		
		if (isNaN(parseFloat(d))) {
			return "";
		}
		sign = (d == Math.abs(d)); //mark the symbol
		absVal = d.toString();
		idx = absVal.indexOf('.');
		if (idx < 0) {
			intPart = absVal;
		} else {
			intPart = absVal.substring(0, idx);
			cents = absVal.substring(idx - 1); //include decimal point
		}
		
		while (intPart.length % 3) {
			intPart = "0" + intPart;
		}
		sReturn = intPart.replace(/(\d{3})/g, "$1,").replace(/,\./, ".").replace(/(^0*)|(,$)/g, "");
		if (!Strings.isEmpty(cents)) {
			sReturn +=  cents;
		}
		
		if(parseFloat(sReturn) > 0 && parseFloat(sReturn) < 1) {
			sReturn = "0" + sReturn;
		}	
		
		if (Strings.isEmpty(sReturn)) sReturn = 0;
		
		return ((sign)?'':'-') + sReturn;
		
	},
	addOptionElm : function(selElm, strText, strValue, bSelected) {
		if(document.all)//HACK for IE
			selElm.add(createOptionElm(strText, strValue, bSelected));
		else
			selElm.add(createOptionElm(strText, strValue, bSelected),null);
	},
	createOptionElm : function(strText, strValue, bSelected) {
		var ops = document.createElement("OPTION"); 
		ops.text = strText;
		ops.value = strValue;
		if (bSelected){
			ops.selected = true;
		}
		return ops;
	},
	emptyOptionElm : function(selElm) {
		if(selElm.options) selElm.options.length = 0;
	},
	initErrorMessageTips : 	function (args) {
		if(args['msg'] && !Strings.isEmpty(args['msg'])) {
			var errorMessageTips =  new Ext.Tip({
		        target: 'divTips',
		        html: args['msg'],
		        title: 'Warning',
		        autoHide: true,
		        closable: true,
		        draggable:true,
		        width : args['w'] || 400,
		        height : args['h'] || 300,
		        x:getWindowWidth()-400,
		        y:10
		    });
			errorMessageTips.show();
		}
	},
	getRecordsDataByFieldName : function(records, FieldName) {
		var list = new Array();
		if(!records) return list;
		
		for(var i = 0; i < records.length; i++) {
			var record = records[i];
			list.push(record.get(FieldName));
		}
		
		return list;
	},
	fireEvent : function(id,eventName) {
		var lenObj = document.getElementById(id);
		if(Ext.isIE) {
			lenObj.fireEvent(eventName);
		} else {
			var evt = document.createEvent('HTMLEvents');   
			evt.initEvent(eventName.removeFirstStr('on'),true,true);   
			lenObj.dispatchEvent(evt,lenObj);
		}
	},
	showPrinter4WorkFlow : function(args, printerStore, workFlowSumbit) {
		var me = this;
		var printer = "";
		var isBOL = args.isBOL;
		if(CUtils.isTrueVal(isBOL)) {
			printer = CUtils.getDefaultPrinter2();
		}
		else {
			printer = CUtils.getDefaultPrinter1();
		}		
		Ext.create('Ext.window.Window', {
			title: "Choose Printer",
		    width: 350,
		    height: 100,
	    	modal: true,
	    	items: [{
                xtype:'combo',
			    layout: 'fit',
		    	name: 'Printer',
		    	id:'printer',
                mode: 'local',
                queryMode : 'local',
                valueField: 'name',
                displayField: "name",
                value : printer,
		    	fieldLabel: 'Choose printer',
                allowBlank:false,
                forceSelection: true,
                typeAhead: true,
                store: me.buildPrinterStore(printerStore),
		    	margin: '10 0 0 0'
            }],
		    buttons: [{
                text : "OK",
                handler : function() {
                	var printer = Ext.getCmp("printer").value;
            		if(Strings.isEmpty(printer)) {
            			CUtils.warningAlert("Choose one printer for printing");
            			return;
            		}
           			else {
                   		this.findParentByType("window").destroy();
           			}
					if(document.getElementById("printerName")) {
           				document.getElementById("printerName").value = printer;
           			}
            		
            		if(CUtils.isTrueVal(isBOL)){
                		CUtils.setDefaultPrint2(printer);
            		}
            		else{
                		CUtils.setDefaultPrint1(printer);
            		}
            		if(typeof(workFlowSumbit) != 'undefined' && typeof(workFlowSumbit) == "function") {
                		workFlowSumbit();
            		}            		
                }
            },{
          	  text : "Cancel",
                handler : function(){                	
                 	this.findParentByType("window").destroy();
                }
           }]
		}).show();
	},
	/**
	 * @param printArgs print params
	 * @param printerStore printer list store
	 * @param isBatch true:batch print false : general print
	 * 
	 * */
	showPrinter : function(printArgs, printerStore,isBatch) {
		var isBOL = printArgs.isBOL;
		var printer = '';
		if(CUtils.isTrueVal(isBOL)){
			printer = CUtils.getDefaultPrinter2();
		}else{
			printer = CUtils.getDefaultPrinter1();
		}
		var me = this;
		Ext.create('Ext.window.Window', {
			id : 'general_printer_window',
			title: Strings.isEmpty(printArgs.printTitle) ? "Choose Printer" : printArgs.printTitle,
		    width: 350,
		    height: 100,
	    	modal: true,
	    	items: [{
                xtype:'combo',
			    layout: 'fit',
		    	name: 'Printer',
		    	id:'general_printer',
                mode: 'local',
                queryMode : 'local',
                valueField: 'name',
                displayField: "name",
                value : printer,
		    	fieldLabel: 'Choose printer',
                allowBlank:false,
                forceSelection: true,
                typeAhead: true,
                store: me.buildPrinterStore(printerStore),
		    	margin: '10 0 0 0'
            }],
		    buttons: [{
                text : "OK",
                handler : function() {
                	var printer = Ext.getCmp("general_printer").value;
            		if(Strings.isEmpty(printer)) {
            			CUtils.warningAlert("Choose one printer for printing");
            			return;
            		}
           			else {
                   		this.findParentByType("window").destroy();
           			}

            		if(printArgs && printArgs.jasperParams) {
            			printArgs.jasperParams.printerName = printer;
            		} else if (printArgs.batchJsonObject) {
            			var batchParams = printArgs.batchJsonObject;
            			for(var i = 0; i < batchParams.length; i++){
            				batchParams[i].jasperParams.printerName = printer;
            			}
            		}
            		if(CUtils.isTrueVal(isBOL)){
                		CUtils.setDefaultPrint2(printer);
            		}else{
                		CUtils.setDefaultPrint1(printer);
            		}
                	me.printReport(printArgs,isBatch);
                }
            },{
          	  text : "Cancel",
                handler : function(){                	
                 	this.findParentByType("window").destroy();
                }
           }]
		}).show();
	},	
	buildPrinterStore : function(printerStore) {
		var data = {};
		if(printerStore) {
			data = CUtils.jsonDecode(printerStore);
		}				
		return Ext.create('Ext.data.Store', {
			fields: ['name'],
			data: data
		});
	},				
	printReport : function (args,isBatch) {
		if(args.gridId) {
		    var record = GUtils.getSelected(Ext.getCmp(args.gridId));
			if(record){
				args.jasperParams.id = record.get("id");
				args.jasperParams.ID = record.get("id");
				args.jasperParams.isCom = record.get("isFromComSO") || "";
			}else{
				return;
			}
	   }
	   if(isBatch){
		   this.batchPrint(args);
	   } else {
		   this.print(args);
	   }
	   
	},
	print : function (args){
		var url = '/app/steel/report/print';
		var me = this;
		Ext.Ajax.request({
		    url: url,
		    params: {
		    	jasperJson: Ext.encode(args)
		    },
		    success : function(response) {
		    	if(args.documentType || args.isDocument){
		    		me.updatePrintedInDocument(args);
		    	}
		    }
		});
	},
	updatePrintedInDocument : function(args){
	    var type = $('docType').value;
	    var subType = $('docSubType').value;
	    
	    var url;
		if(args.hasProductionCopy){
			url = '/app/steel/document/'+type+'/'+subType+'/form/'+args.jasperParams.id+'/updatePrinted4Copy';
		} else {
			url = '/app/steel/document/'+type+'/'+subType+'/form/'+args.jasperParams.id+'/updatePrinted';
		}
	    if(!Strings.isEmpty(type) && !Strings.isEmpty(subType)){
			Ext.Ajax.request({
		        url: url,
		        params: {
		    	    id: args.jasperParams.id
		        },
				success : function(response) {
					var data = Ext.decode(response.responseText);
	    			if($('version')){
		    			$('version').value = data.version;
		    		}
				}
		    });
		}
    },
	// in the future, make it one common method for document
	batchPrint : function (args){
		var url = '/app/steel/report/batchPrint';
		beginWaitCursor("Printing....");
		var fileNames = args.batchJsonObject[0].fileName.split(',');
		// print all report for current document
		if(fileNames.length > 1){
			for(var i = 0; i < fileNames.length; i++){
				for(var j = 0; j < args.batchJsonObject.length; j++){
					args.batchJsonObject[j].fileName = fileNames[i];
				}
				Ext.Ajax.request({
				    url: url,
				    params: {
				    	jasperJson: Ext.encode(args)
				    },
				    success : function(response) {
				    	if(args.batchPrintDoucment){
				    		PAction.updatePrinted4Document(args.ids,args.hasProductionCopy);
				    	}
				    }
				});
			}
		} else {
			// common method for batch print
			Ext.Ajax.request({
			    url: url,
			    params: {
			    	jasperJson: Ext.encode(args)
			    },
			    success : function(response) {
			    	if(args.batchPrintDoucment){
			    		PAction.updatePrinted4Document(args.ids,args.hasProductionCopy);
			    	}
			    }
			});
		}
	},
	getCustomer : function(code,codeName){
		var customerMask = new Ext.LoadMask(document.getElementById('fr_'+codeName), {msg:"Checking...",removeMask : true});
		customerMask.show();
		Ext.Ajax.request({
		    url: '/app/steel/report/getCustomerByCode',
		    params: {
		    	code: code
		    },
		    success : function(response) {
		    	var data = Ext.decode(response.responseText);
		    	if(data.cusHasExist == 'true'){
		    		customerMask.hide();
		    	} else {
		    		var msgarray = [];
		    		msgarray.push({fieldname:codeName,message:"Customer Account No." + code + "  doesn't exist!", arg: null});
		    		VUtils.processValidateMessages(msgarray);
		    		customerMask.hide();
		    	}
		    }
		});
	},
	downLoadReportFile : function (args) {
		$("jasperJson").value = Ext.encode(args);
    	document.forms[0].action = args.url || '/app/pgm/report/downLoad';
    	document.forms[0].submit();
	},
	getVendor : function(code,codeName){
		var vendorMask = new Ext.LoadMask(document.getElementById('fr_'+codeName), {msg:"Checking...",removeMask : true});
		vendorMask.show();
		Ext.Ajax.request({
		    url: '/app/steel/report/getVendorByCode',
		    params: {
		    	code: code
		    },
		    success : function(response) {
		    	var data = Ext.decode(response.responseText);
		    	if(data.vendorHasExist == 'true'){
		    		vendorMask.hide();
		    	} else {
		    		var msgarray = [];
		    		msgarray.push({fieldname:codeName,message:"Vendor Account No." + code + "  doesn't exist!", arg: null});
		    		VUtils.processValidateMessages(msgarray);
		    		vendorMask.hide();
		    	}
		    }
		});
	},
	isDisableCmp : function(id) {
		var resources = CUtils.jsonDecode($("CONTROLLED_RESOURCES").value);
		return resources[id] && !Strings.isEmpty(resources[id]) &&  resources[id] == "disabled";
	},
	isHiddenCmp : function(id) {
		var resources = CUtils.jsonDecode($("CONTROLLED_RESOURCES").value);
		return resources[id] && !Strings.isEmpty(resources[id]) &&  resources[id] == "hidden";
	},
	myEncodeURI:function(iStr) {
		var oStr = "";
		oStr = encodeURI(iStr);
		
		oStr = oStr.replace(/!/g, "%21");
		oStr = oStr.replace(/#/g, "%23");
		oStr = oStr.replace(/&/g, "%26");
		oStr = oStr.replace(/'/g, "%27");
		oStr = oStr.replace(/[(]/g, "%28");
		oStr = oStr.replace(/[)]/g, "%29");
		oStr = oStr.replace(/[+]/g, "%2B");
		oStr = oStr.replace(/[$]/g, "%24");
		oStr = oStr.replace(new RegExp("[/]","g"), "%2F");
		oStr = oStr.replace(/[:]/g, "%3A");
		oStr = oStr.replace(/[;]/g, "%3B");
		oStr = oStr.replace(/[=]/g, "%3D");
		oStr = oStr.replace(/[?]/g, "%3F");
		oStr = oStr.replace(/[@]/g, "%40");
		oStr = oStr.replace(/[~]/g, "%7E");
		
		oStr = oStr.replace(/,/g, "%2C");
		oStr = oStr.replace(/%20/g, "+");
		return oStr;
	},
	myDecodeURI : function(iStr) {
		var oStr = "";
		//make no mistake, this is far from complete yet, we jsut try to make the
		//space and comma handled properly at the moment. Henry 05-09-30
		oStr = iStr.replace(/[+]/g,"%20");
		
		oStr = oStr.replace(/%23/g,"#");
		oStr = oStr.replace(/%24/g,"$");
		oStr = oStr.replace(/%26/g,"&");
		oStr = oStr.replace(/%2B/g,"+");
		oStr = oStr.replace(/%2F/g,"/");
		oStr = oStr.replace(/%3A/g,":");
		oStr = oStr.replace(/%3B/g,";");
		oStr = oStr.replace(/%3D/g,"=");
		oStr = oStr.replace(/%3F/g,"?");
		oStr = oStr.replace(/%40/g,"@");
		oStr = oStr.replace(/%7E/g,"~");
		
		oStr = oStr.replace(/%2C/g,",");
		oStr = decodeURI(oStr);
		return oStr;
	},
    isTrueVal : function(v) {
		if (v == null) v = "false";
		if (typeof(v) == "undefined") v = "false";
		if (typeof(v) != "string") v = v.toString();
	    var vv = v.toUpperCase().trim();
	    if(vv != "FALSE" && vv != "NO" && vv != "0" && !!v)
			return true;
		else
			return false;
	},
	remTrailingZeros : function(x) {
		if(Strings.isEmpty(x)) {
			return "";
		}
		x = x + ""; // to string
		var decPos = x.indexOf(".");
		if (decPos > -1) {
			first = x.substring(0, decPos);
			second = x.substring(decPos, x.length);
			while (second.charAt(second.length - 1) == "0") {
				second = second.substring(0, second.length - 1);
			}
			if (second.length > 1)
				return first + second;
			else
				return first;
		}
		return x;
	},
	errorAlert : function(message, callBack){
		Ext.MessageBox.show({
	           title: 'Error',
	           msg: message,
	           buttons: Ext.MessageBox.OK,
	           fn: callBack ? callBack : null,
	           icon: Ext.MessageBox.ERROR
	    });
	},
	infoAlert : function(message, callBack){
		Ext.MessageBox.show({
	           title: 'Info',
	           msg: message,
	           buttons: Ext.MessageBox.OK,
	           fn: callBack ? callBack : null,
	           icon: Ext.MessageBox.INFO
	    });
	},
	questionAlert : function(message, callBack, title){
		Ext.MessageBox.show({
	           title: title ? title : 'Question',
	           msg: message,
	           buttons: Ext.MessageBox.YESNO,
	           fn: callBack ? callBack : null,
	           icon: Ext.MessageBox.QUESTION
	    });
	},
	getStrSeparateByComma : function(originalStr, addStr) {
		if(Strings.isEmpty(originalStr)) return addStr;
		if(!Strings.isEmpty(originalStr) && !Strings.isEmpty(addStr)) return originalStr + ", " + addStr;
		return originalStr;
	},
	initInfoMessageTips : function(title, msg, x, y, w, h) {
		if(!Strings.isEmpty(msg)){			
			var messageTips =  new Ext.Tip({
		        target: 'divTips',
		        html: msg,
		        title: title || 'Warning',
		        autoHide: true,
		        closable: true,
		        draggable:true,
		        width : w || 400,
		        height : h || 50,
		        x: x || 10,
		        y: y || getWindowWidth()-400
		    });
			messageTips.show();
		}
	},
	questionAlertWithCancel : function(message, callBack){
		Ext.MessageBox.show({
	           title: 'Question',
	           msg: message,
	           buttons: Ext.MessageBox.YESNOCANCEL,
	           fn: callBack ? callBack : null,
	           icon: Ext.MessageBox.QUESTION
	    });
	},
	warningAlert : function(message, callBack){
		Ext.MessageBox.show({
	           title: 'Warning',
	           msg: message,
	           buttons: Ext.MessageBox.OK,
	           fn: callBack ? callBack : null,
	           icon: Ext.MessageBox.WARNING
	    });
	},
	
	focus : function(id){
		if(id){
			var cmp = Ext.getCmp(id);
			if(cmp){
				cmp.focus();
			}else{
				var elm = $(id);
				if(elm){
					elm.focus();
				}
			}
		}
	},
	
	prompt : function(title, info, callBack, scope, multiline, value ){
		Ext.MessageBox.prompt(title, info, callBack, scope, multiline, value );//callBack((btn, inputText))
	},
	passwordPrompt : function(title, info, callBack, passby, scope, height) {
		Ext.create('Ext.window.Window', {
			title: title,
		    width: 250,
		    height: height ? height : 111,
	    	modal: true,
	    	bodyCls: 'x-password-prompt',
	    	bodyStyle: {
	    		padding: '10px',
	    		overflow: 'hidden',
	    		width: '240px'
	    	},
	    	items: [{
	    		xtype: 'text',
	    		text: info
	    	},{
		    	xtype: 'textfield',
			    layout: 'fit',
		    	inputType: 'password',
		    	width: 220,
		    	id:'password'
		    }],
		    buttons: [{
                text: PRes["yes"],
                handler: function(btn){
                	var password = Ext.getCmp("password").value;
	   				if (!Strings.isEmpty(password) && Ext.util.MD5(password) == passby) {
	   					if (typeof scope != 'undefined') {
	   						callBack.apply(scope);
	   					} else {
	   						callBack();
	   					}
		   				this.findParentByType("window").destroy();
	   				} else {
	   					CUtils.warningAlert("Password validate failed, please contact with administrator!");
	   				}
                }
            },{
          	    text: PRes['no'],
	            handler: function(){
	            	this.findParentByType("window").destroy();
	            }
           }]
		}).show();

	},
	setDefaultPrint1 : function(printer1){
		Ext.util.Cookies.set("Printer1", printer1);
	},
	setDefaultPrint2 : function(printer2){
		Ext.util.Cookies.set("Printer2", printer2);
	},
	setDefaultPrint3 : function(printer3){
		Ext.util.Cookies.set("Printer3", printer3);
	},
	getDefaultPrinter1 : function(){
		var p1 = Ext.util.Cookies.get("Printer1");
		return p1;
	},
	getDefaultPrinter2 : function(){
		var p2 = Ext.util.Cookies.get("Printer2");
		return p2;
	},
	getDefaultPrinter3 : function(){
		var p3 = Ext.util.Cookies.get("Printer3");
		return p3;
	},
	displayInfoMessageFromWorkFlow : function (infoLogArray, config) {
		if (!Strings.isEmpty(infoLogArray)) {
			var array = CUtils.jsonDecode(infoLogArray);
			if (array.length > 0) {
				this.openExtWindowWithTreeInfoLog(infoLogArray, config);
			}
		}
	}
});

Ext.applyIf(Array.prototype, {
	addAll: function(args) {
		if(!args || args.length == 0) return this;
		for(var i = 0; i < args.length; i ++) {
			this.push(args[i]);
		}
		return this;
		
	},
	indexOf:function(elt /*, from*/) {
		var len = this.length;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	}
});

Ext.applyIf(String.prototype, {
	trim: function() {
	    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
	},
	lTrim: function() {
	    return this.replace(/(^[\s]*)/g, "");
	},
	rTrim: function() {
		return this.replace(/([\s]*$)/g, "");
	},
	endWith: function(endStr) {
		 return this.substr(this.length - endStr.length) == endStr;
	},
	startWith: function(startStr) {
		 return this.substr(0, startStr.length) == startStr;
	},
	firstStr: function() {
		 return this.substr(0, this.indexOf("_"));
	},
	firstStr2: function() {
		return this.substr(0, this.lastIndexOf("_"));
	},
	lastStr2: function() {
		return this.substr(this.lastIndexOf("_")+1);
	},
	lastStr: function() {
		return this.substr(this.indexOf("_")+1);
	},
	removeLastStr: function(lastStr) {
		return this.substr(0, this.length - lastStr.length);
	},
	removeFirstStr: function(firstStr) {
		return this.substr(firstStr.length);
	}
});

var Strings = {};
Strings.isEmpty = function (iStr) {
    if ((typeof (iStr) == "undefined") || (iStr == null) || (iStr.toString().length == 0) || (iStr.toString().trim() == ""))return true;
	return false;
};

ObjUtils = {};
ObjUtils.isEmpty = function(obj) {
	for ( var name in obj) {
		if(obj.hasOwnProperty(name)) {
			return false;
		}
	}
	return true;
};

//move from _heder4extjs4.jsp------------------------------------------------------------

/**
 * Handle 'Enter' event for chrome, we can support 'tab' key event base on particular issue
 * call initKeyDownHandle() will be ok
 * @type 
 */
function doKeyDown(e, fn) {
     var key;
     if(window.event)
          key = window.event.keyCode;     //IE
     else
          key = e.which;     //firefox
     if(key == 13) {
          fn();
     }
     
}

var isIe = (document.all) ? true : false; 
function initKeyDownHandle() { 	
	document.onkeydown = function(evt){ 
		catchKeyDown(evt); 	
	};
} 

function catchKeyDown(evt){ 
	evt = (evt) ? evt : ((window.event) ? window.event : ""); 
	var key = isIe ? evt.keyCode : evt.which;
	if (evt.keyCode == 13 && PAction.doSearch) {
		var el = evt.srcElement || evt.target; 
		if ((el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "select") && el.type != "submit") { 
			if (isIe) {
				PAction.doSearch();
			} else {
				PAction.doSearch();
			} 
			
			if (evt.preventDefault) {
				evt.preventDefault(); 
			}
			
			if (evt.stopPropagation) {
				evt.stopPropagation(); 
			}
		} 
	} 
} 

function nextCtl(ctl) {
	var form = ctl.form;
	for (var i = 0; i < form.elements.length - 1; i++) {
		if (ctl == form.elements[i]) {
			return form.elements[i + 1];
		}
	}
	return ctl;
}
