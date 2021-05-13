var _waitMask = null;
var _defaultPopUpSelectLauncher = null;

var bIsGUIBusy = false;
var bIsFormDirty = false;
Ext.onReady( function() {
	
	
	//defaults to 'maximized', if you want to change it, please set the property is false that named 'maximizedWindow'. 
	//For example  : LauncherUtils's showPopupSelector.
	_maximizedDocumentWindow();
	
	page_OnLoad();
	
	
	if(initKeyDownHandle && typeof(window["initKeyDownHandle"]) == 'function') {		
		initKeyDownHandle();
	}
	if (typeof(window["_after_page_OnLoad"]) == 'function') { 
		_after_page_OnLoad();
	}
	if (typeof(window["page_AfterLoad"]) == 'function') { 
		page_AfterLoad();
	}
	if (typeof(window["_processSecurityResources"]) == 'function') { 
		_processSecurityResources();
	}
	if (typeof(window["page_AfterProcessSecurityResources"]) == 'function') { 
		page_AfterProcessSecurityResources();
	}
	if (typeof(window["initErrorMessageTips"]) == 'function') { 
		initErrorMessageTips();
	}
	this.focus();

    var frm = document.forms[0];
    if (frm)
        frm.onsubmit = beginWaitCursor;

    ////////////////////////////////////////////////////////////////////////////////
	try {
	    window.parent.endWaitCursor();
	} 
	catch (ex) {
	}
	
	// Simulate tab key by pressing enter key
	try {
		_enterAsTab();
	}
	catch (ex) {
	}
	
	// will be phase out after henry's version of seaching select is complete
   	try {
        _adjustFldBtnPos(document.body);
    } catch (ex) {
        //debugger;
        //alert(ex);
    }
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	_createLauncherForm();

	//add generic highlight feature
	_addHighLightForInput();
}); 
/*

window.onbeforeunload = function (e) {
	  var e = e || window.event;

	  // For IE and Firefox
	  if (e) {
	    e.returnValue = 'Any string';
	  }

	  // For Safari
	  return 'Any string';
	};

*/	
function _addHighLightForInput(){
	var elements = document.getElementsByTagName("input");
	for (var i=0,l=elements.length; i<l; i++) {
		if (elements[i].type != "button" && elements[i].type != "submit" && elements[i].type != "reset" && elements[i].type != "hidden") {
			Ext.EventManager.on(elements[i], "focus" , _hl_focus);
			Ext.EventManager.on(elements[i], "blur", _hl_blur);
			Ext.EventManager.on(elements[i], "keydown", _hl_keydown);
		}
	}
}

function _enterAsTab() {
	var tagName = "";
	var all = [];
	 
	// all elements by sort by tabIndex
	var inputs = Ext.query("input[tabindex]");
	var selects = Ext.query("select[tabindex]");
	var buttons = Ext.query("button[tabindex]");
	all  = all.concat(inputs,selects,buttons);
	
	all.sort(_AscSort);
	
	Ext.each(all,function(o,i,all){
		var keymapObj = Ext.get(o).addKeyMap({
	        key : 13,
	        fn : function() {

	        	// blur
	        	var id = o.id;
	        	if(id && (id.indexOf('ext-gen') == 0 || id.indexOf('-inputEl') > -1) 
	        			&& o.name.indexOf('DESP_') == 0) {
	        		id = o.name.lastStr();
	        	}
	        	var cmp = Ext.getCmp(id);
	        	if(cmp) {
	        		if(cmp.picker) {
	        			var selection;
	                    Ext.Array.forEach(cmp.picker.all.elements || [], function(element) {
	                        if (element && element.getAttribute('class') == "x-boundlist-item x-boundlist-item-over") {
	                            selection = cmp.picker.getRecord(element) ;
	                        }
	                    });
	        			cmp.fireEvent('select', cmp, [selection]);
	        		}
	        		cmp.blur();
	        		cmp.fireEvent("blur", cmp);
	        	} else {
	        		o.blur();
	        	}
	        	
	        	var nextO = _getNextDom(all,i);
	        	
	        	// tab
	            try{
	            	if(nextO) {
	            		nextO.focus();
	            	}
	            }catch(e){event.keyCode=9;}
	            if(nextO&&/button|reset|submit/.test(nextO.type)){
//	            	nextO.click();   //if buttons, click on it
	            	nextO.onkeypress = function () {
	            		document.getElementById(nextO.id).focus(); 
	            		return false;
	            	};
	            }
	            
	            return Ext.EventObject.TAB;
	        }
	    });
		
		if(!Ext.get(o).$$keymapObj) Ext.get(o).$$keymapObj = keymapObj;
		
	});
	
	return all;
}
function _getNextDom(all,i) {
	var _tabIndexNum = 0;
	
	do {
		
		// dead loop check
		_tabIndexNum++;
		if(all.length == 0 || _tabIndexNum == all.length) {
			return null;
		}
		
		// when reach the last, move to the first
		if((i+1) == all.length) {
			i = -1;
		}
		
		i = i + 1;
	}while (!_canTab(all[i]));
	
	_tabIndexNum = 0;
	
	return all[i];
}
function _canTab(obj) {
	if(obj) {
		if(obj.type == 'hidden' || obj.disabled) {
			return false;
		} else if(obj.style){
			return _isVisibile(obj);
		}
	}
	return true;
}
function _isVisibile(obj) {
	if(obj.style.display == 'none' || obj.style.visibility == 'hidden') {
		return false;
	} else if(obj.parentNode && obj.parentNode.style) {
		return _isVisibile(obj.parentNode);
	}
	return true;
}
function _AscSort(x, y) {
	return x.tabIndex == y.tabIndex ? 0 : (x.tabIndex > y.tabIndex ? 1 : -1);
}
function _hl_focus(a,b) {
	if (typeof b.old_className == 'undefined') {
		b.old_className = b.className;
		b.className =b.className + ' textFieldFocusClass';
	}
	
}
function _hl_blur(a,b) {
	if(!Strings.isEmpty(b.old_className)) {
		b.className = b.old_className ||'';
	}
	try {
		delete b.old_className;
	} catch (e) {
		b.old_className = undefined;
	}
}

