Ext.define('ERP.BaseAction' , {
	
	corporation : null,
	plant : null,
	loadMark : null,
	
	constructor : function(config) {
		if(!config || !config.corporation) {
			this.corporation = $('defaultOwnerCorporation') ? $('defaultOwnerCorporation').value : "";
		}
		if(!config || !config.plant) {
			this.plant = $('currentPlant') ? $('currentPlant').value : "";
		}
		Ext.apply(this, config);
		
		return this;
	},
	
	getCorporation : function() {
		return this.corporation;
	},
	getPlant : function() {
		return this.plant;
	},
	
	filedOnchange: function(onchangeString, id) {
		var ocs = onchangeString.split(",");
		for(var i=0; i<ocs.length; i++) {
			PAction[ocs[i]]($(id));
		}
	},
	
	filedOnkeydown: function(event, onkeydownString, id) {
		event = this.fixEvent(event);
		var targetElement = $(id);
		if(CUtils.getS(id)) {
			targetElement = CUtils.getS(id);
		} else if(CUtils.getSS(id)) {
			targetElement = CUtils.getSS(id);
		} 
		
		PAction[onkeydownString](targetElement, event);
	},
	fixEvent : function (event) {
		event = event || window.event;
		if (!event.preventDefault) {
			event.preventDefault = function () {
				event.returnValue = false;
			};
		}
		
		if (!event.stopPropagation) {
			event.stopPropagation = function () {
				e.cancelBubble = true;
			};
		}
		
		return event;
	},
	common_ss_onclick : function (cmp, paramObj) {
		paramObj['gridUrl'] = "maintenance/_includes/_maintenanceGrid";
		paramObj['callBack'] = "common_ss_callBack";
		LUtils.showPopupSelector(paramObj);
	},
	// if want to set other properties may be override this function
	common_ss_callBack : function(cmpId, action, returnVal, param) {		
		if (action == "ok") {
			if(returnVal[0]){
				CUtils.setSSValue(cmpId,returnVal[0][param.valueField], returnVal[0][param.displayField]);
				if(param["onchange"]){
					PAction[param["onchange"]](returnVal[0][param.valueField], returnVal[0][param.displayField],returnVal[0],CUtils.getSS(cmpId));
				}
			}
		}
	},
	commonSourceEntitySecondOnchange : function(value, text, record, combo) {
		if(!Strings.isEmpty(combo.secondOnchange)) {
			if(!Strings.isEmpty(value)) {
				if(combo.isPopup && combo.popupLoadBySourceEntity == 'T') {
					PAction[combo.secondOnchange](value, text, record, combo);
					return true;
				}
				beginWaitCursor("", true);
				Ext.Ajax.request({
					url : '/app/core/entity/form/' + record['ownerType'] + '/'+ value + '/json',
					success : function(response) {
						var record = CUtils.jsonDecode(response.responseText);
						PAction[combo.secondOnchange](value, text, record, combo);
						endWaitCursor();
					},
					failure: function(a,b){
						endWaitCursor();
					}
				});
			} else {
				PAction[combo.secondOnchange]('', '', {}, combo);
			}
			
		}
		return true;
	},
	// set load mark for alone component
	showLoadMark : function (id, msg) {
		var me = this;
		var mask = new Ext.LoadMask(id, {msg:msg, removeMask : true});
		mask.on('show', function (cpt,eopts) {
			PAction.loadMarkShowEvent();
		});
		mask.show();
		me.loadMark = mask;
		return me.loadMark;
	},
	hideLoadMark : function (isDisabled) {
		this.loadMark.hide();
		this.loadMarkHideEvent(isDisabled);
	},
	loadMarkShowEvent : function () {
	},
	loadMarkHideEvent : function (isDisabled) {
	}
});
	
