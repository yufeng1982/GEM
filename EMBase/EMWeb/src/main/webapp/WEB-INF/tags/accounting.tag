<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>

<%@ attribute name="id" rtexprvalue="true" required="true" %>
<%@ attribute name="type" rtexprvalue="true" %>
<%@ attribute name="name" rtexprvalue="true" %>
<%@ attribute name="key" rtexprvalue="true" %>
<%@ attribute name="value" rtexprvalue="true"%>
<%@ attribute name="XTemplate" rtexprvalue="true"%>
<%@ attribute name="text" rtexprvalue="true" %>
<%@ attribute name="tabindex" rtexprvalue="true" %>
<%@ attribute name="cssClass" rtexprvalue="true" %>
<%@ attribute name="disabled" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="readonly" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="notNull" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="onchange" rtexprvalue="true" %>
<%@ attribute name="overrideTaxScheduleValue" rtexprvalue="true" %>
<%@ attribute name="showOverrideTaxSchedule" rtexprvalue="true" %>

<c:if test="${empty text}" >
	<c:set var="text">${value}</c:set>
</c:if>

<c:if test="${type == 'salesPaymentTerm'}">
	<t:common key="Document.SideBar.PaymentTerm" 
		type="searchingSelect" 
		id="${id}"
		name="${name}"
		onclick="paymentTerms_onclick"
		storeFieldArray="['code','description']" 
		displayField="code"
		valueField="code"
		XTemplate="'{code}-{description}'"
		url="/app/core/fina/list/salesPaymentTerm/json"
		gridUrl="/fina/accounting/salesPaymentTermListGrid"
		onchange="${onchange}"
		text="${text}"
		value="${value}"
		tabindex="${tabindex}"
		cssClass="${cssClass}"
		disabled="${disabled}"
		readonly="${readonly}"
		notNull="${notNull}"/>
</c:if>

<c:if test="${type == 'purchasePaymentTerm'}">
	<t:common key="Document.SideBar.PaymentTerm" 
		type="searchingSelect" 
		id="${id}"
		name="${name}"
		onclick="paymentTerms_onclick"
		storeFieldArray="['code','description']" 
		displayField="code"
		valueField="code"
		XTemplate="'{code}-{description}'"
		url="/app/core/fina/list/purchasePaymentTerm/json"
		gridUrl="/fina/accounting/purchasePaymentTermListGrid"
		onchange="${onchange}"
		text="${text}"
		value="${value}"
		tabindex="${tabindex}"
		cssClass="${cssClass}"
		disabled="${disabled}"
		readonly="${readonly}"
		notNull="${notNull}"/>
</c:if>

<c:if test="${type == 'taxSchedule'}">

	<c:if test="${showOverrideTaxSchedule}">
		<t:common type="checkbox" tabindex='${tabindex}' path="overrideTaxSchedule" 
		id="overrideTaxSchedule"  key="Document.OverrideTaxSchedule" value="${overrideTaxScheduleValue}" 
		onclick="overrideTaxSchedule_onclick" />
	</c:if>

	<t:common key="ShipTo.TaxSchedule" 
			type="searchingSelect" 
			id="taxSchedule"
			name="${name}"
			onclick="taxSchedule_onclick"
			storeFieldArray="['code','description']" 
			displayField="code"
			valueField="code"
			XTemplate="'{code}'"
			url="/app/core/fina/list/taxZone/json"
			gridUrl="/fina/accounting/taxZoneListGrid"
			text="${text}"
			value="${value}"
			tabindex="${tabindex}"
			cssClass="${cssClass}"
			disabled="${disabled}"
			readonly="${readonly}"
			notNull="${notNull}"/>
</c:if>			