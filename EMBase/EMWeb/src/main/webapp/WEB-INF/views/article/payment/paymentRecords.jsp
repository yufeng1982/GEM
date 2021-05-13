<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.ArticleInfo')}"/>
	<title>${winTitle}</title>
	<jsp:directive.include file="/WEB-INF/views/article/payment/_includes/_paymentRecordsGrid.jsp" />
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript">
	
		function page_OnLoad() {
			var searchConfig = {
				layout : 'hbox',
	             defaults: {
		             margin : '3 15 3 15'
		         },
				items: [{
					fieldLabel: "${f:getText('Com.ArticleTitle')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_LIKE_article',
			        value : ""
				},{
					fieldLabel: "${f:getText('Com.ChapterTitle')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_LIKE_chapters',
			        value : ""
				},{
					fieldLabel: "${f:getText('Com.PaymentUser')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_LIKE_paymentUser',
			        value : ""
				}]
			};
			var actionBarItems = [];
			actionBarItems[1] = null;
			var actionBar = new ERP.ListActionBar(actionBarItems);
			PApp = new ERP.ListApplication({
				actionBar : actionBar,
				searchConfig : searchConfig,
				_gDockedItem : {
	                xtype: 'toolbar',
	                items: []
	            }
			});
			
			Ext.define('ERP.PaymentRecordsAction' ,{
				extend : 'ERP.ListAction',
				
				launcherFuncName : "showArticle",
				getGridSearchPara : function() {
					
				},
				cleanFields : function() {
					this.callParent(arguments);
				},
				gridItemDBClick : function(view , record , item  , index , e){
				}
			
			});
			PAction = new ERP.PaymentRecordsAction();
		}
	</script>
</head>
<body>
<c:set var="bindModel" value="pageQueryInfo"/>
<form id="form1" action="" method="post" modelAttribute="${bindModel}">
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>