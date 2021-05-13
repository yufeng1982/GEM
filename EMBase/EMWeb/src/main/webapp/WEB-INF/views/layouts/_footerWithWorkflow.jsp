<jsp:directive.include file="/WEB-INF/views/layouts/_footer.jsp" />
<script>
	function workFlowSumbit(action) {
		var isCancel = (action.indexOf("cancel") != -1 ? true : false);
		if (!CUtils.isTrueVal(isCancel)) {
			PAction.showMask();
			PAction.submitForm(action);
			return;
		}
		
		if (typeof PAction.cancelDocument != 'undefined') {
			PAction.cancelDocument(action);
		} else {
			Ext.MessageBox.confirm("Warning", "Are you sure to cancel this document ? ", function(btn) {
				if (btn == 'yes') {
					redirectNoDatasFormSubmit(action);
				}
			});
		}
	}

	function t_deny(action) {
		Ext.MessageBox.confirm("Warning", "Are you sure to deny ? ", function(btn) {
			if (btn == 'yes') {
				action();
			}
		});
	}

	function redirectNoDatasFormSubmit(action) {
		PAction.showMask();
		document.forms[0].action += action;
		document.forms["noDataForm"].action = document.forms[0].action;
		document.forms["noDataForm"].submit();
	}
</script>
