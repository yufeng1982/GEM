var globalValidate={};
function processValidateMessages(ida){
	var msg = COMMONBUNDLE["Alert.WeCannotProcessYourRequest"] + "<br><br>";
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
	Ext.Msg.show({
		title:'Warning',
	   	msg: msg,
	   	closable: false,
	   	buttons: Ext.Msg.OK,
		minWidth: 300,
	   	maxWidth: 700,
	   	icon: Ext.MessageBox.WARNING
	});
	try {
		processHighlightFieldRow(ida);
	} catch (ex) {}
}
function processHighlightFieldRow(ar) {
    for (var i = 0; i < ar.length; i++) {
        var elm =$(ar[i].fieldname) ? $(ar[i].fieldname) : $('VAL_' + ar[i].fieldname);
		if (elm && elm != null && elm.tagName != "DIV") {
			if(elm.parentNode.className.indexOf("x-form-field") == -1) {
				elm = elm.parentNode;
			}
			if(typeof(elm) != 'undefined') {
				Ext.get(elm).highlight("ffff66", {
					attr: "background-color",
					duration:10
				});
			}
		}
    }
}
////////////////////////////////////////////////////////////////////////

var VUtil = {};

VUtil.processValidateMessages = processValidateMessages;

VUtil.isFloat = function(val) {
	if (Strings.isEmpty(val)) return false;
	return (val == String(val).match(new RegExp("[+-]{0,1}\\d*\\.{0,1}\\d*"))[0]);
}
VUtil.isInteger = function (val) {
if (Strings.isEmpty(val)) return false;
	return val==parseInt(val,10);
}

VUtil.isPositiveFloat = function (val){
	return (VUtil.isFloat(val) && (parseFloat(val) >= 0));
}
VUtil.isValidTime = function (val){
	if(Strings.isEmpty(val)) return true;
	var reg = new RegExp("^([0-1][0-9]|[2][0-3])((:[0-5][0-9]){1,2})$");
	if(reg.test(val)){
		return true;
	} else {
		return false;
	}
}

VUtil.isPositiveInteger = function (val){
	if (VUtil.isInteger(val) && (parseInt(val) >= 0)){
		if(typeof val == "number"){
			return true;
		} else if (val.indexOf('.')>=0){
			return false;
		} else return true;
	}else return false;
}

////////////////////////////////////////////////////////////////////////

function validatePositiveValue(value, helpStr){
	if(VUtil.isFloat(value) && (parseFloat(value) >= 0)) {
		value = parseFloat(value).toFixed(2);
		return true;
	}
	
	alert(helpStr + " is expecting a positive number.");
	return false;
}

function validateFloatDecimal(value, decimal){
	if(VUtil.isFloat(value)) {
		var valueStr = value.toString();
		var subFloat = valueStr.substring(0,valueStr.indexOf(".")+1+decimal);
		if(value == parseFloat(subFloat)){
			return true;
		}
	}
	return false;
}

function validatePositivePercent(percent){
	if((VUtil.isFloat(percent) && (parseFloat(percent) >= 0) && (parseFloat(percent) <= 100))) {
		value = parseFloat(percent).toFixed(2);
		return true;
	}
	return false;
}

function validatePositivePercentValue(value, helpStr){
	if(validatePositivePercent(value)) {
		return true;
	}
	
	alert(helpStr + " must be between 0 and 100.");
	return false;
}

function validatePercent(percent){
	if((VUtil.isFloat(percent) && (parseFloat(percent) >= -100) && (parseFloat(percent) <= 100))) {
		value = parseFloat(percent).toFixed(2);
		return true;
	}
	return false;
}

function verifyNumString(numString){
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
}

function validateStringDuration(stringDuration, helpStr) {
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

}

function validateNonPositiveStringDuration(stringDuration, helpStr) {
	stringDuration = stringDuration.trim();
	var numString = stringDuration.substring(0,stringDuration.length - 1);
	var periodUnit = stringDuration.charAt(stringDuration.length-1).toUpperCase();
	var validString = "DWMQY";
	if((numString.length != 0 && VUtil.isFloat(numString) && !(validString.indexOf(periodUnit) < 0)) || stringDuration == ''){
		return true;
	}
	alert("'" + stringDuration + "' is not a valid "+helpStr+".\nThe "+helpStr+" should be composed of a positive number followed\nby a valid period unit where a period unit can be:\n 	D for days\n 	W for weeks\n 	M for months\n 	Q for quarters\n 	and Y for Years.");
	return false;
}

