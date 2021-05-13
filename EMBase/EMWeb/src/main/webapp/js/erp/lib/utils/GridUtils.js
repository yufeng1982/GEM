/**
 * 
 */
Ext.define('ERP.GridUtils' , {
	BROWSER_COLUMN_SUBFIX : "_text",
	/**
	 * data example {
     *               common: 'New Plant 1',
     *               light: 'Mostly Shady',
     *               price: 0,
     *               availDate: Ext.Date.clearTime(new Date()),
     *               indoor: false
     *           }  
	 **/
	addLine: function(grid, data, index){
		data = data || {};
		if(grid){
			var data2 = {};
			var cols = grid.columns;
			for(var i=0; i<cols.length;i++ ) {
				var fn = cols[i].dataIndex;
				switch(cols[i].fieldType){
					case "text" :
						data2[fn] = '';
						break;
					case "integer" :
//						data2[fn] = 0;
						break;
					case "number" : 
						data2[fn] = 0;
						break;
					case "date" : 
						data2[fn] = '';
						break;
					case "checkbox" : 
						data2[fn] = false;
						break;
					default :
						data2[fn] = '';
						break;
				}
			}
			Ext.apply(data2,data);
			var store = grid.getStore();
			var r = Ext.ModelManager.create(data2, store.model.modelName);
			if(grid.plugins[0]) grid.plugins[0].cancelEdit();
			var count = store.getCount();
			if(typeof(index) == 'number' && index <=count) {
				count = index;
			}
			store.insert(count, r);
            if(grid.plugins[0]) grid.plugins[0].startEditByPosition({row: count, column: 0});
            grid.getView().getSelectionModel().select(count,false,false);
            var record = grid.getView().getSelectionModel().getSelection()[0];
            return record;
		}
	},
	removeLine: function(grid, lineToDelete,recordToDel) {
		var selection;
		if(recordToDel) {
			selection = recordToDel;
		} else {
			selection = this.getSelected(grid);
		}
	   if(selection) {
	   		if(grid.plugins[0]) {
				grid.plugins[0].cancelEdit();
			}
			var selectionIndex = grid.getStore().indexOf(selection);
        	grid.getStore().remove(selection);
        	if(grid.getStore().getCount() > 0) {
        		if(selectionIndex <= 0) {
        			selectionIndex = 1;
        		}
        		grid.getView().getSelectionModel().select(selectionIndex-1, false, false);
        	}
        	//set to hidden fields
			if(lineToDelete) {
				var obj = document.forms[0][lineToDelete];
				if (obj) {
					var deletedLines = obj.value;
					var id = selection.get("id");
					if(!Ext.isEmpty(id) && deletedLines.indexOf(id) < 0) {
						if (Ext.isEmpty(deletedLines)) {
							deletedLines="";
						}
						if(deletedLines.length > 0) {
							obj.value = deletedLines+","+id;
						} else {
							obj.value = id;
						}
					}
				}
			}
        }
	},
	removeAllLines: function(grid, lineToDelete) {
		var lineRecords = grid.getStore().data.getRange();
		for(var i = 0; i < lineRecords.length; i ++) {
			var record = lineRecords[i];
			if(record){
				this.removeLine(grid, lineToDelete, record);
			}
		}
	},	
	isDataExist : function(grid,field,value ) {
		var records = grid.getStore().getRange();
		if(records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				if(records[i].get(field) == value) {
					return true;
				}
			}
		}
		return false;
	},
	
	resetSequence : function(grid,seqField,times/*Increased By*/, ignoreEndLines/*Number value, how many lines in the end will be ignored*/) {
		var multiple = times?times:SEQ_MULTIPLE;
		var ignoreNumber = ignoreEndLines?ignoreEndLines:0;
		if(grid) {
			if(!seqField) {
				seqField = "sequence";
			}
			var records = grid.getStore().data.getRange();
			var resetLength = ignoreNumber>records.length?0:records.length - ignoreNumber;
			for(var i=0;i<resetLength;i++){
				records[i].set(seqField, (i+1)*multiple);
			}
		}
	},
	nextSequence : function(grid,times, ignoreEndLines) {
		var multiple = times?times:SEQ_MULTIPLE;
		var nextNumber = multiple;
		var ignoreNumber = ignoreEndLines?ignoreEndLines:0;
		if(grid) {
			var records = grid.getStore().data.getRange();
			if(records && records.length > 0){
				var resetLength = ignoreNumber>records.length?0:records.length - ignoreNumber;
				nextNumber = (resetLength + 1) * multiple;
			}
		}
		return nextNumber;
	},
	modifiedRecordsToJson: function(grid, id){
		var me = this;
		id = id || "id";
		var updateRecords = grid.getStore().getUpdatedRecords();
		var newRecords = grid.getStore().getNewRecords();
		var data = [];
		for(var i = 0; i < newRecords.length; i ++) {
			var record = newRecords[i].getChanges();
			record[id]=newRecords[i].get(id);
			data.push(record);
		}
		for(var i = 0; i < updateRecords.length; i ++) {
			var record = updateRecords[i].getChanges();
			record[id] = updateRecords[i].get(id);
			data.push(record);
		}
		if(data.length > 0){
			return CUtils.jsonEncode(me.formatDateColumnValue(data, me.getDateColumnArray(grid)));
		} else {
			return "";
		}
	},
	allRecordsToJson : function(grid/*Ext.gird*/, withoutFilter) {
		if(withoutFilter){
			var store = grid.getStore();
			if(store.isFiltered()) store.clearFilter();
		}
		var records = grid.getStore().data.getRange();
		return CUtils.jsonEncode(this.dataToArray(null, grid));
	},
	getDateColumnArray : function(grid) {
		if(!grid) return [];
		var dateTypeColumn = [];
		var cols = grid.columns;
		for(var i=0; i<cols.length;i++ ) {
			if(cols[i].fieldType == "date") {
				dateTypeColumn.push(cols[i].dataIndex);
			}
		}
		return dateTypeColumn;
	},
	formatDateColumnValue : function(records, dateTypeColumn) {
		var me = this;
		if(!records) return null;
		var dataArray = [];
		
		for(var i = 0;i < records.length;i++){
			var data = records[i];
			if(data){
				if(dateTypeColumn.length > 0) {
					for ( var columnI = 0; columnI < dateTypeColumn.length; columnI++) {
						var columnIndex = dateTypeColumn[columnI];
						if(data.hasOwnProperty(columnIndex)) {
							data[columnIndex] = me.getFormatDateStr(data[columnIndex]);
						}
					}
				}
				dataArray.push(data);
			}
		}
		return dataArray;
	},
	getFormatDateStr : function(value) {
		if (isNaN(Date.parse(value))) {
			value = Ext.Date.parse(value, 'Y-m-d');
		} else {
			value = new Date(Date.parse(value));
		}
		if(!value) return value;
		var year = value.getFullYear() ;
	    var month = parseInt(value.getMonth()) + 1;
	    	var date = value.getDate();
	    	return dateStr = year + '-' + month + '-' + date + ' 12:00:00' ; 
	},
	// JSON data change to Array
	dataToArray : function(records, grid){
		var me = this;
		if(!records) {
			records = grid.getStore().data.getRange();
		}
		if(!records) return null;
		var dataArray = [];
		var data;
		
		var dateTypeColumn = me.getDateColumnArray(grid);

		for(var i = 0;i < records.length;i++){
			data = records[i].data;
			if(data){
				data['_recordId'] = records[i].id;
				if(dateTypeColumn.length > 0) {
					for ( var columnI = 0; columnI < dateTypeColumn.length; columnI++) {
						var value = data[dateTypeColumn[columnI]];
						data[dateTypeColumn[columnI]] = me.getFormatDateStr(value);
					}
				}
				dataArray.push(data);
			}
		}
		return dataArray;
	},
	// delete specific id from array
	removeFromArray : function(records/*array*/,id/*string*/){
		for(var i = 0; i < records.length; i ++) {
			if(records[i] && records[i].id) {
				if(id == records[i].id) {
					records.splice(i,1);
					break;
				}
			}
		}
	},
	/**
	 * @param record going to be judged
	 * @param data : default data when add line, will ignore the keys in data when judge record is empty
	 *
	 **/
	isRecordEmpty : function(record, data) {
		if(record) {
			var keys = record.fields.keys;
			for(var i=0;i< keys.length;i++){
				if(!(keys[i] in data) && keys[i] != 'sequence') {
					var ft = GUtils.getColumn(keys[i]).fieldType;
					var value = record.get(keys[i]);
					if(ft == 'checkbox') {
						if(value === true) {
							return false;
						}
					} else if(ft == 'number' || ft == 'integer') {
						if(value != 0) {
							return false;
						}
					} else {
						if(!Strings.isEmpty(record.get(keys[i]))) {
							return false;
						}
					}
				}
			}
		}
		return true;
	},
	/**
	 * @param record current selected line object
	 * @param popupId popup hidden id name
	 * @param popupIdValue popup hidden id name's value
	 * @param popupName popup name
	 * @param popupNameValue popup name's value
	 *
	 **/
	setPopupValue : function(record, popupId, popupIdValue, popupName, popupNameValue, prefixId) {
		if(!prefixId) prefixId = GRID_ID;
		var column = Ext.getCmp(prefixId + "_" + popupName);
		
		if(column){
			if(column.field && column.field.getXType() == 'triggerfield' || column.field.getXType() == 'trigger'){
				record.set(popupId,popupIdValue);
				record.set(popupName,popupNameValue);
				column.field.setValue(popupNameValue);
			}
		}
	},
	setHiddenColumn : function(columnConfig, hiddenColumns) {
		var hiddenColumnsArray = hiddenColumns.split(",");
		for(var p in columnConfig){
			for(var i = 0; i < hiddenColumnsArray.length; i++){
				if(columnConfig[p].id == hiddenColumnsArray[i]){
					columnConfig[p].hidden = true;
					columnConfig[p].editable = false;
				} 
			}
		}
		return columnConfig;
	},
	getUniqueColumns : function(columnConfig) {
		var group = new Array();
		var firstOne = new Array();
		for(var p in columnConfig) {
			var c = columnConfig[p];
			if(c.unique === true){
				firstOne.push(c.id);
			}
		}
		group.push(firstOne);
		return group;
	},
	setPopupHidenColumn : function (columnConfig) {
		var newColumnArray = [];
		for(var i = 0; i < columnConfig.length; i++){
			if(columnConfig[i].fieldType == 'browerButton'){
				var hiddenPopupColumn = {id:columnConfig[i].id,fieldType : "text", hidden :true, editable: false, header: columnConfig[i].id};
				newColumnArray.push(hiddenPopupColumn);
				columnConfig[i].id += this.BROWSER_COLUMN_SUBFIX;
				columnConfig[i].dataIndex += this.BROWSER_COLUMN_SUBFIX;
			}
		}
		if(newColumnArray.length != 0){
			for(var i = 0; i < newColumnArray.length; i++){
				columnConfig.push(newColumnArray[i]);
			}
		}
		return columnConfig;
	},
	getSelected : function(grid) {
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			return grid.getSelectionModel().getLastSelected();
		}
		return null;
	},
	getRecordByInternalId : function(grid, id) {
		if(!id || Strings.isEmpty(id)) return null;
		
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			var records = grid.getStore().data.getRange();

			for(var i = 0; i < records.length; i ++) {
				var record = records[i];
				if(record && record.internalId == id) {
					return record;
				}
			}
		}
		return null;
	},
	getRecord : function(grid, id) {
		if(Strings.isEmpty(id)) return null;
		
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			var records = grid.getStore().data.getRange();

			for(var i = 0; i < records.length; i ++) {
				var record = records[i];
				if(record && (record.get("id") == id || record.internalId == id)) {
					return record;
				}
			}
		}
		return null;
	},
	getSelectedId : function(grid) {
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			var curRecord = this.getSelected(grid);
			if(curRecord) {
				return curRecord.data["id"];
			}
		}
		return "";
	},
	colorRenderer : function(colorValue,styleObj) {
		styleObj.style = 'background-image:none;background-color:#' + colorValue+';';
	},
	dateRenderer : function(value) {
		if(!Ext.isDate(value)) {
			if (isNaN(Date.parse(value))) {
				value = Ext.Date.parse(value, 'Y-m-d');
			} else {
				value = new Date(Date.parse(value));
			}
	    }
	    return value ? Ext.util.Format.date(value,'Y-m-d') : '';
	},
	timeRenderer : function(value) {
		if(!Ext.isEmpty(value) && Ext.isDate(value)){
			return Ext.util.Format.date(value,'H:i');
		} else {
			return value;
		}
	},
	comboBoxRenderer : function(combo) {
		return function(value) {
			var idx = combo.store.find(combo.valueField, value);
			var rec = combo.store.getAt(idx);
			if(!Ext.isEmpty(rec)){
				return rec.get(combo.displayField);
			} else {
				return value;
			}
		};
	},
	fireCellEditEvent : function(record,field,newValue,originalValue,grid) {
		grid = grid || Ext.getCmp(GRID_ID);
        var obj = {'grid':grid,'record':record,'field':field,'value':newValue,'originalValue':originalValue};
        var flag = grid.fireEvent('beforeedit', this, obj);
        //alert(flag +  " | " + field +  " | " + newValue + " | " + originalValue);
        if(flag) {
        	record.set(field,newValue);
        	grid.fireEvent('edit',this, obj);
        }
	},
	setRecordAndFireEvent : function(record,field,newValue,grid) {
		var originalValue = record.get(field);
		this.fireCellEditEvent(record, field, newValue, originalValue, grid);
	},
	setRecord : function(record,data,grid) {
		for(p in data) {

			// fire grid's cell edit event
            this.setRecordAndFireEvent(record, p, data[p], grid);
		}
	},
	cancelSelectionChangeIfRelatedStoreIsLoading : function(grid, store) {
		if(grid) {
			grid.getView().on('beforeitemmousedown', function(view, record, item, index, e, eOpes) {
				if(store && store.isLoading()) return false;
				return true;
			});
		}
	},
	getHeader : function(dataIndex,grid){
		grid = grid || Ext.getCmp(GRID_ID);
		var cols = grid.columns;
		for(var i=0; i<cols.length;i++ ) {
			if(cols[i].dataIndex == dataIndex) {
				return cols[i].text;
			}
		}
		return "";
	},
	getColumnIndex : function(dataIndex,grid){
		grid = grid || Ext.getCmp(GRID_ID);
		var cols = grid.columns;
		for(var i=0; i<cols.length;i++ ) {
			if(cols[i].dataIndex == dataIndex) {
				return i;
			}
		}
		return -1;
	},
	getColumn : function(dataIndex, grid) {
		grid = grid || Ext.getCmp(GRID_ID);
		return Ext.getCmp(grid.id + "_" + dataIndex);
	},
	// TODO (need convert to extjs4) under two methods use in exporting grid as excel start ------------------
	getColumnConfigArray : function(grid) {
		var array = new Array();
		var fieldConfigure = grid.columns;
		if(fieldConfigure){
			if(fieldConfigure.length > 0){
				for ( var i = 0; i < fieldConfigure.length; i++) {
					var elment = fieldConfigure[i];
					if(elment.isCheckerHd) continue;//hidde the check all column
					if(!elment.hidden){
						var configObj = {};
						configObj[elment.dataIndex] = elment.text;
						configObj['columnType'] = elment.fieldType;
						array.push(configObj);
					}
				}
			}
		}
		return array;
	},
	isColumnHidden : function(grid, dataIndex) {
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			var elment = this.getColumn(dataIndex,grid);
			return CUtils.isTrueVal(elment.hidden);
		}
		return false;
	},
	isColumnEditable : function(grid, dataIndex) {
		grid = grid || Ext.getCmp(GRID_ID);
		if(grid) {
			var elment = this.getColumn(dataIndex,grid);
			return CUtils.isTrueVal(elment.editable);
		}
		return false;
	},
	exportExcelList : function(grid, searchParams, pathParam, action) {
		if(grid.ignoreExport === true) {
			return
		}
		var path = pathParam || $('_FROM_URI__').value;
		var parameters = {};
		parameters = searchParams;
		action = action || "exportGridExcel";
		if(!Strings.isEmpty(path)){
			if(Strings.isEmpty(pathParam)) {
				var position = path.lastIndexOf('\/');
				path = path.substring(0, position) + "/" + action;
			}
			var url = path + '?columnConfig=' + 
			CUtils.myEncodeURI(CUtils.jsonEncode(this.getColumnConfigArray(grid))) + "&" + Ext.urlEncode(parameters);
			document.forms["noDataForm"].action = url;
			document.forms["noDataForm"].submit();
		}
	},
	moveUp : function(grid,seqField,times,ignoreEndLines){
		var multiple = times?times:SEQ_MULTIPLE;
		var ignoreNumber = ignoreEndLines?ignoreEndLines:0;
		if(!seqField) {
			seqField = "sequence";
		}		
		var store = grid.getStore(); 
		var record = this.getSelected(grid); 
		var index = store.indexOf(record); 
		if (index > 0) { 
			store.removeAt(index); 
			store.insert(index - 1, record); 
			grid.getView().getSelectionModel().select(index - 1,false,false);
			this.resetSequence(grid,seqField,multiple,ignoreNumber);
		}
		return record;
	},
	moveDown : function(grid,seqField,times,ignoreEndLines){
		var multiple = times?times:SEQ_MULTIPLE;
		var ignoreNumber = ignoreEndLines?ignoreEndLines:0;
		if(!seqField) {
			seqField = "sequence";
		}	
		var store = grid.getStore(); 
		var record = this.getSelected(grid); 
		var index = store.indexOf(record); 
		if (index < store.getCount() - 1 - ignoreNumber) { 
			store.removeAt(index); 
			store.insert(index + 1, record); 
			grid.getView().getSelectionModel().select(index + 1,false,false);
			this.resetSequence(grid,seqField,multiple,ignoreNumber);
		}
		return record;
	},
	getAllRecords : function (grid){
		grid = grid || Ext.getCmp(GRID_ID);
		return grid.getStore().data.getRange();
	},
	addIntoColumns : function(gColumns,gFields,col, gId, hasHeaderFilter){
		col.gridId = gId;
		var resourceId = "GRID_" + col.id;
		if(CUtils.isHiddenCmp(resourceId)) return;
		if(CUtils.isDisableCmp(resourceId)) {
			col.editable = false;
		}
		var defaultValue = col.defaultValue,renderer = col.renderer ? col.renderer : null;
		var modelType = 'string';
		switch(col.fieldType){
			case "text" :
				modelType = 'string';
				if(Strings.isEmpty(defaultValue)){
					defaultValue = '';
				}
				if(Strings.isEmpty(renderer)){
					renderer = 'htmlEncode';
				}
				break;
			case "integer" :
				modelType = 'int';
//				if(Strings.isEmpty(defaultValue)){
//					defaultValue = 0;
//				}
				break;
			case "number" : 
				modelType = 'float';
//				if(Strings.isEmpty(defaultValue)){
//					defaultValue = 0;
//				}
				break;
			case "date" : 
				modelType = 'date';
				if(Strings.isEmpty(defaultValue)){
					defaultValue = '';
				}
				break;
			case "checkbox" : 
				modelType = 'bool';
				if(Strings.isEmpty(defaultValue)){
					defaultValue = false;
				}
				break;
			case "time" : 
				modelType = 'time';
				if(Strings.isEmpty(defaultValue)){
					defaultValue = '';
				}
				break;
			default :
				modelType = 'string';
				if(Strings.isEmpty(defaultValue)){
					defaultValue = '';
				}
				if(Strings.isEmpty(renderer)){
					renderer = 'htmlEncode';
				}
				break;
		}
		if(hasHeaderFilter) {
			if (!col.noFilter) {
				if(!col.filter && col.sortKey) {
					if(col.type == 'combo') {
						col.filter = {filterName:"sf_EQ"+col.sortKey, xtype: "combo",mode: "local",store: data,triggerAction: "all"};
					} else {
						col.filter = {xtype:"textfield", filterName: "sf_START_"+col.sortKey};
					}
				}
			}
		}
		var fields = {name: col.id, type: modelType, defaultValue : defaultValue};
		if(modelType == 'date'){
			fields.dateFormat = col.format ? col.format : 'Y-m-d';
		}
		if(modelType == 'time'){
			fields.dateFormat = 'H:i';
		}
		gFields.push(fields);
		if(modelType == 'bool'){
			gColumns.push(new Erp.app.CheckColumn(col));
		} else {
			col.renderer = renderer;
			gColumns.push(new ERP.ui.GridColumn(col));
		}
	},
	addDynamicColumns : function(gColumns,gFields,columnsArray, gId){
		for(var i=0; i<columnsArray.length; i++){
			var col = columnsArray[i];
			this.addIntoColumns(gColumns,gFields, col, gId);
		}
	},
	gridStringIds : function(grid) {
		var records = this.getAllRecords(grid);

		return this.recordsStringIds(records);
	},
	recordsStringIds: function(records) {
		var ids = [];
		for (var i = 0; i < records.length; i++) {
			if (!Strings.isEmpty(records[i].get("id"))) {
				ids.push(records[i].get("id"));
			}
		}
		
		return ids.join(",");
	},
	//end------------------------------------------------------------
	initErpGrid : function(_gId, _gExtraParams, _gConfig, _gDockedItem) {
		var me =this;
		var gId = _gId || GRID_ID;
		var gExtraParams = _gExtraParams || {};
		var gConfig = _gConfig || G_CONFIG;
		
		var gFields = [];
		var gColumns = [];
		var gPlugins = [];
		var gFeatures = [];
		var gDockedItems = [];
		if (_gDockedItem) gDockedItems.push(_gDockedItem);
		var hasHeaderFilter = gConfig.hasHeaderFilter === true;
		for (var i = 0, l = gConfig.columns.length; i < l; i ++) {
			var col = gConfig.columns[i];
			if(col.fieldType == 'columns'){
				this.addDynamicColumns(gColumns,gFields,col.value, gId, hasHeaderFilter);
			}else{
				this.addIntoColumns(gColumns,gFields, col, gId, hasHeaderFilter);
			}
		}
	
		var model = Ext.define(gConfig.modelName || gId+'GridModelName', {
		    extend: 'Ext.data.Model',
		    fields: gFields
		});
		
		var gProxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
	        actionMethods : {
	        	read: "POST" // this way can resolve to chinese garbled
	        },
			url : gConfig.url,
	        reader : {
	            type : 'json',
	            root : gConfig.root || 'data',
	            idProperty: gConfig.idProperty || 'id',
	            totalProperty: 'total' // implements infinite grid proxy 
	        },
	        startParam: 'beginIndex',
	        limitParam: 'pageSize'
		});
		
		var gStore = null;
		
		Ext.apply(gProxy.extraParams, gExtraParams);
	    
	    if(gConfig.isLocalData === true) {
	    	gStore = Ext.create('Ext.data.ArrayStore', {
	    		pageSize : DEFAULT_PAGE_SIZE,
	    		autoDestroy : true,
			    storeId: '_gStore' + gId,
			    model : model,
			    data: gConfig.data || new Array()
	    	});
	    } else if (gConfig.isInfinite) { // implements infinite grid for emp project
	    	gStore = Ext.create('Ext.ux.data.JsonStore' , {
			    //autoDestroy : true,
			    storeId: '_gStore' + gId,
			    proxy: gProxy,
			    remoteSort: true,
		        // allow the grid to interact with the paging scroller by buffering
		        buffered: true,
		        leadingBufferZone: 300,
		        pageSize: 100,
			    model : model,
			    cols : gConfig.columns,
			    autoLoad : gConfig.autoLoad || false
			});
	    } else {
	    	gStore = Ext.create('Ext.ux.data.JsonStore' , {
	    		pageSize : DEFAULT_PAGE_SIZE,
			    autoDestroy : true,
			    storeId: '_gStore' + gId,
			    proxy: gProxy,
			    model : model,
			    cols : gConfig.columns,
			    autoLoad : gConfig.autoLoad || false
			});
	    }
		
		var gIsEditable = gConfig.isEditable === true ? true : false;
		if(gIsEditable) gPlugins.push(Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1}));
		if(hasHeaderFilter) {
			gPlugins.push(new Ext.ux.grid.plugin.HeaderFilters());
			gStore.remoteFilter = true;			
		}
		var isMultipleSelect = gConfig.isMultipleSelect === true ? true : false;
		if(isMultipleSelect) {
//			gConfig.selModel = Ext.create('Ext.selection.CheckboxModel');
			gConfig.selType = 'checkboxmodel';
//			gPlugins.push(Ext.create('Ext.ux.grid.plugin.DragSelector'));
		}
		if(gConfig.group) {
			if(!Strings.isEmpty(gConfig.group.groupHeaderTpl)) {
			    var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
			        groupHeaderTpl: gConfig.group.groupHeaderTpl
			    });
			    gFeatures.push(groupingFeature);
			}
