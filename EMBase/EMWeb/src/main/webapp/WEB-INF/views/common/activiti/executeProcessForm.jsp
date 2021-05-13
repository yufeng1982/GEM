<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="${f:getText('FN.ActivitiExecuteProcess')}"/>
	<title>${winTitle}</title>
	<script type="text/javascript">
	function page_OnLoad() {
		var content = new Ext.form.FormPanel({
			bodyPadding: 10,
	        labelAlign: 'left',
	        width: 790,
	        autoHeight: true,
	        items:[{
                columnWidth:1/2,
                bodyStyle:'padding:5px 5px 5px 5px;border:none',
                items: [{
                    xtype:'textfield',
                    margin: '5',
                    fieldLabel: 'BPMN Key',
                    allowBlank:false,
                    id: 'BPMNKey'
                }, {
                    xtype:'textfield',
                    margin: '5',
                    fieldLabel: 'Document Id',
                    allowBlank:false,
                    id: 'documentId'
                },{
                    xtype:'textfield',
                    margin: '5',
                    fieldLabel: 'Task Name',
                    allowBlank:false,
                    id: 'taskName'
                },{
                    xtype:'textfield',
                    margin: '5',
                    fieldLabel: 'Transaction Name',
                    allowBlank:false,
                    id: 'transactionName'
                }]
            }]
	    });
		
		var extLauncherWin = new Ext.window.Window({
			id : "autoControl",
			title : 'Auto Control',
	        closeAction : 'close',
	        closable : false,
	        plain : true,
	        modal : true,
	        items : [content],
	        buttons: [{
	        	id : 'process',
	            text: 'GO'
	        }]
	    });
		extLauncherWin.show();
		
		Ext.getCmp('process').on('click', function(){
			
			var BPMNKey = Ext.getCmp('BPMNKey').getValue();
			var documentId = Ext.getCmp('documentId').getValue();
			var taskName = Ext.getCmp('taskName').getValue();
			var transactionName =  Ext.getCmp('transactionName').getValue();
			Ext.Ajax.request({
				url: "/app/steel/activiti/deploy/go",
				params: { BPMNKey : BPMNKey,
							documentId : documentId, 
								taskName : taskName, 
									transactionName : transactionName
						},
				success: function(request,  response,  options){
		   			if(!Strings.isEmpty(request.responseText)){
		   				var dataObj = CUtils.jsonDecode(request.responseText);
		   				if(dataObj.data){
		   					if(CUtils.isTrueVal(dataObj.data)){
		   						CUtils.infoAlert("Done");
		   						return;
		   					}
		   					CUtils.infoAlert("Fail");
		   				}
		   			}
		   		},
				failure : function(){CUtils.infoAlert("Fail");}
			});
		});
	}
	</script>
</head>
<body>
<form id="form1" action="/app/${APP_NAME}/activiti/deploy" method="post">
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	<div id="divWinHeader">${winTitle}</div>
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>