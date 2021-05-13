<script type="text/javascript">
var isPopupEditor = "${isPopupEditor}";
var propUrl = "${propUrl}";
var paged = "${paged}";
var isInfinite = "${isInfinite}";
var jsonUrl = "${jsonUrl}";
var sizeJsonStr = '${propWinSizeSetupJsonStr}';
var hiddenColumns = "${hiddenColumns}";
var columnModelConfig = ${columnModelConfig};
var uniqueColumns = GUtils.getUniqueColumns(columnModelConfig);
var columns = GUtils.setHiddenColumn(columnModelConfig, hiddenColumns);
columns = GUtils.setPopupHidenColumn(columns);
G_CONFIG = {
		url : jsonUrl,
		root : 'data',
		modelName : 'GenericProp',
		idProperty : 'id',
		isEditable : !CUtils.isTrueVal(isPopupEditor), 
		isPaging : CUtils.isTrueVal(paged),
		isInfinite : CUtils.isTrueVal(isInfinite),
		uniqueColumns: uniqueColumns,
		columns : columns
};
</script>