<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/gem/role/list/json',
		root : 'data',
		modelName : 'Role',
		idProperty : 'id',
		isEditable : true, // default value is false
		isPaging : true, // default value is true
		isInfinite : false, // deault value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'name', fieldType : 'browerButton', popupSelectOnClick : 'roleSelect', editable : true, header : "${f:getText('Com.Name')}", width : 100},
		           {id : 'description', header : "${f:getText('Com.Description')}", width : 220}
		]
};
</script>