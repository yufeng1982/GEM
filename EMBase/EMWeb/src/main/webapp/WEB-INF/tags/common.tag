<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>

<%@ attribute name="id" rtexprvalue="true" required="true" %>
<%@ attribute name="value" rtexprvalue="true"%>
<%@ attribute name="fieldrowId" rtexprvalue="true" %>
<%@ attribute name="labelFor" rtexprvalue="true" %>
<%@ attribute name="name" rtexprvalue="true" %>
<%@ attribute name="path" rtexprvalue="true" %>
<%@ attribute name="tabindex" rtexprvalue="true" %>
<%@ attribute name="label" rtexprvalue="true" %>
<%@ attribute name="hiddenLabel" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="key" rtexprvalue="true" %>
<%@ attribute name="leftLabel" rtexprvalue="true" %>
<%@ attribute name="leftKey" rtexprvalue="true" %>
<%@ attribute name="rightLabel" rtexprvalue="true" %>
<%@ attribute name="rightKey" rtexprvalue="true" %>
<%@ attribute name="rightLink" rtexprvalue="true" %>
<%@ attribute name="rightLinkOclick" rtexprvalue="true" %>
<%@ attribute name="rightCheckbox" rtexprvalue="true" %>
<%@ attribute name="rightCheckboxOnclick" rtexprvalue="true" %>
<%@ attribute name="cssClass" rtexprvalue="true" %>
<%@ attribute name="onchange" rtexprvalue="true" %>
<%@ attribute name="secondOnchange" rtexprvalue="true" %>
<%@ attribute name="popupLoadBySourceEntity" rtexprvalue="true" %>
<%@ attribute name="showHexValue" rtexprvalue="true" %>
<%@ attribute name="autoShow" rtexprvalue="true" %>
<%@ attribute name="onclick" rtexprvalue="true" %>
<%@ attribute name="onblur" rtexprvalue="true" %>
<%@ attribute name="onfocus" rtexprvalue="true" %>
<%@ attribute name="onkeydown" rtexprvalue="true" %>
<%@ attribute name="startDateField" rtexprvalue="true" %>
<%@ attribute name="endDateField" rtexprvalue="true" %>
<%@ attribute name="type" rtexprvalue="true" %>
<%@ attribute name="allowEmpty" rtexprvalue="true" description="Default to true. Values='true|false'" %>
<%@ attribute name="disabled" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="readonly" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="checked" rtexprvalue="true" description="Default to false. Values='true|false'" %>
<%@ attribute name="resourceid" rtexprvalue="true" %>
<%@ attribute name="size" rtexprvalue="true" %>
<%@ attribute name="width" rtexprvalue="true" %>
<%@ attribute name="rows" rtexprvalue="true" %>
<%@ attribute name="cols" rtexprvalue="true" %>
<%@ attribute name="items" rtexprvalue="true" type="java.util.Collection"%>
<%@ attribute name="itemValue" rtexprvalue="true" %>
<%@ attribute name="itemLabel" rtexprvalue="true" %>
<%@ attribute name="rtKey" rtexprvalue="true" %>
<%@ attribute name="rtLabel" rtexprvalue="true" %>
<%@ attribute name="format" rtexprvalue="true" %>


<%@ attribute name="hideTrigger" rtexprvalue="true" %>
<%@ attribute name="text" rtexprvalue="true" %>
<%@ attribute name="url" rtexprvalue="true" %>
<%@ attribute name="gridUrl" rtexprvalue="true" %>
<%@ attribute name="findUrl" rtexprvalue="true" %>
<%@ attribute name="gridConfigName" rtexprvalue="true" %>
<%@ attribute name="gridInitParameters" rtexprvalue="true" %>
<%@ attribute name="initParameters" rtexprvalue="true" %>
<%@ attribute name="XTemplate" rtexprvalue="true" %> 
<%@ attribute name="storeFieldArray" rtexprvalue="true" %>
<%@ attribute name="valueField" rtexprvalue="true" %>
<%@ attribute name="displayField" rtexprvalue="true" %>
<%@ attribute name="bindModel" rtexprvalue="true" %>
<%@ attribute name="userType" rtexprvalue="true" %>
<%@ attribute name="maxlength" rtexprvalue="true" %>
<%@ attribute name="maxValue" rtexprvalue="true" %>
<%@ attribute name="minValue" rtexprvalue="true" %>
<%@ attribute name="positiveNumber" rtexprvalue="true" %>
<%@ attribute name="keepZero" rtexprvalue="true" %>

