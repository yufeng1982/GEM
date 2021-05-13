<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/gem/article/list/json',
		root : 'data',
		modelName : 'Artticle',
		idProperty : 'id',
		isEditable : false, // default value is false
		isPaging : true, // default value is true
		isInfinite : false, // deault value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'title', header : "${f:getText('Com.Title')}", width : 100},
		           {id : 'chapter', header : "${f:getText('Com.Chapter')}", width : 100},
		           {id : 'status',  header : "${f:getText('Com.Status')}", width : 100},
		           {id : 'creationDate', header : "${f:getText('Com.CreationDate')}", width : 250},
		           {id : 'modificationDate', header : "${f:getText('Com.ModificationDate')}", width : 250}
		]
};
</script>