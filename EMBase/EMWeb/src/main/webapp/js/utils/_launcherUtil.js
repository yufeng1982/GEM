var POSITION = {MANUAL:0,AUTO:1};
function popupSelector(arg) {
	var appName = $('APP_NAME').value;
	var qs =  new QueryString();
	if (arg["cmpId"]) qs.setParameter("cmpId", arg["cmpId"]);
	if (arg["gridUrl"]) qs.setParameter("gridUrl", arg["gridUrl"]);
	if (arg["initMethodName"]) qs.setParameter("initMethodName", arg["initMethodName"]);
	if (arg["parameters"]) qs.setParameter("parameters", jsonEncode(arg["parameters"]));
	if (typeof arg["searchable"] != "undefined") {
		qs.setParameter("searchable", arg["searchable"]);
	} else {
		qs.setParameter("searchable", true);
	}
	
	if (arg["multiple"]) qs.setParameter("multiple", arg["multiple"]);
	if (arg["queryParameterName"]) qs.setParameter("queryParameterName", arg["queryParameterName"]);
	var url = "/app/"+ appName + "/ui/popup/" + arg["cmpId"] + "/show";
	var oLauncher =  new Launcher((arg["varName"] ? arg["varName"] : "PopUpSelect_" + arg["cmpId"]), url);
    oLauncher.arguments = qs;
    oLauncher.windowMode = LAUNCHER.WINDOW;
    oLauncher.top = (arg["y"])? arg.y:160;
    oLauncher.left = (arg["x"])? arg.x:470;
    oLauncher.width = (arg["w"])? arg.w:440;
    oLauncher.height = (arg["h"])? arg.h:500;
    if (arg["callBack"])  {
		oLauncher.callBack = function (action, returnVal) {
			arg["callBack"](arg["cmpId"], action, returnVal);
			if (this.free)
				this.free();
		};
	} else {
		oLauncher.callBack = function (action, returnVal) {
			if (action == "ok" || action == "OK") {
				var isSuccess = true;
				var selectedValue ="";
				var selectedText = "";
				if(returnVal[0]){
					selectedValue = returnVal[0][arg["valueField"]?arg["valueField"]:"id"];
					selectedText = returnVal[0][arg["displayField"]?arg["displayField"]:"name"];
				}
				if (arg["onchange"]) {
					isSuccess = arg["onchange"](selectedValue, selectedText, returnVal[0]);
				}
				if(isSuccess) {
					var popupSelectorCMP = Ext.getCmp(arg["cmpId"]);
					popupSelectorCMP.setSelectValue(selectedValue, selectedText);
					
				}
			}
			if (this.free)
				this.free();
		};
	}
    oLauncher.open();
	if (!arg["varName"]) {
		window["PopUpSelect_" + arg["cmpId"]] = oLauncher;
	} 
	return oLauncher;
}

