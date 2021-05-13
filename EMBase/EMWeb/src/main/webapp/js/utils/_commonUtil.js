Array.prototype.addAll = function(args) {
	if(!args || args.length == 0) return this;
	for(var i = 0; i < args.length; i ++) {
		this.push(args[i]);
	}
	return this;
	
};
String.prototype.trim = function() {
    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
};
String.prototype.lTrim = function() {
    return this.replace(/(^[\s]*)/g, "");
};
String.prototype.rTrim = function() {
    return this.replace(/([\s]*$)/g, "");
};
String.prototype.endWith = function(endStr) {
	 return this.substr(this.length - endStr.length) == endStr;
};
String.prototype.lastStr = function() {
	 return this.substr(this.lastIndexOf("_")+1);
};
String.prototype.removeLastStr = function(lastStr) {
	return this.substr(0, this.length - lastStr.length);
};
var Strings = {};
Strings.isEmpty = function (iStr) {
    if ((typeof (iStr) == "undefined") || (iStr == null) || (iStr.toString().length == 0) || (iStr.toString().trim() == ""))return true;
	return false;
}
Date.prototype.toMMDDYYYYString = function () {return isNaN (this) ? 'NaN' : [this.getMonth() > 8 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1), this.getDate() > 9 ? this.getDate() : '0' + this.getDate(), this.getFullYear()].join('/')};
Date.prototype.toMMYYYYString = function (n) {return isNaN (this) ? 'NaN' : [(this.getMonth()+n > 8 && (this.getMonth()+ (n+1))<=12) ? this.getMonth() + (n+1) : '0' + ((this.getMonth()+ (n+1) > 12 ? (this.getMonth()+ (n+1) - 12) :(this.getMonth()) + (n+1))), this.getMonth()+ (n+1) > 12 ?this.getFullYear()+1:this.getFullYear()].join('/')};

///////////////////////////////////////////////////////////////////
function jsonEncode(o) {
	if(Ext.encode) {
		return Ext.encode(o);
	} else {
		return Ext.util.JSON.encode(o);
	}
}
function jsonDecode(o) {
	if(Ext.decode) {
		return Ext.decode(o);
	} else {
		return Ext.util.JSON.decode(o);
	}
}
function myEncodeURI(iStr) {
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
}

function myDecodeURI(iStr) {
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
}
///////////////////////////////////////////////
function isPostBack() {
        return document.forms[0]._isPostBack.value == "true";
}
    
function getContextID(){
	return document.forms[0].dataBeanContextID.value;
}
///////////////////////////////////////////////
function setPopupSelectValue(elementName, strText, strValue) {
      var tmpText = "";
      if (strText)
      	tmpText = strText;
      var tmpVal = "";
      if (strValue)
      	tmpVal = strValue;
      else
	  	tmpVal = strText;
	  var elm = document.getElementById("DESP_" + elementName);
	  if (elm) {
		  elm.value =tmpText;
		  elm = document.getElementById("VAL_" + elementName);
		  elm.value =tmpVal;
	  }
}

function getPopupSelectValue(elementName) {
	var elm = document.getElementById("VAL_" + elementName);
	if(elm)
		return document.getElementById("VAL_" + elementName).value;
	return null;
}
function getPopupSelectText(elementName) {
	return document.getElementById("DESP_" + elementName).value;
}

function setPopupSelectState(elementName, bEnabled) {
	
	var desp = document.getElementById("DESP_" + elementName);

	if (desp) {
 		//desp.readOnly = !bEnabled;
	 	if (bEnabled) 
		 	desp.style.color = "#000000";
	 	else {
	 		desp.readOnly = true;
			desp.style.color = "#c0c0c0";
	 		
	 		//document.title += "-" + desp.id;
	 	}
	}
    	//document.getElementById("VAL_" + elementName).readOnly = !bEnabled;
    	document.getElementById("btnPopUpSelect_" + elementName).disabled = !bEnabled;
	
}

