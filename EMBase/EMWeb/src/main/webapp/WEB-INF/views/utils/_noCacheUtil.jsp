<%	
	HttpServletResponse httpResponse = (HttpServletResponse) response;
	httpResponse.setHeader("Pragma", "no-cache"); // HTTP 1.0
	httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate"); // HTTP 1.1
	httpResponse.setDateHeader("Expires", -1); // 
%>
