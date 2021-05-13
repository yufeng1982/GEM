<jsp:directive.include file="/WEB-INF/views/layouts/_header.jsp" />
<jsp:directive.include file="/WEB-INF/views/utils/_resourceUtil.jsp" />
	<title>${title}</title>
	<style type="text/css" media="all">
	</style>
	
	<jsp:directive.include file="/WEB-INF/views/maintenance/_includes/_maintenancedModelGrid.jsp" />
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/maintenance/_includes/_list.js" />
	</script>
</head>
<body>
	<form id="form1" action="${formUrl}">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<input type="hidden" id="modifiedRecords" name="modifiedRecords"></input>
		<input type="hidden" id="lineToDelete" name="lineToDelete"></input>
		<div id="divWinHeader">${title}</div>
	</form>
</body>
</html>