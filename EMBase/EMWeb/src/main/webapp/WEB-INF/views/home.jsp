<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ page import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter"%>
<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core' %>
<%   
	String userName = null;
	Cookie[] cookies = request.getCookies();
	if(cookies != null){
		for(Cookie ck : cookies) {
			if(ck.getName().equals("userName")){
				userName = ck.getValue();
			}
		}
	}
    request.setAttribute("userName", userName);
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>Orange - HR Management System</title>

<script type="text/javascript">
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}
function   forgetPasswordWindow()   {window.open( "toForgetPassword", " ", "width=200,height=100,top=400,left=600,location=no");} 
function init() {
	var un = "${userName}";
	if(un.toString().length != 0 && un.toString().trim() != ""){
		document.getElementById("username").value = un;
		document.getElementById("rememberMe").checked = true;
		document.getElementById("password").focus();
	} else {
		document.getElementById("username").focus();
	}
}
function getEnter(E){
	var E = E || window.event;
	if(E && E.keyCode == 13){
		document.getElementById('form1').submit();
	}else{
		return;
	}
}
</script>
<style type="text/css" media="all">
body {
	background-color:#ECEEEE;
 	background-image: url('/images/nova_login_bg.png');
	background-repeat:no-repeat;
	position:relative; 
}

.but_login {
	float: left;
	line-height: 26px;
	display: inline;
}
.but_login span {
	float: left;
	margin-left: 0px;
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
.errorMsg{
	color:red;
	font-size: 11px;
}

#divBG {
		background-image: url('/images/nova_login_bg.png');
		margin:0 auto;
		width:900px; 
		height:620px;  
		margin-top:100px;
		position:relative;
		background-repeat:no-repeat;
	}
#login_mod {
	left: 550px;
	top: 170px;
	width:720px;
	position:relative;
	font-size: 11pt;
	font-family: tahoma,verdana,arial,sans-serif;
}

.left_text {
display:block;
margin-top:10px;
}
</style>
</head>

<body onload="init()">
<form name="form1" id="form1" method="post" action="/app/login">


		<div id="login_mod">
			<dt>
				<%
					if(request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME) != null) {
				%>
					<span class="errorMsg">
				        Your login attempt was not successful, try again.<BR>  
				        User name or password is not correct.
			      </span>
			      ${message}
				<%
					}
				%>
			</dt>

			<dd>
				<span class="left_text">Username:</span>
				<input class="right_input" name="username" id="username" type="text" MaxLength="50"  OnKeyDown="return getEnter(event)"/>
			</dd>
			<dd>
				<span class="left_text">Password:</span>
				<input class="right_input" id="password" name="password" type="Password" MaxLength="50" OnKeyDown="return getEnter(event)" />
			</dd>
			<dd>
				<span class="myinfo"><input name="rememberMe" type="checkbox" value="" id="rememberMe" OnKeyDown="return getEnter(event)" />Remember me</span>
				<span class="forgetpassword"><a href="#"></a></span>
			</dd>
			<dd class="but_login">
			<BR>
				<a href="#" onclick="form1.submit()">
					<span>Login</span>
				</a>
					<a href="/app/toForgetPassword" ">
					<span>Forgot</span>
				</a>
			</dd>
			
		</div>
</form>
</body>
</html>
