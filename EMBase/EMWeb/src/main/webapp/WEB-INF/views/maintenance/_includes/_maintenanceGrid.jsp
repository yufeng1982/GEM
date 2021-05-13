<script type="text/javascript">
var searchable = ${searchable};
var multiple = ${multiple};

var jsonUrl = '${searchUrl}';
var hiddenColumns = '${hiddenColumns}';
var decodedColumns = ${columnConfigs};
var uniqueColumns = GUtils.getUniqueColumns(decodedColumns);
var columns = GUtils.setHiddenColumn(decodedColumns, hiddenColumns);
columns = GUtils.setPopupHidenColumn(columns);
G_CONFIG = {
		url : jsonUrl,
		root : 'data',
		modelName : 'MaintenancePopup',
		idProperty : 'id',
		isEditable : false, 
		isPaging : false,
		autoLoad : true,
		isInfinite : true,
		uniqueColumns: uniqueColumns,
		columns : columns
};
</script>