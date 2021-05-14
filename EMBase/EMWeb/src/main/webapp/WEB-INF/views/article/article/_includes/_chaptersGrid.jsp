<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/${APP_NAME}/chapters/list/json',
		root : 'data',
		modelName : 'Chapter',
		idProperty : 'id',
		isEditable : true, // default value is false
		isPaging : false, // default value is true
		isInfinite : false, // deault value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'chapterNo', header : "${f:getText('Com.Chapter')}", width : 80},
		           {id : 'chapterTitle', header : "${f:getText('Com.ChapterTitle')}", editable : true, width : 150},
		           {id : 'chapterContent', header : "${f:getText('Com.ChaptersContent')}",editable : true, width : 550}
		]
};
</script>