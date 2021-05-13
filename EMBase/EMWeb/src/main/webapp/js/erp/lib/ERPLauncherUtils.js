/**
 * @author FengYu
 */
Ext.define('ERP.LauncherUtils' , {
	launchers : {},
	
	addLauncher : function(launcherName, launcher) {
		this.launchers[launcherName] = launcher;
	},
	
	getLauncher : function(launcherName) {
		return this.launchers[launcherName];
	},
	defaultCallback : function(action, returnVal,params, launcher) {
		if (action == "ok" && PApp.grid) {
			PAction.reloadDefaultGrid();
		}
		if(launcher.callBackName) {
			PAction[launcher.callBackName](action, returnVal,params, launcher);
		}
		if (launcher.free) launcher.free();
	},
	removeLauncher : function(launcherName) {
		this.launchers[launcherName] = null;
	},
	
	extractId : function(args) {
		return args && args['id'] && !Strings.isEmpty(args['id']) ? args['id'] : DEFAULT_NEW_ID;
	},
	extractSourceEntityId : function(args) {
		return args && args['ownerShipSourceEntityId'] && !Strings.isEmpty(args['ownerShipSourceEntityId']) ? args['ownerShipSourceEntityId'] : DEFAULT_NEW_ID;
	},
	extractEntityId : function(args) {
		return args && args['entityId'] && !Strings.isEmpty(args['entityId']) ? args['entityId'] : DEFAULT_NEW_ID;
	},
	extractCallback : function(args) {
		return args && args['callBack'] ? args['callBack'] : null;
	},
	resizeToWindow : function(y, x, w, h) {
		window.moveTo(y, x);
		window.resizeTo(w, h);
	},
	buildQueryString : function (args){
		var qs = new QueryString();
		for (var p in args){
			if (!Strings.isEmpty(args[p])){
				qs.setParameter(p, args[p]);
			}
		}
		return qs;
	},
	
	getParentLauncher : function(varName) {
		var parentLauncher = null;
	    if (window.opener) {
	        if (varName && (varName.length > 0)) {
	            try {
	            	var pLauncher = window.opener.LUtils;
	            	parentLauncher = pLauncher.getLauncher(varName);
	            }
	            catch (E) {
	            }
	        }
	    }
	    return parentLauncher;
	},
	
	showPopupSelector : function(args) {
		var appName = $('APP_NAME').value;
		var qs = this.buildQueryString(args);
		
		if (typeof args["searchable"] != "undefined") {
			qs.setParameter("searchable", args["searchable"]);
		} else {
			qs.setParameter("searchable", true);
		}
		if (args["parameters"]) qs.setParameter("parameters", CUtils.jsonEncode(args["parameters"]));
		var url = "/app/"+ appName + "/ui/popup/" + args["cmpId"] + "/show";
		var name = args["varName"] ? args["varName"] : ("PopUpSelect_" + args["cmpId"]);
		var launcher = new ERP.Launcher({
			varName : name,
			url : url,
			arguments : qs,
			maximizedWindow : false,
			top : args["y"] ? args.y : 100,
		    left : args["x"] ? args.x : 450,
		    width : args["w"] ? args.w : 540,
		    height : args["h"] ? args.h : 550,
		    callBack : args["callBack"] ? 
		    			function(action, returnVal, otherParameters) {
		    				otherParameters = otherParameters || {};
		    				args = Ext.apply(args, otherParameters);
		    				args.isPopup = true;
		    				if(PAction[args["callBack"]]) {
		    					PAction[args["callBack"]](args["cmpId"], action, returnVal, args);
		    				} else {
		    					args["callBack"](args["cmpId"], action, returnVal, args); // hack for filter's SS
		    				}
							if (this.free) this.free();
					    }
						: 
					    function (action, returnVal, otherParameters) {
							if (action == "ok" || action == "OK") {
		    					otherParameters = otherParameters || {};
		    					args = Ext.apply(args, otherParameters);
								var isSuccess = true;
								var selectedValue ="";
								var selectedText = "";
								var id = args["cmpId"];
								var popupSelectorCMP = Ext.getCmp(id);
								if(returnVal[0]){
									selectedValue = returnVal[0][args["valueField"]?args["valueField"]:"id"];
									selectedText = returnVal[0][args["displayField"]?args["displayField"]:"name"];
								}
								popupSelectorCMP.originalValue = $('H_' + id).value;
								popupSelectorCMP.originalText = $('H_' + id + '_Text').value;	
								popupSelectorCMP.setSelectValue(selectedValue, selectedText);
								popupSelectorCMP.isPopup = true;
								if (args["onchange"]) {
									isSuccess = PAction[args["onchange"]](selectedValue, selectedText, returnVal[0], popupSelectorCMP);
								}
								if(!isSuccess) {
									popupSelectorCMP.setSelectValue(popupSelectorCMP.originalValue, popupSelectorCMP.originalText);
								}
							}
							if (this.free) this.free();
								
						}
		    
		}).open();
	},
	showUser : function(args) {
		new ERP.Launcher({
			varName : 'userForm',
			url : "/app/gem/user/form/" + this.extractId(args) + "/show",
			//top : 50,
			//left : 100,
			width : 740,
			height : 610
		}).open();
	},
	showArticle : function(args) {
		new ERP.Launcher({
			varName : 'userForm',
			url : "/app/gem/article/form/" + this.extractId(args) + "/show",
			//top : 50,
			//left : 100,
			width : 740,
			height : 610
		}).open();
	},
	showRole : function(args) {
		new ERP.Launcher({
			varName : 'roleForm',
			url : "/app/gem/role/form/" + this.extractId(args) + "/show",
			width : 780,
			height : 610
		}).open();
	}
});

function popupSelector(arg) {
	alert("Come on, refactor me !!");
}



