<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<html>
<c:set var="pageTitle">${f:getText('FN.EventLog')} </c:set>
<c:set var="pageHeader">${f:getText('FN.EventLog')} </c:set>
<head>
	<title>${pageTitle}</title>
	<style type="text/css" media="all">
		
	</style>
	<script type="text/javascript" src="/js/erp/common/eventLog/EventLogAction.js"></script>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/common/eventLog/_includes/_eventLog.js" />
	</script>
</head>
<body>

<c:set var="bindModel" value="entity"/>
<form:form id="form1" action="/app/${APP_NAME}/common/eventLog/form/${entityId}/" method="post" modelAttribute="${bindModel}">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<div id="divWinHeader">${pageHeader}</div>

		<div id="divGeneral" class="divPanel">
			<jsp:directive.include file="/WEB-INF/views/common/eventLog/_includes/_eventLogProperties.jspf" />
		</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>