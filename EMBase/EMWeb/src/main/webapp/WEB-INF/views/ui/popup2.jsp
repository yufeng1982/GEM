<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
	<title>${f:getText('Com.ChoosePage')}</title>
	<style type="text/css" media="all">
	</style>
	<jsp:include page="/WEB-INF/views/${gridUrl}.jsp" flush="true" />
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/ui/_includes/_popup2.js" />
	</script>
</head>
<body>
	<form:form id="form1" action="/app/${APP_NAME}/ui/popup/${entityId}/" method="post" modelAttribute="selected">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<input type="hidden" id="selectedRecords" name="selectedRecords" />
	</form:form>
</body>
</html>