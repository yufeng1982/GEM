<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
	<title>${title}</title>
	<jsp:directive.include file="/WEB-INF/views/prop/_includes/_propsGrid.jsp" />
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/prop/_includes/_props.js" />
	</script>
	<pack:script>
	    <src>/js/erp/prop/PropAction.js</src>
	</pack:script>
</head>
<body>
	<form id="form1" action="${formUrl}">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<input type="hidden" id="modifiedRecords" name="modifiedRecords"></input>
		<input type="hidden" id="lineToDelete" name="lineToDelete"></input>
		<input type="hidden" id="savePermission" name="savePermission" value="${savePermission}"></input>
		<input type="hidden" id="deletePermission" name="deletePermission" value="${deletePermission}"></input>
		<input type="hidden" id="ableToClosePage" name="ableToClosePage" value="${ableToClosePage}"></input>
		<input type="hidden" id="ignoreCorporation" name="ignoreCorporation" value="${ignoreCorporation}"></input>
		<c:forEach var="it" items="${filterParams}">
			<input type="hidden" id="fp_${it.key}" name="${it.key}" value="${it.value}"></input>
		</c:forEach>
	</form>
</body>
</html>