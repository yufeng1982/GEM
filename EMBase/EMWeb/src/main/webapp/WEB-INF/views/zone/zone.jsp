<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
	<c:set var="pageTitleText" value="${!empty entity.id ? entity.code : entityId}"/>
	<title>${pageTitleText}</title>
	<style type="text/css" media="all">
		.fieldRow LABEL {width:140px}
		.comboboxSelectField {width:135px;}
		#infoDivLeft {margin-left:3px;float:left; width:43%;}
		#infoDivRight {float:left; width:53%;}
	</style>
	
	<script type="text/javascript" src="/js/erp/lib/ui/ColorField.js" ></script>
	<script type="text/javascript">
	function page_OnLoad() {
		PApp =  new ERP.FormApplication({
			pageLayout : {
				bodyItems : [ {
					xtype : "portlet",
					id : "zoneGeneralPanel",
					title : ss_icon('ss_application_form') + PRes["general"],
					height: 300,
					contentEl : "infoDiv"
				}]
			}
		});
		PAction = new ERP.FormAction({
			countryOnChange : function(value, text, record, countryBombox) {
				return true;
			}
		});
	}
	function page_AfterLoad() {
		CUtils.initProvinceField('country', 'province');
	}
	</script>
</head>
<body>

<c:set var="bindModel" value="entity"/>
<form:form id="form1" action="/app/${APP_NAME}/zone/${zoneType}/form/form/${entityId}/" method="post" modelAttribute="${bindModel}">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<div id="divWinHeader">${pageTitleText}</div>
		<div id="infoDiv">
			<div id="infoDivLeft">
			    <t:common type="text" path="code" id="code"  key="Com.code" notNull="true" />
				<t:common type="text" path="name" id="name" key="Com.name" /> 			
				<t:common type="text" id="estimateCostCwt" path="estimateCostCwt" key="Zone.EstimateCostCwt"  dataType="Float" bindModel="${bindModel}"/>		
			</div>
			<div id="infoDivRight">  
				<t:common type="select" path="country" id="country" key="ContactMetch.ShipToForm.Country" XTemplate="${COUNTRY_TPL}" items="${countryList}" itemValue="name" itemLabel="text" onchange="countryOnChange" notNull="true" />
				<t:common type="select" path="province" id="province" key="ContactMetch.ShipToForm.Province" items="${provinceList}" itemValue="name" itemLabel="text" />
			    <c:if test="${zoneType eq 'local'}">
			    	<t:common type="color" path="color" id="color"  key="Com.Color" notNull="false" />
			    </c:if>  
			</div>
		</div>
</form:form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>