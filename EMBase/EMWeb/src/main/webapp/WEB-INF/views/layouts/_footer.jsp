<form:form id="noDataForm" action="" method="post" modelAttribute="${bindModel}" />
<script type="text/javascript">
    function redirectNoDatasFormSubmit(action) {
	    beginWaitCursor("Processing", true);
	    document.forms[0].action += action;
	    document.forms["noDataForm"].action = document.forms[0].action;
	    document.forms["noDataForm"].submit();
    }
	function _after_page_OnLoad() {
		${AFTER_PAGE_ONLOAD_SCRIPT}
	}
</script>