function _hl_focusx(elm) {
	if (typeof elm.old_className == 'undefined') {
		elm.old_className = elm.className; 
		elm.className =elm.className + ' textFieldFocusClass';
	}
}
function _hl_blurx(elm) {
	elm.className = elm.old_className ||'';
	try {
		 delete elm.old_className;
	 } catch (e) {
		 elm.old_className = undefined;
	 }
}
function _hl_keydown(evt) {
	if((evt.getKey() == Ext.EventObject.BACKSPACE) && this.readOnly){evt.stopEvent();}
}

function _showBusy() {
	beingBusyCursor();
};
function _hideBusy() {
	endBusyCursor();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function page_OnSubmit() {
	document.forms[0].hiddenSubmitButton.click();
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function _createLauncherForm() {
	var frm = document.createElement("FORM");
	frm.id = "launcherForm";
	frm.name = frm.id;
	document.body.appendChild(frm);
	frm = null;
}

/////// new resize need to take care this (may be)
/*
if($("btnMiniHelp")) {
			$("btnMiniHelp").style.left = (getWindowWidth() - 28) + "px";
			$("btnMiniHelp").style.top = "12px";
		}
*/		


Ext.EventManager.on(window, "unload", function () {
    //winHeader = null;
    //winContent = null;
    //winFooter = null;
	_defaultPopUpSelectLauncher = null;
	_waitMask = null;
	_busyCursor = null;

});

/////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////
var _busyCursor = null;
function beingBusyCursor() {
	if (!_busyCursor) {
		_busyCursor =  Ext.DomHelper.append(document.body,
		{tag:"img",
		width:20,
		height:20,
		src : "/images/throbber.gif",
		style:"position:absolute;"
		});
		
		
	}
	_busyCursor.show();
	_busyCursor.bringToFront();
	Ext.on(document.body, "mousemove" , throbber_onmousemove);
}

function throbber_onmousemove(e) {
	e = e || window.event;
	var cX = Ext.isIE?e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft:e.clientX + window.scrollX;
    var cY = Ext.isIE?e.clientY + document.documentElement.scrollTop  + document.body.scrollTop :e.clientY + window.scrollY;
  	_busyCursor.setXY([  cX +12 , cY +12]);
}

function endBusyCursor() {
	if (_busyCursor) {
		Ext.un(document.body, "mousemove" , throbber_onmousemove);
		_busyCursor.hide();
	}
}
////////////////////////////////////////////////////////////////////////////////
function beginWaitCursor(msg,showMainFrameMask) {
	if(typeof(showMainFrameMask) == 'undefined') {
		showMainFrameMask = true;
	}
	if (!bIsGUIBusy) {
		//if (
		bIsGUIBusy = true;
		_createWaitMask(msg);
		if (window.parent && window.parent.beginWaitCursor && CUtils.isTrueVal(showMainFrameMask)) {
			window.parent.beginWaitCursor();
		}
	}
};

function endWaitCursor() {
	if (bIsGUIBusy) {
		bIsGUIBusy = false;
		if ((typeof(domapi) != "undefined") && domapi) {
			_waitMask.hide();
		} else {
			try {
			_waitMask.hide();
			_waitMask=null;
			} catch (ex) {}			
		}
		if (window.parent && window.parent.endWaitCursor) {
			window.parent.endWaitCursor();
		}
	}
};

function _createWaitMask(msg) {
	var tmpDiv = _waitMask;
	if (!tmpDiv) {
		var tmpmsg = msg;
		if (Strings.isEmpty(tmpmsg)) {
			tmpmsg= "&nbsp;";
		}
		tmpDiv = new Ext.LoadMask(document.body,{msg:tmpmsg,removeMask:true});
		tmpDiv.show();
	}else {
		tmpDiv.hide();
	}
	_waitMask = tmpDiv;
};


/// The functions in below no longer needed, will be phase out soon

function getViewPointHeight(){
	if (window.innerHeight){
		return window.innerHeight;
	}

	if (document.documentElement && document.documentElement.clientHeight){
		// IE6 Strict
		return document.documentElement.clientHeight;
	}

	if (document.body){
		// IE
		return document.body.clientHeight;
	}

	return 0;
}
						
/* to the window client area height, support both moz and ie */
function getWindowHeight() {
	//if (typeof domapi != "undefined") return domapi.bodyHeight();
    var windowHeight = 0;
    if (typeof (window.innerHeight) == 'number') {
        windowHeight = window.innerHeight;
    } else{
        if (document.documentElement && document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight;
        } else{
            if (document.body && document.body.clientHeight) {
                windowHeight = document.body.clientHeight;
            }
        }
    }
    return windowHeight;
};

function getWindowWidth() {
	if (typeof domapi != "undefined") return domapi.bodyWidth();
    var windowWidth = 0;
    if (typeof (window.innerWidth) == 'number') {
        windowWidth = window.innerWidth;
    } else{
        if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else{
            if (document.body && document.body.clientWidth) {
                windowWidth = document.body.clientWidth;
            }
        }
    }
    return windowWidth;
};
function getRuntimeStyle(el,styleProp)
{
	if (el.currentStyle) {
        return el.currentStyle[styleProp];
    }
    if (typeof(document.defaultView) == 'undefined') {
        return undefined;
    }
    if (document.defaultView == null) {
        return undefined;
    }
    var style = document.defaultView.getComputedStyle(el, null);
    if (typeof(style) == "undefined" || style == null) {
        return undefined;
    }
    return style.getPropertyValue(styleProp);
}

function _errEnd(){
	var err =	document.getElementById("divErrorInfoPanel");
	if(err) 
		err.style.display ="none";
}
function _adjustFldBtnPos(srcObj) {
	var elms = srcObj.getElementsByTagName("BUTTON");
	for (var i = elms.length-1; i > -1 ; i--) {
		var elm = elms[i];
		if (elm.className.indexOf("browseBtnPopup") > -1) {
			var idr = elm.id.indexOf("_");
			var id = null;
			if (idr>-1)
				//btnPopUpSelect_
				id = elm.id.substring(15);
			else
				//handle old code	
				id = elm.id.substring(3);
			//debugger;
			//Debug.writeln(elm.id);
			var fld = document.getElementById("DESP_" + id);
			if (fld) { 
				var x =  fld.offsetHeight +2;
				if(Ext.isIE) x-=1;
				
				elm.style.height = x+ "px";
				elm.style.width = x + "px"
				if (Ext.isIE)
				elm.style.marginTop = "0px";
				if(!Ext.isIE)
				elm.style.marginBottom = "-1px"
				elm.style.marginLeft = (Ext.isIE)? (-x+1) + "px":(-x-1) + "px"
				//fix the right side of the fieldRow
				//elm.style.lineHeight= (x)+"px";
				elm.style.marginRight = -x + "px";
				//Debug.writeln(fld.id + " h " + elm.style.heigh + " w " + elm.style.width  );
			}
		}
	}
};

function _maximizedDocumentWindow(){
	if(window.opener && window.opener.LUtils){
		var pLaunchers = window.opener.LUtils;
		var parentLauncher = pLaunchers.getLauncher(document.getElementById("varName").value);
		if(parentLauncher && parentLauncher.maximizedWindow){
			LUtils.resizeToWindow(0, 0, screen.availWidth, screen.availHeight);
		}
	}
}

function ss_icon(cls) {
	return '<span class="ss_icon ' + cls + '">&nbsp;</span>&nbsp;';	
}
window.onblur = function(e){
    isTargetWindow = true;
};
window.onfocus = function(){
    isTargetWindow = false;
};