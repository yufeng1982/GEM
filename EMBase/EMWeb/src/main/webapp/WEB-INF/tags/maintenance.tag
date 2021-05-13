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
<%@ attribute name="type" rtexprvalue="true" %>
<%@ attribute name="onclick" rtexprvalue="true" %>
<%@ attribute name="onchange" rtexprvalue="true" %>
<%@ attribute name="onkeydown" rtexprvalue="true" %>
<%@ attribute name="initParameters" rtexprvalue="true" %>
<%@ attribute name="gridInitParameters" rtexprvalue="true" %>
<%@ attribute name="disabled" rtexprvalue="true" %>
<%@ attribute name="readonly" rtexprvalue="true" %>
<%@ attribute name="XTemplate" rtexprvalue="true" %>
<%@ attribute name="displayField" rtexprvalue="true" %>
<%@ attribute name="valueField" rtexprvalue="true" %>
<%@ attribute name="storeFieldArray" rtexprvalue="true" %>
<%@ attribute name="dataType" rtexprvalue="true" %>
<%@ attribute name="notNull" rtexprvalue="true" description="Default to true. Values='true|false'" %>
<%@ attribute name="value" rtexprvalue="true"%>
<%@ attribute name="text" rtexprvalue="true" %>
<%@ attribute name="tabindex" rtexprvalue="true" %>
<%@ attribute name="cssClass" rtexprvalue="true" %>
<%@ attribute name="hiddenColumns" rtexprvalue="true" %>
<%@ attribute name="columnConfigs" rtexprvalue="true" %>
<%@ attribute name="showKey" rtexprvalue="true" %>
<%@ attribute name="url" rtexprvalue="true" %>

<c:set var="seType" value="${f:getMType(type)}" />
<c:set var="onclick" value="${empty onclick ? 'common_ss_onclick' : onclick}" />
<c:set var="mkey" value="${empty key ? seType.key : key}" />
<c:set var="showKey" value="${empty showKey ? true : showKey}" />
<c:choose>
	<c:when test="${type == 'MaterialType'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code}- {name}</div></tpl>'
		</c:set>
	</c:when>
	<c:when test="${type == 'TubeType' || type == 'FobCode'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code} - {description}</div></tpl>'
		</c:set>
	</c:when>
	<c:when test="${type == 'ChemicalTreatment'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code}</div></tpl>'
		</c:set>
	</c:when>
	<c:when test="${type == 'TubingCuttingRate'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code}</div></tpl>'
		</c:set>
	</c:when>
	<c:when test="${type == 'TagFormat'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code} - {customerName} - {shipToCode}</div></tpl>'
		</c:set>
	</c:when>
	<c:otherwise></c:otherwise>
</c:choose>
<c:if test="${empty XTemplate}" >
	<c:set var="XTemplate">
		'<tpl for="."><div class="x-combo-list-item">{code} - {name}</div></tpl>'
	</c:set>
</c:if>
<c:if test="${empty url}" >
	<c:set var="url">${seType.searchUrl}</c:set>
</c:if>
<c:if test="${empty valueField}" >
	<c:set var="valueField">${seType.valueField}</c:set>
</c:if>
<c:if test="${empty displayField}" >
	<c:set var="displayField">${seType.displayField}</c:set>
</c:if>
<t:common id="${id}" type="searchingSelect" key="${mkey}" leftLabel="${leftLabel}" rightLabel="${rightLabel}" leftKey="${leftKey}" rightKey="${rightKey}" 
         bindModel="${bindModel}" path="${path}" name="${name}"
         url="${url}" valueField="${valueField}" displayField="${displayField}" storeFieldArray="${seType.storeFieldArray}" 
         gridUrl="${seType.gridUrl}" gridConfigName="${seType.gridConfigName}"
		 initParameters="${initParameters}" gridInitParameters="${gridInitParameters}"
		 onclick="${onclick}" onchange="${onchange}" width="${width}"
		 readonly="${readonly}" disabled="${disabled}" onkeydown="${onkeydown}" 
		 XTemplate="${XTemplate}" notNull="${notNull}" dataType="${dataType}" 
		 value="${value}" text="${text}" tabindex="${tabindex}" 
		 mtype="${type}" cssClass="${cssClass}" hiddenLabel="${!showKey}"/>