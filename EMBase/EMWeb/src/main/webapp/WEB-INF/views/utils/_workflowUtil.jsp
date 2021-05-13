<script type="text/javascript">
var workFlowActionsMenus = new Ext.menu.Menu();
var hasContent = false;
<c:forEach var="transition" items="${workFlowActionsInfo.transitions}">
		hasContent = true;
		workFlowActionsMenus.add({
			text : "${transition.text}",
		    iconCls : "ss_icon ss_sprite ss_page_gear ",
			disabled : false,
			handler : function() {
				var actionUrl = 'post/${transition.taskId}/${transition.name}';
				var methodName = '${transition.name}';
				if(methodName.indexOf("-") > 0) methodName = methodName.substring(0, methodName.indexOf("-"));
				if(typeof(PAction[methodName]) == 'function') {
					PAction[methodName](function() {workFlowSumbit(actionUrl);}, actionUrl);
				} else {
					workFlowSumbit(actionUrl);
				}
			}
		});
</c:forEach>
workflowControllerBtn = new Ext.Button({text : 'Actions', iconCls : "ss_icon ss_page_gear ", width: 80, menu: workFlowActionsMenus, disabled:!hasContent});
</script>