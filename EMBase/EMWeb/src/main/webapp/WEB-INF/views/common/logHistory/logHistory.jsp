
<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<c:set var="winTitle" value="History"/>
	<title>${winTitle}</title>
	<style type="text/css" media="all">
	</style>
	
	<jsp:directive.include file="/WEB-INF/views/common/logHistory/_logHistoryGrid.jsp" />
	<script type="text/javascript">
		function page_OnLoad() {
			PAction = new ERP.FormAction();
			var fields = "${fields}";
			if(!Strings.isEmpty(fields)) {
				G_CONFIG.url = "/app/log/history/list/jsonFields";
			}
			var grid = GUtils.initErpGrid(null,{id : "${id}", "clazz" : "${clazz}", "fields" : fields });
			grid.getSelectionModel().on('selectionchange', function(selModel, records) {
			});
			var actionBarItems = [];
			var actionBar = new ERP.FormActionBar(actionBarItems);
			//var height = screen.availHeight - 50;
			PApp =  new ERP.FormApplication({
				grid : grid,
				pageLayout :{
					bodyItems : [{id : 'gridId', 
		    		 	xtype :'panel',
		    		 	flex : 1,
	    		 		items : [grid],
	    	    		listeners : {
	    					'resize': function (pnl) {
	    						var g = Ext.getCmp("gridId");
	    						if (g) {
	    							var height = screen.availHeight - 180;
	    							g.setSize(pnl.getWidth() -5, height);
	    						}
	    					}
	    				}
	    		 	}],
					sideBar : false
				},
				actionBarItems : actionBar
			});	
		}
		
		function compareRecords(r, l) {
			var columns = [];
			if (r && l) {
				var keys = r.fields.keys;
				for ( var i = 0; i < keys.length; i++) {
					var columnName = keys[i];
					if (columnName == "id") {
						continue;
					}
					if (r.get(columnName) != l.get(columnName)) {
						columns.push(columnName);
					}
				}
				return columns;
			}
			return null;
		}
	</script>
</head>
<body>
<form id="form1" action="" method="post">
	<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
	
	<div id="divWinHeader">${winTitle}</div>
</form>
<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
</body>
</html>