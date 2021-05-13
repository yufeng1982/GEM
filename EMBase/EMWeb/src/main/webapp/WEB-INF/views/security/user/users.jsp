<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.User')}"/>
	<title>${winTitle}</title>
	<jsp:directive.include file="/WEB-INF/views/security/user/_includes/_usersGrid.jsp" />
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript">
	
		function page_OnLoad() {
			var searchConfig = {
				layout : 'hbox',
	             defaults: {
		             margin : '3 15 3 15'
		         },
				items: [{
					fieldLabel: "${f:getText('Com.UserName')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        name: 'sf_LIKE_username',
			        value : ""
				},{
					fieldLabel: "${f:getText('Com.Enabled')}",
					xtype : 'checkbox',
					labelWidth: 50,
			        width : 100,
			        id: 'sf_EQ_enabled',
			        name: 'sf_EQ_enabled',
			        checked  : true
                },{
					fieldLabel: "${f:getText('Com.Role')}",
					name: 'sf_EQ_roleId',
					xtype : "erpsearchingselect",
					labelWidth: 50,
			        width : 200,
					config : ${f:sess('Role')}
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
			
			Ext.define('ERP.UsersAction' ,{
				extend : 'ERP.ListAction',
				
				launcherFuncName : "showUser",
				getGridSearchPara : function() {
					if(CUtils.getExtObj('sf_EQ_enabled').checked) {
						return {sf_EQ_enabled: true};
					} else {
						return {sf_EQ_enabled: false};
					}
				},
				cleanFields : function() {
					this.callParent(arguments);
					var cmp = Ext.getCmp("sf_EQ_enabled");
					if(cmp){
						cmp.setValue(true);
					}
				}
			
			});
			PAction = new ERP.UsersAction();
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