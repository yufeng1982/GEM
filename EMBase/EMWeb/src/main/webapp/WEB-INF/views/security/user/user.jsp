<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('Com.User')} - ${entity.username}"/>
<c:choose>
	<c:when test="${entity.newEntity}"><c:set var="method" value="post"/><c:set var="readonly" value="false"/></c:when>
	<c:otherwise><c:set var="method" value="put"/><c:set var="readonly" value="true"/></c:otherwise>
</c:choose>

	<title>${winTitle}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width:140px}
		.fieldRowTextField {width:160px}
		#divHeader1{float:left;width:48%}
		#divHeader2{float:left;width:48%}
	</style>
	<script type="text/javascript">
		PRes["roleList"] = "${f:getText('Com.User.RolesList')}";
		PRes["RoleListValidation"] = "${f:getText('Validation.RoleList.NotEmpty')}"
		PRes["modifyPassword"] = "${f:getText('Com.ModifyPassword')}";
		PRes["validationPassword"] = "${f:getText('Validation.ValidationPassword')}";
		
		// define some var by using EL if needed
		
	</script>
	<jsp:directive.include file="/WEB-INF/views/security/user/_includes/_rolesGrid.jsp" />
	<script type="text/javascript" src="/js/erp/security/user/UserAction.js"></script>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/security/user/_includes/_user.js" />
	</script>
	
	
</head>
<body>

<c:set var="bindModel" value="entity"/>

<form:form id="form1" action="/app/${APP_NAME}/user/form/${entityId}/" method="${method}" modelAttribute="${bindModel}">
<div id="divWinHeader">${winTitle}</div>
	<form:hidden path="version" id="version" />
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<input type="hidden" name="roleListJSON" id="roleListJSON" />
	<input type="hidden" id="isSuperAdmin" value="${isSuperAdmin}"/>
	<div id="divGeneral">
	    <div id="divHeader1">
			<t:common type="text" tabindex='10' path="username" id="name" key="Com.Name" readonly="${readonly}" notNull="true" maxlength="50" onchange="checkComponentUnique"/>
			<c:if test="${entity.newEntity}">
				<t:common type="password" tabindex='20' maxlength="50" path="password" id="password" key="Com.Password" />
			</c:if> 
			<t:common type="text" tabindex='23' path="email" id="email" key="Com.Email" maxlength="50" notNull="true" onchange="checkComponentUnique"/>
			<t:common type="text" tabindex='29' path="phone" id="phone" key="Com.PhoneNumber" notNull="true" maxlength="50" />
        </div>
		<div id="divHeader2">
			<t:common type="text" tabindex='10' path="nickname" id="nickname" key="Com.Nickname" notNull="true" maxlength="50" onchange="checkComponentUnique"/>
			<c:if test="${entity.newEntity}">
				<t:common type="password" tabindex='30' maxlength="50" path="plainPassword" id="plainPassword" key="Com.Confirm.Password" />
			</c:if>
			<t:common type="checkbox" path="enabled" id="enabled" key="Com.Enabled" />
		    <t:combine type="creation" bindModel="${bindModel}" id="creation" key="Com.CreationDateBy"/>
			<t:combine type="modification" bindModel="${bindModel}" id="modification" key="Com.MotifyDateBy" />
		</div>
	</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>