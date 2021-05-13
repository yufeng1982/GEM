<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp"/>
<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request"></c:set>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<jsp:include page="/WEB-INF/views/layouts/${APP_ENVIRONMENT}/_headerIncludes.jsp" flush="true" />
	<jsp:directive.include file="/WEB-INF/views/utils/_jsUtil.jsp"/>
	<jsp:directive.include file="/WEB-INF/views/utils/_stateUtil.jsp"/>