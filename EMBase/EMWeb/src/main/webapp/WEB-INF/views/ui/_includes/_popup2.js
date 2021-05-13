function page_OnLoad() {
	var actionBarItems = [];
	actionBarItems[1] = 0;
	actionBarItems[ACTION_BAR_INDEX.ok] = new Ext.Button(new Ext.Action( {
		text : "${f:getText('Com.Ok')}",
		iconCls: 'ss_sprite ss_accept',
		handler: function() {
			PAction.selected();
		}
	}));
	actionBarItems[ACTION_BAR_INDEX.cancel] = new Ext.Button(new Ext.Action( {
		text : "${f:getText('Com.Cancel')}",
		iconCls: 'ss_sprite ss_cancel' ,
		handler: function() {
			PAction.notSelected();
		}
	}));
	
	var actionBar = new ERP.ListActionBar(actionBarItems);
	var gridConfigName = '${gridConfigName}';
	gridConfigName = Strings.isEmpty(gridConfigName) ? 'G_CONFIG' : gridConfigName;
	
	window[gridConfigName].isMultipleSelect =  ${multiple};

	var queryParameterName = !Strings.isEmpty('${queryParameterName}') ? '${queryParameterName}' : 'sf_LIKE_query';
	var params = ${parameters};

	if(params) params["paged"] = true;

	
	window[gridConfigName].isEditable = false;
	window[gridConfigName].isPaging = true;
	
	var searchUrl = '${searchUrl}';
	if(!Strings.isEmpty(searchUrl)) {
		window[gridConfigName].url = '${searchUrl}';
	}
	
	var popupSelectGrid = GUtils.initErpGrid("poupSelectGrid", params, window[gridConfigName]);

	popupSelectGrid.store.on("load", function() {
//		if(popupSelectGrid.store.getCount() > 0 ) {
////			popupSelectGrid.getSelectionModel().select(0);
//			popupSelectGrid.getView().focusRow(0);
//		} else {
			if(${searchable}) {
				Ext.getCmp("search_field_id").focus();
			}
//		}
	});
	

	if(popupSelectGrid.hasListener('keydown')) {
		popupSelectGrid.removeListener('keydown');
	}
	popupSelectGrid.on("keydown", function(/*Ext.EventObject*/ e) {
		if(e.getKey() == e.ENTER) {
			PAction.selected();
		}
	});
	
	var searchConfig = {
		layout : 'hbox',
		items: [{
			//fieldLabel: PRes["search"],
			id : "search_field_id",
			xtype : 'textfield',
			width: 260,
		    name: queryParameterName,
		    value : ""
		}]
	};
	
	PApp = new ERP.ListApplication({
		searchConfig : searchConfig,
		grid : popupSelectGrid,
		actionBar : actionBar,
		isShowActionBtn : true
	});
	Ext.define('ERP.PopupAction', {
		extend : 'ERP.ListAction',
		
		searchable : true,
		
		constructor : function(config) {
			this.callParent([config]);
			Ext.apply(this , config);
			return this;
		},
	    _getSearchParames : function() {
	    	var extraParams = this.callParent();
	    	Ext.apply(extraParams, params);
	    	return extraParams;
	    },
		gridItemDBClick : function(view , record , item  , index , e) {
			this.selected();
		},
		
		selected : function() {
			var recordDataArray = new Array();
			var records = PApp.grid.getSelectionModel().getSelection();
			if(!records || records.length < 1) {
				Ext.Msg.alert('Warning!', 'Please select one line!');
				return ;
			}
			for (var i = 0, size = records.length; i < size; i ++) {
				recordDataArray.push(records[i].raw);
			}
//			document.forms[0].action += "ok";
//			$("_action__").value = "ok";
//			$("selectedRecords").value = CUtils.jsonEncode(recordDataArray);
//			document.forms[0].submit();
			callBack("ok",recordDataArray);
		},
		
		notSelected : function() {
//			document.forms[0].action += "cancel";
//			$("_action__").value = "cancel";
//			$("selectedRecords").value = CUtils.jsonEncode(new Array());
//			document.forms[0].submit();
			callBack("cancel");
		}
	});
	
	PAction = new ERP.PopupAction({
		searchable : ${searchable}
	});

}

function callBack(action, result) {
    if (window.opener) {
        var parentLauncher = LUtils.getParentLauncher("${varName}");
        if (parentLauncher) {
            if (parentLauncher.callBack) {
            	var otherParameters = {};
            	var displayField = "${displayField}";
            	if(!Strings.isEmpty(displayField)) otherParameters["displayField"] = displayField;
                parentLauncher.callBack(action, result, otherParameters);
            }
        }
        window.close();
    }
    else if (window.parent.dialogArguments) {
        window.parent.dlgClose(action, result);
    }
}
function page_AfterLoad() {
	if(!PAction.searchable) {
		Ext.getCmp('searchFilter').hide();
	}
}