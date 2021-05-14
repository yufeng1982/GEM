<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.ArticleInfo')} - ${entity.title}"/>
<c:choose>
	<c:when test="${entity.newEntity}"><c:set var="method" value="post"/><c:set var="readonly" value="false"/></c:when>
	<c:otherwise><c:set var="method" value="put"/><c:set var="readonly" value="true"/></c:otherwise>
</c:choose>

	<title>${winTitle}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width:140px}
		.fieldRowTextField {width:160px}
		#divHeader1{float:left;width:33%}
		#divHeader2{float:left;width:33%}
		#divHeader2{float:left;width:33%}
	</style>
	<script type="text/javascript">
		PRes["roleList"] = "${f:getText('Com.User.RolesList')}";
		PRes["RoleListValidation"] = "${f:getText('Validation.RoleList.NotEmpty')}"
		PRes["modifyPassword"] = "${f:getText('Com.ModifyPassword')}";
		PRes["validationPassword"] = "${f:getText('Validation.ValidationPassword')}";
		
		// define some var by using EL if needed
		
	</script>
	<jsp:directive.include file="/WEB-INF/views/article/article/_includes/_chaptersGrid.jsp" />
	<script type="text/javascript" src="/js/erp/article/article/ArticleAction.js"></script>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/article/article/_includes/_article.js" />
	</script>
	
	
</head>
<body>

<c:set var="bindModel" value="entity"/>

<form:form id="form1" action="/app/${APP_NAME}/article/form/${entityId}/" method="${method}" modelAttribute="${bindModel}">
<div id="divWinHeader">${winTitle}</div>
	<form:hidden path="version" id="version" />
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	
	<input type="hidden" name="chapters" id="chapters" value=""/>
	<input type="hidden" name="chaptersDeleteLines" id="chaptersDeleteLines" value=""/>
	<div id="divGeneral">
	    <div id="divHeader1">
			<t:common type="text" tabindex='10' path="title" id="title" key="Com.Title" notNull="true" maxlength="50"/>
        </div>
		<div id="divHeader2">
			<t:maintenance type="ArticleCategory" tabindex='1052' path="articleCategory" id="articleCategory"  notNull="true" key="Com.ArticleCategory" bindModel="${bindModel}" />
		</div>
		<div id="divHeader2">
			<t:common type="select" tabindex='20' path="status" id="status" key="Com.Status" items="${statusList}" itemValue="name" itemLabel="text" notNull="true" />
		</div>
	</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>