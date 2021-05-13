/**
 * @author FengYu
 */
Ext.define('ERP.ui.MainAction', {
	extend : 'ERP.BaseAction',
	isSuperAdmin : false,
	currentUserId : null,
	currentUser : null,
	currentENo : null,
	currentCorporation : null,
	workDate : null,
	indexTab : 0,
	selectedNode : null,
	markedTabs : new Array(),
	appName : null,
	addTab : null,
	dashboard : null,
	logoff : null,
	resetPassword : null,
	toEnglish : null,
	toChinese : null,
	hContent : null,
	hAbout : null,
	rMenuOpenWithNewTab : null,
	rMenuEdit : null,
	rMenuDelete : null,
	fuctionNodeRightClick : null,
	toolsFNRightClick : null,
	mMenu : null,

	isLogoff: false,
	
	constructor : function(config) {
		var me = this;
		
		this.callParent([config]);
		Ext.apply(this, config);
		
	    Ext.define('cModel', {
	    	extend: 'Ext.data.Model',
	    	fields: [
		         {type: 'string', name: 'id'},
		         {type: 'string', name: 'shortName'}
	    	]
	    });

		this.addTab= new Ext.Action({
		    text : PRes['addTab'],
		    icon : '/images/icon/sprites.png', 
	        iconCls : 'ss_application_add',
		    handler : function() { me.addTabFun(); }
		});
		this.dashboard= new Ext.Action({
		    text : PRes['dashboard'],
		    icon : '/images/bar/article.gif',
//		    iconCls : 'ss_application_view_tile',
	        handler: function() { me.onDispDesktopClick(); }
		});
		this.sessionControl = new Ext.Action({
		    text : PRes['sessionControl'],
		    icon : '/images/bar/page_attach.png',
	        handler: function() { me.launchCorporationSelector(); }
		});

		this.logoff = new Ext.Action({
		    text : PRes['logoff'],
		    icon : '/images/bar/folder_go.png', 
	        handler: function() { me.logoutPage(); }
		});
		
		this.resetPassword = new Ext.Action({
		    text : PRes['resetPassword'],
		    icon : '/images/icon/sprites.png', 
		    iconCls : 'ss_application_form_edit', 
	        handler: function() { 
	        	PAction.modifyPassword(); 
	        }
		});
		
		this.toEnglish = new Ext.Action({
		    text : PRes['english'],
		    icon : '/images/bar/en.gif', 
	        handler: function() { me.switchLanguageEn(); }
		});
		this.toChinese = new Ext.Action({
		    text : PRes['chinese'],
		    icon : '/images/bar/zh.gif', 
	        handler: function() { me.switchLanguageEs(); }
		});
		this.hContent = new Ext.Action({
		    text : PRes['content'],
		    icon : '/images/bar/help_s.gif', 
	        handler: function() { me.switchLanguageFr(); }
		}),
		this.hAbout = new Ext.Action({
		    text : PRes['about'],
		    icon : '/images/bar/ablout.gif', 
	        handler: function() { me.switchLanguageFr(); }
		});
		this.toGray = new Ext.Action({
		    text : PRes['Gray'],
		    icon : '/images/bar/gray.jpg', 
	        handler: function() { me.switchGray(); }
		});
		this.toBlue = new Ext.Action({
		    text : PRes['Blue'],
		    icon : '/images/bar/blue.jpg', 
	        handler: function() { me.switchBlue(); }
		}),
		this.rMenuOpenWithNewTab = new Ext.Action({
	        text : PRes['openInNewTab'],
	        handler : function (menu, event) {
				var nodeUrl = me.selectedNode.raw.url;
				if (nodeUrl == '') {
					return ;
				}
				var nodeId = me.selectedNode.raw.id;
				me.showMainFramePage(nodeId, nodeUrl, me.selectedNode.raw.text, true);
			}
		});
		this.fuctionNodeRightClick = new Ext.menu.Menu({
		    id : 'fuctionNodeRightClick',  
		    items : this.rMenuOpenWithNewTab
		});
		this.toolsFNRightClick = new Ext.menu.Menu({
			id : 'toolsFNRightClick',  
			items : new Ext.Action({
		        text : "Open",
		        handler : function (menu, event) {
					var nodeUrl = me.selectedNode.raw.url;
					if (nodeUrl == '') {
						return ;
					}
					eval(nodeUrl);
				}
			})
		});
		this.mMenu = {xtype:'toolbar', region:"north", height:50,
				items:[
//				{	
//					xtype:"splitbutton",
//					id: 'lang-menu',
//					text: PRes['language'],
//					icon:'/images/bar/comment.gif',
//					menu : {items: [me.toChinese/*, me.toEnglish*/]}
//				}, '-',
				'-',
				me.addTab, '-',
				me.dashboard, '-',
//				me.sessionControl, '-',
				{	
				xtype:"button",
				id: 'color-menu',
				text: PRes['switchColors'],
				icon:'/images/icon/color-trigger.gif',
				menu : {items: [me.toGray, me.toBlue]}
				}, '-',
				me.resetPassword, '-',
				me.logoff, '-' 
				,'->', PRes['currentUser'] + " : " + me.currentCorporation + (Strings.isEmpty(me.currentENo) ? "" : "/" + me.currentENo) + "/" + me.currentUser + ' ', PRes['workDate'] + ' : ' + this.workDate
			]};
		
		Ext.define('TagM', {
		    extend: 'Ext.data.Model',
		    fields: [
		        {name: 'id', type: 'string'},
		        {name: 'code',  type: 'string'}
		    ]
		});
	},

	showMainFramePage : function(id, pageUrl, pageTitle, openInNewTab) {
		var centerPanel = Ext.getCmp("centerPanel");
		var shouldBeRemovedArr = this.getShouldBeRemovedArr(id, openInNewTab);
		var shouldBeRemovedIndex = parseInt(shouldBeRemovedArr[0]);
		var shouldBeRemovedTab = shouldBeRemovedArr[1];
		centerPanel.remove(shouldBeRemovedTab, true);
		var isClosable = true;
		if(shouldBeRemovedTab && shouldBeRemovedTab.closable) isClosable = shouldBeRemovedTab.closable;
		
		var szPanel= this.mkIframePanelo(id, pageTitle, pageUrl, isClosable);
		
		szPanel = centerPanel.insert(shouldBeRemovedIndex, szPanel);
		if (centerPanel.rendered) centerPanel.doLayout();
		centerPanel.setActiveTab(szPanel);
	},

	mkIframePanelo : function(id, title, url, isClosable) {
		if (typeof(isClosable) == "undefined") isClosable = true;
		
		return Ext.create('Erp.ux.MainIFrame', {
	        id: id,
	        src : url,
	        title: title,
	        closable: isClosable,
	        layout: 'fit'
		});
	},

	getShouldBeRemovedArr : function(tabId, openInNewTab) {
		var centerPanel = Ext.getCmp("centerPanel");
		var shouldBeRemovedArr = [];
		var allTabs = centerPanel.items;
		var allTabsLength = allTabs.length; 
		for (var ti = 0; ti < allTabsLength; ti ++) {
			var eachTab = allTabs.get(ti);
			if (eachTab.id == tabId) {
				shouldBeRemovedArr.push(ti);
				shouldBeRemovedArr.push(eachTab);
				break;
			}
		}
		if (shouldBeRemovedArr.length == 0) {
			if(openInNewTab === true) this.addTabFun();
			
			shouldBeRemovedArr.push(this.getActiveTabIndex());
			shouldBeRemovedArr.push(centerPanel.getActiveTab());
			return shouldBeRemovedArr;
		} else {
			return shouldBeRemovedArr;
		}
	},

	getActiveTabIndex : function() {
		var centerPanel = Ext.getCmp("centerPanel");
		var actiTab = centerPanel.getActiveTab();
		return this.getTabIndex(actiTab);
	},

	getTabIndex : function(theTab) {
		var centerPanel = Ext.getCmp("centerPanel");
		var theTabIndex = 0;	
		var allTabs = centerPanel.items;
		var allTabsLength = allTabs.length; 
		for (var ti = 0; ti < allTabsLength; ti ++) {
			var eachTab = allTabs.get(ti);
			if (eachTab.id == theTab.id) {
				theTabIndex = ti;
				break;
			}
		}
		return theTabIndex;
	},
	
	addTabFun : function() {
		var centerPanel = Ext.getCmp("centerPanel");
		this.indexTab ++;
		var newBoardTab = centerPanel.add({
	        id: 'newTab' + this.indexTab,
			title: PRes['addTab'],
			autoScroll: false,
			closable: true
		});
		if (centerPanel.rendered) centerPanel.doLayout();
		centerPanel.setActiveTab(newBoardTab);
	},

	switchGray : function(){
		this.changeColor('gray');
	},
	
	switchBlue : function(){
		this.changeColor('blue');
	},
	
	switchLanguageEs : function() {
		this.changeLanguage('zh');
	},

	switchLanguageEn : function() {
		this.changeLanguage('en');
	},

	
	
	logoutPage : function() {
		var me = this;
		this.isLogoff = true;
		Ext.MessageBox.confirm(PRes['Warning'], PRes['Com.Logoff'], 
			function(btn) {
				if('yes' == btn) {
					me.isLogoff = true;
					if(window.opener) {
						if (!window.opener.closed) {
							window.opener.location.href = '/app/logout';
							window.close();
						} else {
							location.href = '/app/logout';
						}
					} else {
						location.href = '/app/logout';
					}
				} else {
					me.isLogoff = false;
				}
			}
		);
	},

	helpSubject : function() {
		alert("Coming soon!");
	},
	helpSearch : function() {
		alert("Coming soon!");
	},
	helpAbout : function() {
		alert("Coming soon!");
	},

	addFormTab : function(tabId, tabTitle, tabUrl){
		var tabs = Ext.getCmp('centerPanel');
		
	  	tabs.add({
	   		id: tabId,
	   		title: tabTitle,
	   		autoLoad: {url: tabUrl, callback: this.initSearch, scope: this, scripts: true},
	   		closable: true
	  	});
	  	tabs.getLayout().setActiveItem(tabId);
	  	tabs.doLayout();
	  	
	  	return tabs.getItem(tabId);
	},

	updateFormTab : function(tabId, tabTitle, tabUrl) {  
		var tabs = Ext.getCmp('centerPanel'); 
		
	    var tab = tabs.getItem(tabId);   
	    if(tab){   
	    	tab.getUpdater().update(tabUrl);
	        tab.setTitle(tabTitle);   
	    }else{     
	        tab = this.addFormTab(tabId, tabTitle, tabUrl);
	    }
	       
	    tabs.setActiveTab(tab);   
	}, 

	onDispDesktopClick : function(){
//		this.showMainFramePage('dashboardId', '/app/core/ui/dashboard/show', PRes['dashboard'], false);
		this.showMainFramePage('dashboardId', '/app/gem/article/list/show', PRes['dashboard'], false);
	},

	onLogoutClick : function(item){ 
		if(window.opener) {
			try{
				window.opener.location.href = "../../../logoff.jsp";
				self.close();
			} catch(ex) {
				location.href="../../../logoff.jsp";
			}
		} else {
			location.href="../../../logoff.jsp";
		}
	},

	changeLanguage : function(lng) {
		location.href = '/app/core/ui/mainFrame?lang='+ lng;
	},

	changeColor : function(color) {
		location.href = '/app/core/ui/mainFrame?color=' + color;
	},
	
	launchCorporationSelector : function() {
		var me = this;
		var items = [];
		
		var corporationStore = Ext.create('Ext.data.Store', {
			model: 'cModel',
		    data: me.availableCorporationrray
		});
		
		items.push({xtype: 'combo',id : 'c', fieldLabel : PRes['company'], displayField : 'shortName', valueField : 'id', 
				store: corporationStore, queryMode: 'local', value: me.currentCorporationId, forceSelection : true
		});
		
		var form = Ext.create('Ext.form.Panel', {
	        border: false,
	        fieldDefaults: {
	            labelWidth: 70,
	            margin : '2 2 0 0'
	        },
	        defaultType: 'textfield',
	        bodyPadding: 5,
	        items: items
	    });

		var w = 100;
	    var win = Ext.create('Ext.window.Window', {
	        title: PRes['psc'], 
	        width: 300,
	        height:w,
	        layout: 'fit',
	        plain: true,
	        closeAction : 'destroy',
	        closable : false,
	        modal : true,
	        items: form,

	        buttons : [
            {
            	text : PRes['ok'], 
	        	handler: function() {
	        		if(Strings.isEmpty(CUtils.getSValue('c'))) {
	        			Ext.Msg.show({
	        				title: PRes['warning'],
	        			   	msg: PRes['ssc'],
	        			   	closable: false,
	        			   	buttons: Ext.Msg.OK,
	        				minWidth: 300,
	        			   	maxWidth: 700,
	        			   	icon: Ext.MessageBox.WARNING
	        			});
	        			return;
	        		}
	        		$('DEFAULT_OWNER_CORPORATION_KEY').value = CUtils.getSValue('c');
	        		
	        		me.isLogoff = true;
	        		document.forms[0].submit();
	        	}
            },{
            	text : PRes['cancel'], 
	        	handler: function() {
	        		win.close();
	        	}
            }]
	    });

		win.show();
	},

	isNewEmptyTab : function(tabId) {
		return tabId.indexOf('newTab') == 0;
	},
	
	tabchange_callback : function(request, response, params) {
	},
	modifyPassword : function() {
		var msgarray;
		var items = [{
	    	fieldLabel: PRes["NewPassword"], 
	    	id: 'plainPassword',
	    	inputId : 'plainPasswordInputId',
	    	inputType : 'password',
	    	name : 'plainPassword',
	    	xtype:'textfield',
	    	value : '',
	    	margins: '5 0 5 5',
	    	height : 20,
	    	width : 280
	    },{
	    	fieldLabel: PRes["ConfirmPassword"], 
	    	id: 'confirmPassword',
	    	inputId : 'confirmPasswordInputId',
	    	inputType : 'password',
	    	name : 'confirmPassword',
	    	xtype:'textfield',
	    	value : '',
	    	margins: '5 0 5 5',
	    	height : 20,
	    	width : 280
	    }];
		var me = this;
		if(!me.resetWin){
			me.resetWin= Ext.create('Ext.window.Window', {
				id : 'resetPasswordWin',
			    height: 125,
			    width: 350,
			    modal :  true,
			    closable : false,
			    layout:'vbox',
			    title : PRes["ResetPassword"],
			    items : items,
			    fbar: [{
			        	   type: 'button', 
			        	   text: PRes["ok"],
			        	   handler : function() {
			        		   msgarray = [];
			        		   var newPassword = Ext.getCmp('plainPassword').getValue();
			        		   var confirmPassword = Ext.getCmp('confirmPassword').getValue();
			        		   if(Strings.isEmpty(newPassword)){
			        			   msgarray.push({fieldname:'plainPasswordInputId', message:PRes["NewPasswordNotEmpty"], arg: null});
			        		   }
			        		   if(Strings.isEmpty(confirmPassword)){
			        			   msgarray.push({fieldname:'confirmPasswordInputId', message:PRes["ConfirmPasswordNotEmpty"], arg: null});
			        		   }
			        		   if(newPassword != confirmPassword){
			        			   msgarray.push({fieldname:'confirmPasswordInputId', message:PRes["PasswordNotSame"], arg: null});
			        		   }
			        		   if(msgarray.length > 0){
			        			   	VUtils.removeFieldErrorCls('plainPasswordInputId');
			   		    			VUtils.removeTooltip('plainPasswordInputId');
			   		    			VUtils.removeFieldErrorCls('confirmPasswordInputId');
			   		    			VUtils.removeTooltip('confirmPasswordInputId');
			   		    			VUtils.processValidateMessages(msgarray);
			        		   } else {
			        			   beginWaitCursor(PRes["Saving"],false);
				        		   Ext.Ajax.request({
			        				    url: '/app/pgm/ui/resetPassword',
			        				    params: {
			        				    	userId : $('currentUserId').value,
			        				    	plainPassword : newPassword
			        				    },
			        				    success: function(response) {
			        				    	endWaitCursor();
			        				    	CUtils.infoAlert(PRes["RestSuccess"]);
			        						Ext.getCmp('resetPasswordWin').hide();
			        				    }
				        		   });
			        		   }
			        	   }
			           }, {
			        	   type: 'button', 
			        	   text: PRes["cancel"],
			        	   handler : function(){
			        		   Ext.getCmp('resetPasswordWin').hide();
			        	   }
			    }]
			}).show();
		} else {
			if(!me.resetWin.isVisible()){
				VUtils.removeFieldErrorCls('plainPasswordInputId');
    			VUtils.removeTooltip('plainPasswordInputId');
    			VUtils.removeFieldErrorCls('confirmPasswordInputId');
    			VUtils.removeTooltip('confirmPasswordInputId');
				Ext.getCmp('plainPassword').setValue('');
     		   	Ext.getCmp('confirmPassword').setValue('');
				me.resetWin.show();
			}
		}
	},
});

