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
<%@ attribute name="find" rtexprvalue="true" description="Default to true. Values='true|false'" %>
<%@ attribute name="findUrl" rtexprvalue="true" %>
<%@ attribute name="hideTrigger" rtexprvalue="true" %>

<c:set var="seType" value="${f:getSEType(type)}" />
<c:choose>
	<c:when test="${type == 'Corporation'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{shortName} - {name}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'shortName', 'name']" />
	</c:when>
	<c:when test="${type == 'CooperationAccount'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{bank} - {receiveNo}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'bank', 'receiveNo']" />
	</c:when>
	<c:when test="${type == 'ItemPackage'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{sequence} - {name}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'sequence', 'name']" />
	</c:when>
	<c:when test="${type == 'RepairOrder'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'code', 'name']" />
	</c:when>
	<c:when test="${type == 'User'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{code}-{realName}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'code', 'realName']" />
	</c:when>
	<c:when test="${type == 'YearBudgets'}">
		<c:set var="XTemplate">
			'<tpl for="."><div class="x-combo-list-item">{years}-{approveContents}</div></tpl>'
		</c:set>
		<c:set var="storeFieldArray" value="['id', 'years', 'approveContents']" />
	</c:when>
	<c:otherwise></c:otherwise>
</c:choose>

<c:if test="${empty XTemplate}" >
	<c:set var="XTemplate">
		'<tpl for="."><div class="x-combo-list-item">{code} - {name}</div></tpl>'
	</c:set>
</c:if>
<c:if test="${empty storeFieldArray}" >
	<c:set var="storeFieldArray" value="['id','code','name']" />
</c:if>
<c:if test="${empty valueField}" >
	<c:set var="valueField">${seType.valueField}</c:set>
</c:if>
<c:if test="${empty displayField}" >
	<c:set var="displayField">${seType.displayField}</c:set>
</c:if>
<c:if  test="${find == true}">
	<c:if test="${empty findUrl}" >
		<c:set var="findUrl">${seType.findUrl}</c:set>
	</c:if>
</c:if>

<t:common id="${id}" type="searchingSelect" key="${key}" leftLabel="${leftLabel}" rightLabel="${rightLabel}" rightLink="${rightLink}" rightLinkOclick="${rightLinkOclick}"  leftKey="${leftKey}" rightKey="${rightKey}" 
         bindModel="${bindModel}" path="${path}" name="${name}"
         url="${seType.searchUrl}" valueField="${valueField}" displayField="${displayField}" storeFieldArray="${storeFieldArray}" 
         gridUrl="${seType.gridUrl}" findUrl="${findUrl}" gridConfigName="${seType.gridConfigName}"
		 initParameters="${initParameters}" gridInitParameters="${gridInitParameters}"
		 onclick="${onclick}" onchange="${onchange}" width="${width}" hideTrigger="${hideTrigger}"
		 readonly="${readonly}" disabled="${disabled}" onkeydown="${onkeydown}" 
		 XTemplate="${XTemplate}" notNull="${notNull}" dataType="${dataType}" 
		 value="${value}" text="${text}" tabindex="${tabindex}" cssClass="${cssClass}"/>