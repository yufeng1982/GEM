<script type="text/javascript"><!--
	Ext.BLANK_IMAGE_URL = "/images/blank.gif";
	Ext.PagingToolbar.prototype.beforePageText = "${f:getText('com.Ext.pagingToolBar.beforePageText')}";
	Ext.PagingToolbar.prototype.afterPageText = "${f:getText('com.Ext.pagingToolBar.afterPageText')}";
	Ext.PagingToolbar.prototype.displayMsg = "${f:getText('com.record.displayMsg')}";
	Ext.PagingToolbar.prototype.emptyMsg = "${f:getText('com.NoRecord.displayMsg')}";
	Ext.form.ComboBox.prototype.loadingText = "${f:getText('Com.Search')}";
    Ext.form.ComboBox.prototype.emptyText = "${f:getText('Com.Select')}";
    var DEFAULT_PAGE_SIZE = ${f:getAppSetting('erp.app.page.default.size')};
    var DEFAULT_NEW_ID = "NEW";
    var GRID_ID = "GRID";

	Ext.override(Ext.util.Observable, {
		hasEvent: function(eventName){
			var evt = this.events[eventName];
			return Ext.isObject(evt) || (evt === true);
		},
		removeListeners: function(eventName){
			var evt = this.events[eventName];
			if(Ext.isObject(evt)){
				evt.clearListeners();
			}
		},
		removeEvent: function(eventName){
			this.removeListeners(eventName);
			delete this.events[eventName];
		}
	});

	Ext.override(Ext.grid.RowSelectionModel, {
		onEditorKey : function(field, e) {
			var sm = this;
	        var k = e.getKey(), newCell, g = sm.grid, ed = g.lastEdit;  
	        if (k == e.ENTER) {  
	            e.stopEvent();  
	            //ed.completeEdit();  
	            if (e.shiftKey) {  
	                newCell = g.walkCells(ed.row, ed.col - 1, -1, sm.acceptsNav, sm);  
	            } else {  
	                newCell = g.walkCells(ed.row, ed.col + 1, 1, sm.acceptsNav, sm);  
	            }  
	        } else if (k == e.TAB) {  
	            e.stopEvent();  
	           // ed.completeEdit();  
	            if (e.shiftKey) {  
	                newCell = g.walkCells(ed.row-1, ed.col, -1, sm.acceptsNav, sm);  
	            } else {  
	                newCell = g.walkCells(ed.row+1, ed.col, 1, sm.acceptsNav, sm);  
	            }  
	            if (ed.col == 1) {  
	                if (e.shiftKey) {  
	                    newCell = g.walkCells(ed.row, ed.col + 1, -1, sm.acceptsNav, sm);  
	                } else {  
	                    newCell = g.walkCells(ed.row, ed.col + 1, 1, sm.acceptsNav, sm);  
	                }  
	            }  
	        } else if (k == e.ESC) {  
	            //ed.cancelEdit();  
	        }  
	        if (newCell) {  
	            g.startEditing(newCell[0], newCell[1]);  
	        }
//	        else {
//	        	newCell = g.walkCells(0, 0, 0, sm.acceptsNav, sm);
//	        	g.startEditing(newCell[0], newCell[1]);  
//	        }
	    }
	});
	
    var COMMONBUNDLE = {};
    COMMONBUNDLE["Alert.WeCannotProcessYourRequest"] = "${f:getText('Alert.WeCannotProcessYourRequest')}";
    
	function formSubmit(action) {
		if(action) $("_action__").value = action;
		document.forms[0].submit();
	}
	function redirectFormSubmit(action,showMainFrameMask) {
		if(typeof(showMainFrameMask) == 'undefined') {
			showMainFrameMask = true;
		}
		beginWaitCursor("Processing",showMainFrameMask);
		appendFormAction(action);
		formSubmit(action);
	}
	function setFormAction(url) {
		document.forms[0].action = url;
	}
	function appendFormAction(url) {
		document.forms[0].action += url;
	}

	function submitForm(action) {
		if(action && action == 'cancel'){
			cancelForm();
			return;
		}
		var msg = new Array();
		msg.addAll(commonComponentValidate());
		if (typeof(window["__formValidationBeforeSave"]) == 'function') {
			msg.addAll(__formValidationBeforeSave());
		}
		if (msg.length == 0 || action.indexOf("cancel") != -1) {
			if (typeof(window["__formProcessingBeforeSave"]) == 'function') {
				__formProcessingBeforeSave();
			}
			redirectFormSubmit(action);
		} else {
			processValidateMessages(msg);
		}
	}

	function cancelForm(){
		if (window.opener) {
	        var parentLauncher = getParentLauncher("${varName}");
	        if (parentLauncher) {
	            if (parentLauncher.callBack) {
	                parentLauncher.callBack("${_action__}");
	            }
	        }
	        window.close();
		}
	    else if (window.parent.dialogArguments) {
	        window.parent.dlgClose("${_action__}");
	    }
	}
	
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
	//under two methods use in exporting grid as excel end
--></script>