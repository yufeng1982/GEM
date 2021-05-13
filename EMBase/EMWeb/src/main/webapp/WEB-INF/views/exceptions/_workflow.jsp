<%@page import="javax.el.ELException"%>
<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />
<%@page import="com.photo.bas.core.utils.Strings" %>
<%@page import="com.photo.bas.core.web.controller.entity.AbsFormController" %>
<%@page import="org.activiti.engine.ActivitiException"%>
<%@page import="com.photo.bas.core.exception.ERPException"%>
<%
	ActivitiException je = (ActivitiException) request.getAttribute("exception");
	String exceptionErrorMsgKey = "";
	String exceptionErrorMsgDetail = "";

	if (je != null) {
		RuntimeException re = null;
		
		if(je.getCause() instanceof ActivitiException){
			while ( je.getCause() instanceof ActivitiException){
				je = (ActivitiException) je.getCause();
			}
		} 
		
		re = (RuntimeException) je.getCause();
		
		if (re != null && re.getCause() instanceof ELException) {
			re = (ELException)re.getCause();
		}
		
		if(re != null) {
			if(re.getCause() instanceof ERPException) {
				exceptionErrorMsgDetail = ((ERPException) re.getCause()).getDetailErrorMsg();
				System.out.println(exceptionErrorMsgDetail);
			}
			System.out.println(re.getMessage());
			if(Strings.isEmpty(exceptionErrorMsgDetail)) exceptionErrorMsgKey = re.getMessage();
		}
		// print exception out to console first
		je.printStackTrace();
	}
	
	String exPageUrl  = (String) request.getParameter(AbsFormController.FROM_URI);
	String url = exPageUrl;
	if(!Strings.isEmpty(exceptionErrorMsgKey)) {
		url = url +"?errorMsgKey=" + exceptionErrorMsgKey;
	} else if(!Strings.isEmpty(exceptionErrorMsgDetail)) {
		url = url +"?errorMsg=" + exceptionErrorMsgDetail;
	}
	response.sendRedirect(url);
%>