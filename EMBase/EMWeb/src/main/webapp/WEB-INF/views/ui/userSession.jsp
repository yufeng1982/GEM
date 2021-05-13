<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
	<style type="text/css" media="all">
		.fieldRow LABEL {width:	160px;}
		.fieldRowTextField{width:160px;}
	</style>
	<title>${f:getText('User.Session')} - ${user.name}</title>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/ui/_includes/_userSession.js" />
	</script>
	<script type="text/javascript" src="/js/erp/ui/UserSessionAction.js"></script>
</head>
<body>

<c:set var="bindModel" value="entity"/>
<form:form id="form1" action="/app/${APP_NAME}/ui/session/form/${entity.id}/" method="${method}" modelAttribute="${bindModel}">
<div id="divWinHeader">${f:getText('User.Session')} - ${entity.name}</div>
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<div id="infoDiv">
		<t:common type="select" path="language" id="language" key="Com.Language" items="${languages}" itemValue="name" itemLabel="text" notNull="true" />
	</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>