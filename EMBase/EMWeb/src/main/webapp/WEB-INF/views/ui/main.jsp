<jsp:directive.include file="/WEB-INF/views/layouts/_header2.jsp" />
<title>${f:getText('Com.App.Title')}</title>
	<script type="text/javascript" src="/js/erp/lib/ui/field/ERPSearchingSelect.js"></script>
	<script type="text/javascript" src="/js/erp/ui/MainAction.js"></script>
	<script type="text/javascript">
		PRes['addTab'] = "${f:getText('FN.AddTab')}";
		PRes['dashboard'] = "${f:getText('FN.Dashboard')}";
		PRes['deleteConfirm'] = "${f:getText('Core.BookMark.Delete.Confirm.Title')}";
		PRes['deleteConfirmMsg'] = "${f:getText('Core.BookMark.Delete.Confirm.Msg')}";
		PRes['sessionControl'] = "${f:getText('FN.SessionControl')}";
		PRes['shopReceiving'] = "${f:getText('FN.ShopReceiving')}";
		PRes['logoff'] = "${f:getText('FN.Logoff')}";
		PRes['english'] = "${f:getText('Language.English')}";
		PRes['chinese'] = "${f:getText('Language.Chinese')}";
		PRes['content'] = "${f:getText('FN.Content')}";
		PRes['about'] = "${f:getText('FN.About')}";
		PRes['openInNewTab'] = "${f:getText('Com.OpenInNewTab')}";
		PRes['edit'] = "${f:getText('Com.Edit')}";
		PRes['delete'] = "${f:getText('Com.Delete')}";
		PRes['currentUser'] = "${f:getText('Com.CurrentUser')}";
		PRes['workDate'] = "${f:getText('Com.WorkDate')}";
		PRes['language'] = "${f:getText('Com.Language')}";
		PRes['file'] = "${f:getText('FN.File')}";
		PRes['menu'] = "${f:getText('FN.Main.Menu')}";
		PRes['tools'] = "${f:getText('FN.Main.Tools')}";
		PRes['psc'] = "${f:getText('Com.PleaseSelectCorporation')}";
		PRes['ssc'] = "${f:getText('Com.ShouldSelectCorporation')}";
		PRes['warning'] = "${f:getText('Com.Warning')}";
		PRes['company'] = "${f:getText('Com.Company')}";
		PRes['resetPassword'] = "${f:getText('Com.ModifyPassword')}";
		PRes["ResetPassword"] = "${f:getText('Com.ResetPassword')}";
		PRes["NewPassword"] = "${f:getText('Com.NewPassword')}";
		PRes["ConfirmPassword"] = "${f:getText('Com.Confirm.Password')}";
		PRes["NewPasswordNotEmpty"] = "${f:getText('Com.Validate.User.NewPassword.NotEmpty')}";
		PRes["ConfirmPasswordNotEmpty"] = "${f:getText('Com.Validate.User.ConfirmPassword.NotEmpty')}";
		PRes["PasswordNotSame"] = "${f:getText('Com.Validate.User.Password.NotSame')}";
		PRes["RestSuccess"] = "${f:getText('Com.Password.Modify')}";
		
	</script>
	<script type="text/javascript">
		<jsp:directive.include file="/WEB-INF/views/ui/_includes/_main.js" />
	</script>
	<style>
		.icon-bookmark1{background-image:url(/images/bar/bookmark1.gif) !important;}
		.icon-bookmark2{background-image:url(/images/bar/bookmark2.gif) !important;}
		/*resolve width show problem at firfox and chrome  */
		.x-grid-table{width:inherit !important;}
		/* left tree panel cursor is showed pointer*/
		.x-component{cursor: default !important;}
		/* left tree menu link cursor is showed hand*/
		.x-grid-cell-inner{cursor: pointer !important;}
	</style>
</head>  
<body>
	<form id="form1" action="/app/${APP_NAME}/ui/mainFrame/" method="post">
		<jsp:directive.include file="/WEB-INF/views/utils/_hiddenUtil.jsp" />
		<input type="hidden" name="DEFAULT_OWNER_CORPORATION_KEY" id="DEFAULT_OWNER_CORPORATION_KEY" value="" />
		<input type="hidden" name="user" id="user" value="" />
		<input type="hidden" name="currentUserId" id="currentUserId" value="${currentUser.id}" />
	</form>
</body>
</html>