var actions = {
	Close : new Ext.Action( {
		text : "${f:getText('Com.Close')}",
		iconCls: 'ss_sprite ss_accept',
		handler: function() {
			window.close();
		}
	})
};
function page_OnLoad() {
	var grid = initHistoryListGrid(GRID_ID);
	
	grid.flex = 1;
	
	var app = new  ERP.ui.Chrome({
		sideBar:false,
		bodyLayout:'vbox',
		bodyItems:[grid],
		ribbonBar:false,	
		actionBarItems:[
		                {xtype : 'spacer',flex : 1}, 
		                new Ext.Button(actions.Close)
						]
	});
	app.initApp();
	grid.store.load();
		
    grid.getSelectionModel().on("rowselect",function(sm, rowIndex, record){
    	var grid = sm.grid;
    	var s = record.store;
    	var lastRecord = s.getAt(rowIndex + 1);
    	if (lastRecord) {
    		var columns = compareRecords(record, lastRecord);
    		if (!Ext.isEmpty(columns)) {
    			var view = grid.getView();
    			var cm = grid.getColumnModel();
    			for ( var i = 0; i < columns.length; i++) {
    				var columnIndex = grid.getColumnModel().findColumnIndex(columns[i]);
    				var el = view.getCell(rowIndex, columnIndex);
    				el.style.backgroundColor = "#FFA500";

    				el = view.getCell(rowIndex + 1, columnIndex);
    				el.style.backgroundColor = "#FFA500";
    			}
    		}
    	 }
	});			
	  
	grid.getSelectionModel().on("rowdeselect", function(sm, rowIndex, record) {
		if (rowIndex + 1 == record.store.getCount()) {
			return true;
		}
		var grid = sm.grid;
		var view = grid.getView();
		var cols = record.fields.keys;
		for ( var j = 0; j < cols.length; j++) {
			var columnIndex = grid.getColumnModel().findColumnIndex(cols[j]);
			var el = view.getCell(rowIndex, columnIndex);
			if (el) {
				el.style.backgroundColor = "#FFFFFF";
			}

			el = view.getCell(rowIndex + 1, columnIndex);
			if (el) {
				el.style.backgroundColor = "#FFFFFF";
			}
		}
		return true;
	});
	return grid;
    
}

function compareRecords(r, l) {
	var columns = [];
	if (r && l) {
		var keys = r.fields.keys;
		for ( var i = 0; i < keys.length; i++) {
			var columnName = keys[i];
			if (columnName == "id") {
				continue;
			}
			if (r.get(columnName) != l.get(columnName)) {
				columns.push(columnName);
			}
		}
		return columns;
	}
}