<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.Organization')}"/>
	<title>${winTitle}</title>
	<jsp:directive.include file="/WEB-INF/views/security/organization/_includes/_organizationsGrid.jsp" />
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript">
	
		function page_OnLoad() {
			DEFAULT_PAGE_SIZE = 300;
			var searchConfig = {
				layout : 'hbox',
	            defaults: {
		             margin : '3 15 3 15'
		        },
				items: [{
					fieldLabel: "${f:getText('Com.Code')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        id: 'sf_LIKE_code',
			        name: 'sf_LIKE_code'
				},{
					fieldLabel: "${f:getText('Com.ShortName')}",
					xtype : 'textfield',
					labelWidth: 70,
			        width : 200,
			        id: 'sf_LIKE_shortName',
			        name: 'sf_LIKE_shortName'
				}]
			};
			var actionBarItems = [];
			actionBarItems[1] = null;
			var actionBar = new ERP.ListActionBar(actionBarItems);
			if(!CUtils.isTrueVal('${isSuperAdmin}')){
				Ext.getCmp('newBtn').hide();
			}
			PApp = new ERP.ListApplication({
				searchConfig : searchConfig,
				actionBar : actionBar,
				_gDockedItem : {
	                xtype: 'toolbar',
	                items: [btnCreate]
	            }
			});
		    PAction = new ERP.ListAction({
		    	launcherFuncName : "showOrganization"
		   });
		};
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