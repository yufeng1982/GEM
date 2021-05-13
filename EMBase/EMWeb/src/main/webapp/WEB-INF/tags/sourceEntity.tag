<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>

<%@ attribute name="id" rtexprvalue="true" required="true" %>
<%@ attribute name="name" rtexprvalue="true" %>
<%@ attribute name="width" rtexprvalue="true" %>
<%@ attribute name="bindModel" rtexprvalue="true" %>
<%@ attribute name="path" rtexprvalue="true" %>
<%@ attribute name="key" rtexprvalue="true" %>
<%@ attribute name="leftLabel" rtexprvalue="true" %>
<%@ attribute name="leftKey" rtexprvalue="true" %>
<%@ attribute name="rightLabel" rtexprvalue="true" %>
<%@ attribute name="rightKey" rtexprvalue="true" %>
<%@ attribute name="rightLink" rtexprvalue="true" %>
<%@ attribute name="rightLinkOclick" rtexprvalue="true" %>
<%@ attribute name="type" rtexprvalue="true" %>
<%@ attribute name="url" rtexprvalue="true" %>
<%@ attribute name="gridUrl" rtexprvalue="true" %>
<%@ attribute name="gridConfigName" rtexprvalue="true" %>
<%@ attribute name="popupLoadBySourceEntity" rtexprvalue="true" %>
<%@ attribute name="onclick" rtexprvalue="true" %>
<%@ attribute name="onchange" rtexprvalue="true" %>
<%@ attribute name="onkeydown" rtexprvalue="true" %>
<%@ attribute name="disabled" rtexprvalue="true" %>
<%@ attribute name="readonly" rtexprvalue="true" %>
<%@ attribute name="XTemplate" rtexprvalue="true" %>
<%@ attribute name="storeFieldArray" rtexprvalue="true" %>
<%@ attribute name="notNull" rtexprvalue="true" description="Default to true. Values='true|false'" %>
<%@ attribute name="value" rtexprvalue="true"%>
<%@ attribute name="text" rtexprvalue="true" %>
<%@ attribute name="tabindex" rtexprvalue="true" %>
<%@ attribute name="cssClass" rtexprvalue="true" %>
<%@ attribute name="initParameters" rtexprvalue="true" %>

<c:if test="${empty url}" >
	<c:set var="url">/app/core/entity/list/${type}/json</c:set>
</c:if>
<c:if test="${empty gridUrl}" >
	<c:set var="gridUrl">/common/sourceEntity/_sourceEntityGrid</c:set>
</c:if>
<c:if test="${empty popupLoadBySourceEntity}" >
	<c:set var="popupLoadBySourceEntity">F</c:set>
</c:if>
<c:set var="secondAjaxUrl"></c:set>
<c:if test="${empty XTemplate}" >
	<c:set var="XTemplate">
		'<tpl for="."><div class="x-combo-list-item">{code} - {name}</div></tpl>'
	</c:set>
</c:if>

<t:common id="${id}" type="searchingSelect" key="${key}" leftLabel="${leftLabel}" rightLabel="${rightLabel}" rightLink="${rightLink}" rightLinkOclick="${rightLinkOclick}"  leftKey="${leftKey}" rightKey="${rightKey}" 
         bindModel="${bindModel}" path="${path}" name="${name}"
         url="${url}" valueField="id" displayField="code" storeFieldArray="['id', 'code', 'name', 'description', 'ownerId', 'ownerType','status']" 
         gridUrl="${gridUrl}" seType="${type}" gridConfigName="${gridConfigName}" popupLoadBySourceEntity="${popupLoadBySourceEntity}"
		 onclick="${onclick}" onchange="commonSourceEntitySecondOnchange" secondOnchange="${onchange}" width="${width}"
		 readonly="${readonly}" disabled="${disabled}" onkeydown="${onkeydown}" 
		 XTemplate="${XTemplate}" notNull="${notNull}" dataType="${dataType}" 
		 value="${value}" text="${text}" tabindex="${tabindex}" cssClass="${cssClass}" initParameters="${initParameters }"/>