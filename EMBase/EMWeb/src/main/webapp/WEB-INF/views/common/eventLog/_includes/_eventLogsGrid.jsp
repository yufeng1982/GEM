<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : "/app/${APP_NAME}/common/eventLog/list/json",
		root : 'data',
		modelName : 'User',
		idProperty : 'id',
		isEditable : false,
		isPaging : true,
		columns : [{id : 'id', hidden: true, header : "id"},
					{id : 'userName', header : "User", width : 100},
					{id : 'sessionId', header : "SessionId", width : 100},
					{id : 'url', header : "Url", width : 100},
					{id : 'requestDate', header : "Date", width : 100},
					{id : 'remoteAddr', header : "Remote Addr", width : 100},
					{id : 'consumption', header : "Consumption", width : 100},
					{id : 'params', header : "Params", width : 100},
		          ]
};
</script>