function addOptionElm(selElm, strText, strValue, bSelected) {
	if(document.all)//HACK for IE
		selElm.add(createOptionElm(strText, strValue, bSelected));
	else
		selElm.add(createOptionElm(strText, strValue, bSelected),null);
}

function createOptionElm(strText, strValue, bSelected) {
	var ops = document.createElement("OPTION"); 
	ops.text = strText;
	ops.value = strValue;
	if (bSelected){
		ops.selected = true;
	}
	return ops;
}

function emptyOptionElm(selElm){
	/*var countNum = selElm.options.length; 
	for(var i=1;i<=countNum;i++){
		selElm.remove(countNum-i);
	}*/
	
	if(selElm.options) selElm.options.length = 0;
}

//function setSelectElmValue(elm, strValue) {
//	var bflag = false;
//	if (elm && (elm.tagName == "SELECT")) {
//		var op;
//		for (var i = elm.options.length-1; i >=0;i--) {
//			op = elm.options[i];
//			if (op.value == strValue) {
//				bflag = true;
//				op.selected = true;
//				break;
//			}
//		}
//	}
//	return bflag;
//}

function getSelectElmText(elm) {
	if (elm && (elm.tagName == "SELECT")) {
		var op;
		for (var i = elm.options.length-1; i >=0;i--) {
			op = elm.options[i];
			if (op.selected) {
				return op.text;
			}
		}
	}
	return "";
}

function getSelectElmValue(elm) {
	if (elm && (elm.tagName == "SELECT")) {
		var op;
		for (var i = elm.options.length-1; i >=0;i--) {
			op = elm.options[i];
			if (op.selected) {
				return op.value;
			}
		}
	}
	return "";
}

function setElementsState(enabled) {
	var elms = document.forms[0].elements;	
	for (var i = elms.length-1; i >=0;i--) {	
		if (elms[i] && (elms[i].type == "text" || elms[i].type == "select-one" || elms[i].type == "textarea" 
			|| elms[i].type == "radio" || elms[i].type == "checkbox"|| elms[i].className == "browseBtnPopup")) {			
			if(!CUtils.isTrueVal(elms[i].disabled)) {//if element already disabled, don't change its status
				elms[i].disabled = !enabled;	
			}
		}
	}		
}

function getRadioGroupValue(strGroupName){
	var val = null;
	var coll = document.forms[0][strGroupName];
	if(coll){
		for (var i=0;i<coll.length;i++) {
			if (coll[i].checked) {
				val = coll[i].value;
				break;
			}
		}
	}
	return val;
}
function selectRadioGroup(strGroupName,valSelected){
	var coll = document.forms[0][strGroupName];
	if(!coll) return;
	for (var i=0;i<coll.length;i++) {
		if (coll[i].value==valSelected) {
			coll[i].checked=true;
			break;
		}
	}
}

function getCheckboxGroupValue(strGroupName){
	var val = [];
	var coll = document.forms[0][strGroupName];
	if(coll){
		for (var i=0,l=coll.length;i<l;i++) {
			if (coll[i].checked) {
				val.push(coll[i].value);
			}
		}
	}
	return val;
}

function setCheckboxGroupStatus(strGroupName,enabled){
	var coll = document.forms[0][strGroupName];
	if(coll){
		for (var i=0,l=coll.length;i<l;i++) {
			coll[i].disabled = !enabled;
		}
	}
}

/////////////////////////////////////////////////////
function autoVolumeUom(dimUom,volUomId){
	var volUom = "";
	switch(dimUom) {
		case 'dm':	
            volUom = "dm^3";
		break;
        case 'cm':
            volUom = "cm^3";
		break;
        case 'mm':
            volUom = "mm^3";
		break;
        case 'm':
            volUom = "m^3";
		break;

        case 'km':
            volUom = "km^3";
		break;
        case 'ft':
            volUom = "ft^3";
		break;
        case 'yd':
            volUom = "yd^3";
		break;
        case 'in':
            volUom = "in^3";
		break;
		case 'fur':
			 volUom = "fur^3";
		break;
		case 'mi':
			volUom = "mi^3";
		break;
	}
	setPopupSelectValue(volUomId,volUom,volUom);
}

