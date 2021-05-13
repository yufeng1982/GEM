<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
	<title>${varName}</title>
	<jsp:include page="/WEB-INF/views/maintenance/_includes/_maintenanceGrid.jsp"/>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/ui/_includes/_popup.js"/>
	</script>
	<script type="text/javascript" src="/js/erp/maintenance/MaintenanceAction.js"></script>
</head>
<body>
	<form:form id="form1" action="/app/${APP_NAME}/ui/popup/${entityId}/" method="post" modelAttribute="selected">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<input type="hidden" id="selectedRecords" name="selectedRecords" />
		<div id="divWinHeader">${varName}</div>
	</form:form>
</body>
</html>