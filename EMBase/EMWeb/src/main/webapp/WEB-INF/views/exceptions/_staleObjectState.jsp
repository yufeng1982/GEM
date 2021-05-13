<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />
<%@page import="com.photo.bas.core.web.controller.entity.AbsFormController" %>
<%@page import="com.photo.bas.core.exception.EntityOptimisticLockingFailureException" %>
<%@page import="org.slf4j.Logger"%>
<%@page import="org.slf4j.LoggerFactory"%>
<%
    Logger logger = LoggerFactory.getLogger(getClass());
	Exception ex = (Exception) request.getAttribute("exception");

	if (ex != null) {
		logger.error(ex.getMessage());
	}

	String exPageUrl  = (String) request.getParameter(AbsFormController.FROM_URI);
	
	response.sendRedirect(exPageUrl + "?errorMsgKey=" + EntityOptimisticLockingFailureException.OPTIMISTIC_FAILURE_ERROR_KEY);
%>