<script type="text/javascript">
function numberFormatRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	return Ext.util.Format.number(value,'0,000.00');
}
G_MANAGEMENT_REPORT_STATS_CONFIG = {
		url : '/app/core/ui/dashboard/flashReport',
		idProperty : 'id',
		isPaging : false,
		isExport : true,
		autoLoad : false,
		isEditable : false,
		columns : [
			{ id:'description', header:"${f:getText('Dashboard.ManagementReport.KPI.Desc')}", width:120},
			{ id:'today', header:"${f:getText('Dashboard.ManagementReport.KPI.Today')}", width:120, fieldType : 'number', renderer: numberFormatRenderer},
			{ id:'currMoActual', header:"${f:getText('Dashboard.ManagementReport.KPI.CMA')}", width:120, fieldType : 'number', renderer: numberFormatRenderer},
			{ id:'currMoLastActual', header:"${f:getText('Dashboard.ManagementReport.KPI.LCMA')}", width:140, fieldType : 'number' , renderer: numberFormatRenderer},
			{ id:'currMoBudget', header:"${f:getText('Dashboard.ManagementReport.KPI.CMB')}", width:120, fieldType : 'number', renderer: numberFormatRenderer},
			{ id:'ytdCurrActual', header:"${f:getText('Dashboard.ManagementReport.KPI.YCA')}", width:120, fieldType : 'number' , renderer: numberFormatRenderer},
			{ id:'lastYTDActual', header:"${f:getText('Dashboard.ManagementReport.KPI.LYCA')}", width:120, fieldType : 'number' , renderer: numberFormatRenderer},
			{ id:'lastYTDBudget', header:"${f:getText('Dashboard.ManagementReport.KPI.LYB')}", width:120, fieldType : 'number' , renderer: numberFormatRenderer}
		]
};
</script>