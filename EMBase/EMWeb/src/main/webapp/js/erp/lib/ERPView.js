Ext.define('ERP.View' ,{

	args : null,
	
	id : null,
	
	constructor : function(config) {
		Ext.apply(this , config);
	},	
	buildViewMenu : function(isFromList) {
		var _viewMenu = new Ext.menu.Menu();
		var arg;
		
		if (this.args.length == 1) 
			return {items: this.buildItems(this.args[0], isFromList)};
		
		for (var i = 0; i < this.args.length; i++) {
			arg = this.args[i];
			_viewMenu.add({
				id: arg.id,
			    text: arg.text,
			    iconCls : "ss_icon ss_page_gear",
			    menu: {items: this.buildItems(arg, isFromList)}
			});
		}
		
		return _viewMenu;
	},
	buildItems : function(arg, isFromList) {
		var items = this._buildViewMenuItem(arg, isFromList);
				
		return items;
	},
	handleView : function(arg, isFromList) {
		var me = this;
		if (isFromList && !me.tryInitParams(arg)) {
			CUtils.warningAlert("Please at least select one line to view");
			return;
		}		
		LUtils.showPrintView(arg);
	},
	_buildViewItem : function(arg, isFromList) {
		var me = this;
		var _menu = null;
		if(CUtils.isTrueVal(arg.isExcel)) {
			_menu = {
            	items : [{
            		text: 'Excel',
            		iconCls : "ss_icon ss_page_gear",
        			handler: function() {	    				
		   				arg.fileType = "xlsx";
		   				me.handleView(arg, isFromList);
	    			}
            	},{
            		text: 'Pdf',
            		iconCls : "ss_icon ss_page_gear",
        			handler: function() {	    				
		   				arg.fileType = "pdf";
		   				me.handleView(arg, isFromList);
	    			} 
            	}]
			};
		} else if (CUtils.isTrueVal(arg.isRawExcel)){
			_menu = {
		        	items : [{
		        		text: 'Excel(Raw Data)',
		        		iconCls : "ss_icon ss_page_gear",
		    			handler: function() {	    				
			   				arg.fileType = "raw_xlsx";
			   				arg.fileName = arg.fileName + "_raw";
			   				me.handleView(arg, isFromList);
		    			} 
		        	},{
		        		text: 'Pdf',
		        		iconCls : "ss_icon ss_page_gear",
		    			handler: function() {
		    				arg.fileType = "pdf";
			   				me.handleView(arg, isFromList);
		    			} 
		        	}]
				};
		} else if (arg.isAllExcel){
			_menu = {
		        	items : [{
		        		text: 'Excel(Raw Data)',
		        		iconCls : "ss_icon ss_page_gear",
		    			handler: function() {	    				
			   				arg.fileType = "raw_xlsx";
			   				arg.fileName = arg.fileName + "_raw";
			   				me.handleView(arg, isFromList);
		    			} 
		        	},{
		        		text: 'Excel',
		        		iconCls : "ss_icon ss_page_gear",
		    			handler: function() {	    				
			   				arg.fileType = "xlsx";
			   				me.handleView(arg, isFromList);
		    			} 
		        	},{
		        		text: 'Pdf',
		        		iconCls : "ss_icon ss_page_gear",
		    			handler: function() {
		    				arg.fileType = "pdf";
			   				me.handleView(arg, isFromList);
		    			} 
		        	}]
				};
		}
		return _menu;
	},
	_buildViewMenuItem: function(arg, isFromList) {
		var me = this;
		return [{
		   id : arg.id + '_view',
		   iconCls : 'ss_sprite ss_accept',
		   text : "View",
		   menu : me._buildViewItem(arg, isFromList),
		   handler: function() {
			   if (isFromList && !me.tryInitParams(arg)) {
				   	return;
			   }
               LUtils.showPrintView(arg);
           }
		}];
	},
	tryInitParams: function(arg) {
	   	var record = this._getSelectRecord(arg.gridId);
	   	if (!record) {
	   		if(arg.selectLineMsg && !Strings.isEmpty(arg.selectLineMsg)) {
				CUtils.warningAlert(arg.selectLineMsg);
			}
			return false;
	   	}
	   	if(CUtils.isTrueVal(record.get("isFromTO")) || CUtils.isTrueVal(arg.isFromTO))  {
	   	   	if(arg.toValidateMsg && !Strings.isEmpty(arg.toValidateMsg)) {
				CUtils.warningAlert(arg.toValidateMsg);
			}
	   	   	return false;	
	   	}
	   	this._initJasperParams(arg, record);
	   	return true;
    },
	_getSelectRecord: function(gridId) {
		gridId = gridId || G_CONFIG;
		return GUtils.getSelected(Ext.getCmp(gridId));
	},
	_initJasperParams: function(arg, record) {
		if (!arg.jasperParams) arg.jasperParams = {};
		if (CUtils.isTrueVal(arg.isDocumentInquiry)) {
		   arg.jasperParams.id = record.get("headerId");
		   arg.jasperParams.ID = record.get("headerId");
		} else {
		   arg.jasperParams.id = record.get("id");
		   arg.jasperParams.ID = record.get("id");
		}
		arg.jasperParams.isCom = record.get("isFromComSO") || "";	
		arg.jasperParams.soSEId = record.get("refDocumentSourceId") || "";	
		arg.jasperParams.soShipToId = record.get("shipToId") || "";	
		arg.local = record.get("languageLocale") || "";
		arg.vendorSEId = record.get("vendorSEId") || "";
		arg.customerSEId = record.get("customerSEId") || "";
		if(CUtils.isTrueVal(arg.isBOL)) {
			this._initBOLJasperParams(arg, record);
		}
	},
	_initBOLJasperParams: function(arg, record) {		
		if(!CUtils.isTrueVal(arg.isView)) {
			arg.fileName = "steel_so_bol_test_certificate_report_subreport";			
		}
		arg.jasperParams.isManual = record.get("isManualBOL") || "";
	},	
	viewBtn : function(){
		return new Ext.Button({
			text : PRes["view"],
			iconCls : 'ss_sprite ss_accept',
			menu : this.buildViewMenu(false),
			scope : this,
			disabled : this.isDisabled()
		});
	},	
	viewBtnGrid : function(){
		return new Ext.Button({
			text : PRes["view"],
			iconCls : 'ss_sprite ss_accept',
			menu : this.buildViewMenu(true),
			scope : this
		});
	},
	isDisabled : function() {
		return typeof(PAction) != 'undefined' && typeof(PAction.isNew) == "function" && PAction.isNew();
	}
});