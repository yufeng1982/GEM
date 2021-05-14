<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.ArticleInfo')}"/>
	<title>${winTitle}</title>
	<jsp:directive.include file="/WEB-INF/views/article/article/_includes/_articlesGrid.jsp" />
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript">
	
		function page_OnLoad() {
			var searchConfig = {
				layout : 'hbox',
	             defaults: {
		             margin : '3 15 3 15'
		         },
				items: [,{
					fieldLabel: "${f:getText('Com.ArticleCategory')}",
					xtype : "erpsearchingselect",
					config : ${f:mss('ArticleCategory')},
					labelWidth: 70,
			        width : 200,
			        name: 'sf_EQ_articleCategory'
				},{
					fieldLabel: "${f:getText('Com.Title')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_LIKE_title',
			        value : ""
				},{
					fieldLabel: "${f:getText('Com.Status')}",
					xtype : 'SelectField',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_EQ_status',
			        data: ${statusList},
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
	                items: [btnCreate]
	            }
			});
			
			Ext.define('ERP.ArticlesAction' ,{
				extend : 'ERP.ListAction',
				
				launcherFuncName : "showArticle",
				getGridSearchPara : function() {
					
				},
				cleanFields : function() {
					this.callParent(arguments);
				}
			
			});
			PAction = new ERP.ArticlesAction();
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