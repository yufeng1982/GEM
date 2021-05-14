function page_OnLoad() {
	var ableToClosePage = ${ableToClosePage};
	var isAbleToRemoveLine = ${isAbleToRemoveLine};
	var savePermission = '${savePermission}';
	var deletePermission = '${deletePermission}';
	
	PApp = new ERP.ListApplication({
		_gDockedItem : {
            xtype: 'toolbar',
            items: buildActionBarItems(isPopupEditor, ableToClosePage, isAbleToRemoveLine,savePermission,deletePermission)
        },
//		actionBar : buildActionBarItems(isPopupEditor, ableToClosePage, isAbleToRemoveLine,savePermission,deletePermission),
        actionBar : new ERP.ListActionBar([]),
        defaultSearchPara : {ignoreCorporation: $F('ignoreCorporation')}
	});
	PAction = new ERP.prop.PropAction({
		ableToClosePage : ableToClosePage,
		isAbleToRemoveLine : isAbleToRemoveLine,
		specialValidate : '${specialValidate}'
	});
}
PRes['PROPApply'] = "${f:getText('Com.Apply')}";
PRes['PROPAdd'] = "${f:getText('Com.Add')}";
PRes['PROPRemove'] = "${f:getText('Com.Remove')}";
PRes['PROPCancel'] = "${f:getText('Com.Cancel')}";
var actions = {
	showValues : new Ext.Action({
		text : "&nbsp;${f:getText(showBtnName)}&nbsp;",
		iconCls : 'ss_sprite ss_accept',
		handler : function() {
			LUtils['${showValuesMethodName}']({id: PAction.getCurrentGridTypeId()});
		}
	}),

	apply : new Ext.Action({
		text : '&nbsp;'+PRes['PROPApply']+'&nbsp;',
		iconCls : 'ss_sprite ss_accept',
		handler : function() {
			VUtils.removeAllErrorFields();
			PAction.save('apply');
		}
	}),
	addLine : new Ext.Action({
		iconCls : 'ss_sprite ss_add',
		text : '&nbsp;'+PRes['PROPAdd']+'&nbsp;',
		handler : function() {
			PAction.addLine();
		}
	}),
	removeLine : new Ext.Action({
		id : 'removeLine',
		iconCls : 'ss_sprite ss_delete',
		text : '&nbsp;'+PRes['PROPRemove']+'&nbsp;',
		handler : function() {
			PAction.removeLine();
		}
	}),
	cancel : new Ext.Action({
		iconCls : 'ss_sprite ss_cancel',
		text : '&nbsp;'+PRes['PROPCancel']+'&nbsp;',
		handler : function() {
			if (window.opener) {
		        var parentLauncher = LUtils.getParentLauncher($F("varName"));
		        if (parentLauncher) {
		            if (parentLauncher.callBack) {
		                parentLauncher.callBack($F("_action__"));
		            }
		        }
		        window.close();
			}
		    else if (window.parent.dialogArguments) {
		        window.parent.dlgClose($F("_action__"));
		    }
		}
	})
};
function buildActionBarItems(isPopupEditor, ableToClosePage, isAbleToRemoveLine, savePermission, deletePermission){
	var actionBar = [];
	if(!Strings.isEmpty(deletePermission)){
		isAbleToRemoveLine = isAbleToRemoveLine && CUtils.isTrueVal(${f:isPermitted(deletePermission)});
	}
	var isAbleToSave = true;
	if(!Strings.isEmpty(savePermission)){
		isAbleToSave = CUtils.isTrueVal(${f:isPermitted(savePermission)});
	}
	if(ableToClosePage) {
		var actionBarItems = [];
//		if(isAbleToRemoveLine){
			actionBar.push(new Ext.Button(actions.addLine));
//		}
		if(!CUtils.isTrueVal(isPopupEditor)){
			if(isAbleToRemoveLine) {
				actionBar.push(new Ext.Button(actions.removeLine));
			}
			if(isAbleToSave) {
				actionBar.push(new Ext.Button(actions.apply));
			}
		}
		actionBar.push(new Ext.Button(actions.cancel));
	} else {
//		if(isAbleToRemoveLine) {
			actionBar.push(new Ext.Button(actions.addLine));
//		}
		if(!CUtils.isTrueVal(isPopupEditor)){
			if(isAbleToRemoveLine) {
				actionBar.push(new Ext.Button(actions.removeLine));
			}
			if(isAbleToSave) {
				actionBar.push(new Ext.Button(actions.apply));
			}
		}
	}
	
//	var actionBar;
//	if(!Strings.isEmpty(deletePermission)){
//		isAbleToRemoveLine = isAbleToRemoveLine && CUtils.isTrueVal(${f:isPermitted(deletePermission)});
//	}
//	var isAbleToSave = true;
//	if(!Strings.isEmpty(savePermission)){
//		isAbleToSave = CUtils.isTrueVal(${f:isPermitted(savePermission)});
//	}
//	if(ableToClosePage) {
//		var actionBarItems = [];
//		if(isAbleToRemoveLine){
//			actionBarItems[1] = new Ext.Button(actions.addLine);
//		}
//		if(!CUtils.isTrueVal(isPopupEditor)){
//			if(isAbleToRemoveLine) {
//				actionBarItems[ACTION_BAR_INDEX.ok] = new Ext.Button(actions.removeLine);
//			}
//			if(isAbleToSave) {
//				actionBarItems[ACTION_BAR_INDEX.apply] = new Ext.Button(actions.apply);
//			}
//		}
//		actionBarItems[ACTION_BAR_INDEX.cancel] = new Ext.Button(actions.cancel);
//		
//		actionBar = new ERP.ListActionBar(actionBarItems);
//	} else {
//		actionBar = new ERP.ActionBar();
//		
//		actionBar.actionBarItems.push(actionBar.spacer);
//		if(isAbleToRemoveLine) {
//			actionBar.actionBarItems[ACTION_BAR_INDEX.ok] = new Ext.Button(actions.addLine);
//		}
//		if(!CUtils.isTrueVal(isPopupEditor)){
//			if(isAbleToRemoveLine) {
//				actionBar.actionBarItems[ACTION_BAR_INDEX.cancel] = new Ext.Button(actions.removeLine);
//			}
//			if(isAbleToSave) {
//				actionBar.actionBarItems[ACTION_BAR_INDEX.apply] = new Ext.Button(actions.apply);
//			}
//		}
//	}
	return actionBar;
}
function page_AfterLoad() {
	var grid  = PAction.getPropGrid();
	if(grid) {
		var passwordColumn = GUtils.getColumn("password", grid);
		if(passwordColumn) {
			passwordColumn.renderer = function(value, metadata, record, rowIndex, colIndex, store) {
				if(Strings.isEmpty(value)) return "";
				var pw = "";
				for(var i = 0; i < value.length; i ++) {
					pw += "*";
				}
				return pw;
			}
		}
	}
}