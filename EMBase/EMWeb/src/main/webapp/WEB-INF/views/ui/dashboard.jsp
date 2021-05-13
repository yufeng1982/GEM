<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<jsp:directive.include file="/WEB-INF/views/utils/_resourceUtil.jsp" />
<c:set var="winTitle" value="ERP - Dashboad"/>
	<title>${winTitle}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width: 100px;}
		.fieldRowTextField {width:100px;}
		#divGeneral{width: 100%;}
		.generalRLDiv{float:left;width:50%;padding-top:5px;}
	</style>
	<jsp:directive.include file="/WEB-INF/views/ui/_includes/_managementStatsGrid_ext.jsp" />
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/ui/_includes/_dashboard.js" />
	</script>
</head>
<body>

<form:form id="form1" action="/app/${APP_NAME}/ui/dashboard/" >
<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
<div id="divWinHeader">${winTitle}</div>
<div id="infoDiv"><img src="/images/404.jpg"></img></div>
<div id="divGeneral" >
	<div class="generalRLDiv">
		<t:common type="date" tabindex='1' id="fiscalDate"  key="Com.Date"  width="120" />
	</div>
	<div class="generalRLDiv">
		<div id="searchBtn"></div>
	</div>
</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>