function isDateAfter(startDate,currentDate){
	return compareDates(startDate,currentDate,true);
	
}
function isDateStrictlyAfter(startDate,currentDate){
	return compareDates(startDate,currentDate,false);
	
}
function compareDates(startDate,endDate,bSuperiorOrEqual){
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
}
function compareDateTime(date1,date2){
	var d1 = date1.substring(0,date1.indexOf("T"));
	var t1 = date1.substring(date1.indexOf("T")+1,date1.length);
	var d2 = date2.substring(0,date2.indexOf("T"));
	var t2 = date2.substring(date2.indexOf("T")+1,date2.length);
	return (compareDates(d1,d2,false) && compareTimes(t1,t2,false));
}
function compareTimes(t1,t2,bSuperiorOrEqual){
	if(validateTime(t1) && validateTime(t2)){
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

}



function validateEmail(str) {
	/*
     var emailReg = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
     
     var regex = new RegExp(emailReg);
    
     return regex.test(src);
     
	*/
	var r1 = new RegExp("(@.*@)|(\\.\\.)|(@\\.)|(^\\.)");
	var r2 = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
	return (!r1.test(str) && r2.test(str));
}
///////////////////////////////////////
//validate file type,if it's diffrent,return false
//fileName and fileType are the arguments,
//important: we can extend the file type list, what we need to do is only putting the file type into the list.
//example: extend image list, add "jiff", just append "jiff" into imageList
function fileTypeValidate(fileName,fileType){

	//get file name and extention name
	//var fileName=$("PB__FileInput").value;
	var fileExName=getFileExName(fileName);
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
}

//get one file's extention name, filename is the argument
function getFileExName(fileName){
	var dotIndex=fileName.lastIndexOf(".");
	return fileName.substring(dotIndex+1);
}
function validateTime(n){

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
}

/**
 * validate array element uniqueness
 * if it is not unique, return false
 */
function validateArrayValueUnique (arr){
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
}

/**
 * validate records data unique base on colnames
 * @param records record[], like extGrid.getStore().data.getRange();
 * @param colNames array, like ["colName1","colName2"];
 */
function validateUniqueRecords (records,colNames){
    var i = 0, j = 0,equalNum = 0;
    if (records && records[0]) {
     	if(colNames == null || colNames.length == 0) {
     		colNames = [];
			for(var k = 0; k < records[0].fields.keys.length;k++){//grid column name
				if(records[0].fields.keys && records[0].fields.keys[k] != "id"){
					colNames.push(records[0].fields.keys[k]);
				}
			}
     	}
    } else {
    	return true;
    }
    while (undefined !== records[i]){
        j = i + 1;
        equalNum = 0;
        while(undefined !== records[j]){
        	equalNum = 0;
        	for(var m = 0;m < colNames.length;m++){        		
	            if (records[i].get(colNames[m]) == records[j].get(colNames[m])) {
	            	equalNum++;
	            }
        	}
        	if(equalNum == colNames.length){
        		return false;
        	}
            ++j;
        }
        ++i;
    }
    return true;
}
function warehouseValidate(warehouseCmpId, callbackFun) {
	var warehouseId = Ext.getCmp(warehouseCmpId).getValue();

	if(!Strings.isEmpty(warehouseId) && warehouseId != $F('currentPrimaryWarehouse') && warehouseId != $F('currentSecondaryWarehouse')) {
		Ext.MessageBox.confirm('Confirm', "You are neither operating on your primary warehouse nor secondary warehouse, do you want to continue?", callbackFun);
		return false;
	}
	return true;
}
// for new validators /////////////////////////////////////////////////////////////////////////////////////////////////////////////
var formaters = [];
formaters['Integer'] = function(id, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero) {
	if($(id) && !Strings.isEmpty($(id).value)) {
		$(id).value = parseInt($(id).value);
	}
}
formaters['Float'] = function(id, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero) {
	if($(id) && !Strings.isEmpty($(id).value)) {
		notNull = notNull || false;
		ignoreEndZeros = ignoreEndZeros || false;
		ignoreBeginZero = ignoreBeginZero || false;
		decimalNumber = decimalNumber || 2;
		$(id).value = formatFloat($(id).value, decimalNumber, notNull, ignoreEndZeros, ignoreBeginZero);
	}
}
function formateData(args) {
	if(formaters[args["dataType"]]) {
		if(args["type"] && args["type"] == "minMax") {
			formaters[args["dataType"]](args["id"] + "Min", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
			formaters[args["dataType"]](args["id"] + "Max", args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
		} else {
			formaters[args["dataType"]](args["id"], args["decimalNumber"], args["notNull"], args["ignoreEndZeros"], args["ignoreBeginZero"]);
		}
	}
}
var validators = [];
validators['text'] = [];
validators['text']['notNull'] = function(id, label){
	return validateNotNull(id, label);
}
validators['select']=[];
validators['select']['notNull'] = function(id, label){
	return validateComboboxNotNull(id, label);
}

validators['select_nb']=[];
validators['select_nb']['notNull'] = function(id, label){
	return validateComboboxNotNull(id, label);
}
validators['date']=[];
validators['date']['notNull'] = function(id, label){
	return validateDateNotNull(id, label);
}
validators['date_nb']=[];
validators['date_nb']['notNull'] = function(id, label){
	return validateDateNotNull(id, label);
}
validators['time']=[];
validators['time']['notNull'] = function(id, label){
	return validateTimeNotNull(id, label);
}
validators['dateTime']=[];
validators['dateTime']['notNull'] = function(id, label){
	var msgarray = new Array();
	msgarray.addAll(validateDateNotNull(id+'_date', label));
	if(msgarray && msgarray.length == 0){
		msgarray.addAll(validateTimeNotNull(id+'_time', label));
	}
	return msgarray;
}
validators['searchingSelect']=[];
validators['searchingSelect']['notNull'] = function(id, label){
	var msgarray = new Array();
	if(Strings.isEmpty(Ext.getCmp(id).getValue())){
		msgarray.push({fieldname:id,message:label+" cannot be empty ", arg: null});
	}
	return msgarray;
}
validators['text_nb']=[];
validators['text_nb']['notNull'] = function(id, label){
	return validateNotNull(id, label);
}

validators['currency']=[];
validators['currency']['notNull']=function(id, label){
	return validateNotNull(id, label);
}

validators['text']['Integer'] = function(id, label){
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value) && !VUtil.isPositiveInteger($(id).value)){
		msgarray.push({fieldname:id,message:label+" is invalid integer number ", arg: null});
	}
	return msgarray;
}
validators['text']['Float'] = function(id, label){
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value) && !VUtil.isFloat($(id).value)) {
		msgarray.push({fieldname: id, message: label + " is invalid float number ", arg: null});
	}
	return msgarray;
}
validators['text']['decimalNumber'] = function(id, label, decimalNumber){
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value)) {
		var value = parseFloat($(id).value);
		var pow = Math.pow(10, decimalNumber);
		var newValue = Math.round(value * pow) / pow;
		if(newValue != value) {
			msgarray.push({fieldname: id, message: label + " is invalid float number, decimal place must less than " + decimalNumber, arg: null});
		}
	}
	return msgarray;
}
validators['text']['minValue'] = function(id, label, minValue) {
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value)) {
		var value = dv($(id).value);
		if( value < minValue) {
			msgarray.push({fieldname: id, message: label + " must not be less than " + minValue, arg: null});
		}
	}
	return msgarray;
}
validators['text']['maxValue'] = function(id, label, maxValue) {
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value)) {
		var value = dv($(id).value);
		if( value > maxValue) {
			msgarray.push({fieldname: id, message: label + " must not be great than " + maxValue, arg: null});
		}
	}
	return msgarray;
}
validators['text_nb']['Integer'] = function(id, label){
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value) && !VUtil.isPositiveInteger($(id).value)){
		msgarray.push({fieldname:id,message:label+" is invalid integer number ", arg: null});
	}
	return msgarray;
}
validators['text_nb']['Float'] = function(id, label){
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value) && !VUtil.isFloat($(id).value)){
		msgarray.push({fieldname: id, message: label + " is invalid float number ", arg: null});
	}
	return msgarray;
}
validators['text_nb']['maxValue'] = function(id, label, maxValue) {
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value)) {
		var value = dv($(id).value);
		if( value > maxValue) {
			msgarray.push({fieldname: id, message: label + " must not be great than " + maxValue, arg: null});
		}
	}
	return msgarray;
}
validators['text_nb']['minValue'] = function(id, label, minValue) {
	var msgarray = new Array();
	if(!Strings.isEmpty($(id).value)) {
		var value = dv($(id).value);
		if( value < minValue) {
			msgarray.push({fieldname: id, message: label + " must not be less than " + minValue, arg: null});
		}
	}
	return msgarray;
}
validators['minMax']=[];
validators['minMax']['notNull'] = function(id, label) {
	var msgarray = new Array();
	var minId = id + 'Min';
	var maxId = id + 'Max';
	msgarray.addAll(validateNotNull(minId, label + 'Min'));
	msgarray.addAll(validateNotNull(maxId, label + 'Max'));
	return msgarray;
}
validators['minMax']['decimalNumber'] = function(id, label, decimalNumber){
	var msgarray = new Array();
	var minId = id + 'Min';
	var maxId = id + 'Max';
	if(!Strings.isEmpty($(minId).value)) {
		var value = parseFloat($(minId).value);
		var pow = Math.pow(10, decimalNumber);
		var newValue = Math.round(value * pow) / pow;
		if(newValue != value) {
			msgarray.push({fieldname: id, message: label + "'s min value is invalid float number, decimal place must less than " + decimalNumber, arg: null});
		}
	}
	if(!Strings.isEmpty($(maxId).value)) {
		var value = parseFloat($(maxId).value);
		var pow = Math.pow(10, decimalNumber);
		var newValue = Math.round(value * pow) / pow;
		if(newValue != value) {
			msgarray.push({fieldname: id, message: label + "'s max value is invalid float number, decimal place must less than " + decimalNumber, arg: null});
		}
	}
	return msgarray;
}
validators['minMax']['Integer'] = function(id, label) {
	var msgarray = new Array();
	var minId = id + 'Min';
	var maxId = id + 'Max';
	if(!Strings.isEmpty($(minId).value) && !VUtil.isPositiveInteger($(minId).value)){
		msgarray.push({fieldname:id, message:label+" is invalid integer number ", arg: null});
	}
	if(!Strings.isEmpty($(maxId).value) && !VUtil.isPositiveInteger($(maxId).value)){
		msgarray.push({fieldname:id, message:label+" is invalid integer number ", arg: null});
	}
	return msgarray;
}
validators['minMax']['Float'] = function(id, label){
	var msgarray = new Array();
	var minId = id + 'Min';
	var maxId = id + 'Max';
	if(!Strings.isEmpty($(minId).value) && !VUtil.isFloat($(minId).value)){
		msgarray.push({fieldname: id, message: label + " is invalid float number ", arg: null});
	}
	if(!Strings.isEmpty($(maxId).value) && !VUtil.isFloat($(maxId).value)){
		msgarray.push({fieldname: id, message: label + " is invalid float number ", arg: null});
	}
	return msgarray;
}
validators['minMax']['notGT'] = function(id, label) {
	var msgarray = new Array();
	var minId = id + 'Min';
	var maxId = id + 'Max';
	if(!Strings.isEmpty($(minId).value) && VUtil.isFloat($(minId).value)) {
		if(!Strings.isEmpty($(maxId).value) && VUtil.isFloat($(maxId).value)) {
			if(dv($(minId).value) > $(maxId).value) msgarray.push({fieldname: id, message: label + "'s min value must less than max value.", arg: null});
		}
	}
	return msgarray;
}
validators['minMax']['minValue'] = function(id, label, minValue) {
	var msgarray = new Array();
	var minId = id + "Min";
	if(!Strings.isEmpty($(minId).value) && VUtil.isFloat($(minId).value)) {
		if(dv($(minId).value) < minValue) {
			msgarray.push({fieldname: minId, message: label + "'s min value must not be less than " + minValue, arg: null});
		}
	}
	return msgarray;
}
validators['minMax']['maxValue'] = function(id, label, maxValue) {
	var msgarray = new Array();
	var maxId = id + "Max";
	if(!Strings.isEmpty($(maxId).value) && VUtil.isFloat($(maxId).value)) {
		if( dv($(maxId).value) > maxValue) {
			msgarray.push({fieldname: maxId, message: label + "'s max value must not be great than " + maxValue, arg: null});
		}
	}
	return msgarray;
}
function commonComponentValidate(){
	var msgarray = new Array();
	for(var p in globalValidate) {
		var param = globalValidate[p];
		var arr;
		if(param && !Strings.isEmpty(param.id) && validators[param.type]){
			if(!Strings.isEmpty(param.notNull) && param.notNull == 'true'){
				arr = validators[param.type]['notNull'](param.id, param.label);
			    msgarray.addAll(arr);
			}
			if(!Strings.isEmpty(param.dataType) && validators[param.type][param.dataType]){
				arr = validators[param.type][param.dataType](param.id, param.label);
			    msgarray.addAll(arr);
			}
			if(!Strings.isEmpty(param.notGT) && param.notGT == 'true') {
				arr = validators[param.type]['notGT'](param.id, param.label);
			    msgarray.addAll(arr);
			}
			if(!Strings.isEmpty(param.decimalNumber)) {
				arr = validators[param.type]['decimalNumber'](param.id, param.label, param.decimalNumber);
			    msgarray.addAll(arr);
			}
			if(!Strings.isEmpty(param.minValue)) {
				arr = validators[param.type]['minValue'](param.id, param.label, param.minValue);
			    msgarray.addAll(arr);
			}
			if(!Strings.isEmpty(param.maxValue)) {
				arr = validators[param.type]['maxValue'](param.id, param.label, param.maxValue);
			    msgarray.addAll(arr);
			}
		}
	}
	return msgarray;
}
function validateNotNull(id, label) {
	var msgarray = new Array();
	if(Strings.isEmpty($(id).value)){
		msgarray.push({fieldname:id,message:label+" cannot be empty", arg:null});
	}
	return msgarray;
}
function validateComboboxNotNull(id, label) {
	var msgarray = new Array();
	if(Strings.isEmpty(getComboBoxFieldValue(id))){
		msgarray.push({fieldname:id,message:label+" cannot be empty", arg:null});
	}
	return msgarray;
}
function validateDateNotNull(id, label){
	var msgarray = new Array();
	if(Strings.isEmpty(getDateFieldValue(id))){
		msgarray.push({fieldname: id, message: label + " cannot be empty", arg:null});
	}
	return msgarray;
}
function validateTimeNotNull(id, label){
	var msgarray = new Array();
	if(Strings.isEmpty(getTimeFieldValue(id))){
		msgarray.push({fieldname: "TF_" + id, message: label + " cannot be empty", arg:null});
	}
	return msgarray;
}