<%@ attribute name="dataType" rtexprvalue="true" %>
<%@ attribute name="notNull" rtexprvalue="true" description="Default to true. Values='true|false'" %>
<%@ attribute name="decimalNumber" rtexprvalue="true" %>
<%@ attribute name="ignoreEndZeros" rtexprvalue="true" %>
<%@ attribute name="ignoreBeginZero" rtexprvalue="true" %>
<%@ attribute name="mtype" rtexprvalue="true" %>
<%@ attribute name="seType" rtexprvalue="true" %>
<%@ attribute name="forceSelection" rtexprvalue="true" %>
<%@ attribute name="addSeacrhButton" rtexprvalue="false" description="Default to false. Values='true|false'" %>
<c:if test="${empty name}">
	<c:set var="name" value="${id}"/>
</c:if>
<c:if test="${empty labelFor}">
	<c:set var="labelFor" value="${id}"/>
</c:if>
<c:if test="${!empty key}">
	<c:set var="label" value="${f:getOText(key)}"/>
</c:if>
<c:if test="${!empty leftKey}">
	<c:set var="leftLabel" value="${f:getOText(leftKey)}"/>
</c:if>
<c:if test="${!empty rightKey}">
	<c:set var="rightLabel" value="${f:getOText(rightKey)}"/>
</c:if>
<c:if test="${!empty rtKey}">
	<c:set var="rtLabel" value="${f:getOText(rtKey)}"/>
</c:if>
<c:if test="${empty forceSelection}">
	<c:set var="forceSelection" value="true"/>
</c:if>
<c:if test="${empty positiveNumber}">
	<c:set var="positiveNumber" value="true"/>
</c:if>
<c:set var="resources" value="${pageContext.request.getAttribute('CONTROLLED_RESOURCES')}" />
<c:set var="isHiddenPermitted" value="${f:isVisible(id, resources)}"/>
<c:set var="isDisablePermitted" value="${f:isEnable(id, resources)}"/> 
<c:if test="${not isDisablePermitted}">
	<c:set var="disabled" value="true"/>
</c:if>

<c:if test="${type != 'select' && type != 'searchingSelect' && type != 'date' && type != 'fiscalDate' && type != 'color' && type != 'time' && type != 'timeUnit' && type != 'currency' && type != 'multiSelect' && type != 'find'}" >
	<c:if test="${!empty onchange}"><c:set var="onchange" value="PAction.filedOnchange('${onchange}','${id}')"/></c:if>
	<c:if test="${!empty onclick}"><c:set var="onclick" value="PAction.filedOnchange('${onclick}','${id}')"/></c:if>
	<c:if test="${!empty onblur}"><c:set var="onblur" value="PAction.filedOnchange('${onblur}','${id}')"/></c:if>
	<c:if test="${!empty onfocus}"><c:set var="onfocus" value="PAction.filedOnchange('${onfocus}','${id}')"/></c:if>
	<c:if test="${!empty onkeydown}"><c:set var="onkeydown" value="PAction.filedOnkeydown(event, '${onkeydown}','${id}')"/></c:if>