Ext.define('ERP.FormAction' , {	
	extend : 'ERP.BaseAction',

	entityId : null,

	//override it if you need
	formProcessingBeforeValidation : Ext.emptyFn,
	//override it if you need
	formProcessingBeforeSave : Ext.emptyFn,
	//override it if you need
	formValidationBeforeSave : Ext.emptyFn,
	
	//override it if you need
	// return an array of message
	getFormConfirmMsg : Ext.emptyFn,
	
	//override it if you need
	// return true to submit form
	formConfirmYes : function(){
		return true;
	},
	
	//override it if you need
	// return true to submit form
	formConfirmNo : function(){
		return false;
	},
	
	constructor : function(config) {
		this.callParent([config]);
		
		if(!config || !config.entityId) {
			this.entityId = $('entityId') ? $('entityId').value : DEFAULT_NEW_ID;
		}
		Ext.apply(this , config);
		
		return this;
	},
	
	getEntityId : function() {
		return this.entityId;
	},
	
	isNew : function(){
		return this.getEntityId() == DEFAULT_NEW_ID;
	},
	hasError : function() {
		if((typeof (errorMsg) != "undefined") && !Strings.isEmpty(errorMsg)) {
			return true;
		}
		return false;
	},
	submitForm : function(action) {
		if (this.formProcessingBeforeValidation) {
			this.formProcessingBeforeValidation();
		}
		
		VUtils.removeAllErrorFields();
		
		var msg = new Array();
		msg.addAll(VUtils.commonComponentValidate());
		if (this.formValidationBeforeSave) {
			msg.addAll(this.formValidationBeforeSave());
		}
		if (msg.length == 0 || action.indexOf("cancel") != -1) {
			if (this.formProcessingBeforeSave) {
				this.formProcessingBeforeSave();
			}
			this.redirectFormSubmit(action);
		} else {
   		 	endWaitCursor();
			VUtils.processValidateMessages(msg);
		}
	},

	cancelForm : function(){
		if (window.opener) {
	        var parentLauncher = LUtils.getParentLauncher($F("varName"));
	        if (parentLauncher) {
	            if (parentLauncher.callBack) {
	                parentLauncher.callBack($F("_action__"), null, null, parentLauncher);

	            }
	        }
	        window.close();
		}
	    else if (window.parent.dialogArguments) {
	        window.parent.dlgClose($F("_action__"));
	    }
	},
	
	redirectFormSubmit : function(action, showMainFrameMask) {
		this.appendFormAction(action);
		this.formSubmit(action);
	},
	
	appendFormAction : function(url) {
		if (document.forms[0].action.indexOf(url) < 0) {
			document.forms[0].$oldAction = document.forms[0].action;
			document.forms[0].action += url;
		}
	},
	
	removeFromAction : function(url) {
		if (document.forms[0].action.indexOf(url) > 0) {
			document.forms[0].action = document.forms[0].$oldAction;
		}
	},
	
	formSubmit : function(action) {
		if(action) $("_action__").value = action;
		
		document.forms[0].submit();
	},
	
	doOk : function() {
		this.save("ok");
	},
	doCancel : function() {
		if (window.opener) {
			if(window.opener.PApp){
				if (window.opener.PApp.grid) {
					window.opener.PApp.grid.store.load();
				}
			}
		}
		window.close();
		//this.save('cancel');
	},
	doApply :function() {
		this.save("apply");
	},
    save : function(action) {
	
    	var me = this;
    	
    	if(action && action == 'cancel') {
    		me.cancelForm();
			return;
		}
    	
    	var msgArray = me.getFormConfirmMsg();
    	
    	if(msgArray && msgArray.length > 0) {
    		
    		var msg = this.buildMsg(msgArray);
    		
    		Ext.Msg.show({
			      title:PRes['Confirm'] || 'Confirm',
			      msg: msg,
			      buttons: Ext.Msg.YESNO,
			      fn: function (/*buttonId*/ buttonId) {
			    	 if(buttonId == "yes") {
			    		if(me.formConfirmYes()) {
			    		 	 me.showMask();
			    			 me.submitForm(action);
			    		 } else {
			    			 endWaitCursor();
			    		 }
			    	 } else if(buttonId == "no") {
			    		 if( me.formConfirmNo()) {
			    		 	 me.showMask();
			    			 me.submitForm(action);
			    		 } else {
			    			 endWaitCursor();
			    		 }
			    	 }
			      },
			      icon: Ext.Msg.QUESTION
			 });
    	} else {
    		me.showMask();
    		this.submitForm(action);
    	}
    },
	showMask : function () {
		if(typeof(showMainFrameMask) == 'undefined') {
			showMainFrameMask = true;
		}
		beginWaitCursor("Processing", showMainFrameMask);
	},
	buildMsg : function (msgArray){
		var msg = "";
		for(var i = 0 ; i < msgArray.length ; i++){
			if(i != msgArray.length - 1){
				msg += msgArray[i]+"<br>";
			}else{
				msg += msgArray[i];
			}
		}
		return msg;
	}
});


