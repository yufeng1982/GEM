<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('Com.Role')} - ${entity.name}"/>
<c:choose>
	<c:when test="${entity.newEntity}"><c:set var="readonly" value="false"/></c:when>
	<c:otherwise><c:set var="readonly" value="true"/></c:otherwise>
</c:choose>
<title>${winTitle}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width:140px}
		.fieldRowTextField {width:160px}
		#divHeader1 {float:left;width:48%}
		#divHeader2 {float:left;width:48%}
	</style>
	
	<script type="text/javascript" src="/js/erp/security/user/RoleAction.js"></script>
	
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/security/user/_includes/_role.js" />
	</script>
</head>
<body>

<c:set var="bindModel" value="entity"/>

<form:form id="form1" action="/app/${APP_NAME}/role/form/${entityId}/" method="post" modelAttribute="${bindModel}">
<div id="divWinHeader">${winTitle}</div>
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<form:hidden path="version" id="version" />
	<form:hidden path="functionNodeIds"/>
	<form:hidden path="resources"/>
	<div id="infoDiv">
	    <div id="divHeader1">
			<t:common type="text" path="name" id="name" key="Com.Name" readonly="${readonly}" onchange="nameOnchange" notNull="true" />
			<t:common type="text" path="description" id="description" key="Com.Description" />
        </div>
		<div id="divHeader2">
		    <t:combine type="creation" bindModel="${bindModel}" id="creation" key="Com.CreationDateBy"/>
			<t:combine type="modification" bindModel="${bindModel}" id="modification" key="Com.MotifyDateBy" />
		</div>
	</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>