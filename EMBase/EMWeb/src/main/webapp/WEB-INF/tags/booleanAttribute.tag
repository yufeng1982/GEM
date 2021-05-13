<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ attribute name="value" %>
<%@ attribute name="text" %>
<%@ attribute name="display" %>

<c:choose>
	<c:when test="${value}">  	
    	<c:set var="display" value="${text}" />
  	</c:when>
  	<c:otherwise>
  		<c:set var="display" value="" />
  	</c:otherwise>
</c:choose>

${display}