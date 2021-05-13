function common_searchingSelect_onclick(cmp, paramObj) {
	var cmpId = cmp.id;
	var url = cmp.getStore().proxy.url;
	var parameters = {};
	for(var p in paramObj) {
		parameters[p] = paramObj[p];
	}
	parameters.jsonUrl = url;
	var arg = {
		cmpId : cmpId,
		gridUrl : "maintenance/_includes/_maintenancedModelGrid" ,
		initMethodName : "initGrid",
		parameters : parameters ,
		callBack : function(cmpId,action, returnVal) { 
			if (action == "ok") {
				var cmp = Ext.getCmp(cmpId);
				if(returnVal[0]){
					var isSuccess = true;
					if (paramObj && paramObj["onchange"]) {
						isSuccess = paramObj["onchange"](returnVal[0][paramObj.valueField], returnVal[0][paramObj.displayField], returnVal[0]);
					}
					if(isSuccess){
						cmp.setSelectValue(returnVal[0][paramObj.valueField], returnVal[0][paramObj.displayField]);
					}
				}
			}
		}
	};
	
	popupSelector(arg);
}

var modWinForm = null;
function mod_searchingSelect_onclick(cmp) {
	var cmpId = cmp.id;
	var arg = {
			varName: 'modWinForm',
			cmpId : cmpId,
			gridUrl : "/maintenance/mod/_includes/modListGrid" ,
			initMethodName : "initActiveModeOfDeliveryGrid",
			gridReadOnly: true,
			parameters : {} ,
			callBack : function(cmpId,action, returnVal) { 
				if (action == "ok") {
					var cmp = Ext.getCmp(cmpId);
					if(returnVal){
						var isSuccess = true;
						if(isSuccess){
							cmp.setSelectValue(returnVal[0]["id"], returnVal[0]["code"]);
						}
					}
				}
			}
	};
	modWinForm = popupSelector(arg);
}
