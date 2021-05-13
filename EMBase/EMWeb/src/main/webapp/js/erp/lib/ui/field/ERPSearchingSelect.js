Ext.define('ERP.ui.field.ERPSearchingSelect', {
    extend:'Ext.form.field.ComboBox',
    
    //triggerCls : 'x-form-brower-trigger',
    
    alias: 'widget.erpsearchingselect',
    
    gridInitParameters : Ext.emptyFn,
    
    initComponent: function() {
    	var me = this;
    	
        if(me.overrideConfig) Ext.apply(me.config, me.overrideConfig);
        
    	Ext.applyIf(me , me.config);
    	
    	var listWidth = 260;
    	me.minChars = 1;
    	me.displayField = me.config.displayField;
    	if(me.id.startWith('erpsearchingselect')) me.id = me.name;
        me.triggerAction = 'all',
        me.matchFieldWidth = false;
		me.defaultListConfig = {minWidth: listWidth, maxWidth: listWidth};
        //me.hiddenName = me.id;
        me.store = me._createStore();
        me.pageSize=10;
        me.HValue='';
        me.HText='';
        me.queryParam = 'sf_LIKE_query';
        
        var resultTpl = '<tpl for="."><div class="x-combo-list-item">' + me.config.optionsTemplate + '</div></tpl>';
        
        me.listConfig = {
            getInnerTpl: function() {
                return resultTpl;
            }
        },
        
        me.on('blur', function(combo) {
			if(me.getRawValue() == '')  {
				me.setSelectValue('', '');
			} else if(me.getRawValue() != me.HText) {
				me.setSelectValue(me.HValue, me.HText);
			}
		});


		// TODO, fuck extjs, HACK for now, have check if it could be fix in extjs next version
        me.on('select', function(combo, record) {
//        	console.log(record[0]);
        	var isSuccess = true;
			if (me.onchange) {
				isSuccess = PAction[me.onchange](record[0].get(me.valueField), record[0].get(me.displayField), record[0].raw, combo);
			}
			if(isSuccess) {
				me.setSelectValue(record[0].get(me.valueField), record[0].get(me.displayField));
			}
    	});
        ///////////////////////////////////////////////////////////////////////////////////////
        me.callParent();
    },
    ///////////////////////////////////////////////////////
    // HACK for now will see if it able to be fixed in next extjs version
    setSelectValue : function(value, text) {
    	this.setValue(value);
    	this.setRawValue(text);
    	this.HValue = value;
    	this.HText = text;
    },
    
    getSelectValue : function() {
    	return this.HValue;
    },
    getSelectRawValue : function() {
    	return this.HText;
    },
    ////////////////////////////////////////////////////////
    createPicker: function() {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply({
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.create('Erp.ui.SSList', opts);
        
        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), {
            selectionChange: me.onListSelectionChange,
            scope: me
        });

        return picker;
    },
	_createStore : function(){
		var me = this;
		
		var model = Ext.define(me.modelName, {
		    extend: 'Ext.data.Model',
		    fields: me.storeFieldArray
		});
		
		var gProxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
			url : me.searchUrl,
	        reader : {
	            type : 'json',
	            root : 'data',
	            idProperty: me.valueField
	        },
	        startParam: 'beginIndex',
	        limitParam: 'pageSize'
		});
		
		var gStore = Ext.create('Ext.data.JsonStore' , {
		    autoDestroy : true,
		    autoLoad: false,
		    storeId: this.id + '_storeId',
		    model : model,
		    proxy : gProxy,
		    listeners: {
		    	
		    }
		});
		gStore.on('beforeload', function(e) {
			var otherParameters = me.gridInitParameters();
			Ext.apply(gStore.proxy.extraParams, otherParameters);
		});
		gStore.on('load',function(a,b) {
			var bar = me.picker ? me.picker.pagingToolbar : null;
			if(bar) {
				if(this.getTotalCount()>0) {
					bar.el.update('Total number : ' + this.getTotalCount());
				} else {
					bar.el.update('No record found');
//					me.picker.setHeight(15);
				}
			}
		});
		return gStore;
	},
	
	 onTriggerClick : function() {
	    	// make sure each time when you click the trigger button, call the initParameter method
	    	var me = this;
	    	var gridArg = {};
	    	
	    	gridArg.cmpId = me.id;
   			gridArg.gridUrl = me.gridUrl;
   			gridArg.mtype = me.mtype;
   			gridArg.parameters = {};
   			gridArg.callBack = me.popup_callback;
   			gridArg.valueField = me.valueField;
   			gridArg.displayField = me.displayField;
   			gridArg.seType = me.seType;
   			gridArg.searchUrl = me.searchUrl;
   				
			var otherParameters = me.gridInitParameters();

			if (me.onclick) {
				if(otherParameters){
					for(var p in otherParameters) {
						gridArg[p] = otherParameters[p];
					}
				}
				PAction[me.onclick](this, gridArg);
			} else {
				if(otherParameters){
					for(var p in otherParameters) {
						gridArg["parameters"][p] = otherParameters[p];
					}
				}
				LUtils.showPopupSelector(gridArg);
			}
		},
	    
		popup_callback : function (cmpId, action, returnVal, args){
			if (action == "ok" || action == "OK") {
				if(returnVal[0]){
					var isSuccess = true;
					var cmp = Ext.getCmp(cmpId);
					selectedValue = returnVal[0][args.valueField];
					selectedText = returnVal[0][args.displayField];
					if(cmp.onchange) {
						isSuccess = PAction[cmp.onchange](selectedValue, selectedText, returnVal[0], cmp);
					}
					if(isSuccess) {
						
						// TODO, fuck extjs, HACK for now, have check if it could be fix in extjs next version
						cmp.setSelectValue(selectedValue, selectedText);
						//cmp.setValue(selectedValue);
						//cmp.setRawValue(selectedText);
					}
				}
			}
		}
	   
});