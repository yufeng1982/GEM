<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>

<%@ attribute name="id" rtexprvalue="true" required="true" %>
<%@ attribute name="name" rtexprvalue="true" %>
<%@ attribute name="bindModel" rtexprvalue="true" %>
<%@ attribute name="path" rtexprvalue="true" %>
<%@ attribute name="label" rtexprvalue="true" %>
<%@ attribute name="key" rtexprvalue="true" %>
<%@ attribute name="leftLabel" rtexprvalue="true" %>
<%@ attribute name="leftKey" rtexprvalue="true" %>
<%@ attribute name="middleKey" rtexprvalue="true" %>
<%@ attribute name="middleLabel" rtexprvalue="true" %>
<%@ attribute name="rightLabel" rtexprvalue="true" %>
<%@ attribute name="rightKey" rtexprvalue="true" %>
<%@ attribute name="maxlength" rtexprvalue="true" %>
<%@ attribute name="cssClass" rtexprvalue="true" %>
<%@ attribute name="type" rtexprvalue="true" %>
<%@ attribute name="items" rtexprvalue="true" type="java.util.Collection"%>
<%@ attribute name="itemValue" rtexprvalue="true" %>
<%@ attribute name="itemLabel" rtexprvalue="true" %>
<%@ attribute name="onSourceTypeChange" rtexprvalue="true" %>
<%@ attribute name="sourceTypeValue" rtexprvalue="true" %>
<%@ attribute name="url" rtexprvalue="true" %>
<%@ attribute name="onclick" rtexprvalue="true" %>
<%@ attribute name="onchange" rtexprvalue="true" %>
<%@ attribute name="storeFieldArray" rtexprvalue="true" %>
<%@ attribute name="valueField" rtexprvalue="true" %>
<%@ attribute name="displayField" rtexprvalue="true" %>
<%@ attribute name="width" rtexprvalue="true" %>
<%@ attribute name="disabled" rtexprvalue="true" %>
<%@ attribute name="readonly" rtexprvalue="true" %>
<%@ attribute name="notNull" rtexprvalue="true" %>
<%@ attribute name="notGT" rtexprvalue="true" %>
<%@ attribute name="maxValue" rtexprvalue="true" %>
<%@ attribute name="minValue" rtexprvalue="true" %>
<%@ attribute name="dataType" rtexprvalue="true" %>
<%@ attribute name="decimalNumber" rtexprvalue="true" %>
<%@ attribute name="ignoreEndZeros" rtexprvalue="true" %>
<%@ attribute name="ignoreBeginZero" rtexprvalue="true" %>
<%@ attribute name="isSpecialExchangeRate" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="isEnable" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="value" rtexprvalue="true" %>
<%@ attribute name="years" rtexprvalue="true" type="java.util.Collection"%>
<%@ attribute name="monthes" rtexprvalue="true" type="java.util.Collection"%>
<%@ attribute name="tabindex" rtexprvalue="true" %>
<%@ attribute name="onblur" rtexprvalue="true" %>
<c:if test="${!empty key}">
	<c:set var="label" value="${f:getOText(key)}"/>
</c:if>
<c:if test="${!empty leftKey}">
	<c:set var="leftLabel" value="${f:getOText(leftKey)}"/>
</c:if>
<c:if test="${!empty middleKey}">
	<c:set var="middleLabel" value="${f:getOText(middleKey)}"/>
</c:if>
<c:if test="${!empty rightKey}">
	<c:set var="rightLabel" value="${f:getOText(rightKey)}"/>