Ext.define('ERP.ListAction' ,{
	extend : 'ERP.BaseAction',
	
	launcherFuncName : null,
	
	createParams : null,
	
	gridAutoLoad : true,
	
	getGridSearchPara : Ext.emptyFn,
	
	constructor : function(config) {
		this.callParent([config]);
		
		Ext.apply(this, config);
		
		var me = this;
		
		PApp.grid.on('itemdblclick', function(/* Ext.view.View*/ view, /*Ext.data.Model*/ record, /*HTMLElement*/ item, /*Number*/ index, /*Ext.EventObject*/ e ){
			me.gridItemDBClick(view, record, item, index, e);
		}); 
		
		if(this.gridAutoLoad){
			this.doSearch();
		}
		
		return this;
	},
	
	gridItemDBClick : function(view , record , item  , index , e){
		var param = this.prepearShowParams(record);
		this.doShow(param);
	},
	
    doCreate : function(){
    	
    	if(this.launcherFuncName){
    		var func = this.launcherFuncName;
    		LUtils[func](this.createParams);
    	}
    },
    
    doShow : function(param){
    	if(this.launcherFuncName){
    		var func = this.launcherFuncName;
    		LUtils[func](param);
    	}
    },
    
    reloadDefaultGrid : function() {
    	this.doSearch();
    },
    
    searchValidate : Ext.emptyFn,
    
    validate : function() {
		var msgarray = [];
		msgarray.addAll(this.searchValidate());
		if (msgarray.length > 0) {
			VUtils.processValidateMessages(msgarray);
			return false;
		}
		return true;				
	},
    
    doSearch : function() {
    	if(this.validate()) {
    	   var searchParams =  this.getSearchParams();
    	   PApp.grid.store.proxy.extraParams = {};
	       Ext.apply(PApp.grid.store.proxy.extraParams, searchParams);
	       PApp.grid.getStore().loadPage(1);
//	       PApp.grid.getStore().load();
    	}
    },
    getSearchParams : function(){
    	
    	   var searchParams ={};
		   if($('historical') && $('historical').value)  searchParams = {'historical' : $('historical').value};
		   
	       var params = this._getSearchParames();
	       if(params){
	    	   Ext.apply(searchParams, params);
	       } 
	       if(PApp.defaultSearchPara){
    		   Ext.apply(searchParams, PApp.defaultSearchPara);
	       }
	       if (this.getGridSearchPara) {
	    	   Ext.apply(searchParams, this.getGridSearchPara());
    	   }
	       return searchParams;
    },
    doReset : function(){
    	if(PApp.filterForm) {
    		this.cleanFields();
			
    		this.doSearch();
    	}
    },
    cleanFields : function() {
    	var myForm = PApp.filterForm.getForm();
		
		// myForm.reset();
		// reset one by one, ignore the disable field
		
		var items = myForm.getFields().items;
		for (var i = 0; i < items.length; i ++) {
			var field = items[i];
			if(field.disabled === true) {
				continue ;
			} else {
				// TODO, fuck extjs, HACK for now, have check if it could be fix in extjs next version
				var xtype = field.xtype;
				if(xtype == 'erpsearchingselect' || xtype == 'SelectField') {
					field.setSelectValue('', '');
				} else if (xtype == 'checkboxfield') {
					field.checked = true;
					field.setValue(true)
				} else {
					field.setValue('');
				}
			}
		}
    },
    
    prepearShowParams : function(record){
    	return {id : record.get('id') };
    },
    
    _getSearchParames : function() {
    	var params = {};
    	if(PApp.filterForm) {
    		var myForm = PApp.filterForm.getForm();
    		params = myForm.getValues();

			// TODO, fuck extjs, HACK for now, have check if it could be fix in extjs next version
			var items = myForm.getFields().items;
			for (var i = 0; i < items.length; i ++) {
				var field = items[i];
				var name = field.name;
				var xtype = field.xtype;
				if(field.disabled === true) {
					params[name] = field.getValue();
				}
				if(xtype == 'erpsearchingselect') {
					params[name] = field.getSelectValue();
				}
			}
			//////////////////////////////////////////////////////////////////////////////////////
    	}
    	return params;
    }
});