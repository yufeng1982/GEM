<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />
<%@page import="com.photo.bas.core.utils.Strings" %>
<%@page import="com.photo.bas.core.web.controller.entity.AbsFormController" %>
<%@page import="com.photo.bas.core.exception.DocumentError"%>
<%
	DocumentError ie = (DocumentError) request.getAttribute("exception");
	String errorMsgKey = "";
	String errorMsg = "";
	if (ie != null) {
		errorMsg = ie.getDetailErrorMsg();
		if(!Strings.isEmpty(errorMsgKey)) {
			errorMsgKey = ie.getMessage();
		}
		ie.printStackTrace();
	}

	String exPageUrl  = (String) request.getParameter(AbsFormController.FROM_URI);
	String url = exPageUrl;
	if(!Strings.isEmpty(errorMsgKey)) {
		url = url +"?errorMsgKey=" + errorMsgKey;
	} else if(!Strings.isEmpty(errorMsg)) {
		url = url +"?errorMsg=" + errorMsg;
	}
	if(Strings.isEmpty(exPageUrl)) {
		String contextPath = request.getContextPath();
		response.sendRedirect(contextPath+"/404.jsp");
		return;
	}
	request.getRequestDispatcher(url).forward(request, response);
%>