</c:if>
<div id="fr_${type}_${id}" class="${(empty cssClass) ? 'fieldRow' : cssClass}" >
	<c:if test="${!empty label}">
		<label  class="${(empty cssClass)?'fieldRow':cssClass}Label">${label}</label>
	</c:if>
	<c:if test="${!empty leftLabel}">${leftLabel}</c:if>
	<c:if test="${type == 'creation'}">
		<spring:bind path="${bindModel}.creationDate">
			<input type="text" id="creationDate" value="${status.value}" disabled="true" class="combineDateField"/>
		</spring:bind>
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<c:set var="createdByName" value="" />
		<spring:bind path="${bindModel}.createdBy">
			<c:if test="${!empty status.value}">
				<spring:bind path="${bindModel}.createdBy">
					<c:set var="createdByName" value="${status.value}" />
				</spring:bind>
			</c:if>
		</spring:bind>
		<input type="text" id="createdBy" value="${createdByName}" disabled="true" class="userNameTextField"/>
	</c:if>
	<c:if test="${type == 'modification'}">
		<spring:bind path="${bindModel}.modificationDate">
			<input type="text" id="modificationDate" value="${status.value}" disabled="true" class="combineDateField"/>
		</spring:bind>
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<c:set var="modifiedByName" value="" />
		<spring:bind path="${bindModel}.modifiedBy">
			<c:if test="${!empty status.value}">
				<spring:bind path="${bindModel}.modifiedBy">
					<c:set var="modifiedByName" value="${status.value}" />
				</spring:bind>
			</c:if>
		</spring:bind>
		<input type="text" id="modifiedBy" value="${modifiedByName}" disabled="true" class="userNameTextField"/>
	</c:if>
	<c:if test="${type == 'date_by'}">
		<spring:bind path="${bindModel}.${path}Date">
			<input type="text" id="${id}Date" value="${status.value}" disabled="true" class="combineDateField"/>
		</spring:bind>
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<c:set var="byName" value="" />
		<spring:bind path="${bindModel}.${path}By">
			<c:if test="${!empty status.value}">
				<spring:bind path="${bindModel}.${path}By">
					<c:set var="byName" value="${status.value}" />
				</spring:bind>
			</c:if>
		</spring:bind>
		<input type="text" id="${id}By" value="${byName}" disabled="true" class="userNameTextField"/>
	</c:if>
	<c:if test="${type == 'minMax'}">
		<c:if test="${!empty onblur}">
			<c:set var="minOnblur" value="PAction.filedOnchange('${onblur}','${id}Min')"/>
			<c:set var="maxOnblur" value="PAction.filedOnchange('${onblur}','${id}Max')"/>
		</c:if>
		<c:if test="${!empty onchange }">
			<c:set var="minOnchange" value="PAction.filedOnchange('${onchange}','${id}Min')"/>
			<c:set var="maxOnchange" value="PAction.filedOnchange('${onchange}','${id}Max')"/>
		</c:if>
		<c:if test="${!empty path}">
			<form:input path="${path}Min" id="${id}Min" maxlength="${maxlength}" disabled="${disabled}" readonly="${readonly}" onchange="${minOnchange}" onblur="${minOnblur}" value="${value}" tabindex="${tabindex}" cssClass="combinMinField" />
			<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
			<form:input path="${path}Max" id="${id}Max" maxlength="${maxlength}" disabled="${disabled}" readonly="${readonly}" onchange="${maxOnchange}" onblur="${maxOnblur}" value="${value}" tabindex="${tabindex}" cssClass="combinMaxField" />
		</c:if>
		<c:if test="${empty path}">
			<input type="text" id="${id}Min" name="${name}" value="${empty value? '': value}" tabindex="${tabindex}" onchange="${minOnchange}" onblur="${minOnblur}" class="combinMinField" />
			<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
			<input type="text" id="${id}Max" name="${name}" value="${empty value? '': value}" tabindex="${tabindex}" onchange="${maxOnchange}" onblur="${maxOnblur}" class="combinMaxField" />
		</c:if>
	</c:if>
	<c:if test="${type == 'inOutOn'}">
		<form:input path="${path}In" id="${id}In" disabled="true" tabindex="${tabindex}" cssClass="combinInField" />
		<form:input path="${path}Out" id="${id}Out" disabled="true" tabindex="${tabindex}" cssClass="combinOutField" />
		<input type="text" id="${id}On" name="${name}" value="${empty value? '': value}" tabindex="${tabindex}" disabled="true" class="combinOnField" />
	</c:if>
	<c:if test="${type == 'exchangeRate'}">
		<input type="checkbox" id="specialExchangeRate" name="specialExchangeRate" value="true" 
			   <c:if test="${!empty disabled}"> disabled="${disabled}"</c:if> <c:if test="${isSpecialExchangeRate}"> checked="checked" </c:if> 
			   onclick="PAction.filedOnchange('${onclick}','specialExchangeRate')" tabindex="${tabindex}" />
	    <input type="hidden" name="_specialExchangeRate" value="on" />
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<input type="text" id="exchangeRate" name="exchangeRate" value="${value}" tabindex="${tabindex}" 
		<c:if test="${!isSpecialExchangeRate}"> disabled="true" </c:if> class="exchangeRateField" />
		<c:set var="dataType" value="Float" />
		<c:set var="notNull" value="false" />
		<c:set var="minValue" value="0" />
		<c:set var="decimalNumber" value="5" />
	</c:if>
	<c:if test="${type == 'enableOrNot'}">
		<c:set var="_id" value="${f:capitalize(id)}" />
		<input type="checkbox" id="enable${_id}" name="enable${_id}" value="true" 
			   <c:if test="${!empty disabled}"> disabled="${disabled}"</c:if> <c:if test="${isEnable}"> checked="checked" </c:if> 
			   onclick="PAction.filedOnchange('${onclick}','enable${_id}')" tabindex="${tabindex}" />
	    <input type="hidden" name="_enable${_id}" value="on" />
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<input type="text" id="${id}" name="${id}" value="${value}" tabindex="${tabindex}" 
		<c:if test="${!isEnable}"> disabled="true" </c:if> class="exchangeRateField" />
		<c:set var="dataType" value="Float" />
		<c:set var="notNull" value="false" />
		<c:set var="minValue" value="0" />
		<c:set var="decimalNumber" value="2" />
	</c:if>
	<c:if test="${type == 'dateTime'}">
		<div class="dateTime">
			<t:common type="date" id="${id}_date" path="${path}Date" readonly="${readonly}" tabindex="${tabindex}" cssClass="" />
			<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
			<t:common type="time" id="${id}_time" path="${path}Time" readonly="${readonly}" width="${width}" tabindex="${tabindex}" cssClass="" />
		</div>
	</c:if>
	<c:if test="${type == 'lastName'}">
		<form:select path="${path}.salutation" id="salutation_${id}" tabindex="${tabindex}" cssClass="componentTextField">
			<form:option value="" label="${f:getOText('Com.Select')}" />
			<form:options items="${items}" itemValue="${itemValue}" itemLabel="${itemLabel}" />
		</form:select>
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<form:input path="${path}.lastName" id="lastName_${id}" tabindex="${tabindex}" cssClass="componentTextField"/>
	</c:if>
	<c:if test="${type == 'yearAndMonth'}">
		<form:select path="${path}Year" id="${id}Year" disabled="${disabled}" tabindex="${tabindex}" cssClass="componentYearField">
			<c:forEach items="${years}" var="it"><form:option value="${it}" label="${it}" /></c:forEach>
		</form:select>
		<c:if test="${!empty middleLabel}">${middleLabel}</c:if>
		<form:select path="${path}Month" id="${path}Month" disabled="${disabled}" tabindex="${tabindex}" cssClass="componentMonthField">
			<c:forEach items="${monthes}" var="it"><form:option value="${it}" label="${it}" /></c:forEach>
		</form:select>
	</c:if>
	<c:if test="${!empty rightLabel}">${rightLabel}</c:if>
	<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
		${AFTER_PAGE_ONLOAD_SCRIPT}
		VUtils.addField("${id}", {label:"${label}", dataType:"${dataType}", id:"${id }", type:"${type}", notNull: "${notNull}", notGT: "${notGT}", maxValue: "${maxValue}", minValue: "${minValue}"<c:if test="${dataType == 'Float'}">, decimalNumber: "${decimalNumber}", ignoreEndZeros: "${ignoreEndZeros}", ignoreBeginZero: "${ignoreBeginZero}"</c:if>});
	</c:set>
	<jsp:doBody/>
</div>
