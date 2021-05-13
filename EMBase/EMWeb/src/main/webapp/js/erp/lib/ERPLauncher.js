/**
 * @author FengYu
 */
Ext.define('ERP.Launcher' , {
	config : {
		WINDOW : 0,
		windowName : null,
	    windowMode : 0,
	    arguments : null,
	    url : null,
	    callBack : null,
	    windowHandle : null,
	    varName :  null,
		returnValue : null,
		
	    top : 30,
	    left : 100,
	    width : 500,
	    height : 600,
	    resizable : true,
	    status : false,
	    //skipQst for skip add question mark.
	    skipQst : false,
	    //winopen
	    channelmode : false,
	    directories : false,
	    fullscreen : false,
	    location : false,
	    maximizedWindow : true,
	    menubar : false,
	    scrollbars : true, //<-- not recommend to touch, use css to control instead
	    titlebar : true,
	    toolbar : false,
	    modal : false,//for firefox modal window
	
	    //dialog
	    center : false,
	    dialogHide : false,
	    edge : "raised", //or sunken, leave default
	    //scroll <- use scrollbars
	    unadorned : false,
	    callBackName : ''
	},
	statics: {
        newInstance : function(config) {
            return new this(config);
        }
    },
    constructor: function(config) {
    	var d = new Date();
    	config.windowName = config.varName + d.getTime();
        d = null;
        if(config.callBack && (typeof config.callBack == "string")) {
        	config.callBackName = config.callBack;
        } else if(!config.callBack){
        	config.callBack = LUtils.defaultCallback;
        }
        this.initConfig(config);
        LUtils.addLauncher(config.varName, this);
        return this;
    },
    _getFeatureString : function () {
        var strFeature = "";
        if (this.windowMode == this.WINDOW) {
            //window.open
        	if(this.modal){//for firefox modal window
        		strFeature += "modal=yes,";
        	}
            strFeature += "height=" + this.height + ",";
            strFeature += "left=" + this.left + ",";
            strFeature += "top=" + this.top + ",";
            strFeature += "width=" + this.width + ",";
            strFeature += "channelmode=" + this._bool2str(this.channelmode) + ",";
            strFeature += "directories=" + this._bool2str(this.directories) + ",";
            strFeature += "fullscreen=" + this._bool2str(this.fullscreen) + ",";
            strFeature += "location=" + this._bool2str(this.location) + ",";
            strFeature += "menubar=" + this._bool2str(this.menubar) + ",";
            strFeature += "scrollbars=" + this._bool2str(this.scrollbars) + ",";
            strFeature += "status=" + this._bool2str(this.status) + ",";
            strFeature += "resizable=" + this._bool2str(this.resizable) + ",";
            strFeature += "titlebar=" + this._bool2str(this.titlebar) + ",";
            strFeature += "toolbar=" + this._bool2str(this.toolbar) + "";
        } else {
            alert("Don't support this window mode !!");
        }
        return strFeature;
    },

 	_bool2str : function(bflag) {
        return ((bflag) ? "yes" : "no");
    },
	open : function(){
		if (!this.arguments) {
			this.arguments =  new QueryString();
		}
		this.arguments.setParameter("varName", this.varName);
		try {
			if(!window.showModalDialog){
				if(this.windowMode == this.DIALOG){
					this.modal = true;
				}
				this.windowMode = this.WINDOW;
			}
		}
		catch (E) {
		}
		
		switch (this.windowMode) {
			case this.WINDOW:
				var frm = document.getElementById("launcherForm");
				if(!frm){
					frm = _createLauncherForm();	
				} 
				frm.action = this.url;
				frm.target = this.windowName;
				frm.method = "POST";
				frm.innerHTML = "";
				//alert(frm.innerHTML);
				//dataBeanContextID, pageURI, varName, frontContextID, parentContextID, windowMode
				var tqs = new QueryString();
				//debugger;
				for (var p in this.arguments.params) {
					var tmp = this.arguments.getParameter(p);
					if (!Strings.isEmpty(tmp)) {
						if(p == "pageURI" || tmp.length < 100 ) {
							tqs.addParameter(p, tmp);
						} else {
							var t = document.createElement("INPUT");
							t.setAttribute("type", "hidden");
							t.setAttribute("NAME", p);
							t.id = p;
							t.name = p;
							t.value = tmp;
							frm.appendChild(t);
						}
					}
				}
				frm.action = this.url + tqs.toString(this.skipQst);
				this.windowHandle = window.open("/launcher.html", this.windowName, this._getFeatureString());
				setTimeout("document.getElementById('launcherForm').submit();",100);
				break;
			case this.DIALOG :
	            alert("Don't support this window mode !!");
				break;
			case this.DIALOG_MODELESS :
	            alert("Don't support this window mode !!");
				break;
		}
	},
	setCord : function(arg) {
        if (arg["x"]) this.left = arg.x;
        if (arg["y"]) this.top = arg.y;
        if (arg["w"]) this.width = arg.w;
        if (arg["h"]) this.height = arg.h;
    },
    free : function() {
        this.arguments = null;
        this.windowHandle = null;
        this.callBack = null;
        this.returnValue = null;
        this.open = null;
        this.free = null;
        LUtils.removeLauncher(this.varName);
    }
});