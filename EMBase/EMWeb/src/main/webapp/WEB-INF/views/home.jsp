<%@ page language="java" contentType="text/html; charset=UTF-8"   pageEncoding="UTF-8"%>
<%@ page import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter"%>
<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core' %>
<%@ taglib prefix="f" uri="functions" %>
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
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

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
<link href="/static/bootstrap/3.2.0/css/bootstrap.min.css" type="text/css" rel="stylesheet" />
<style type="text/css" media="all">
body {
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: lightblue;
  background-image: url("");
}

.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}

 .form-control {
  position: relative;
  font-size: 16px;
  height: auto;
  padding: 10px;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
 .form-control:focus {
  z-index: 2;
}
input::-moz-placeholder{font-family: 楷体;}
input::-moz-placeholder{color:black !important;}
input:-ms-input-placeholder{font-family: 楷体;}
input:-ms-input-placeholder{color:black !important;}
input::-webkit-input-placeholder{font-family: 楷体;}
input::-webkit-input-placeholder{color:black !important;}
input[type="text"] {
  margin-top : 20px;
  margin-bottom: -2px;
}
input[type="password"] {
  margin-bottom: 30px;
}
.panel-ext-height{height: 350px;width: 320px;}
.alert-danger-ext-width{width: 320px;}
.panel-ext-login {height: 45px;}
.panel-ext-login p {text-align: center; padding: 2px 2px;font-family: 楷体;}
.btn-ext-font{font-family: 楷体;}
</style>
</head>

<body onload="init()">
	<div class="container">
      <form name="form1" id="form1" method="post" action="/app/login">
        <br><br><br><br>
		<div class="row">
       		<div class="col-sm-7"></div>
       		<div class="col-sm-4">
       		    <%
					if(request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME) != null) {
				%>
					<div class="alert alert-danger alert-danger-ext-width">
						<span class="errorMsg">
					        <strong>${f:getText('Com.UserNameAndPassword.Info')}!</strong> ${f:getText('Com.UserNameAndPassword.Failure')} 
				        </span>
			        </div>
				<%
					}
				%>
       			<div class="panel panel-info panel-ext-height">
	 				<div class="panel-heading panel-ext-login">
	 					<p><strong>用 户 登 录</strong></p>
	 				</div>
	 				<div class="panel-body">
	 					<input type="text" name="username" id="username" class="form-control" placeholder="用户名:" autofocus OnKeyDown="return getEnter(event)">
				        <br>
				        <input type="password" name="password" id="password" class="form-control" placeholder="密&nbsp;&nbsp;码:" OnKeyDown="return getEnter(event)">
				        <button class="btn btn-lg btn-success btn-block btn-ext-font" type="submit">登 录</button>
	 				</div>
       		</div>
       		<div class="col-sm-1"></div>
       	</div>
        
      </form>
    </div> 
</body>
</html>