<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />
<%@page import="com.photo.bas.core.web.controller.entity.AbsFormController" %>
<%@page import="com.novasteel.scm.exception.InventoryError"%>
<%@page import="com.photo.bas.core.Strings" %>

<%
	InventoryError ie = (InventoryError) request.getAttribute("exception");
	String exceptionErrorMsgKey = "";
	String exceptionErrorMsgDetail = "";

	if(ie != null) {
		if(ie.getCause() instanceof InventoryError) {
			exceptionErrorMsgDetail = ((InventoryError) ie.getCause()).getDetailErrorMsg();
		}
		if(Strings.isEmpty(exceptionErrorMsgDetail)) exceptionErrorMsgKey = ie.getMessage();
		// print exception out to console first
		ie.printStackTrace();
	}
	
	String exPageUrl  = (String) request.getParameter(AbsFormController.FROM_URI);
	String url = exPageUrl;
	if(!Strings.isEmpty(exceptionErrorMsgKey)) {
		url = url +"?errorMsgKey=" + exceptionErrorMsgKey;
	} else if(!Strings.isEmpty(exceptionErrorMsgDetail)) {
		url = url +"?errorMsg=" + exceptionErrorMsgDetail;
	}
	request.getRequestDispatcher(url).forward(request, response);	
%>