</c:if>
<c:if test="${!empty rightLinkOclick}"><c:set var="rightLinkOclick" value="PAction.filedOnchange('${rightLinkOclick}','${id}')"/></c:if>
<c:if test="${!empty rightCheckboxOnclick}"><c:set var="rightCheckboxOnclick" value="PAction.filedOnchange('${rightCheckboxOnclick}','${rightCheckbox}')"/></c:if>
<c:if test="${isHiddenPermitted}">
	<div id="fr_${id}" class="${(empty cssClass) ? 'fieldRow' : cssClass}" >
		<c:if test="${!empty label}">
			<c:if test="${type != 'checkbox'}">
				<c:if test="${empty hiddenLabel || !hiddenLabel}">
					<label for="${labelFor}" id="label_${labelFor}" class="${(empty cssClass)?'fieldRow':cssClass}Label">${label}<c:if test="${notNull}"> <span style="color:red;line-height:1.2em">(*)</span></c:if></label>
				</c:if>
			</c:if>
			<c:if test="${!empty hiddenLabel || hiddenLabel}">
				<div style="display:none">
					<label for="${labelFor}" id="label_${labelFor}" class="${(empty cssClass)?'fieldRow':cssClass}Label">${label}</label>
				</div>
			</c:if>
		</c:if>
		<c:if test="${!empty leftLabel}">${leftLabel}</c:if>
		<c:if test="${type == 'radios'}">
			<c:if test="${empty itemValue}"><c:set var="itemValue" value="code" /></c:if>
			<c:if test="${empty itemLabel}"><c:set var="itemLabel" value="text" /></c:if>
			<c:forEach items="${items}" var="it">
				<div class="fieldRowRadioButton"><form:radiobutton tabindex="${tabindex}" id="${id}_${it[itemValue]}" path="${path}" value="${it[itemValue]}" disabled="${disabled}" onchange="${onchange}" onblur="${onblur}" onclick="${onclick}"/> ${it[itemLabel]}</div>
		    </c:forEach>
		</c:if>
		
		<c:if test="${type == 'password'}">
			<form:password path="${path}" id="${id}" size="${size}" disabled="${disabled}" readonly="${readonly}" onchange="${onchange}" onblur="${onblur}" tabindex="${tabindex}" cssClass="fieldRowTextField" />
		</c:if>
		<c:if test="${type == 'text'}">
			<c:if test="${!empty path}">
				<form:input path="${path}" id="${id}" size="${size}" maxlength="${maxlength}" disabled="${disabled}" readonly="${readonly}" onkeydown="${onkeydown}" onchange="${onchange}" autocomplete="off" onblur="${onblur}" onclick="${onclick}" onfocus="${onfocus}" value="${value}" tabindex="${tabindex}" cssClass="fieldRowTextField" />
				<c:set var="name" value="${path}" />
			</c:if>
			<c:if test="${empty path}">
				<c:set var="text_nbAttributes">
					<t:booleanAttribute value="${disabled}" text="disabled=\"disabled\""/> <t:readonlyAttribute readonly="${readonly}"/>
				</c:set>
				<input type="text" id="${id}" name="${name}" value="${empty value? '': value}" onfocus="${onfocus}" maxlength="${maxlength}" onblur="${onblur}" onkeydown="${onkeydown}" autocomplete="off" onchange="${onchange}" tabindex="${tabindex}" ${text_nbAttributes} class="fieldRowTextField" />
			</c:if>
		</c:if>
		<c:if test="${type == 'textEncode' || type == 'hiddenEncode'}">
			<c:set var="encodeType" value="text" />
			<c:if test="${type == 'hiddenEncode'}">
				<c:set var="encodeType" value="hidden" />
			</c:if>
			<input type="${encodeType}" id="${id}" name="${name}" value="${empty value? '': f:htmlEscape(value)}" onfocus="${onfocus}" maxlength="${maxlength}" onblur="${onblur}" onkeydown="${onkeydown}" autocomplete="off" onchange="${onchange}" tabindex="${tabindex}" ${text_nbAttributes} class="fieldRowTextField" />
		</c:if>
		<c:if test="${type == 'checkbox'}">
			<c:if test="${!empty path}">
				<form:checkbox path="${path}" id="${id}" disabled="${disabled}" onclick="${onclick}" tabindex="${tabindex}" />
			</c:if>
			<c:if test="${empty path}">
				<input type="checkbox" id="${id}" name="${name}" value="${value}" 
				<c:if test="${!empty disabled}">
					disabled="${disabled}"
				</c:if>
				<c:if test="${!empty checked}">
					checked="${checked}" 
				</c:if>
				 onclick="${onclick}" tabindex="${tabindex}" />
				<input type="hidden" name="_${name}" value="on" />
			</c:if>
			<label for="${labelFor}" id="label_${labelFor}" class="${(empty cssClass)?'fieldRow':cssClass}Label">${label}</label>
		</c:if>
		<c:if test="${type == 'checkbox_rt'}">
			<div  class="checkboxInputField">
				<form:checkbox path="${path}" id="${id}" disabled="${disabled}" onclick="${onclick}" tabindex="${tabindex}"/>
			</div>
			<c:if test="${!empty rtLabel}">
				<div class="checkboxTextField">${rtLabel}</div>
			</c:if>
		</c:if>
		<c:if test="${type == 'textarea'}">
			<form:textarea path="${path}" id="${id}" rows="${rows}" cols="${cols}" disabled="${disabled}" readonly="${readonly}" onchange="${onchange}" onblur="${onblur}" tabindex="${tabindex}" cssClass="fieldRowTextareaField" />
		</c:if>
		<c:if test="${type == 'textarea_ni'}">
			<textarea id="${id}_value" rows="${rows}" cols="${cols}" disabled="${disabled}" readonly="${readonly}" onchange="${onchange}" onblur="${onblur}" tabindex="${tabindex}" class="${(empty cssClass) ? 'fieldRow' : cssClass}"  >${value}</textarea>
		</c:if>
		<c:if test="${type == 'text_ni'}">
			<div id="${id}_value" class="fieldRow">${value}</div> 
		</c:if>
		<c:if test="${type == 'select'}">
			<div id="DCNT_${id}"></div>
			<c:if test="${empty itemValue}"><c:set var="itemValue" value="name" /></c:if>
			<c:if test="${empty itemLabel}"><c:set var="itemLabel" value="text" /></c:if>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			<c:set var="comboboxDatas">
				[
				<c:forEach items="${items}" var="it" varStatus="state">
					<c:if test="${empty text}"><c:if test="${it[itemValue] == value}"><c:set var="text" value="${it[itemLabel]}" /></c:if></c:if>
					<c:if test="${!state.last}">["${it[itemValue]}","${it[itemLabel]}"],</c:if> 
					<c:if test="${state.last}">["${it[itemValue]}","${it[itemLabel]}"]</c:if>
				</c:forEach>
				]
			</c:set>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
			${AFTER_PAGE_ONLOAD_SCRIPT}
			var com${id} = initComboboxField({
				id : '${id}',
				fieldClass : '${empty cssClass ? 'comboboxSelectField' : cssClass}',
			    itemLabel : '${itemLabel}',
			    itemValue : '${itemValue}',
			    datas : ${comboboxDatas} ,
				disabled : ${empty disabled ? 'false' : disabled},
				readOnly : ${empty readonly ? 'false' : readonly},
				XTemplate: ${empty XTemplate ? 'null' : XTemplate},
			    value: '${value}',
	   			forceSelection : ${forceSelection},
	   			width : ${empty width ? 0 : width},
	   			tabIndex: '${tabindex}',
	   			onchange : '${onchange}',
		        onkeydown : '${onkeydown}'
			});
			</c:set>
			<input type="hidden" value="${value}" id="H_${id}" name="${name}" />
			<input type="hidden" value="${text}" id="H_${id}_Text" />
		</c:if>
		<c:if test="${type == 'multiSelect'}">
			<div id="DCNT_${id}"></div>
			<c:if test="${empty itemValue}"><c:set var="itemValue" value="name" /></c:if>
			<c:if test="${empty itemLabel}"><c:set var="itemLabel" value="text" /></c:if>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			<c:set var="comboboxDatas">
				[
				<c:forEach items="${items}" var="it" varStatus="state">
					<c:if test="${empty text}"><c:if test="${it[itemValue] == value}"><c:set var="text" value="${it[itemLabel]}" /></c:if></c:if>
					<c:if test="${!state.last}">["${it[itemValue]}","${it[itemLabel]}"],</c:if> 
					<c:if test="${state.last}">["${it[itemValue]}","${it[itemLabel]}"]</c:if>
				</c:forEach>
				]
			</c:set>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
			${AFTER_PAGE_ONLOAD_SCRIPT}
			var com${id} = initMultiComboboxField({
				id : '${id}',
				fieldClass : '${empty cssClass ? 'comboboxSelectField' : cssClass}',
			    itemLabel : '${itemLabel}',
			    itemValue : '${itemValue}',
			    datas : ${comboboxDatas} ,
				disabled : ${empty disabled ? 'false' : disabled},
			    value: '${value}',
	   			forceSelection : ${forceSelection},
	   			tabIndex: '${tabindex}',
	   			onchange : '${onchange}',
		        onkeydown : '${onkeydown}'
			});
			</c:set>
			<input type="hidden" value="${value}" id="H_${id}" name="${name}" />
			<input type="hidden" value="${text}" id="H_${id}_Text" />
		</c:if>
		<c:if test="${type == 'color'}">
			<div id="DCNT_${id}"></div>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				Erp.common.ext.util.initColorField({
					id : '${id}', 
					renderTo : 'DCNT_${id}',
					value : $('H_${id}').value,
					tabIndex: '${tabindex}',
					notNull: ${empty notNull ? 'false' : notNull},
					disabled : ${empty disabled ? 'false' : disabled},
					onchange : '${onchange}',
					showHexValue : ${empty showHexValue ? false : showHexValue},
					autoShow : ${empty autoShow ? true : autoShow}
				}); 
			</c:set>
			<input type="hidden" value="${value}" id="H_${id}" name="${name}" />
		</c:if>
		<c:if test="${type == 'date'}">
			<div id="DCNT_${id}"></div>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${!empty format}"><c:set var="format" value="${format}" /></c:if>
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				__initDateField({
					id : '${id}', 
					name : '${name}', 
					value : '${value}',
					validateType: 'daterange',
					tabIndex: '${tabindex}',
					format : '${empty format ? 'Y-m-d' : format}',
					width : ${empty width ? 0 : width},
					notNull: ${empty notNull ? 'false' : notNull},
					disabled : ${empty disabled ? 'false' : disabled},
					onchange : '${onchange}',
					startDateField : '${startDateField}',
					endDateField : '${endDateField}'
				}); 
			</c:set>
		</c:if>
		
		<c:if test="${type == 'fiscalDate'}">
			<div>
					<div id="DCNT_${id}" style="float:left;width:70px"> <div id="FDCNT_${id}" 
					style="float:left;width:70px;height:22px;position: absolute;z-index: 9999;margin-left:70px;padding-top:5px; "></div></div>
			</div>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${!empty format}"><c:set var="format" value="${format}" /></c:if>
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				__initDateField({
					id : '${id}', 
					name : '${name}', 
					value : '${value}',
					validateType: 'daterange',
					date_type : 'fiscalDate',
					tabIndex: '${tabindex}',
					format : '${empty format ? 'Y-m-d' : format}',
					width : ${empty width ? 0 : width},
					notNull: ${empty notNull ? 'false' : notNull},
					disabled : ${empty disabled ? 'false' : disabled},
					onchange : 'fiscalDate_change',
					startDateField : '${startDateField}',
					endDateField : '${endDateField}'
				}); 
			</c:set>
		</c:if>
		
		<c:if test="${type == 'time'}">
			<div id="DCNT_${id}"></div> 
			<c:if test="${!empty path}">
				<spring:bind path="${path}">
					<c:set var="value" value="${status.value}" />
				</spring:bind>
			</c:if>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				__initDateTimeField({
					id : '${id}', 
					name : '${path}',
					value : '${value}',
					width : ${empty width ? 0 : width},
					tabIndex: '${tabindex}',
					disabled : ${empty disabled ? 'false' : disabled},
					onchange : '${onchange}'
				}); 
			</c:set>
		</c:if>
		<c:if test="${type == 'searchingSelect'}">
			<c:if test="${empty valueField}"><c:set var="valueField" value="id" /></c:if>
			<c:if test="${empty displayField}"><c:set var="displayField" value="name" /></c:if>
			<c:if test="${empty storeFieldArray}"><c:set var="storeFieldArray" value="['id','name']" /></c:if>
			<c:if test="${empty userType}"><c:set var="userType" value="false" /></c:if>
			
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<div id="DCNT_${id}" class="searchingSelectPosition"></div> 
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				var ${id}arg = {url:'${url}',
					 id:'${id}', 
					 textFieldId: '_Text',
					 width: ${empty width ? 0 : width},
					 tabIndex: '${tabindex}',
					 XTemplate: ${empty XTemplate ? 'null' : XTemplate},
		        	 onTriggerClick : '${onclick}',
		        	 onchange : '${onchange}',
					 secondOnchange : '${secondOnchange}',
					 popupLoadBySourceEntity : '${popupLoadBySourceEntity}',
		        	 onkeydown : '${onkeydown}',
		        	 readOnly : ${empty readonly ? false : readonly},
		        	 disabled : ${empty disabled ? false : disabled},
		        	 valueField: '${valueField}',
		        	 displayField: '${displayField}',
		        	 gridUrl : '${gridUrl}',
		        	 findUrl : '${findUrl}',
		        	 gridConfigName : '${gridConfigName}',
		        	 gridInitParameters : '${empty gridInitParameters ? initParameters : gridInitParameters}',
		        	 initParameters : '${empty initParameters ? gridInitParameters : initParameters}',
		        	 fieldArray: ${storeFieldArray},
		        	 hideTrigger : ${empty hideTrigger ? false : hideTrigger},
		        	 mtype : '${mtype}',
		        	 seType : '${seType}'
				};
	
				var ${id}params = {};
		 		var ${id}ex = initSearchingSelect(${id}arg);
		 		if($('H_${id}').value == '' && $('H_${id}_Text').value == '') {
		 			${id}ex.clearValue();
		 		} else {
		  			${id}ex.setValue($('H_${id}').value);
		    		${id}ex.setRawValue($('H_${id}_Text').value);
				}
			</c:set>
			
			<c:if test="${!empty bindModel && !empty path}">
			  <spring:bind path="${bindModel}.${path}">
			  		<c:if test="${!empty status.value}">
				    	<c:if  test="${userType == true}">
				    		<c:set var="value" value="${status.value}" />
				    		<c:set var="text" value="${status.value}" />
				    	</c:if>
				    	
				    	<c:if  test="${userType == false}">
					    	<spring:bind path="${bindModel}.${path}.${valueField}">
					    		<c:set var="value" value="${status.value}" />
					    	</spring:bind>
					    	
					    	<spring:bind path="${bindModel}.${path}.${displayField}">
					    		<c:set var="text" value="${status.value}" />
					    	</spring:bind>
				    	</c:if>
				   </c:if>
			  </spring:bind>
			</c:if>
			<input type="hidden" value="${empty value? '': f:htmlEscape(value)}" id="H_${id}" name="${name}" />
			<input type="hidden" value="${empty text? '': f:htmlEscape(text)}" id="H_${id}_Text" />
			
		</c:if>
		<c:if test="${type == 'currency'}">
			<div id="DCNT_${id}"></div>
			<c:if test="${empty itemValue}"><c:set var="itemValue" value="name" /></c:if>
			<c:if test="${empty itemLabel}"><c:set var="itemLabel" value="text" /></c:if>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			
			<c:if test="${empty value}">
				<c:if test="${!empty path}">
					<spring:bind path="${path}">
						<c:set var="value" value="${status.value}" />
					</spring:bind>
				</c:if>
			</c:if>
			
			<c:set var="comboboxDatas">
				[
				<c:forEach items="${items}" var="it" varStatus="state">
					<c:if test="${empty text}"><c:if test="${it == value}"><c:set var="text" value="${it}" /></c:if></c:if>
					<c:if test="${!state.last}">["${it}","${it}"],</c:if> 
					<c:if test="${state.last}">["${it}","${it}"]</c:if>
				</c:forEach>
				]
			</c:set>
			
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
			${AFTER_PAGE_ONLOAD_SCRIPT}
			var com${id} = initComboboxField({
				id : '${id}',
				fieldClass : '${empty cssClass ? 'comboboxSelectField' : cssClass}',
			    itemLabel : '${itemLabel}',
			    itemValue : '${itemValue}',
			    datas : ${comboboxDatas} ,
				disabled : ${empty disabled ? 'false' : disabled},
			    value: '${value}',
	   			forceSelection : ${forceSelection},
	   			tabIndex: '${tabindex}',
	   			onchange : '${empty onchange ? null : onchange}',
		        onKeydown : '${empty onkeydown ? null : onkeydown}'
			});
			</c:set>
			<input type="hidden" value="${value}" id="H_${id}" name="${name}" />
			<input type="hidden" value="${text}" id="H_${id}_Text" />
		</c:if>
		
		<c:if test="${type == 'timeUnit'}">
			<form:select path="${path}" id="${id}" disabled="${disabled}" onchange="${onchange}" onblur="${onblur}" cssClass="fieldRowTextField" tabindex="${tabindex}">
				<c:if test="${empty allowEmpty || allowEmpty == 'true'}"><form:option value="" label="${f:getOText('Com.Select')}" /></c:if>
				<c:forEach items="${items}" var="item">
					<form:option value="${item}">${item}</form:option>
	  			</c:forEach>
			</form:select>
		</c:if>
		
		<c:if test="${type == 'find'}">
			<div id="DCNT_${id}" style="float:left;"></div>
			<c:if test="${empty valueField}"><c:set var="valueField" value="id" /></c:if>
			<c:if test="${empty displayField}"><c:set var="displayField" value="code" /></c:if>
			<c:if test="${!empty path}"><c:set var="name" value="${path}" /></c:if>
			<c:if test="${empty name}"><c:set var="name" value="${id}" /></c:if>
			<c:if test="${empty userType}"><c:set var="userType" value="false" /></c:if>
			<c:if test="${!empty bindModel && !empty path}">
			  <spring:bind path="${bindModel}.${path}">
			  		<c:if test="${!empty status.value}">
				    	<c:if  test="${userType == true}">
				    		<c:set var="value" value="${status.value}" />
				    		<c:set var="text" value="${status.value}" />
				    	</c:if>
				    	
				    	<c:if  test="${userType == false}">
					    	<spring:bind path="${bindModel}.${path}.${valueField}">
					    		<c:set var="value" value="${status.value}" />
					    	</spring:bind>
					    	
					    	<spring:bind path="${bindModel}.${path}.${displayField}">
					    		<c:set var="text" value="${status.value}" />
					    	</spring:bind>
				    	</c:if>
				   </c:if>
			  </spring:bind>
			</c:if>
			<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
				${AFTER_PAGE_ONLOAD_SCRIPT}
				var ${id}arg = {
					 id:'${id}', 
		        	 initParameters : '${empty initParameters ? gridInitParameters : initParameters}',
		        	 url: '${url}',
		        	 onchange: '${onchange}',
		        	 disabled : ${empty disabled ? 'false' : disabled},
		        	 onclick: '${onclick }',
		        	 tabIndex: '${tabindex}',
		        	 width: ${empty width ? 0 : width},
		        	 addSeacrhButton: '${addSeacrhButton }'
				};
	
		 		var ${id}ex = initFindTag(${id}arg);
		 		${id}ex.setSelectValue('${value}', '${text}');
			</c:set>
			<c:if test="${addSeacrhButton }">
				<div id="TagAdd_${id}_div" style="float:left;"></div>
			</c:if>
			<input type="hidden" value="${value}" id="H_${id}" name="${name}" />
		</c:if>
		
		<c:if test="${!empty rightLabel}">${rightLabel}</c:if>
		<c:if test="${!empty rightLink}"><div style="float:left;height:15px;width:30px;line-height:22px;"><a href='#' id="${rightLink}" onclick="javascript:${rightLinkOclick}">${rightLink}</a></div></c:if>
		<c:if test="${!empty rightCheckbox}"><input type="checkbox" id="${rightCheckbox}" name="${rightCheckbox}" onclick="${rightCheckboxOnclick}"/></c:if>
		<c:set var="AFTER_PAGE_ONLOAD_SCRIPT" scope="request">
			${AFTER_PAGE_ONLOAD_SCRIPT}
			VUtils.addField("${id}", {label:"${label}",dataType:"${dataType}",id:"${id}",type:"${type}",notNull: "${notNull}", maxValue: "${maxValue}", minValue: "${minValue}", positiveNumber : "${positiveNumber}", keepZero : "${keepZero}"<c:if test="${dataType == 'Float'}">, decimalNumber: "${decimalNumber}", ignoreEndZeros: "${ignoreEndZeros}", ignoreBeginZero: "${ignoreBeginZero}"</c:if>});
		</c:set>
		<jsp:doBody/>
	</div>
</c:if>
