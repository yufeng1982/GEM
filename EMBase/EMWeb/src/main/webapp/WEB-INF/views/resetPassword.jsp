<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>
<%@ taglib prefix="pack" uri="http://packtag.sf.net" %>

<html>
<head>
	<title>${f:getText('Com.ResetPassword')}</title>
	
	<script>
	$(document).ready(function() { 
		$("#form1").focus();
			$(document.forms[0]).validate();
	});
	</script>
	<style type="text/css" media="all">
body {
	background-color:#ECEEEE;
	text-align: center;
}
#pwcontent{


}

.but_login span {
	float: left;
	margin-left: 45px;
	width: 91px;
	height: 26px;
	display: inline;
	text-align: center;
	margin-top: 5px;
}
.but_login a span {
	background: url(/images/login/button_02.gif) 0px 0px no-repeat;
	color: white;
	text-decoration: none;
}
.but_login a:hover span {
	background: url(/images/login/button_02.gif) -91px 0px no-repeat;
}
</style>
</head>

<body>
	<form id="form1" action="/app/doResetPassword" method="post" class="form-horizontal" >
	<input type="hidden" id="entryptValidationCode" name="entryptValidationCode" value="${entryptValidationCode}"/>

		<fieldset>
			<legend><small>${f:getText('Com.ResetPassword')}</small></legend>
			<div class="control-group">
				<div class="controls">
					<label for="plainPassword" class="control-label">${f:getText('Com.NewPassword')}</label>
					<input type="password" id="plainPassword" name="plainPassword" class="input-large required" minlength="6"/>
				</div>
			</div>
			<div class="control-group">
				<div class="controls">
					<label for="confirmPassword" class="control-label">${f:getText('Com.Confirm.Password')}</label>
					<input type="password" id="confirmPassword" name="confirmPassword" class="input-large required" equalTo="#plainPassword" minlength="6"/>
				</div>
			</div>
			<div class="form-actions">
				<input id="submit_btn" class="btn btn-primary"  type="submit" value="${f:getText('Com.Submit')}"/>
			</div>
		</fieldset>
	</form>
</body>
</html>
