/**
 * 
 */
Ext.namespace('Ext.ux.form');

Ext.ux.form.SearchField = Ext.extend(Ext.form.ComboBox, {
//	triggerClass : 'x-form-browswbtn-trigger',

	initList : function() {
		if (!this.list) {
			var cls = 'x-combo-list';

			this.list = new Ext.Layer( {
				shadow : this.shadow,
				cls : [ cls, this.listClass ].join(' '),
				constrain : false
			});

			var lw = this.listWidth
					|| Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;

			if (this.title) {
				this.header = this.list.createChild( {
					cls : cls + '-hd',
					html : this.title
				});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild( {
				cls : cls + '-inner'
			});
			this.innerList.on('mouseover', this.onViewOver, this);
			this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

			if (this.pageSize) {
				this.footer = this.list.createChild( {
					cls : cls + '-ft'
				});
				this.pageTb = new Ext.StatusBar( {
					renderTo : this.footer,
					height : 20,
					cls : 'x-searchingFieldToolbar'
				});
				this.assetHeight += this.footer.getHeight();
			}

			if (!this.tpl) {

				this.tpl = '<tpl for="."><div class="' + cls + '-item">{'
						+ this.displayField + '}</div></tpl>';

			}

			this.view = new Ext.DataView( {
				applyTo : this.innerList,
				tpl : this.tpl,
				singleSelect : true,
				selectedClass : this.selectedClass,
				itemSelector : this.itemSelector || '.' + cls + '-item'
			});

			this.view.on('click', this.onViewClick, this);

			this.bindStore(this.store, true);

			if (this.resizable) {
				this.resizer = new Ext.Resizable(this.list, {
					pinned : true,
					handles : 'se'
				});
				this.resizer.on('resize', function(r, w, h) {
					this.maxHeight = h - this.handleHeight
							- this.list.getFrameWidth('tb') - this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);
				this[this.pageSize ? 'footer' : 'innerList'].setStyle(
						'margin-bottom', this.handleHeight + 'px');
			}
		}
	},

	// private
	onLoad : function() {
		if (!this.hasFocus) {
			return;
		}

		var totalCount = this.store.getTotalCount();
		if (this.store.getCount() > 0) {
			var inner = this.innerList.dom;
			inner.style.display = "";
			if (totalCount <= 10) {
				if (this.assetHeight >= this.footer.getHeight()) {
					this.assetHeight -= this.footer.getHeight();
				}
				this.pageTb.hidden = true;
			} else {
				this.pageTb.setText("Total number :" + totalCount);
				this.pageTb.hidden = false;
				if (this.assetHeight < this.footer.getHeight()) {
					this.assetHeight += this.footer.getHeight();
				}
			}

			this.expand();
			this.restrictHeight();
			if (this.lastQuery == this.allQuery) {
				if (this.editable) {
					this.el.dom.select();
				}
				if (!this.selectByValue(this.value, true)) {
					this.select(0, true);
				}
			} else {
				this.selectNext();
				if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE
						&& this.lastKey != Ext.EventObject.DELETE) {
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		} else {
			this.pageTb.setText("No record found");
			this.pageTb.hidden = false;
			var inner = this.innerList.dom;
			inner.style.display = "none";

			// alert (inner.clientHeight + " " + inner.offsetHeight +" "+
			// inner.scrollHeight);
			if (this.assetHeight < this.footer.getHeight()) {
				this.assetHeight += this.footer.getHeight();
			}
			this.expand();
			this.restrictHeight();
		}
		// this.el.focus();
	},
	// private
	restrictHeight : function() {
		this.innerList.dom.style.height = '';
		var inner = this.innerList.dom;
		var pad = this.list.getFrameWidth('tb')
				+ (this.resizable ? this.handleHeight : 0) + this.assetHeight;
		var h = inner.offsetHeight;
		if (h)
			h = Math.max(inner.clientHeight, inner.offsetHeight,
					inner.scrollHeight);

		var hzFlag = false;
		if (inner.offsetWidth)
			hzFlag = inner.scrollWidth > inner.offsetWidth;
		// $("divWinHeader").innerHTML = inner.scrollWidth + " " +
		// inner.offsetWidth;
		// $("divWinHeader").innerHTML = inner.clientHeight + " " +
		// inner.offsetHeight + " "+ inner.scrollHeight;
		var ha = this.getPosition()[1] - Ext.getBody().getScroll().top;
		var hb = Ext.lib.Dom.getViewHeight() - ha - this.getSize().height;
		var space = Math.max(ha, hb, this.minHeight || 0)
				- this.list.shadowOffset - pad - 5;

		// $("divWinHeader").innerHTML = "h: " + h + " ha:" + ha + " hb:" + hb +
		// "space:" + space+ " pad:" + pad + " min H:" + this.minHeight + "max h
		// " + this.maxHeight;
		// $("divWinHeader").innerHTML += "tb:" + ha + this.resizable + "
		// handle:" + this.handleHeight + " asset:" + this.assetHeight;

		h = Math.min(h, space, this.maxHeight);

		// hmmm .... i think there is a way to get the scroll bar width from
		// some where.
		// http://www.alexandre-gomes.com/?p=115
		if (hzFlag)
			h += 18;
		this.innerList.setHeight(h);

		this.list.beginUpdate();
		this.list.setHeight(h + pad);
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.endUpdate();
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		if (this.isExpanded()) {
			this.collapse();
			this.el.focus();
		}
		this.fireEvent('triggerClick', this);
	}
});

function initSearchingSelect(arg) {
	var displayField = arg['displayField'] || "name";
	var valueField = arg['valueField'] || "id";
	var url = arg['url'];
	var id = arg['id'];
	var txtId = arg['textFieldId']?arg['textFieldId'] : 'H_' + id + '_Text';
	var pageSize =  arg['pageSize'] ? arg['pageSize'] : 10;
	var value = arg['value'] ? arg['value'] : "";
	var text = arg['text'] ? arg['text'] : "";
	var listWidth = 130;
	var tabIndex = arg["tabIndex"];
	if(pageSize != 0) {
		listWidth = 220;
	}
	
	var dcntId = 'DCNT_'+arg['id'];
	
	// Custom rendering Template
    var resultTpl = arg['XTemplate'] ? new Ext.XTemplate(arg['XTemplate']) : new Ext.XTemplate(
        '<tpl for="."><div class="x-combo-list-item">{'+displayField+'}</div></tpl>'
    );
    
	var store = new Ext.data.JsonStore({
		proxy: new Ext.data.HttpProxy({
            url: url,
            method: 'GET'
        }),
		root : "data",
		fields: arg["fieldArray"],
		totalProperty : 'totalRecordSize',
		id : valueField,
		listeners: {
			beforeload: function(store, options) {
				if(store.searchUrl){
					store.proxy.setUrl(store.searchUrl, true);
				}
				if(!store.proxy.url) return false;
				var initParamsFun = arg['initParameters'];
				if(initParamsFun) {
					var otherParameters = initParamsFun();
					for(var p in otherParameters) {
						store.baseParams[p] = otherParameters[p];
					}
				}
				store.baseParams['pageSize'] = 20;
			}
		}
	});
	
	var searchComboBox = new Ext.ux.form.SearchField({
    	store: store,
		valueField : valueField,
		id: id,
		renderTo: dcntId,
		displayField : displayField,
		tabIndex : tabIndex,
        typeAhead : arg['typeAhead'] ? arg['typeAhead'] : false,
        typeAheadDelay : arg['typeAheadDelay'] || 1500,
        autoWidth : true,
        readOnly : arg['readOnly'] ? arg['readOnly'] : false,
        editable : arg['readOnly'] ? !arg['readOnly'] : true,
        minChars : 1,
        pageSize : pageSize,
        enableKeyEvents : true,
		//width : arg['width'] || 125,
		listWidth : arg['width'] || listWidth,
        hideTrigger : (arg['hideTrigger']? arg['hideTrigger'] : false),
        triggerClass : 'x-form-browswbtn-trigger',
        //triggerAction: "all",
        queryParam: arg['queryString'] || 'query',
        tpl: resultTpl,
        itemSelector : arg['list-item-css'] || 'div.x-combo-list-item',
        name: 'DESP_' + id
    });

	// this on change function pointer could both service for popup select and the searching field
	var onchangedFun = arg['onchange'];
	
	// normally, the onTriggerClick will popup a grid select
	// parameters for trigger click
	var gridUrl = arg['gridUrl'] ? arg['gridUrl'] : "";
	var gridInitMethod = arg['gridInitMethod'] ? arg['gridInitMethod'] : "";
	
	var gridArg = {};
	gridArg["cmpId"] = id;
	gridArg["gridUrl"] = gridUrl;
	gridArg["initMethodName"] = gridInitMethod;
	gridArg["valueField"] = valueField;
	gridArg["displayField"] = displayField;
	gridArg["searchable"] = !arg['readOnly'];
	gridArg["onchange"] = onchangedFun;
	gridArg["parameters"] = {gridReadOnly:true};
	
	searchComboBox.on("keydown", function(cmp, e) {
		if (arg['onKeydown']) {
			arg['onKeydown'](cmp, e);
		}
	});
	
	searchComboBox.on("triggerClick", function(cmp) {
		// make sure each time when you click the trigger button, call the initParameter method
		if(arg['gridInitParameters']) {
			var otherParameters = arg['gridInitParameters']();

			for(var p in otherParameters) {
				gridArg["parameters"][p] = otherParameters[p];
			}
		}
		
		if (arg['onTriggerClick']) {
			arg['onTriggerClick'](cmp, gridArg);
		} else {
			if(gridUrl != "" && gridInitMethod != "") {
				popupSelector(gridArg);
			}
		}
	
	});
	
	searchComboBox.on('select', function(combo, record, index) {
		var isSuccess = true;
		if(onchangedFun && record && record.data && $('H_'+id).value != record.data[valueField]) {
			isSuccess = window[onchangedFun](record.data[valueField], record.data[displayField], record.data, combo);
		}
		if(isSuccess) {
			combo.setSelectValue(record.data[valueField], record.data[displayField]);
		}
	});
			
	searchComboBox.on('blur', function(combo) {
		
		if(Strings.isEmpty(combo.getValue())) {
			combo.clearValues(combo);
		} else if(combo.getValue() != $('H_'+id).value) {
			combo.setValue($('H_'+id).value);
			combo.setRawValue($('H_'+id+'_Text').value);
		}
	});
	
	searchComboBox.setSelectValue = function(value, text) {
		this.setValue(value);
		this.setRawValue(text);
		$('H_'+id).value = value;
		$('H_'+id+'_Text').value = text;
    	delete searchComboBox.lastQuery;
	};
	
    searchComboBox.clearValues = function() {
    	var isSuccess = true;
    	if(!Strings.isEmpty($('H_'+id).value)){
    		if(onchangedFun) {
    			isSuccess = onchangedFun('', '', null);
    		}
    		var oldValue = $('H_'+id).value;
    	    var oldDisplayText = $('H_'+id+'_Text').value;
    		if(isSuccess){
    	    	$('H_'+id).value = "";
    	    	$('H_'+id+'_Text').value = "";
    	    	if(arg['onClear']) {
    	    		arg['onClear'](oldValue, oldDisplayText);
    			}
    			this.clearValue();
    		} else {
    			this.setSelectValue(oldValue, oldDisplayText);
    		}
    	} else {
    		this.setSelectValue("", Ext.form.ComboBox.prototype.emptyText);
    	}
    	delete searchComboBox.lastQuery;
    };
    
    searchComboBox.replaceStoreUrl = function(source) {

    	var searchUrl = "";
    	if(source && source.searchUrl) {
    		searchUrl = source.searchUrl;
    	}
    	if(source && source.tpl){
    		if (searchComboBox.view) {
    			searchComboBox.view.tpl = new Ext.XTemplate(source.tpl);
    			searchComboBox.view.refresh();
    		}
    	}
    	delete searchComboBox.lastQuery;
    	store.searchUrl = searchUrl;
        //store.load();
    };
    
	
	if(arg['disabled'] && arg['disabled'] == true){
		searchComboBox.setDisabled(true);
	}else{ 
		searchComboBox.setDisabled(false);
	}
	
	return searchComboBox;

}