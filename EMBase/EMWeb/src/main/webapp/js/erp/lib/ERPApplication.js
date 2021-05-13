
Ext.define('ERP.Application' ,{
	
	actionBar : null,
	_setBodyProperty : function(config) {
		me = this;
		var bodyItems = config.bodyItems;
		var items = [];
		for ( var i = 0; i < bodyItems.length; i++) {
			var bodyItem = bodyItems[i];
			if(CUtils.isHiddenCmp(bodyItem.id)) bodyItem.hidden = true;//For Permission 
			if(CUtils.isDisableCmp(bodyItem.id))  bodyItem.disabled = true;//For Permission
			if(typeof (bodyItem.autoScroll) == undefined || bodyItem.autoScroll == null) bodyItem.autoScroll = true;//add common autoScroll properties
			items.push(bodyItem);
		}
		return items;
	},
	doLayout : function(config){
		config.bodyItems = this._setBodyProperty(config);
		var chrome = Ext.create('ERP.ui.Chrome', config);
		chrome.initApp();
	}
});

Ext.define('ERP.FormApplication' ,{
	
	extend : 'ERP.Application',
	
	constructor: function(config) {
		
		this.callParent([config]);
		
		Ext.apply(this , config);
		
		if(config.actionBar){
			this.actionBar = config.actionBar;
		}else{
			this.actionBar = new ERP.FormActionBar();
		}
		
		var defaultLayout = {
			ribbonBar : false,
			sideBar : false,
			bodyItems : [],
			actionBarItems : this.actionBar.getActionBarItems()
		};
		
		Ext.apply(defaultLayout , config.pageLayout);
		
		this.doLayout(defaultLayout);
	}
});

Ext.define('ERP.ListApplication' ,{
	
	extend:'ERP.Application',
	
	grid : null,
	
	filterForm : null,
	
	defaultSearchPara : {},
	
	searchConfig : null,//search layout config
	searchValues : {},
	disableDefaultSearchFields : false,
	
	_gConfig : null,
	
	_gDockedItem : null,
	
	_gId : null,
	
	constructor : function(config) {
		
		this.callParent([config]);
		
		Ext.apply(this , config);
		
		if(!this.grid){
			this.grid = GUtils.initErpGrid(this._gId, this.defaultSearchPara, this._gConfig, this._gDockedItem);
		}
		
		if(!this.actionBar){
			this.actionBar = new ERP.ListActionBar();
		}
		this.filterForm = this._createFilterForm(this.searchConfig);
		this._setDefaultValues4FilterForm();
		
		var pageLayout = {
			ribbonBar : false,
			sideBar : false,
			bodyLayout : "vbox",
			bodyItems : this._buildBodyItems(this.filterForm , this.grid),
			actionBarItems : this.actionBar.getActionBarItems(),
			hiddenHeader : true,
			showActionBar : config.isShowActionBtn ? true : false
		};
		this.doLayout(pageLayout);
	},

	_buildBodyItems : function (filterForm  , grid){
		var bodyItems = [];
		
		if(filterForm){
			
			var btnSearch = Ext.create('Ext.Button', {
				iconCls : 'ss_search',
				text : PRes["search"],
				width : 60,
				height:25,
				handler: function() {
			    	PAction.doSearch();
			    }
			});
			
			var btnRest = Ext.create('Ext.Button', {
				iconCls : 'ss_reset',
				text : PRes["reset"],
				width:60,
				height:25,
				handler: function() {
					PAction.doReset();
			    }
			});
			
			
			bodyItems.push({
				xtype : "portlet",
				layout : 'hbox',
				id : "searchFilter",
				closable : false,
				title : ss_icon('ss_magnifier') + PRes["search"],
				items: [{
					xtype : 'panel',
//					flex : 1,
					border : 0,
					items : filterForm
				} , {
	    	    	id : 'searchButtonsPanel',
	    	    	xtype : 'panel',
	    	    	layout : filterForm.btnLayout || 'hbox',
	    	    	width : Ext.isEmpty(filterForm.btnLayout) ? 130 : null,
	    	    	height : filterForm.height > 35 ? filterForm.height : 35,
	    	        defaults: {margins:'5 10 0 0'},
	    	        border : 0,
	    	        items : [btnSearch, btnRest]
	    		}]// filterPanel
			});
		}
		bodyItems.push({
			xtype : "panel",
			layout: 'fit',
			anchor: '100%',
			flex : 1,
			closable:false,
			collapsible:false,
			items:grid
		});
		
		return bodyItems;
	},
    
    _createFilterForm : function(searchConfig){
		if(searchConfig){
			var config = {
			        defaultType: 'textfield',
			        margin : "5 5 5 5",
			        border: false
		    };
			
			Ext.apply(config , searchConfig);
			
			var form = Ext.create('Ext.form.Panel', config);
			return form;
		}
		return null;
	},
	
	_setDefaultValues4FilterForm : function() {
		if(this.filterForm) {
			var myForm = this.filterForm.getForm();
			var items = myForm.getFields().items;

			for (var i = 0; i < items.length; i ++) {
				var field = items[i];
				var name = field.name;
				var xtype = field.xtype;
				var value = CUtils.sv(this.searchValues[name]);
				if(!Strings.isEmpty(value)) {
					field.disabled = this.disableDefaultSearchFields;
					if(!xtype) {
						field.setValue(value);
					} else if(xtype == 'erpsearchingselect') {
						//field.setValue(value);
						//field.setRawValue(CUtils.sv(this.searchValues[name + "Text"]));
						field.setSelectValue(value, CUtils.sv(this.searchValues[name + "Text"]));
					} else {
						field.setValue(value);
					}
				}
			}
		}
	}
	
});
