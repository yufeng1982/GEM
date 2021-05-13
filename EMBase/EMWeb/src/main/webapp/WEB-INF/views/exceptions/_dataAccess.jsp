<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />

<%
Exception ex = (Exception) request.getAttribute("exception");
if (ex != null) {
	// print exception out to console first
	ex.printStackTrace();
}
%>

<h2>Data access failure: <%= ex.getMessage() %></h2>
<p/>

<%
ex.printStackTrace(new java.io.PrintWriter(out));
%>

<p/>
<br/>
<a href="<c:url value="/index.jsp" />">Home</a>
