<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<script type="text/javascript">
G_CONFIG = {
		url : '/app/gem/payment/list/json',
		root : 'data',
		modelName : 'Artticle',
		idProperty : 'id',
		isEditable : false, // default value is false
		isPaging : true, // default value is true
		isInfinite : false, // deault value is false
		columns : [{id : 'id', hidden: true, header : "id"},
		           {id : 'title', header : "${f:getText('Com.Title')}", width : 150},
		           {id : 'chapter', header : "${f:getText('Com.Chapter')}", width : 80},
		           {id : 'paymentUser',  header : "${f:getText('Com.PaymentUser')}", width : 100},
		           {id : 'amount',  header : "${f:getText('Com.PaymentAmount')}", width : 100},
		           {id : 'creationDate', header : "${f:getText('Com.CreationDate')}", width : 250},
		           {id : 'modificationDate', header : "${f:getText('Com.ModificationDate')}", width : 250}
		]
};
</script>