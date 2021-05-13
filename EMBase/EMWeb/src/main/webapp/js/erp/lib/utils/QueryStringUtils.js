function QueryString() {
	this.getParameter = _getArg;
	this.setParameter = _setArg;
	this.addParameter = _setArg;
	this.removeParameter = _removeArg;
	this.empty = _reset;
	this.init = _init;
	this.parseString = _parse;
	this.inject = _inject;
	this.toString = _toString;	//Allows the object to be printed
									//no need to write toString()
	this.params   = new Array();

	// Initiation
	var separator = "&";
	var equalsign = "=";
	
	
	function _parse(strqs) {
		var str = strqs.replace(/%20/g, " ");
		var index = str.indexOf("?");
		var sInfo;
		var infoArray = new Array();
	
		var tmp;
		
		if (index != -1) {
			sInfo = str.substring(index+1,str.length);
		} else {
			sInfo = str;
		}
		infoArray = sInfo.split(separator);	
		for (var i=0; i<infoArray.length; i++) {
			tmp = infoArray[i].split(equalsign);
			var t = tmp[0];
			if (t != "") {
				this.params[t] = {name:t, value: (tmp.length>1 && tmp[1])?myDecodeURI(tmp[1]):''};
				//this.params[t].value = unescape(tmp[1]);
				//this.params[t].name = t;
			}
		}
	};
	function _init() {
		this.parseString( window.location.search);
	};
	
	function _reset() {
		this.params   = new Array();
	};

	function _toString(skipQst) {
		var s = "";
		var once = true;
		for (var i in this.params) {
			if (once) {
				if (!skipQst)
					s += "?";
				once = false;
			}
			if ((this.params[i]!=undefined) && (this.params[i] != null) && (this.params[i].name != undefined) && (this.params[i].name !="")) {
				s += this.params[i].name;
				s += equalsign;
				s += encodeURIComponent(this.params[i].value);
				s += separator;
			}
		}
		return s;//.replace(/ /g, "%20");
	};
	
	function _getArg(name) {
		name += "";
		try{
		if ((this.params[name]==undefined) || typeof(this.params[name].name) != "string")
			return null;
		else
			return this.params[name].value; //.replace(new RegExp("\\x2b", "g")," ");
			//SOMETHIGN SO FUCK UP WITH THE + SIGN IN THE WHOLE RFC THING
			//return decodeURIComponent(this.params[name].value);
		} catch (ex) {
			return null;
		}
	};
	
	function _setArg(name,value) {
		name += "";
		value += "";
		this.params[name] = new Object();
		this.params[name].name = name;
		this.params[name].value = value;
	};
	
	function _removeArg(name) {
		name += "";
		this.params[name] = null;
	};
	
	function _inject(obj) {
		for(var p in obj) {
			this.setParameter(p,obj[p]);
		}
	}
	return this;
};