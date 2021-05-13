/* find tag   **/
Ext.define('Erp.ui.field.Find', {
	extend : 'Ext.form.field.Text',
	alias : 'widget.findUnique',
	
	config: {
		originalValue: '',
		query: '',
		url: ''
    },

    onClickFn : null,
    onChangeFn : new Function(),
    initParamsFn: function () { return {};},
    
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	
	setSelectValue : function(value, text) {
		this.setValue(text);
		this.setOriginalValue(text);
		$('H_'+this.id).value = value;
    },
    getSelectValue : function() {
    	return $('H_'+this.id).value;
    },
    getSelectText : function() {
    	return this.inputEl.getValue();
    },
    clearValue : function() {
    	this.setSelectValue('','');
    	this.setOriginalValue('');
    },
    clearValues : function() {
    	this.clearValue();
    },
    doClean : function() {
		this.clearValue();
		this.onChangeFn.call(PAction, '', '', {}, this);
		return;
    },
    search : function() {
    	if (typeof this.onClickFn === 'function') {
    		this.onClickFn.call(PAction, this, this.getUrl());
		} else {
			this.doSearch();
		}
    },
    doSearch : function() {
		var me = this;
		if (Strings.isEmpty(me.getRawValue()) && Strings.isEmpty(me.getOriginalValue())) return;
		
		if (Strings.isEmpty(me.getRawValue())) {
			me.doClean();
			return;
		}
		
		me.setQuery(me.getRawValue());
		
		if (!Strings.isEmpty(me.getOriginalValue()) && (me.getQuery().toLowerCase() === me.getOriginalValue().toLowerCase())) {
			return;
		}
		
		me.parameters = me.initParamsFn.call(PAction);
		me.parameters["query"] = me.getQuery();
		
		//if you want to add  message to loadMask, Override it.
		beginWaitCursor(CUtils.sv(PAction.maskText));
		
		Ext.Ajax.request({
			url : me.getUrl(),
			params : me.parameters,
			success : function(response) {
				VUtils.removeFieldErrorCls(me.id);
				VUtils.removeTooltip(me.id);
				endWaitCursor();
				var code = me.getQuery();
				me.setOriginalValue(me.getQuery());
				var data = {id : '', code : ''};
				if(!Strings.isEmpty(response.responseText)) {
					data = CUtils.jsonDecode(response.responseText);
				}
				if (Strings.isEmpty(CUtils.sv(data.id))) {
					var errorMsg = "is not found!";
					me.setOriginalValue('');
					me.setSelectValue('', '');
					me.focus();
					
					if(!Strings.isEmpty(CUtils.sv(data.errorMsg))) {
						errorMsg = data.errorMsg;
					}
					VUtils.markErrorFields([{fieldname: me.id, message:  $('label_' + me.id).innerHTML + " " + errorMsg, arg:null}]);
					
					me.onChangeFn.call(PAction, "", code, {}, me);
				} else {
					code =  data['code'] || data['sequence'];
					me.setSelectValue(data['id'], code);
					me.onChangeFn.call(PAction, data['id'], code, data, me);
				}
			},
	   		failure: function(request,  response,  options) {
				endWaitCursor();
	   		}
		});
	}
});

function initFindTag(args) {
	var id = args['id'], renderTo = "DCNT_"+id, tabIndex = args["tabIndex"];
	var disabled = args['disabled'];
	var width = args['width'] || DEFAULT_S_WIDTH;
	var cpn = Ext.create('Erp.ui.field.Find',{
		id:	id,
		name: 'T_'+id, 
		renderTo: renderTo,
		disabled: disabled,
		tabIndex: tabIndex,
		enableKeyEvents: true,
		width : width,
		url: args["url"]
	});

	if(args['initParameters']) {
		cpn.initParamsFn = PAction[args['initParameters']];
	}
	if(args['onchange']) {
		cpn.onChangeFn = PAction[args['onchange']];
	}

	if(args["onclick"]) {
		cpn.onClickFn = PAction[args['onclick']];
	}
	if(Strings.isEmpty(cpn.getUrl())) {
		cpn.setUrl('/app/steel/crm/customerPartsNumber/list/loadForDocument'); // set customer parts number as default
	}
	
	if(CUtils.isTrueVal(args["addSeacrhButton"])) {
		Ext.create('Ext.Button', {
			iconCls : 'ss_sprite ss_add',
			renderTo : 'TagAdd_'+id+'_div',
			text : PRes["add"],
			id : 'tagAddButton',
			width : 80,
			tabIndex : parseInt(tabIndex) + 1,
			handler: function() {
				cpn.search();
		    }
		});
		
		cpn.on('keydown', function (field, e) {
			if(e.keyCode === 13 || e.keyCode === 9) {
				cpn.search();
				e.preventDefault();
				e.stopPropagation();
			}
		});
	} else {
		cpn.on('blur', function (field) {
			if(!isTargetWindow){
				cpn.search();
			}
		});
	}
	return cpn;
}