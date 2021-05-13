<jsp:directive.include file="/WEB-INF/views/utils/_taglibUtil.jsp" />
<html>
	<head>
		<title>Close</title>
		<script>
		
function init() {
	try {
	    if (window.opener) {
	        var parentLauncher = __getParentLauncher("${varName}");
	        if (parentLauncher) {
	            if (parentLauncher.callBack) {
	                var result = ${RETURN_QUERYSTRING};
	                parentLauncher.callBack("${_action__}", result,null,parentLauncher);
	            }
	        }
	    }
	    else if (window.parent.dialogArguments) {
	        var result = ${RETURN_QUERYSTRING};
	        window.parent.dlgClose("${_action__}", result);
	    }
	} catch (E) {
	}
    window.close();
}

function __getParentLauncher(varName) {
	var parentLauncher = null;
    if (window.opener) {
        if (varName && (varName.length > 0)) {
            try {
            	// TODO, Lei, remove else when all the pages are converted into extjs4
            	if(window.opener.LUtils) {
	            	var pLaunchers = window.opener.LUtils;
            		parentLauncher = pLaunchers.getLauncher(varName);
            	} else {
            		parentLauncher = window.opener[varName];
            	}
            }
            catch (E) {
            }
        }
    }
    return parentLauncher;
}

		</script>
	</head>
	<body topmargin="0" title="Dialog" scroll="no" rightmargin="0" leftmargin="0" bottommargin="0" onload="init()">
	</body>
</html>
