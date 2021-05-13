<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/${APP_NAME}/organization/list/json',
		root : 'data',
		modelName : 'Organization',
		idProperty : 'id',
		isPaging : true, // default value is true
		isInfinite : false,
		isEditable : false, // default value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'name', header : "${f:getText('Com.OrgName')}", width : 120},
		           {id : 'code', header : "${f:getText('Com.Code')}", width : 120},
		           {id : 'shortName', header : "${f:getText('Com.ShortName')}", width : 120},
		           {id : 'saltSource', header : "${f:getText('Com.SaltSource')}", width : 120},
		           {id : 'establishDate', header : "${f:getText('Com.EstablishDate')}", width : 150},
		           {id : 'inactiveDate', header : "${f:getText('Com.InactiveDate')}", width : 150},
		           {id : 'address', header : "${f:getText('Com.Address')}", width : 200},
		           {id : 'note', header : "${f:getText('Com.Description')}", width : 200}]
};
</script>