//		    gFeatures.push({ftype:'grouping'});
		}
		var gIsPaging = gConfig.isPaging === false ? false : true;
		if(gIsPaging) {
			var item =[];
			if(gConfig.isExport){
				 item = [{ 
				       text: PRes["export"],
				       type: 'minus',
				       iconCls : 'ss_accept ss_excel',
				       id:"exportButtonId",
				       handler: function(event, toolEl, panel){
				    	   me.exportExcelList(Ext.getCmp(gId),PAction.getSearchParams(), "", gConfig.exportAction);
				       }
		          }];
			}
			if (gConfig.isNeedShowTotalInfo) {
				item.push({
					xtype:'label',
					id: 'currentPageTotal',
					cls: 'page-total-info-class'
				});
			}
			gDockedItems.push({
		         xtype : 'pagingtoolbar',
		         store : gStore, 
		         dock  : 'bottom',
		         displayInfo : true,
		         displayMsg  : PRes["pagingDisplay"],
		         emptyMsg    : PRes["pagingNoRecord"],
		         paramNames  :{start: 'beginIndex', limit: 'pageSize'},
		         items: item
			});
		} else if(gConfig.isExport){
			item = [{ 
			       text: PRes["export"],
			       type: 'minus',
			       iconCls : 'ss_accept ss_excel',
			       id:"exportButtonId",
			       handler: function(event, toolEl, panel){
			    	   me.exportExcelList(Ext.getCmp(gId),PAction.getSearchParams(), "", gConfig.exportAction);
			       }
	          }];
			gDockedItems.push({
		         xtype : 'toolbar',
		         dock  : 'bottom',
		         items: item
			});
		}
		var _conf = {
			id : gId,
			store : gStore,
			viewConfig: gConfig.viewConfig || {
		        stripeRows: true,
		        trackOver: false
		    },
			columnLines: true,
			stateful: true,
			columns : gColumns,
			plugins : gPlugins,
			features : gFeatures,
			dockedItems : gDockedItems
		};
		// implements infinite grid for emp project
		if(gConfig.isInfinite){
			_conf.selModel = {pruneRemoved: false};
			_conf.viewConfig = {trackOver: false};
			//_conf.multiSelect= true;
		}
		
		if(!Strings.isEmpty(gConfig.renderTo)) {
			_conf.renderTo = gConfig.renderTo; // could not exist when use app layout
		}
		if(!Strings.isEmpty(gConfig.tbar)) {
			_conf.tbar = gConfig.tbar;
		}
		if(!Strings.isEmpty(gConfig.selModel)) {
			_conf.selModel = gConfig.selModel;
		}
		if(!Strings.isEmpty(gConfig.selType)) {
			_conf.selType = gConfig.selType;
		}
		if(!Strings.isEmpty(gConfig.stateful)) {
			_conf.stateful = gConfig.stateful;
		}
		if(gConfig.group && !Strings.isEmpty(gConfig.group.groupField)) {
			_conf.groupField = gConfig.group.groupField;
		}
		var gGridPanel = Ext.create('Ext.grid.Panel', _conf);
	
		if(gConfig.height) gGridPanel.setHeight(gConfig.height);
		
		if(!gConfig['uniqueColumns']) gConfig['uniqueColumns'] = [[]];
		VUtils.addGrid({id: gId, uniqueColumns: gConfig['uniqueColumns'], grid: gGridPanel, notNull: gConfig.notNull});
		
		gGridPanel.on('edit', function(editor, obj) {
			IS_PAGE_MODIFIED = true;
		});
		gGridPanel.store.on('beforeprefetch', function(store, opetions, opt) {
        	if (store.hasRemoteSort()) {
        		var sorts = {sorters: store.getSorters()};
        		Ext.apply(opetions, sorts);
        	}
    	});
		return gGridPanel;
	}
});

