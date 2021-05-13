var LAUNCHER = {
    WINDOW : 0, DIALOG : 1, DIALOG_MODELESS : 2};
function _getParentLauncher(varName) {
	var parentLauncher = null;
    if (!varName) {
        var qs =  new QueryString();
        qs.init();
        varName = qs.getParameter("varName");
    }
    return getParentLauncher(varName);
}

// if you get the varName directly, don't need get from query string, please call this function
function getParentLauncher(varName) {
	var parentLauncher = null;
    if (window.opener) {
        //launcher var window open
        if (varName && (varName.length > 0)) {
            try {
                parentLauncher = window.opener[varName];
            }
            catch (E) {
            }
        }
    }
    else if (window.parent) {
        //elimated the window open, this is dialog
        if (window.dialogArguments) {
            parentLauncher = window.dialogArguments;
        }
    }
    return parentLauncher;
}

function Launcher( strValName , strUrl) {
    //public STATIC
	//Launcher.prototype.WINDOW = 0;
	//Launcher.prototype.DIALOG = 1;
    this.WINDOW = 0;
    this.DIALOG = 1;
    this.DIALOG_MODELESS = 2; //nto supported for now
    //public

    //default
    this.windowMode = 0; //0 - window , 1 - dialog
    this.arguments = null;
    this.URL = (strUrl) ? strUrl : null;
    this.callBack = null;
    this.windowHandle = null;
    
    //this enable multiple instances of the window again. the best will
    //be add an extra propety to the Launcher to handle this later on.
    var d = new Date();
    this.windowName = strValName + d.getTime();
    d = null;
    
    this.varName = (strValName) ? strValName : null;
	this.returnValue = null;
	
    this.top = 0;
    this.left = 0;
    this.width = 100;
    this.height = 100;
    this.resizable = true;
    this.status = false;
    //skipQst for skip add question mark.
    this.skipQst = false;
    //winopen
    this.channelmode = false;
    this.directories = false;
    this.fullscreen = false;
    this.location = false;
    this.menubar = false;
    this.scrollbars = true; //<-- not recommend to touch, use css to control instead
    this.titlebar = true;
    this.toolbar = false;
    this.modal = false;//for firefox modal window

    //dialog
    this.center = false;
    this.dialogHide = false;
    this.edge = "raised"; //or sunken, leave default
    //this.scroll <- use scrollbars
    this.unadorned = false;

	this.open = _open;
	this.free = _free;
	this.setCord = _setCord;
	//this.getFeatureString = _getFeatureString;
	
    this._getFeatureString = function () {
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
            strFeature += "channelmode=" + _bool2str(this.channelmode) + ",";
            strFeature += "directories=" + _bool2str(this.directories) + ",";
            strFeature += "fullscreen=" + _bool2str(this.fullscreen) + ",";
            strFeature += "location=" + _bool2str(this.location) + ",";
            strFeature += "menubar=" + _bool2str(this.menubar) + ",";
            strFeature += "scrollbars=" + _bool2str(this.scrollbars) + ",";
            strFeature += "status=" + _bool2str(this.status) + ",";
            strFeature += "resizable=" + _bool2str(this.resizable) + ",";
            strFeature += "titlebar=" + _bool2str(this.titlebar) + ",";
            strFeature += "toolbar=" + _bool2str(this.toolbar) + "";
        } else{
            //showXXXDialog
            strFeature += "dialogHeight:" + this.height + "px;";
            strFeature += "dialogLeft:" + this.left + "px;";
            strFeature += "dialogTop:" + this.top + "px;";
            strFeature += "dialogWidth:" + this.width + "px;";
            strFeature += "center:" + _bool2str(this.center) + ";";
            strFeature += "dialogHide:" + _bool2str(this.dialogHide) + ";";
            strFeature += "edge:" + this.edge + ";";
            strFeature += "scroll:" + _bool2str(this.scrollbars) + ";";
            strFeature += "status:" + _bool2str(this.status) + ";";
            strFeature += "unadorned:" + _bool2str(this.unadorned) + ";";
            strFeature += "resizable:" + _bool2str(this.resizable) + "";
        }
        return strFeature;
    };

 	function _bool2str(bflag) {
        return ((bflag) ? "yes" : "no");
    };
	function _open() {
		if (!this.arguments) {
			this.arguments =  new QueryString();
		}
		this.arguments.setParameter("varName", this.varName);
		/*
		  
		 try {
			if(domapi && !domapi.isIE){
				if(this.windowMode == this.DIALOG){
					this.modal = true;
				}
				this.windowMode = this.WINDOW;
			}
		}
		catch (E) {
		}
		*/
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
				//alert();
				
				var frm = document.getElementById("launcherForm");
				frm.action = this.URL;
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
					/*
					if (!Strings.isEmpty(tmp)) {
						switch(p) {
							case "dataBeanContextID":
							case "pageURI":
							case "varName":
							case "frontContextID":
							case "parentContextID":
							case "windowMode":
							////////////////////////
							case "pageMode":
							case "scopeObjectType":
							case "parentContextMapKey":
							case "contextObjAccessMode":
							case "contextObjAccessKey":
							case "selectionMode":
							case "scopeObjectID":
							case "scopeObjectName":
							case "scopeObjectCode":
							case "scopeObjectString":
								tqs.addParameter(p, tmp);
							break;
							default:
								//var t = document.createElement("<INPUT type='hidden' name='" + p + "'/>");
								var t = document.createElement("INPUT");
								t.setAttribute("type", "hidden");
								t.setAttribute("NAME", p);
								t.id = p;
								t.name = p;
								t.value = tmp;
								frm.appendChild(t);
								//domapi._attachToForm(frm, p, tmp);
								//alert(frm[p].value);
							break;
						}
					}*/
					
				}
				frm.action = this.URL + tqs.toString(this.skipQst);
				this.windowHandle = window.open("/launcher.html", this.windowName, this._getFeatureString());
				setTimeout("document.getElementById('launcherForm').submit();",100);
				break;
			case this.DIALOG:
				var action, returnVar;
				//found something is firefox can do dialog mode, releated to window open. may need to add here in future
				this.arguments.setParameter("URL", this.URL);
				this.returnValue = window.showModalDialog("/_includes/_launcher_dlg_shell.html", this, this._getFeatureString());
				if (this.returnValue) { 
					action = this.returnValue[0];
					returnVar= this.returnValue[1];
				}else if(this.parentParameter){
					this.returnValue = this.parentParameter;
				}
				if (this.callBack) {
					this.callBack(action,returnVar);
				}
				break;
			case this.DIALOG_MODELESS:
				var action, returnVar;
				this.arguments.setParameter("URL", this.URL);
				this.returnValue = window.showModelessDialog("/common/_includes/_launcher_dlg_shell.html", this, this._getFeatureString());
				if (this.returnValue) {
					action = this.returnValue[0];
				    returnVar= this.returnValue[1];
				}
				if (this.callBack) {
					this.callBack(action,returnVar);
				}
				break;
		}
	};
	function _setCord(arg) {
        if (arg["x"])this.left = arg.x;
        if (arg["y"])this.top = arg.y;
        if (arg["w"])this.width = arg.w;
        if (arg["h"])this.height = arg.h;
    };
    function _free() {
        this.arguments = null;
        this.windowHandle = null;
        this.callBack = null;
        this.returnValue = null;
        this.open = null;
        this.free = null;
    };
    return this;
}