<c:set var="errorInfo" value=""/>
<div class="error">
	<c:if test="${not empty errorMsgKey}"><c:set var="errorInfo" value="${errorInfo}${f:getText(errorMsgKey)}<br />" /></c:if>
	<c:if test="${not empty errorMsg}"><c:set var="errorInfo" value="${errorInfo}${errorMsg}<br />" /></c:if>
    <c:forEach var="em" items="${errorMsgs}">
        <c:set var="errorInfo" value="${errorInfo}${em}<br />" />
    </c:forEach>
</div>

<div class="error">
	<c:if test="${not empty systemInfoLog }"><input type="hidden" id="systemInfoLog" name="systemInfoLog" value="${systemInfoLog}"></c:if>
</div>
<style>
    .x-tip .x-tip-body {font-size:12px;}
    .x-tip .x-tip-header-text {font-size:12px;}
</style>
<script type="text/javascript">
	var errorMessageTips = null;
	var errorMsg = "${errorInfo}";
	function initErrorMessageTips() {
		if(!Strings.isEmpty(errorMsg)){
			var warningTitle = "${errorTitle}";
			errorMessageTips =  new Ext.Tip({
		        target: 'divTips',
		        html: errorMsg,
		        title: warningTitle || 'Warning',
		        autoHide: true,
		        closable: true,
		        draggable:true,
		        width : 400,
		        height : 200,
		        x:getWindowWidth()-400,
		        y:10
		    });
			errorMessageTips.show();
		}
	}
</script>
