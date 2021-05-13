<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.EventLog')}"/>
	<title>${winTitle}</title>
	<style type="text/css" media="all">
		
	</style>
	<jsp:directive.include file="/WEB-INF/views/common/eventLog/_includes/_eventLogsGrid.jsp" />
	<script type="text/javascript">
		function page_OnLoad() {
			var searchConfig = {
				layout : 'hbox',
				items: [{
					fieldLabel: "${f:getText('Com.Code')}",
					xtype : 'textfield',
			        fieldWidth: 60,
			        name: 'query',
			        value : ""
				}]
			};
			PApp = new ERP.ListApplication({searchConfig : searchConfig});
			PAction= new ERP.ListAction({launcherFuncName : "showEventLog"});
		}
	</script>
</head>
<body>
<form id="form1" action="" method="post" >
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<div id="divWinHeader">${winTitle}</div>
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>