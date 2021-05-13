<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('Com.User.RolesList')}"/>
	<title>${winTitle}</title>
	<jsp:directive.include file="/WEB-INF/views/security/user/_includes/_rolesGrid.jsp" />
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript">
		function page_OnLoad() {
			var searchConfig = {
					layout : 'hbox',
					defaultType: 'textfield',
			        defaults: {
			        	 width : 250,
						 labelWidth : 80,
			             margin : '2 7'
			        },
					items :[{
						fieldLabel : "${f:getText('Com.Code')}",
						name : 'sf_LIKE_query'
	                 }]
	        	};
			
			G_CONFIG.isEditable = false;
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
		
			PAction = new ERP.ListAction({launcherFuncName : "showRole"});
		}
	</script>
</head>
<body>
<form id="form1" action="" method="post">
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>