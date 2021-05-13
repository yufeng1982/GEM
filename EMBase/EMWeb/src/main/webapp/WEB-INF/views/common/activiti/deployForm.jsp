<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.ActivitiDeployment')}"/>
	<title>${winTitle}</title>
	<script type="text/javascript">
	var actions = {
		deploy : new Ext.Action({
			text : '&nbsp;Deploy&nbsp;',
			iconCls : 'ss_sprite ss_accept',
			handler : function() {
				PAction.deploy();
			}
		})
	};
	
	G_CONFIG = {
		url : "/app/${APP_NAME}/activiti/json",
		root : 'data',
		modelName : 'activiti',
		idProperty : 'id',
		isMultipleSelect : true,
		isEditable : false, // default value is false
		isPaging : false, // default value is true
		columns : [
			{
				id : 'id',
				hidden : true
			},{
				id : 'filename',
				header : "file name",
				width : 140
			},{
				id : 'absolutePath',
				header : "file path",
				width : 140
			}
		]
	};	
	
	function page_OnLoad() {
		var actionBarItems = [];
		actionBarItems[1] = new Ext.Button(actions.deploy);
		var actionBar = new ERP.ListActionBar(actionBarItems);
		
		PApp = new ERP.ListApplication({
			actionBar : actionBar
		});
		
		PAction = new ERP.ListAction({
			deploy : function(){
				var records = PApp.grid.getSelectionModel().getSelection();
				var data = [];
				for(var i = 0 ; i < records.length ; i++){
					data.push(records[i].data);
				}
				if(data){
					$('data').value = Ext.encode(data);
					document.forms[0].submit();
				}
			}
		});
	}
	</script>
</head>
<body>
<form id="form1" action="/app/${APP_NAME}/activiti/deploy" method="post">
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<div id="divWinHeader">${winTitle}</div>
	<input type="hidden" id="data" name="data">
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>