var aboutWin=null;
function About() {
	
	var url = "/about.jsp";
	
	var oLauncher =  new Launcher("aboutWin", url);
   // oLauncher.arguments = qs;
    oLauncher.setCord({y:100, x:100, w:600, h:470});
    
    oLauncher.open();
	return oLauncher;
	
}
// contact /////////////////////////////////////////////////////////////////////////
function showContactById(id) {
	return showContact({contactId:id});
}
function showContact(arg) {
	if(Strings.isEmpty(arg['contactId'])) {
		return;		
	}
	var url = "/app/" + $F('APP_NAME') + "/crm/contact/form/" + arg['contactId'] + "/show";
	var qs = new QueryString();
//	for (var p in  arg) {
//		if((typeof arg[p] != "function") && (typeof arg[p] != "undefined"))
//			qs.addParameter(p,arg[p]);
//	}
	var contactFormWin = new Launcher('contactFormWin', url);
	contactFormWin.arguments = qs;
	
	contactFormWin.setCord({y:30, x:60, w:1100, h:630});
    
	contactFormWin.callBack = arg["callBack"];
	contactFormWin.open();
	return contactFormWin;
}
// customer ////////////////////////////////////////////////////////////////////////////
function showCustomerById(id) {
	return showCustomer({customerId:id});
}
function showCustomer(arg) {
	if(Strings.isEmpty(arg['customerId'])) {
		return;		
	}
	var url = "/app/"+$F('APP_NAME')+"/crm/customer/form/" + arg['customerId'] + "/show";
	var qs = new QueryString();
//	for (var p in  arg) {
//		if((typeof arg[p] != "function") && (typeof arg[p] != "undefined"))
//			qs.addParameter(p,arg[p]);
//	}
	var customerFormWin = new Launcher('customerFormWin', url);
	customerFormWin.arguments = qs;
	
	customerFormWin.setCord({y:30, x:50, w:1080, h:650});
    
	customerFormWin.callBack = arg["callBack"];
	customerFormWin.open();
	return customerFormWin;
}
// vendor ////////////////////////////////////////////////////////////////////////////
function showVendorById(id) {
	return showVendor({vendorId:id});
}
function showVendor(arg) {
	if(Strings.isEmpty(arg['vendorId'])) {
		return;		
	}
	var url = "/app/"+$F('APP_NAME')+"/crm/vendor/form/" + arg['vendorId'] + "/show";
	var qs = new QueryString();
//	for (var p in  arg) {
//		if((typeof arg[p] != "function") && (typeof arg[p] != "undefined"))
//			qs.addParameter(p,arg[p]);
//	}
	var vendorFormWin = new Launcher('vendorFormWin', url);
	vendorFormWin.arguments = qs;
	
	vendorFormWin.setCord({y:30, x:50, w:1080, h:650});
    
	vendorFormWin.callBack = arg["callBack"];
	vendorFormWin.open();
	return vendorFormWin;
}
/////////////////////////////////////////////////////////////////////////////////////////
function showSourceEntityLog(arg) {
	if(Strings.isEmpty(arg["referEntityId"]) && Strings.isEmpty(arg["refer"])) {
		return ;
	}
	var url = "/app/"+$F('APP_NAME')+"/log/list/show";
	var qs = new QueryString();
	for (var p in  arg) {
		if((typeof arg[p] != "function") && (typeof arg[p] != "undefined"))
			qs.addParameter(p,arg[p]);
	}
	var sourceEntityLogWin = new Launcher('sourceEntityLogWin', url);
	sourceEntityLogWin.arguments = qs;
	
	sourceEntityLogWin.setCord({y:30, x:50, w:980, h:500});
    
	sourceEntityLogWin.callBack = arg["callBack"];
	sourceEntityLogWin.open();
	return sourceEntityLogWin;
}
var stockCardWin = null;
function showStockCard(itemId, warehouseId, ownerCompanyId) {
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/cumulativeFact/list/show";
	var qs = new QueryString();
	qs.setParameter("item", itemId);
	qs.setParameter("warehouse", warehouseId);
	qs.setParameter("company", ownerCompanyId);
	stockCardWin = new Launcher('stockCardWin', url);
	stockCardWin.arguments = qs;
	
	stockCardWin.setCord({y:30, x:80, w:1080, h:600});
    
	stockCardWin.callBack = function() {
		stockCardWin = null;
	};
	stockCardWin.open();
	return stockCardWin;
}
var itemAvailabilityWin = null;
function showItemAvailability(itemId, warehouseId, ownerCompanyId) {
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/planning/availableBalance/list/show";
	var qs = new QueryString();
	qs.setParameter("item", itemId);
	qs.setParameter("warehouse", warehouseId);
	qs.setParameter("company", ownerCompanyId);
	itemAvailabilityWin = new Launcher('itemAvailabilityWin', url);
	itemAvailabilityWin.arguments = qs;
	
	itemAvailabilityWin.setCord({y:60, x:80, w:680, h:620});
    
	itemAvailabilityWin.callBack = function() {
		itemAvailabilityWin = null;
	};
	itemAvailabilityWin.open();
	return itemAvailabilityWin;
}
var itemTransactionWin = null;
function showItemTransaction(itemId, warehouseId, ownerCompanyId, headerSourceId, isHideInternalLedger) {
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/itemTransaction/list/show";
	var qs = new QueryString();
	qs.setParameter("item", itemId);
	qs.setParameter("warehouse", warehouseId);
	qs.setParameter("company", ownerCompanyId);
	if(headerSourceId) qs.setParameter("headerSourceId", headerSourceId);
	qs.setParameter("isHideInternalLedger", true);
	itemTransactionWin = new Launcher('itemTransactionWin', url);
	itemTransactionWin.arguments = qs;
	
	itemTransactionWin.setCord({y:60, x:80, w:1000, h:660});
    
	itemTransactionWin.callBack = function() {
		itemTransactionWin = null;
	};
	itemTransactionWin.open();
	return itemTransactionWin;
}

var netRequirementWin = null;
function showNetRequirement(itemId, warehouseId, ownerCompanyId) {
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/planning/netRequirement/show";
	var qs = new QueryString();
	qs.setParameter("item", itemId);
	qs.setParameter("warehouse", warehouseId);
	qs.setParameter("company", ownerCompanyId);
	netRequirementWin = new Launcher('netRequirementWin', url);
	netRequirementWin.arguments = qs;
	
	netRequirementWin.setCord({y:60, x:80, w:1080, h:680});
    
	netRequirementWin.callBack = function() {
		netRequirementWin = null;
	};
	netRequirementWin.open();
	return netRequirementWin;
}
var valueEntriesWin = null ;
function showValueEntries(itemId, warehouseId, ownerCompanyId){
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/fina/valueEntry/list/show";
	var qs = new QueryString();
	qs.setParameter("itemId", itemId);
	qs.setParameter("warehouseId", warehouseId);
	qs.setParameter("companyId", ownerCompanyId);
	valueEntriesWin = new Launcher('valueEntriesWin', url);
	valueEntriesWin.arguments = qs;
	
	valueEntriesWin.setCord({y:60, x:80, w:1080, h:680});
    
	valueEntriesWin.callBack = function() {
		valueEntriesWin = null;
	};
	valueEntriesWin.open();
	return valueEntriesWin;
}

var distributionEntriesWin = null ;
function showDistributionEntries(docSourceEntityId){
	if(Strings.isEmpty(docSourceEntityId)) return;
	var url = "/app/"+$F('APP_NAME')+"/fina/distributionEntry/list/show";
	var qs = new QueryString();
	qs.setParameter("docSourceEntityId", docSourceEntityId);
	distributionEntriesWin = new Launcher('distributionEntriesWin', url);
	distributionEntriesWin.arguments = qs;
	
	distributionEntriesWin.setCord({y:60, x:80, w:1080, h:680});
    
	distributionEntriesWin.callBack = function() {
		distributionEntriesWin = null;
	};
	distributionEntriesWin.open();
	return distributionEntriesWin;
}