Ext.define('Erp.ux.MainIFrame', {
	extend: 'Ext.Panel',
	alias: 'widget.mainiframe',
	src: 'about:blank',
	loadingText: 'Loading ...',
	initComponent: function(){
	  this.updateHTML();
	  this.callParent(arguments);
	},
	updateHTML: function() {
	  this.html='<iframe id="iframe-' + this.id + '"' + 
	      ' style="overflow:auto;width:100%;height:100%;"' +
	      ' frameborder="0" ' +
	      ' src="' + this.src + '"' +
	      '></iframe>';
	},
	reload: function() {
	  this.setSrc(this.src);
	},
	reset: function() {
	  var iframe=this.getDOM();
	  var iframeParent=iframe.parentNode;
	  if (iframe && iframeParent) {
	    iframe.src='about:blank';
	    iframe.parentNode.removeChild(iframe);
	  }
	 
	  iframe=document.createElement('iframe');
	  iframe.frameBorder=0;
	  iframe.src=this.src;
	  iframe.id='iframe-'+this.id;
	  iframe.style.overflow='auto';
	  iframe.style.width='100%';
	  iframe.style.height='100%';
	  iframeParent.appendChild(iframe);
	},
	setSrc: function(src, loadingText) {
	  this.src=src;
	  var iframe=this.getDOM();
	  if (iframe) {
	    iframe.src=src;
	  }
	},
	getSrc: function() {
	  return this.src;
	},
	getDOM: function() {
	  return document.getElementById('iframe-'+this.id);
	},
	getDocument: function() {
	  var iframe=this.getDOM();
	  iframe = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
	  return iframe.document;
	},
	destroy: function() {
	  var iframe=this.getDOM();
	  if (iframe && iframe.parentNode) {
	    iframe.src='about:blank';
	    iframe.parentNode.removeChild(iframe);
	  }
	  this.callParent(arguments);
	},
	update: function(content) {
	  this.setSrc('about:blank');
	  try {
	    var doc=this.getDocument();
	    doc.open();
	    doc.write(content);
	    doc.close();
	  } catch(err) {
	    // reset if any permission issues
	    this.reset();
	    var doc=this.getDocument();
	    doc.open();
	    doc.write(content);
	    doc.close();
	  }
	}
});