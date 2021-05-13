<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/log/history/list/json',
		root : 'data',
		idProperty : 'id',
		isEditable : false,
		autoLoad:true,
		isPaging : true,
		height:580,
		columns :CUtils.jsonDecode('${cols}')
};
</script>