Ext.define('ERP.ui.GridColumn', {
	extend: 'Ext.grid.column.Column',
    alias: 'widget.gridColumn',
    constructor: function(cfg){
    	if(!cfg.header) cfg.header = cfg.id;
    	if(cfg.id && !cfg.dataIndex){
			cfg.dataIndex = cfg.id;
		}
    	cfg.id = cfg.gridId + "_" + cfg.id;
		if(cfg.hidden){
			cfg.hideable = false;
		}
		if(!cfg.fieldType){
			cfg.fieldType = "text";
		}
		cfg.sortable = (cfg.sortable === false) ? false : true;
		if(cfg.fieldType === 'integer' || cfg.fieldType === 'number') {
			cfg.align = 'right';
		}
		if(cfg.editable){
			switch(cfg.fieldType){
				case "text" : 
					cfg.editor={
		                xtype:"textfield",
		                allowBlank:(cfg.allowBlank === false) ? false : true
		            };
					if(cfg.vtype){
						cfg.editor.vtype = cfg.vtype;
					}
					if (cfg.maxLength) {
						cfg.editor.enforceMaxLength = true,
						cfg.editor.maxLength = cfg.maxLength;
					}
					break;
				case "date":
					if(!cfg.renderer) cfg.renderer = GUtils.dateRenderer;
					cfg.editor={
						xtype: 'datefield',
		                format: cfg.format ? cfg.format : 'Y-m-d',
		                allowBlank:(cfg.allowBlank === false) ? false : true,
		                disabledDays : cfg.disabledDays ? cfg.disabledDays.split(',') : '',
		              	minValue:cfg.minValue ? cfg.minValue : '',
		              	maxValue:cfg.maxValue ? cfg.maxValue : '',
		              	value: '',
		              	allowBlank: false,
		              	blankText: "this field is not null"
		            };
					if(cfg.minValue){
						cfg.editor.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						cfg.editor.maxValue = cfg.maxValue;
					}
					break;
				case "time":
					cfg.editor={
						xtype: 'timefield',
				        name: 'in',
				        minValue: '0:00 AM',
				        maxValue: '23:00 PM',
				        increment: cfg.increment ? cfg.increment : 5
		            };
					cfg.renderer = GUtils.timeRenderer;
					break;
				case "number":
					cfg.editor={
						xtype: 'numberfield',
		                allowBlank:(cfg.allowBlank === false) ? false : true,
		                decimalPrecision : cfg.decimalPrecision || 2,
		                labelAlign : 'right',
                		// Remove spinner buttons, and arrow key and mouse wheel listeners
                        hideTrigger: true,
                        keyNavEnabled: false,
                        mouseWheelEnabled: false
		            };
					if(cfg.vtype){
						cfg.editor.vtype = cfg.vtype;
					}
//					var allowNegative = (cfg.allowNegative === true) ? true : false;
//					if(!allowNegative){
//						cfg.field.minValue = 0;
//					}
					if(cfg.minValue){
						cfg.editor.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						cfg.editor.maxValue = cfg.maxValue;
					}
//					cfg.renderer = function(value) {GUtils.numberRenderer(value)};
					break;
				case "integer":
					cfg.field={
						xtype: 'numberfield',
		                allowBlank:(cfg.allowBlank === false) ? false : true,
		                decimalPrecision : 0,
		                labelAlign : 'right',
	                	// Remove spinner buttons, and arrow key and mouse wheel listeners
                        hideTrigger: true,
                        keyNavEnabled: false,
                        mouseWheelEnabled: false
		            };
					if(cfg.vtype){
						cfg.field.vtype = cfg.vtype;
					}
					var allowNegative = (cfg.allowNegative === true) ? true : false;
					if(!allowNegative){
						cfg.field.minValue = 0;
					}
					if(cfg.minValue){
						cfg.field.minValue = cfg.minValue;
					}
					if(cfg.maxValue){
						cfg.field.maxValue = cfg.maxValue;
					}
//					cfg.renderer = function(value) {GUtils.numberRenderer(value)};
					break;
				case "combobox": 
					var comboBoxData = cfg.controlData;
					var comboBoxDataStore = new Ext.data.ArrayStore({ 
						fields: ['name', 'text'],
						data : comboBoxData
					});
					var combo = new Ext.form.field.ComboBox({
						store: comboBoxDataStore,
						valueField:'name',
						displayField:'text',
						queryMode: 'local',
						editable:false,
						triggerAction: 'all',
						allowBlank : (cfg.allowBlank === false) ? false : true
					});
					cfg.field=combo;
					cfg.renderer = GUtils.comboBoxRenderer(combo);
					break;
				case "browerButton":
					var browerButton = new Ext.form.field.Trigger({
						triggerCls : 'x-form-brower-trigger',
						editable : false,
						allowBlank : (cfg.allowBlank === false) ? false : true,
						onTriggerClick: function() {
							if(cfg.popupSelectOnClick) {
								PAction[cfg.popupSelectOnClick](cfg.dataIndex,browerButton);
							} else {
								popupSelect_onclick(cfg.dataIndex);
							} 
					    }
					});
					cfg.field = browerButton;
					break;
				case "colorField":
					var trigger = new Ext.form.field.Picker({
						id : 'trigger-color-picker',
						triggerCls : 'x-form-color-trigger',
						editable : false,
						allowBlank : (cfg.allowBlank === false) ? false : true,
						onTriggerClick : function() {
							var colorPick = new Ext.menu.ColorPicker({
							    id : 'menu-color-picker',
								handler: function(cm, color){
							    	var record = Ext.getCmp(cfg.gridId).getSelectionModel().getSelection()[0];
							    	record.set(cfg.dataIndex, color);
						        }
							});
							colorPick.on('beforeshow',function(obj){
								trigger.setDisabled(true);
							});
							colorPick.on('show',function(obj){
								obj.setPosition([trigger.el.getX(),trigger.el.getY()+trigger.getHeight()+1],true);
							});
							colorPick.on('hide',function(obj){
								trigger.setDisabled(false);
								colorPick.destroy();
							});
							colorPick.show();
						}
					});
				    cfg.field = trigger;
					break;
			}
			
		}
		if(cfg.fieldType == 'colorField'){
			cfg.renderer = GUtils.colorRenderer;
		}
		//add to commonComponentValidate
		if(!cfg.hidden) {
			VUtils.addColumn(cfg);
		}
		if(cfg.decimalPrecision) {
			cfg.renderer = function(value, metadata, record, rowIndex, colIndex, store) {
				if(!Strings.isEmpty(value)) {
					return CUtils.round(value, cfg.decimalPrecision);
				}
				return value;
			};
		}
		ERP.ui.GridColumn.superclass.constructor.call(this, cfg);
	}
});
Ext.define("Ext.ux.data.JsonStore", {
	extend: 'Ext.data.JsonStore',
	alias: 'widget.uxJsonStore',
	cols : null,
	_sts : null,
    constructor: function(config) {
        config = config || {};
        this.callParent([config]);
    },
    doSort: function(sorterFn) {
        var me = this;
        var trace = printStackTrace();
        var t = trace.join(' -> ');
        if (me.hasRemoteSort()) {
        	var options = {sorters: me.getSorters()};
        	me.remoteSort = true;
        	me.sortOnLoad = false;
        	
        	// skip for state load,only works in Chrome and FF, not IE
        	if(t.indexOf('initState') == -1) {
        		// hack for sort of infinite grid
        		me.removeAll();
        		me.load(options);
        		var param = me.proxy.extraParams;
    			param.sorters = me.getSorters();
    			
    			Ext.Ajax.request({
    			    url : '/app/emp/state/saveQueryInfo',
    			    params : {'pageName' : PAction.getPageName(), 'data' : CUtils.jsonEncode(param)}
    			});
        	}
            me.remoteSort = false;
        } else {
        	me.callParent(arguments);
        }
    },
    getSorters: function() {
    	if(this._sts && this._sts.length) {
    		return this._sts;
    	}
        return [];
    },
    hasRemoteSort : function() {
    	var flag = false;
    	var sts = [];
    	for(var i=0; i < this.sorters.items.length; i++) {
    		for(var j=0; j < this.cols.length; j++) {
    			if(!Ext.isEmpty(this.cols[j].sortKey) && this.sorters.items[i].property == this.cols[j].dataIndex) {
    				var keys = this.cols[j].sortKey.split(",");
    				for ( var k = 0; k < keys.length; k++) {
        				var o = {};
        				o.property = keys[k];
        				o.direction = this.sorters.items[i].direction;
        				sts.push(o);
        				flag = true;
					}
    			}
    		}
    	}
    	this._sts = sts;
    	return flag;
    }
})