function autoDimensionUom(volUom,dimUomId){
	var dimUom = document.getElementById(dimUomId);
	switch(volUom) {
		case 'dm^3':	
            dimUom.value = "dm";
		break;
        case 'cm^3':
            dimUom.value = "cm";
		break;
        case 'mm^3':
            dimUom.value = "mm";
		break;
        case 'm^3':
            dimUom.value = "m";
		break;

        case 'km^3':
            dimUom.value = "km";
		break;
        case 'ft^3':
            dimUom.value = "ft";
		break;
        case 'yd^3':
            dimUom.value = "yd";
		break;
        case 'in^3':
            dimUom.value = "in";
		break;
		case 'fur^3':
			dimUom.value = "fur";
		break;
		case 'mi^3':
			dimUom.value = "mi";
	}
} 
 
function initUom(label,name,code){
		var id = "btn"+label;
		var id2 = "DESP_"+label;
		var id3 = "ATT_"+label;
		var uomBtn = document.getElementById(id);
		uomBtn.disabled=true;
		document.getElementById(id2).value=name;
		document.getElementById(id3).value=code;
}

function initialiseFields(id,val){
	if(val.length!=0){
		var price = parseFloat(val);
		document.getElementById(id).value = price.toFixed(2);
	}else{
		document.getElementById(id).value = "";
	}
}

///////////////////////////////////////////
function isDateCorrect(startDate,endDate){
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

   if(end <= start) 
   	{ 
      return false; 
   	} 
   	else
   		return true;
}
//////////////////////////////////////////////
function findStyleSheetRule(sStyleSheet, sRule) {
  var oRule = null;
  var oReg = new RegExp(sStyleSheet, "i");
  for (var i=1;i<document.styleSheets.length;i++) {
    if ( oReg.test(document.styleSheets[i].href)) {
      var oCSS = new TCSS();
      oCSS.init(i);
      var iRule = oCSS.findRule(sRule);
      if ( iRule >= 0)
        oRule = oCSS.rules[iRule];
      break;
    }
  }
  return oRule;
};
/////////////////////////////////////////////////////

function cloneObj(oi) {
	if (!oi)
		return null;
	var oo;
	if (oi.constructor == Array) {
		oo = [];
		for(var i=0,l=oi.length; i<l; i++) {
			oo[i] = cloneObj(oi[i]);
		}
	} else if (typeof(oi) == "object") {
		oo = {};
		for (var p in oi) {
			oo[p] = cloneObj(oi[p]);
		}
	} else {
		oo = oi;
	}
	return oo;
}

Date.prototype.DateAdd = function(strInterval, Number) {   
	var dtTmp = this;  
	switch (strInterval) {   
	     case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));  
	     case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));  
	     case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));  
	     case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));  
	     case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));  
	     case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
	     case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
	     case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
	}  
}

function StringToDate(DateStr) {   
  
    var converted = Date.parse(DateStr);  
    var newDate = new Date(converted);  
    if (isNaN(newDate)) {   
        //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
        var arys= DateStr.split('-');  
        newDate = new Date(arys[0],--arys[1],arys[2]);  
    }  
    return newDate;  
}  

