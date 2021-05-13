<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
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
<style type="text/css" media="all">
body {
	background-color:#ECEEEE;
	text-align: center;
}
.pwcontent{
	float: left;
	width: 100%;
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
<body >

<form action="/app/forgetPassword" method="post" id="form1">
	<fieldset>
			<legend><small>${f:getText('Com.ResetPassword')}</small></legend>
				<div class="pwcontent">
					${message}
				</div>
				<c:if test="${empty messageFlag || messageFlag == false}">
					<div class="pwcontent">
						${f:getText('Com.Mail.EnterMail')}<input type="text" id="userEmail" name="userEmail">
						<input id="submit_btn" class="btn btn-primary"  type="submit" value="${f:getText('Com.Submit')}"/>
					</div>
				</c:if>
	</fieldset>
</form>

</body>
</html>