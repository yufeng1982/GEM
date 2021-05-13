function page_OnLoad() {
	var grid = GUtils.initErpGrid();

	PApp = new ERP.ListApplication({
		grid : grid,
		//searchConfig : searchConfig,
		actionBar : buildActionBarItems(new ERP.ActionBar())
	});
	grid.store.load();
	PAction = new ERP.maintenance.MaintenanceAction({
	});
}

var actions = {
	ok : new Ext.Action({
		text : "${f:getText('Com.Ok')}",
		iconCls : 'ss_sprite ss_accept',
		handler : function() {
			PAction["ok"]('ok');
		}
	}),
	cancel : new Ext.Action({
		text : "${f:getText('Com.Cancel')}",
		iconCls : 'ss_sprite ss_cancel',
		handler : function() {
			PAction.redirectFormSubmit('cancel');
		}
	})
};
function buildActionBarItems(actionBar) {
	actionBar.actionBarItems.push(actionBar.spacer);
	actionBar.actionBarItems[ACTION_BAR_INDEX.ok] = new Ext.Button(actions.ok);
	actionBar.actionBarItems[ACTION_BAR_INDEX.cancel] = new Ext.Button(actions.cancel);
	return actionBar;
}