function ERPHelp(ctxId,pageid){
//this is for the technical writer to see the page id;
	//alert(pageid);
	//$("divWinHeader").innerHTML = pageid;
		RH_ShowHelp(0,'/WebHelp/index.htm>WithNavPane',HH_HELP_CONTEXT,ctxId);
}
//according to issue EBOX-2975, add an method format time to HH:mm
function checkAndFormatTime(timeString) {
	var reg = /[a-zA-Z]/;
	if (reg.test(timeString)) {
		return false;
	} else {
		var val = ignoreSpecialCharacterForTime(timeString);
		if (val.length == 0)
			return false;
		var arr = val.split(":");
		var hour;
		var mins;
		if (arr.length == 1) {
			if (arr[0].length <= 2) {
				hour = arr[0];
				mins = "00";
			} else if (arr[0].length == 3) {
				hour = arr[0].substring(0, 1);
				mins = arr[0].substring(1, 3);
			} else if (arr[0].length == 4) {
				hour = arr[0].substring(0, 2);
				mins = arr[0].substring(2, 4);
			} else {
				return false;
			}
		} else if (arr.length == 2) {
			hour = arr[0];
			mins = arr[1];
		} else {
			return false;
		}
		if (parseInt(hour) > 23) {
			return false;
		}
		if (parseInt(mins) > 59) {
			return false;
		}
		if (hour.length == 1) {
			hour = "0" + hour;
		}
		if (mins.length == 1) {
			mins = mins + "0";
		}
		return hour + ":" + mins;
	}
}
function ignoreSpecialCharacterForTime(timeString) {
	var reg = /[^0-9:]/gi;
	timeString = "" + timeString;
	var val = timeString.replace(reg, '');
	if (val) {
		return val;
	} else
		return "";
}

function focusAndHighLightElm(elm) {
	if(elm && elm.tagName == 'INPUT') {
		elm.focus();
		_hl_focusx(elm);
	}
}

function updateProvincesAfterCountryChanged(newCountryVal, provinceElement, callback){
	if(provinceElement){
		Ext.Ajax.request({ 
			url: "/app/" + $F("APP_NAME") + "/province/list/getProvincesList",
			params: { country: newCountryVal},
	   		success: function(request,  response,  options){
				Ext.getCmp(provinceElement.id).setValue("");
				var provinces = Ext.util.JSON.decode(request.responseText).data;
				Ext.getCmp(provinceElement.id).getStore().loadData(provinces);
		   	   	if(callback) callback(provinceElement);
	   		},
	   		failure: function(request,  response,  options){
	   			alert('Update Province List Failed.');
	   		}
		});
	}
}

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
	}
} 

function catchKeyDown(evt){ 
	evt = (evt) ? evt : ((window.event) ? window.event : ""); 
	var key = isIe ? evt.keyCode : evt.which;
	if (evt.keyCode == 13) {
		var el = evt.srcElement || evt.target; 
		if ((el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "select") && el.type != "submit") { 
			if (isIe) {
				//evt.keyCode = 9;//'tab' key
			}
			else {
				//nextCtl(el).focus(); 
				evt.preventDefault(); 
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
//under two methods use in exporting grid as excel start
function getColumnConfigArray(grid){
	var array = new Array();
	var fieldConfigure = grid.colModel;
	if(fieldConfigure){
		var configItems = fieldConfigure.config; 
		if(configItems){ 
			if(configItems.length > 0){
				for ( var i = 0; i < configItems.length; i++) {
					var elment = configItems[i];
					if(!CUtils.isTrueVal(elment.hidden) && elment.header.indexOf('<input') < 0){//hidde the check all column
						var configObj = {};
						configObj[elment.id] = elment.header;
						array.push(configObj);
					}
				}
			}
		}
	}
	return array;
}
function exportExcelList(grid, getListSearchParams, pathParam){
	var path = pathParam || $('_FROM_URI__').value;
	var parameters = {};
	if(getListSearchParams && typeof(getListSearchParams) == 'function'){
		parameters = getListSearchParams();
	}
	if(!Strings.isEmpty(path)){
		if(Strings.isEmpty(pathParam)) {
			var position = path.lastIndexOf('\/');
			path = path.substring(0, position) + "/exportGridExcel";
		}
		var url = path + "?columnConfig=" + 
							Ext.util.JSON.encode(getColumnConfigArray(grid)) + 
								"&" + Ext.urlEncode(parameters);
		
		document.forms["noDataForm"].action = url;
		document.forms["noDataForm"].submit();
	}
}
//end------------------------------------------------------------