var itemReservationWin = null;
function showItemReservation4Supply(orderId, orderType, callbackFun) {
	return showItemReservation("to", orderId, orderType, "", "", callbackFun);
}
function showItemReservation4Demand(orderId, orderType, lineId, expectFromOnHandQty, callbackFun) {
	return showItemReservation("from", orderId, orderType, lineId, expectFromOnHandQty, callbackFun);
}
function showItemReservation(type, orderId, orderType, lineId, expectFromOnHandQty, callbackFun) {
	if(DEFAULT_NEW_ID == orderId || Strings.isEmpty(orderId) || Strings.isEmpty(orderType)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/reservation/" + type + "/" + orderType + "/" + orderId;
	var qs = new QueryString();
	qs.setParameter("line", lineId);
	if(!expectFromOnHandQty || Strings.isEmpty(expectFromOnHandQty)) expectFromOnHandQty = 0;
	qs.setParameter("expectFromOnHandQty", expectFromOnHandQty);
	itemReservationWin = new Launcher('itemReservationWin', url);
	itemReservationWin.arguments = qs;
	
	itemReservationWin.setCord({y:60, x:80, w:800, h:660});
    
	itemReservationWin.callBack = callbackFun ? callbackFun : function() {
		itemReservationWin = null;
	};
	
	itemReservationWin.open();
	return itemReservationWin;
}

function showItemAllocation4Supply(orderId, orderType, callbackFun) {
	return showItemAllocation("to", orderId, orderType, "", callbackFun);
}
var itemAllocationWin = null;
function showItemAllocation(type, orderId, orderType, lineId, callbackFun) {
	if(DEFAULT_NEW_ID == orderId || Strings.isEmpty(orderId) || Strings.isEmpty(orderType)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/allocation/" + type + "/" + orderType + "/" + orderId;
	var qs = new QueryString();
	qs.setParameter("line", lineId);
	itemAllocationWin = new Launcher('itemAllocationWin', url);
	itemAllocationWin.arguments = qs;
	
	itemAllocationWin.setCord({y:60, x:80, w:1000, h:660});
    
	itemAllocationWin.callBack = callbackFun ? callbackFun : function() {
		itemAllocationWin = null;
	};
	
	itemAllocationWin.open();
	return itemAllocationWin;
}

var entityWin = null;
function showEntity(entityId, cord) {
	if(Strings.isEmpty(entityId)) return;
	var url = "/app/" + $F('APP_NAME') + "/entity/" + entityId + "/show";
	var qs = new QueryString();
	entityWin = new Launcher('entityWin', url);
	entityWin.arguments = qs;
	
	if(cord) {
		entityWin.setCord(cord);
	} else {
		entityWin.setCord({y:60, x:80, w:1080, h:680});
	}
	entityWin.callBack = function() {
		entityWin = null;
	};
	entityWin.open();
	return entityWin;
}

var unitWinForm = null;
function unitSelection_onclick(cmp, arg) {
	var url = "/app/" + $F('APP_NAME') + "/common/unit/show";
	var qs =  new QueryString();
	if (arg["unitType"]) qs.setParameter("unitType", arg["unitType"]);
	if (arg["disabledType"]) qs.setParameter("disabledType", arg["disabledType"]);
	unitWinForm = new Launcher('unitWinForm', url);
	unitWinForm.arguments = qs;
	
	unitWinForm.setCord({x:450, y:30, w:200, h:300});
	unitWinForm.callBack = function(action, returnVal){unitSelection_callBack(cmp, action, returnVal,arg);};
	unitWinForm.open();
}

function unitSelection_callBack(cmp, action, returnVal,arg) {
	if(action == "ok") {
		cmp.setSelectValue(returnVal.unitId, returnVal.unitId);
		
		if (arg["onchange"]) {
			arg["onchange"](cmp, action, returnVal);
		}
		
	}
	unitWinForm = null;
}

function itemUnitSelection_onclick(cmp , arg){
	//unitSelection_onclick(name,{unitType:"le",disabledType:true});
	arg.unitType = "ea";
	unitSelection_onclick(cmp , arg);
}
function lengthUnitSelection_onclick(cmp , arg){
	arg.unitType = "le";
	arg.disabledType = true;
	unitSelection_onclick(cmp , arg);
}
function volumeUnitSelection_onclick(cmp , arg){
	arg.unitType = "vo";
	arg.disabledType = true;
	unitSelection_onclick(cmp , arg);
}
function weightUnitSelection_onclick(cmp , arg){
	arg.unitType = "we";
	arg.disabledType = true;
	unitSelection_onclick(cmp , arg);
}

var holdHistoryWinForm = null;
function showHoldHistory(arg) {
	var url = "/app/" + $F('APP_NAME') + "/product/maintenance/holdCodeEntry/form/show";
	var qs = new QueryString();
	var entityId = arg['entityId'];
	var winName = arg['winName'] || 'holdHistoryWinForm';
	qs.setParameter("entityId",$F('ownerShipSourceEntityId'));
	holdHistoryWinForm =  new Launcher(winName, url);
	holdHistoryWinForm.arguments = qs;
	holdHistoryWinForm.setCord({y:120, x:320, w:450, h:530});
	holdHistoryWinForm.callBack = arg['callBack'] || holdHistoryWinForm_callBack;
	holdHistoryWinForm.open();
	return holdHistoryWinForm;
}

var creditWarningWin = null;
function LaunchCreditWarningWin(data, fncallback) {
    var qs =  new QueryString();
    var sub = data.split("&");    
    var creditLimitAmount = sub[0];
    var periodValue = sub[1];
    var customerAccountingValue = sub[2];
	var creditType =sub[3];
	var checkOverDue = sub[4];
	qs.setParameter("creditLimitAmount", creditLimitAmount);
	qs.setParameter("periodValue", periodValue);
	qs.setParameter("customerAccountingValue", customerAccountingValue);
	qs.setParameter("creditType",creditType);
	qs.setParameter("checkOverDue",checkOverDue);
	
	var url = "/app/" + $F('APP_NAME') + "/crm/creditLimitAmount/form/show";
	creditWarningWin =  new Launcher("creditWarningWin", url);
	creditWarningWin.arguments = qs;
	creditWarningWin.setCord({y:155, x:270, w:600, h:300});
    
	creditWarningWin.callBack = fncallback;
	creditWarningWin.open();
	return creditWarningWin;	

}

/**
 * this function use to inquiry all sales team,include (active/inactive)
 * @param {} cmp
 */
function salesTeam_onclick(cmp){
	var cmpId = cmp.id;
	var arg = {
		cmpId : cmpId,
		gridUrl : "/crm/sales/_includes/salesTeamListGrid",
		initMethodName : "initSalesTeamListGrid"
	};
	arg["parameters"] = {gridReadOnly : true, isGetAll : true , jsonUrl:"/app/" + $F('APP_NAME') + "/crm/sales/salesTeams/search"};
	popupSelector(arg);
}


function launcherCreditLimit(arg) {
	var url = arg['url'];
	var qs = new QueryString();
	var creditLimitWinForm = new Launcher(arg['varName'], url);
	creditLimitWinForm.arguments = qs;
	creditLimitWinForm.setCord({x:350, y:120, w:420, h:500});
	creditLimitWinForm.callBack = arg['callBack'];
	creditLimitWinForm.open();
	return creditLimitWinForm;
}


function launchLocationProp(arg) {

    var qs =  new QueryString();
    qs.setParameter("pageMode", arg['pageMode']);
	
	qs.setParameter("scopeObjectID", arg['scopeObjectID']);
		
	var url = arg['url'];

	var oLauncher =  new Launcher(arg['varName'], url);
    oLauncher.arguments = qs;
    oLauncher.setCord({y:155, x:370, w:700, h:580});
    
    oLauncher.callBack = arg['callBack'];
    oLauncher.open();
	return oLauncher;
}

function showItemForm(arg) {
	var url = "";
	var id = arg.id;
	if(Strings.isEmpty(id)) {
		url = "/app/core/product/item/new/" + DEFAULT_NEW_ID;
	} else {
		url = "/app/core/product/item/form/"+id+"/show";
	}
	var qs = new QueryString();
	
	for(var p in arg){
		if( typeof arg[p] == 'function') continue;
		qs.setParameter(p , arg[p]);
	}
	
	itemFormWin =  new Launcher('itemFormWin', url);
	itemFormWin.arguments = qs;
	
	itemFormWin.setCord({y:10, x:10, w:1124, h:680});
    
	itemFormWin.callBack = arg.callBack;
	itemFormWin.open();
	
	return itemFormWin;
}

var itemWinForm = null;
function launchItemWin(lineId, isDistributionItem, itemWinForm_CallBack){
	var url = "";
	if(CUtils.isTrueVal(isDistributionItem)){
		url = "/app/core/product/item/form/" + lineId + "/show";
	}else{
		url = "/app/tire/product/item/form/" + lineId + "/show";
	}
	var qs = new QueryString();
	itemWinForm = new Launcher("itemWinForm", url);
	itemWinForm.arguments = qs;
	
	itemWinForm.setCord({x:10, y:10, w:1100, h:700});
	if(itemWinForm_CallBack) {
		itemWinForm.callBack = itemWinForm_CallBack;
	} else {
		itemWinForm.callBack = function() {
			itemWinForm = null;
		};
	}
	itemWinForm.open();
}

function showTireItemForm(arg){
	var url="";
	var id = arg.id;
	if(Strings.isEmpty(id)) {
		url = "/app/tire/product/item/new/" + DEFAULT_NEW_ID;
	}else {
		url = "/app/tire/product/item/form/" + id + "/show";
	}
	var qs = new QueryString();
	
	for(var p in arg){
		if( typeof arg[p] == 'function') continue;
		qs.setParameter(p , arg[p]);
	}
	
	tireItemWinForm = new Launcher("tireItemWinForm", url);
	tireItemWinForm.arguments = qs;
	
	tireItemWinForm.setCord({x:10, y:10, w:1100, h:680});
	
	tireItemWinForm.callBack = arg.callBack;
	tireItemWinForm.open();
	return tireItemWinForm;
}

/*
 * tax schedule searching select
 * @parameter cmp : tax schedule component
 * @parameter scopeObjectType : 'SALES','PURCHASES'
 * @parameter currency
 * 
 */
var taxScheduleWinForm = null;
function launcherTaxScheduleWin(cmp,scopeObjectType,currency) {	
	var arg = {
			varName: 'taxScheduleWinForm',
			cmpId : cmp.getId(),
			gridUrl : "/fina/taxSchedule/taxScheduleGrid" ,
			initMethodName : "initTaxScheduleGrid",
			parameters : {scopeObjectType : scopeObjectType, currency:currency} ,
			callBack : taxSchedule_callBack
	};
	
	taxScheduleWinForm = popupSelector(arg);
}

function taxSchedule_callBack(cmpId, action, returnVal) {
	if(action == 'ok') {
		Ext.getCmp(cmpId).setSelectValue(returnVal[0].id, returnVal[0].TaxSchedule);
	}
	taxScheduleWinForm = null;
}

function launcherHodeCodeList(cmp, callBack) {
	var arg = {};
	arg["callBack"] = callBack;
	arg['cmpId'] = cmp?cmp.id:"";
	arg["gridUrl"] = "maintenance/_includes/_maintenancedModelGrid";
	arg["initMethodName"] = "initGrid";
	arg["varName"] = "holdCodeWinForm";
	
	var jsonUrl = "/app/" + $F('APP_NAME') + "/product/maintenance/holdCode/json";
	var columnModelConfig = [{id: 'id', fieldType: 'string', dataIndex: 'id', header: 'id'},
		{id: 'code', fieldType: 'string', dataIndex: 'code', header: 'Code'},
		{id: 'pickingOrderAllowed', checkColumn: 'true', dataIndex: 'pickingOrderAllowed', header: 'Picking Order Allowed'},
		{id: 'color', fieldType: 'colorField', dataIndex: 'color', header: 'Color'},
		{id: 'creationDate', fieldType: 'date', dataIndex: 'creationDate', header: 'creationDate'}];
	arg["parameters"] = {jsonUrl:jsonUrl, columnModelConfig:columnModelConfig};
	var holdCodeWinForm = popupSelector(arg);
	return holdCodeWinForm;
}
var salesInvoiceFormWin = null;
function launcherSIForm(args) {
	var url = "";
	if (Strings.isEmpty(args["headerId"])) {
		url = "/app/" + $F('APP_NAME') + "/document/si/form/"
				+ DEFAULT_NEW_ID + "/new";
	} else {
		url = "/app/" + $F('APP_NAME') + "/document/si/form/"
				+ args["headerId"] + "/show";
	}
	var qs = new QueryString();
	salesInvoiceFormWin = new Launcher('siFormWin', url);
	salesInvoiceFormWin.arguments = qs;
	salesInvoiceFormWin.setCord( {
		y : 30,
		x : 50,
		w : 1080,
		h : 650
	});
	if (args["callBack"]) {
		salesInvoiceFormWin.callBack = args["callBack"];
	}
	salesInvoiceFormWin.open();
	return salesInvoiceFormWin;
}

/**
 * we can use this one to open all kind of documents form
 * if you want to do some extra job in callback, please define it specific
 */
function showDocumentForm(id,type,subType) {
	var documentFormWin = null;
	var urlPrefix = "";
	
	if(Strings.isEmpty(id) || Strings.isEmpty(type)) {
		return;
	}

	urlPrefix = "/app/" + $F('APP_NAME') + "/document/" + type  ;

	if(!Strings.isEmpty(subType)) {
		urlPrefix += "/" + subType ;
	}
	urlPrefix +=  "/form/" ;
	var url = urlPrefix + id + "/show";
 
	var qs = new QueryString();
	documentFormWin = new Launcher('documentFormWin', url);
	documentFormWin.arguments = qs;
	documentFormWin.setCord({y:30, x:50, w:1080, h:650});
	documentFormWin.callBack = function(){documentFormWin = null;};
	documentFormWin.open();
}

var resizeToWindow = function(y, x, w, h) {
	window.moveTo(y, x);
	window.resizeTo(w, h);
}

var rpLineListWin = null;
function openReceiptLineList(documentFromId){
	if(Strings.isEmpty(documentFromId)) {
		return;
	}
	var url="/app/" + $F('APP_NAME') + "/document/rp/list/show";
	var qs = new QueryString();
	rpLineListWin = new Launcher('rpLineListWin', url);
	qs.setParameter("documentFromId", documentFromId);
	rpLineListWin.arguments = qs;
	rpLineListWin.setCord({y:60, x:50, w:900, h:600});
	rpLineListWin.callBack = function(){
		rpLineListWin = null;
	};
	rpLineListWin.open();
}

var rpFormWin = null;
function showRPFormViaInfoLogo(rpId) {
	if(Strings.isEmpty(rpId)) {
		return;
	}
	var url = "/app/" + $F('APP_NAME') + "/document/rp/form/"+rpId+"/show";	
	var qs = new QueryString();
	rpFormWin = new Launcher('rpFormWin', url);
	rpFormWin.arguments = qs;
	
	rpFormWin.setCord({y:30, x:50, w:1080, h:575});
    
	rpFormWin.callBack = rpFormViaInfoLogo_CallBack;
	rpFormWin.open();
}

function rpFormViaInfoLogo_CallBack(action, returnVal){
	rpFormWin = null;
}

var piFormWin = null;
function showPIFormViaInfoLogo(piId) {
	if(Strings.isEmpty(piId)) {
		return;
	}
	var url = "/app/" + $F('APP_NAME') + "/document/pi/form/"+piId+"/show";	
	var qs = new QueryString();
	piFormWin = new Launcher('piFormWin', url);
	piFormWin.arguments = qs;
	
	piFormWin.setCord({y:30, x:50, w:1080, h:575});
    
	piFormWin.callBack = piFormViaInfoLogo_CallBack;
	piFormWin.open();
}

function piFormViaInfoLogo_CallBack(action, returnVal){
	rpFormWin = null;
}

var siFormWin = null;
function showSIForm(siId, callBack_fun) {
	var url = "";
	if(Strings.isEmpty(siId)) {
		url = "/app/" + $F('APP_NAME') + "/document/si/form/" + DEFAULT_NEW_ID + "/new";
	} else {
		url = "/app/" + $F('APP_NAME') + "/document/si/form/"+siId+"/show";
	}
	var qs = new QueryString();
	siFormWin = new Launcher('siFormWin', url);
	siFormWin.arguments = qs;
	
	siFormWin.setCord({y:30, x:50, w:1080, h:650});
    
	siFormWin.callBack = callBack_fun ? siFormWin_CallBack : function(){siFormWin = null;};
	siFormWin.open();
}

var sendEmailWin = null;
function showEmailForm(args){
	var url = "/app/" +$F('APP_NAME')+"/email/form/showEmail";
	var qs = new QueryString();
	sendEmailWin =  new Launcher('sendEmailWin', url);
	qs.setParameter("documentId", args["documentId"]);
	qs.setParameter("contactId", args["contactId"]);
	qs.setParameter("documentNo", args["documentNo"]);
	qs.setParameter("roleType", args["roleType"]);
	sendEmailWin.arguments = qs;
	sendEmailWin.setCord({y:150, x:180, w:700, h:450});
	sendEmailWin.callBack =  function() {
		sendEmailWin = null;
	};
	sendEmailWin.open();
}

var locationTransferWin = null;
function showLocationTransfer(itemId, warehouseId) {
	if(Strings.isEmpty(itemId)) return;
	var url = "/app/"+$F('APP_NAME')+"/scm/inventory/locationTransfer/show";
	var qs = new QueryString();
	qs.setParameter("item", itemId);
	qs.setParameter("warehouse", warehouseId);
	qs.setParameter("isPopup", true);
	locationTransferWin = new Launcher('locationTransferWin', url);
	locationTransferWin.arguments = qs;
	
	locationTransferWin.setCord({y:60, x:80, w:1000, h:660});
    
	locationTransferWin.callBack = function() {
		locationTransferWin = null;
	};
	locationTransferWin.open();
	return locationTransferWin;
}

var cnFormWin = null;
function showCNForm(cnId, cnFormWin_CallBack) {
	var url = "";
	if(Strings.isEmpty(cnId)) {
		url = "/app/"+$F('APP_NAME')+"/document/cn/form/" + DEFAULT_NEW_ID + "/new";
	} else {
		url = "/app/"+$F('APP_NAME')+"/document/cn/form/"+cnId+"/show";
	}
	var qs = new QueryString();
	cnFormWin = new Launcher('cnFormWin', url);
	cnFormWin.arguments = qs;
	
	cnFormWin.setCord({y:60, x:50, w:1080, h:650});
    
	cnFormWin.callBack = cnFormWin_CallBack ? cnFormWin_CallBack : function(){cnFormWin = null};
	cnFormWin.open();
	return cnFormWin;
}
var resourceWin = null;
function launchReceipt(rpId){
	var url = "";
	var qs = new QueryString();
	if(!Strings.isEmpty(rpId)) {
		url = "/app/tire/document/rp/form/"+rpId+"/show";
	} else {
		return;
	}
	rpFormWin = new Launcher('rpFormWin', url);
	rpFormWin.arguments = qs;
	
	rpFormWin.setCord({y:30, x:50, w:1080, h:575});

	rpFormWin.callBack = function(){rpFormWin = null;};
	rpFormWin.open();
}
function launchPickingRpt(pickDocumentId){
	var url = "/app/"+($F('APP_NAME') || "tire")+"/document/picking/pdf/" + pickDocumentId + "/printPreview";
	documentLanucher(pickDocumentId,"headerId",url);
}
function launchSOReport(salesOrderId){
	if (salesOrderId=='bolist')
		launchBackOrderReport();
	else {
		var url = "/app/"+($F('APP_NAME') || "tire")+"/document/so/pdf/" + salesOrderId + "/printPreview";
		documentLanucher(salesOrderId,"reportType",url);
	}
}

function launchBackOrderReport(){
	var url = "/report/back_order_listViewer.jsp";
	var qs = new QueryString();
	documentRptLauncherConfig(url, qs);
}
function launchInvoiceRpt(invoiceId){
	var url = "/app/"+($F('APP_NAME') || "tire")+"/document/si/pdf/" + invoiceId + "/printPreview";
	documentLanucher(invoiceId,"invoice_id",url);
}
function launchPOReport(poId){
	var url = "/report/purchase_orderViewer.jsp";
	documentLanucher(poId,"po_id",url);
}
function launchPIReport(piId){
	var url = "/report/purchase_invoiceViewer.jsp";
	documentLanucher(piId,"pi_id",url);
}
function launchTruckRpt(truckLoadId){
	var url = "/app/"+($F('APP_NAME') || "tire")+"/document/tl/pdf/" + truckLoadId + "/printPreview";
	documentLanucher(truckLoadId,"headerId",url);
}
function launchManifestRpt(truckLoadId, ref_sequence){
	var url = "/app/"+($F('APP_NAME') || "tire")+"/document/sp/pdf/" + truckLoadId + "/printPreview";
	if(truckLoadId != ''){
		var qs = new QueryString();
		qs.setParameter("ref_sequence",ref_sequence);
		qs.setParameter("varName", "");//hack, make sure zoom is the last one
		qs.setParameter("#zoom", 100);
		documentRptLauncherConfig(url, qs);
	}
}
function launchManifestRptCrystal(truckLoadId,ref_sequence){
	var url = "/report/shipment_manifestViewer.jsp";
	if(truckLoadId != ''){
		var qs = new QueryString();
		qs.setParameter("headerId",truckLoadId);
		qs.setParameter("ref_sequence",ref_sequence);
		qs.setParameter("varName", "");//hack, make sure zoom is the last one
		qs.setParameter("#zoom", 100);
		documentRptLauncherConfig(url, qs);
	}
}
function launchROReport(roId,isFromShippingUi){
	var url = "/app/"+($F('APP_NAME') || "tire")+"/document/ro/pdf/" + roId + "/printPreview";
	if(roId != ''){
		var qs = new QueryString();
		qs.setParameter("ro_id",roId);
		qs.setParameter("from_shipment",isFromShippingUi);
		qs.setParameter("varName", "");//hack, make sure zoom is the last one
		qs.setParameter("#zoom", 100);
		documentRptLauncherConfig(url, qs);
	}
}

function launchCreditNoteRpt(cnId){
	if (cnId=='list')
		launchCreditNoteListRpt();
	else {
		var url = "/app/"+($F('APP_NAME') || "tire")+"/document/cn/pdf/" + cnId + "/printPreview";
		documentLanucher(cnId,"reportType",url);
	}
}

function launchCreditNoteListRpt() {
	var url = "/report/credit_note_listViewer.jsp";
	var qs = new QueryString();
	documentRptLauncherConfig(url, qs);
}

function launchPuchasePlanRpt(code){
	var url = "/report/puchase_plan_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	documentRptLauncherConfig(url, qs);
}

function launchInventorySummaryRpt() {
	var url = "/report/inventory_summary_viewer.jsp";
	var qs = new QueryString();
	documentRptLauncherConfig(url, qs);
}


function launchSalesQtyRpt(params){
	var url = "/report/sales_qty_report_per_month_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",params["code"]);
	qs.setParameter("startingMonth", params["month"]);
	qs.setParameter("startingYear", params["year"]);
	qs.setParameter("performance_subcategory_code", params["performance_subcategory_code"]==null || params["performance_subcategory_code"]==""?"_all_":params["performance_subcategory_code"]);
	qs.setParameter("performance_category_code", params["performance_category_type"]==null||params["performance_category_type"]==""?"_all_":params["performance_category_type"]);
	qs.setParameter("brand", params["brand_code"]==null || params["brand_code"]==""?"_all_":params["brand_code"]);
	qs.setParameter("model_codes", params["model_codes"]==null || params["model_codes"]==""?"_all_":params["model_codes"]);
	if(params["isWinter"]) {
		qs.setParameter("isWinter", params["isWinter"]);
	}
	documentRptLauncherConfig(url, qs);
}

function launchSalesMonthEndRpt(code, month, year){
	var url = "/report/sales_report_month_end_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	qs.setParameter("startingMonth", month);
	qs.setParameter("startingYear", year);
	documentRptLauncherConfig(url, qs);
}

function launchSalesRpt(code, month, year, day){
	var url = "/report/sales_report_daily_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	qs.setParameter("startingMonth", month);
	qs.setParameter("startingYear", year);
	qs.setParameter("sales_day", day);
	documentRptLauncherConfig(url, qs);
}

function launchTransferOrderRpt(headerId){
	var url = "/report/transfer_order_report_view.jsp";
	var qs = new QueryString();
	qs.setParameter("headerId",headerId);
	documentRptLauncherConfig(url, qs);
}

function launchReceiptRpt(headerId){
	var url = "/report/receipt_report_view.jsp";
	var qs = new QueryString();
	qs.setParameter("headerId",headerId);
	documentRptLauncherConfig(url, qs);
}

function launchDetilInventoryReport(code){
	var url = "/report/detail_inventory_sample_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	documentRptLauncherConfig(url, qs);
}

function launchSalesManRpt(params) {
	var qs = new QueryString();
	qs.setParameter("code",params['code']);
	qs.setParameter("startingMonth", params['month']);
	qs.setParameter("startingYear", params['year']);
	qs.setParameter("customer_nos", params['customer_nos']==null||params['customer_nos']==''?"_all_":params['customer_nos']);
	qs.setParameter("model_codes", params['model_codes']==null||params['model_codes']==''?"_all_":params['model_codes']);
	documentRptLauncherConfig(params['url'], qs);
}

function launchInventoryStockReport(code) {
	var url = "/report/inventory_stock_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	documentRptLauncherConfig(url, qs);
}

function documentLanucher(documentId, paramName, url){
	if(documentId != ''){
		var qs = new QueryString();
		qs.setParameter(paramName,documentId);
		qs.setParameter("varName", "");//hack, make sure zoom is the last one
		qs.setParameter("#zoom", 100);
		documentRptLauncherConfig(url, qs);
	}
}
var performanceCategoryWinForm = null;
function launchPerformanceCategory(retireTireItemPropertyField) {
	var url = "/app/"+$F('APP_NAME')+"/product/pcSelection/show";
	var qs = new QueryString();
	performanceCategoryWinForm = new Launcher('performanceCategoryWinForm', url);
	qs.arguments = qs;
	performanceCategoryWinForm.setCord({x:450, y:60, w:360, h:500});
	performanceCategoryWinForm.callBack = function(action, returnVal) {performanceCategoryWinForm_callBack(action, returnVal, retireTireItemPropertyField)};
	performanceCategoryWinForm.open();
}

function performanceCategoryWinForm_callBack(action, returnVal, retireTireItemPropertyField) {
	if(action == "ok") {
		Ext.getCmp('performance_category').setSelectValue(returnVal.performanceCategoryId, returnVal.performanceCategoryValue);
		if($('performance_category_type_name')) $('performance_category_type_name').value = returnVal.performanceCategoryTypeName;
		if($('performance_category_name')) $('performance_category_name').value= returnVal.performanceCategoryName;
		if(Ext.getCmp('performance_category_type'))
			Ext.getCmp('performance_category_type').setSelectValue(returnVal.performanceCategoryTypeId, returnVal.performanceCategoryTypeValue);
		if(Ext.getCmp('masterItem'))
			Ext.getCmp('masterItem').setSelectValue('', '');
		//setSelectElmValue($('serviceType'),returnVal.serviceTypeId);
		if($('serviceType'))
			$('serviceType').value = returnVal.serviceTypeId;
		if(typeof(retireTireItemPropertyField) === "function")
			retireTireItemPropertyField(returnVal.serviceTypeId);
		if(returnVal.performanceCategoryValue.match(/\w*Winter$/) && $('isWinter')) $('isWinter').checked = true;
	}
	performanceCategoryWinForm = null;
}

var masterItemWinForm = null;
function launcherMasterItem(cmp) {
	var parameters = initTireMasterItemParameters();
	var cmpId = cmp.id;
	var arg = {
			varName: 'masterItemWinForm',
			cmpId : cmpId,
			gridUrl : "/product/tireModel/_includes/tireModelListGrid" ,
			initMethodName : "initTireMasterItemGrid",
			parameters : parameters ,
			callBack : masterItem_callBack
	};
	masterItemWinForm = popupSelector(arg);
}

function masterItem_callBack(cmpid, action, returnVal) {
	if(action == 'ok') {
		var cmp = Ext.getCmp(cmpid);
		
		var id = "";
		var code = "";
		for(var i = 0; i < returnVal.length; i++) {
			id += returnVal[i].id;
			code += returnVal[i].code;
			
			if(i+1 < returnVal.length) {
				id += ",";
				code += ",";
			}
		}
		cmp.setSelectValue(id, code);
	}
	masterItemWinForm = null;
}

function launchTireTaxRpt(code, year, month) {
	var url = "/report/tire_tax_report_view.jsp";
	var qs = new QueryString();
	qs.setParameter("code",code);
	qs.setParameter("month", month);
	qs.setParameter("year", year);
	documentRptLauncherConfig(url, qs);
}

var documentRptWin = null;
function documentRptLauncherConfig(url, qs) {
	documentRptWin = new Launcher('documentRptWin', url);
	documentRptWin.arguments = qs;
	documentRptWin.windowMode = documentRptWin.WINDOW;
	documentRptWin.top = 30;
	documentRptWin.left = 30;
	documentRptWin.width=1200;
	documentRptWin.height=700;
	documentRptWin.location = false;
	documentRptWin.callBack = null;
	documentRptWin.open();
}

var creditInquiryWin = null;
function launchCreditInquiry(id) {
	if(Strings.isEmpty(id)) return;
	var url = "/app/"+$F('APP_NAME')+"/crm/customer/creditInquiry/list/show";
	var qs = new QueryString();
	qs.setParameter("customerId", id);
	creditInquiryWin = new Launcher('creditInquiryWin', url);
	creditInquiryWin.arguments = qs;
	
	creditInquiryWin.setCord({y:120, x:120, w:1000, h:580});
    
	creditInquiryWin.callBack = function() {
		creditInquiryWin = null;
	};
	creditInquiryWin.open();
	return creditInquiryWin;
}
var salesStatsWin = null;
function launchSalesStats(id) {
	if(Strings.isEmpty(id)) return;
	var url = "/app/"+$F('APP_NAME')+"/crm/customer/salesstats/list/show";
	var qs = new QueryString();
	qs.setParameter("customerId", id);
	salesStatsWin = new Launcher('salesStatsWin', url);
	salesStatsWin.arguments = qs;
	
	salesStatsWin.setCord({y:120, x:120, w:1000, h:580});
    
	salesStatsWin.callBack = function() {
		salesStatsWin = null;
	};
	salesStatsWin.open();
	return salesStatsWin;
}
var logHistory=null;
function launchLogHistory(args){
	var url = "/app/log/history/list/show";
	var qs = new QueryString();
	qs.setParameter("id", args.id);
	qs.setParameter("clazz", args.clazz);
	logHistory =  new Launcher('logHistory', url);
	logHistory.arguments = qs;
	logHistory.setCord({y:50, x:60, w:950, h:550});
	logHistory.open();
	logHistory.callBack = function() {
		logHistory = null;
	};
	return logHistory;
}