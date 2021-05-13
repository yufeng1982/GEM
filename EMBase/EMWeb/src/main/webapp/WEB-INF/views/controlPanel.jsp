<%@ page language="java" contentType="text/html; charset=utf-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="t" uri="tags" %>
<%@ taglib prefix="f" uri="functions" %>
<%@ taglib prefix="pack" uri="http://packtag.sf.net" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<title>${f:getText('Com.ControlPanel')}</title>

<style type='text/css' media='screen'>
#login {
	margin:15px 0px; padding:0px;
	text-align:center;
}
#login .inner {
	width:260px;
	margin:0px auto;
	text-align:left;
	padding:10px;
	border-top:1px dashed #499ede;
	border-bottom:1px dashed #499ede;
	background-color:#EEF;
}
#login .inner .fheader {
	padding:4px;margin:3px 0px 3px 0;color:#2e3741;font-size:14px;font-weight:bold;
}
#login .inner .cssform p {
	clear: left;
	margin: 0;
	padding: 5px 0 8px 0;
	padding-left: 105px;
	border-top: 1px dashed gray;
	margin-bottom: 10px;
	height: 1%;
}
#login .inner .cssform input[type='text'] {
	width: 120px;
}
#login .inner .cssform label {
	font-weight: bold;
	float: left;
	margin-left: -105px;
	width: 100px;
}
#login .inner .login_message {color:red;}
#login .inner .text_ {width:120px;}
#login .inner .chk {height:12px;}
</style>
</head>

<body>
	<br />
	<br />
	<br />
	<br />
	<br /> 
	<div id='login'>
		<div class='inner'>
			<g:if test='${flash.message}'>
			<div class='login_message'>${flash.message}</div>
			</g:if>
			<div class='fheader'>
				<p>${f:getText('Com.ControlPanel')}</p>
				<p><a href="javascript:launch();">${f:getText('Com.Relaunch')}</a></p>
				<p><a href="/app/logout">${f:getText('Com.Restart')}</a></div></p>
			<form action='/app/login' method='POST' id='loginForm' class='cssform' >
 
			</form>
		</div>
	</div>
<script type="text/javascript" src='/js/utils/detect_timezone.js'></script>
<script type='text/javascript'>

</script>
</body>
</html>