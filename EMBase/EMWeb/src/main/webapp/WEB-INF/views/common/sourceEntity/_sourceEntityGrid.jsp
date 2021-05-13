<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
	url : '/app/${APP_NAME}/entity/list/${seType}/json',
	columns : [
		{id : 'id', hidden: true},
		{id : 'ownerId', hidden: true},
		{id : 'ownerType', hidden: true},
		{id : 'code', header : "${f:getText('Com.Code')}", width : 160},
		{id : 'name', header : "${f:getText('Com.Name')}", width : 280},
		{id : 'description', header : "${f:getText('Com.Description')}", width : 280}
	]
};
</script>