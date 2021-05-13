<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/gem/user/list/json',
		root : 'data',
		modelName : 'User',
		idProperty : 'id',
		isEditable : false, // default value is false
		isPaging : true, // default value is true
		isInfinite : false, // deault value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'name', header : "${f:getText('Com.UserName')}", width : 100},
		           {id : 'phone', header : "${f:getText('Com.PhoneNumber')}", width : 100},
		           {id : 'email', header : "${f:getText('Com.Email')}", width : 120},
		           {id : 'enabled', fieldType: 'checkbox', header : "${f:getText('Com.Enabled')}", defaultValue : false, width : 55},
		           {id : 'creationDate', header : "${f:getText('Com.CreationDate')}", width : 250},
		           {id : 'modificationDate', header : "${f:getText('Com.ModificationDate')}", width : 250}
		]
};
</script>