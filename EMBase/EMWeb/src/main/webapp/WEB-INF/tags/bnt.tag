<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>

<%@ tag dynamic-attributes="attributesMap" %>
<%@ attribute name="id" rtexprvalue="true" required="true" %>
<%@ attribute name="name" rtexprvalue="true" %>
<%@ attribute name="key" rtexprvalue="key" required="true" %>
<%@ attribute name="onclick" rtexprvalue="onclick" %>
<%@ attribute name="disabled" rtexprvalue="true" description="Default to false. Values='true|false'"%>
<%@ attribute name="tabindex" rtexprvalue="true" %>

<c:if test="${empty name}">
	<c:set var="name" value="${id}"/>
</c:if>
<c:if test="${!empty key}">
	<c:set var="label" value="${f:getOText(key)}"/>
</c:if>

<c:set var="bntDisabledAtt">
 	<t:disabledAttribute disabled="${disabled}"/>
</c:set>
<input type="button" id="${id}" name="${name}" value="${label}" onclick="${onclick}" tabindex="${tabindex}" ${bntDisabledAtt} />
<c:remove var="bntDisabledAtt"/>