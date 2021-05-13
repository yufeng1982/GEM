<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.Organization')}"/>
<c:choose>
	<c:when test="${entity.newEntity}"><c:set var="method" value="post"/><c:set var="readonly" value="false"/></c:when>
	<c:otherwise><c:set var="method" value="put"/><c:set var="readonly" value="true"/></c:otherwise>
</c:choose>

	<title>${winTitle}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width:140px}
		.fieldRowTextField {width:160px}
		#address {width:400px}
		#dynamicComponent{float: left;}
		#phone{float: left;}
		#phonetxt{float: left;}
		#lableText{float: left;width:140px}
		#btnAdd{float: left;}
		#btn{float: left;width: 100%}
		#divHeader1{float:left;width:48%}
		#divHeader2{float:left;width:48%}
	</style>
	<script type="text/javascript" src="/js/erp/security/organization/OrganizationAction.js"></script>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/security/organization/_includes/_organization.js" />
	</script>
</head>
<body>

<c:set var="bindModel" value="entity"/>

<form:form id="form1" action="/app/${APP_NAME}/organization/form/${entityId}/" method="${method}" modelAttribute="${bindModel}">
<div id="divWinHeader">${winTitle} - ${f:htmlEscape(entity.code)} - ${f:htmlEscape(entity.name)}</div>
	<form:hidden path="version" id="version" />
	<input type="hidden" name="phoneJsons" id="phoneJsons" />
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<div id="infoDiv">
	     <div id="divHeader1">
	     	<t:common type="text" tabindex='10' path="code" id="code" key="Com.Code" notNull="true" disabled="${entityId ne 'NEW'}"/>
	    	<t:common type="text" tabindex='20' path="name" id="name" key="Com.OrgName" notNull="true" maxlength="100"/>
			<t:common type="text" tabindex='30' path="firstPhone" id="firstPhone" key="Com.FirstPhone" notNull="true"  maxlength="20"/>
	    	<t:common type="text" tabindex='40' path="secondPhone" id="secondPhone" key="Com.SecondPhone" notNull="true"  maxlength="20"/>
			<t:common type="text" tabindex='50' path="saltSource" id="saltSource" key="Com.SaltSource" notNull="true" disabled="${readonly}" />
		    <t:common type="text" tabindex='51' path="address" id="address" key="Com.Address" notNull="true" />
		</div>
		<div id="divHeader2">
			<t:common type="text" tabindex='60' path="shortName" id="shortName" key="Com.ShortName"  maxlength="50"/>
			<t:common type="text" tabindex='61' path="city" id="city" key="Com.City"  maxlength="50"/>
			<t:common type="date" tabindex='70' path="establishDate" id="establishDate" key="Com.EstablishDate"/>
			<t:common type="date" tabindex='80' path="inactiveDate" id="inactiveDate" key="Com.InactiveDate"/>
	    	<t:common type="textarea" tabindex='90' path="note" id="note" key="Com.Description" cols="28" rows="3" />
	   </div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>