/* propertyName should same as the node's id */
function commonValidateUnique(propertyName, elementId, type, url) {
	var newValue = $(elementId).value;
	var UniqueUrl = url;
	var propType = type || 'string';
	if(Strings.isEmpty(UniqueUrl)) {
		UniqueUrl = document.forms[0].action  + "isUnique/" + propType;
	}
	Ext.Ajax.request ({
		url : UniqueUrl,
		params : {propertyName : propertyName, newValue : newValue, elementId : elementId},
		success : commonValidateUnique_callBack
	});
}

function commonValidateUnique_callBack(request, response, options) {
	var returnVal = Ext.util.JSON.decode(request.responseText);
	var elementId = returnVal.elementId;
	var obj = $(elementId);
	var parentObj = obj.parentNode;
	var divId = elementId + "_isUnique";
	var msgDiv = $(divId);  
    if(msgDiv) {
    	parentObj.removeChild(msgDiv);  
    }
	if(returnVal && !returnVal.isUnique) {
        var msgDiv = document.createElement("DIV");
        msgDiv.id = divId;
        msgDiv.style.color = "red";
        msgDiv.style.fontSize = "13px";
        msgDiv.innerHTML = elementId +" is already exist.";
        parentObj.appendChild(msgDiv);
	}
}
//copy from ErpExtUtil.js fixing function not found problem
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

function sv(value) {
	return value ? value : "";
}
function dv(value) {
	return value ? parseFloat(value) : 0.0;
}
function iv(value) {
	return value ? parseInt(value) : 0;
}

//end ---------------------------------------------------