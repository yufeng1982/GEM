//////////////////////////////////////////
Ext.namespace('Ext.ux.form');

Ext.ux.form.BrowseField = Ext.extend(Ext.form.TriggerField, {
	dataIndex : "",
	triggerClass : 'x-form-browswbtn-trigger',
	fieldClass : 'x-form-browswbtn-field',

	onResize : function(w, h){
    /*
    	Ext.form.TriggerField.superclass.onResize.call(this, w, h);
    	if(typeof w == 'number'){
    		this.el.setStyle("marginLeft", (this.adjustWidth('input', w - this.trigger.getWidth() -1)) + "px");
    	}
    	this.wrap.setWidth(this.el.getMargins("l") + 1 +this.trigger.getWidth());
    */	
    	Ext.form.TriggerField.superclass.onResize.call(this, w, h);
        var tw = this.getTriggerWidth();
        var fc = Ext.isIE ? 0:10 ;
        if(Ext.isNumber(w)){
            //this.el.setWidth(0);
            this.el.setStyle("visibility","hidden");
            this.el.setStyle("marginLeft", ( w - tw -1 -fc) + "px");
        }
        this.wrap.setWidth(this.el.getMargins("l") + 1 + tw + fc);
	}
}); 

Ext.ux.form.TBrowseField = Ext.extend(Ext.form.TwinTriggerField, {
	dataIndex : "",
	trigger1Class : 'x-form-browswbtn-trigger',
	trigger2Class : 'x-form-clearbtn-trigger',
	fieldClass : 'x-form-browswbtn-field',

	onResize : function(w, h) {
		
		Ext.form.TriggerField.superclass.onResize.call(this, w, h);
        var tw = this.getTriggerWidth();
        var fc = Ext.isIE ? 0:10 ;
        if(Ext.isNumber(w)){
            //this.el.setWidth(0);
            //this.el.setStyle("visibility","hidden");
            this.el.setStyle("marginLeft", ( w - tw -1 -fc) + "px");
        }
        this.wrap.setWidth(this.el.getMargins("l") + 1 + tw + fc);
	}
});

// Add the additional 'advanced' VTypes -- [Begin]
Ext.apply(Ext.form.VTypes, {
	daterange : function(val, field) {
		var date = field.parseDate(val); 
		if(!date){
			return;
		}
		if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
			var start = getDateFieldCmp(field.startDateField);
			start.setMaxValue(date);
			start.validate();
			this.dateRangeMax = date;
		} 
		else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
			var end = getDateFieldCmp(field.endDateField);
			end.setMinValue(date);
			end.validate();
			this.dateRangeMin = date;
		}
		/*
		 * Always return true since we're only using this vtype to set the
		 * min/max allowed values (these are tested for after the vtype test)
		 */
		return true;
	}
});

// Add the additional 'advanced' VTypes -- [End]


Ext.namespace('ERP.ui');

Ext.StatusBar = Ext.extend(Ext.Toolbar, {

		cls : 'x-statusbar',

		busyIconCls : 'x-status-busy',

		busyText : 'Loading...',

		autoClear : 5000,

		// private
		activeThreadId : 0,

		// private
		initComponent : function() {
			if (this.statusAlign == 'right') {
				this.cls += ' x-status-right';
			}
			Ext.StatusBar.superclass.initComponent.call(this);
		},

		// private
		afterRender : function() {
			Ext.StatusBar.superclass.afterRender.call(this);
		},

		setStatus : function(o) {
			o = o || {};

			if (typeof o == 'string') {
				o = {
					text : o
				};
			}
			if (o.text !== undefined) {
				this.setText(o.text);
			}
			if (o.iconCls !== undefined) {
				this.setIcon(o.iconCls);
			}

			if (o.clear) {
				var c = o.clear, wait = this.autoClear, defaults = {
					useDefaults : true,
					anim : true
				};

				if (typeof c == 'object') {
					c = Ext.applyIf(c, defaults);
					if (c.wait) {
						wait = c.wait;
					}
				} else if (typeof c == 'number') {
					wait = c;
					c = defaults;
				} else if (typeof c == 'boolean') {
					c = defaults;
				}

				c.threadId = this.activeThreadId;
				this.clearStatus.defer(wait, this, [ c ]);
			}
			return this;
		},

		clearStatus : function(o) {
			o = o || {};

			if (o.threadId && o.threadId !== this.activeThreadId) {
				// this means the current call was made internally,
				// but a newer
				// thread has set a message since this call was
				// deferred. Since
				// we don't want to overwrite a newer message just
				// ignore.
				return this;
			}

			var text = o.useDefaults ? this.defaultText : '', iconCls = o.useDefaults ? (this.defaultIconCls ? this.defaultIconCls
					: '')
					: '';

			if (o.anim) {
				this.statusEl.fadeOut( {
					remove : false,
					useDisplay : true,
					scope : this,
					callback : function() {
						this.setStatus( {
							text : text,
							iconCls : iconCls
						});
						this.statusEl.show();
					}
				});
			} else {
				// hide/show the el to avoid jumpy text or icon
				this.statusEl.hide();
				this.setStatus( {
					text : text,
					iconCls : iconCls
				});
				this.statusEl.show();
			}
			return this;
		},

		setText : function(text) {
			this.activeThreadId++;
			this.text = text || '';
			if (this.rendered) {
				this.statusEl.update(this.text);
			}
			return this;
		},

		getText : function() {
			return this.text;
		},

		setIcon : function(cls) {
			this.activeThreadId++;
			cls = cls || '';

			if (this.rendered) {
				if (this.currIconCls) {
					this.statusEl.removeClass(this.currIconCls);
					this.currIconCls = null;
				}
				if (cls.length > 0) {
					this.statusEl.addClass(cls);
					this.currIconCls = cls;
				}
			} else {
				this.currIconCls = cls;
			}
			return this;
		},

		showBusy : function(o) {
			if (typeof o == 'string') {
				o = {
					text : o
				};
			}
			o = Ext.applyIf(o || {}, {
				text : this.busyText,
				iconCls : this.busyIconCls
			});
			return this.setStatus(o);
		},

		nextBlock : function() {
			var td = document.createElement("td");
			this.tr.appendChild(td);
			return td;
		},

		onRender : function(ct, position) {
			if (!this.el) {
				if (!this.autoCreate) {
					this.autoCreate = {
						cls : this.toolbarCls + ' x-small-editor'
					}
				}
				this.el = ct.createChild(Ext.apply( {
					id : this.id
				}, this.autoCreate), position);
			}

		},

		onLayout : function(ct, target) {
			Ext.StatusBar.superclass.onLayout
					.call(this, ct, target);

			if (!this.tr) {
				this.tr = this.getLayout().leftTr

				var right = this.statusAlign == 'right', td = Ext
						.get(this.nextBlock());
				if (right) {
					this.getLayout().rightTr.appendChild(td.dom);
				} else {
					td.insertBefore(this.tr.firstChild);
				}

				this.statusEl = td.createChild( {
					cls : 'x-status-text ' + (this.iconCls
							|| this.defaultIconCls || ''),
					html : this.text || this.defaultText || ''
				});
				this.statusEl.unselectable();

				this.spacerEl = td.insertSibling( {
					tag : 'td',
					style : 'width:100%',
					cn : [ {
						cls : 'ytb-spacer'
					} ]
				}, right ? 'before' : 'after');
			}

		}
	});
Ext.reg('statusbar', Ext.StatusBar);

var sideAttatchmentConfig = {};
ERP.ui.SideAttatchment  = function(config) {
	
	//initAttachmentWin(config);
	sideAttatchmentConfig = config;
	
	var menu = new Ext.menu.Menu( {
		items : [{
			text : 'New',
			handler : _create_attatchment
		}, {
			text : 'Delete',
			handler : _delete_attatchment
		} ,{
			text : 'Edit',
			handler : _edit_attachment
		}]
	});
	
//	getPrimaryImage(config);
	getPrimaryImage();
	
	var store = new Ext.data.JsonStore( {
		url : '/erp/'+$('APP_NAME').value+'/resource/list/json',
		root : 'data',
		autoLoad : true,
		baseParams : {
			ownerShipSourceEntityId : $F('ownerShipSourceEntityId')
		},
		fields : [ 'id', 'type', 'typeCode', 'name', 'contentType' , 'contentTypeCode' ,'description' ,'comment' , 'primary' , 'createdBy', 'creationDate','url','size','sourceEntityId']
	});

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="x-note-thumb-wrap">',
			'<div class="x-date">File Name : {name}</div>',
			'<div class="x-date">File Type : {type}</div>',
			'<div class="x-date">Created By : {createdBy}</div>',
			'<div class="x-date"> Date: {creationDate}</div>',
			'<div class="x-date"> Size: {size} (KB)</div>',
			'<div><a href="#" onclick="_download_attachment(\'{id}\')">download</a></div>',
			'</div>',
			'</tpl>', '<div class="x-clear"></div>');
	
	var dataview = new Ext.DataView( {
		id : 'dataview_attatchment',
		store : store,
		tpl : tpl,
		// height: 100,
		autoHeight : true,
		multiSelect : false,
		singleSelect : true,
		overClass : 'x-view-over',
		itemSelector : 'div.x-note-thumb-wrap',
		emptyText : 'No Records to Display',
		listeners : {
			'dblclick' : {
				fn : _edit_attachment
			}
		}
		
	});
	
	initImageWin(config);
	
	var portlet = new Ext.ux.Portlet(
			{
				id : 'attatchment_portlet',
				title : ss_icon('ss_folder_picture') + (config.imagePanel ? 'Images & Attachments' : 'Attachments'),
				draggable : {
					ddGroup : 'sideportal'
				},
				layout : 'anchor',
				// autoHeight:true,
				height : 'auto',
				collapseFirst : false,
				tools : [ {
					id : 'gear',
					qtip : 'actions',
					// hidden:true,
					handler : function(event, toolEl, panel) {
						menu.show(toolEl, 'tr-br?');
					}
				} ],
				items : [
						{
							height : 20,
							html : '<a href="#" id="create_attachment" onclick="_create_attatchment()">click here to create a new attachment</a>'
						},
						{
							html :'<div id="divImage"></div>'
						},
						dataview ]
			});
	return portlet;
};

Ext.reg('erpsideattatchment', ERP.ui.SideAttatchment);

var attachmentWin = null;
var imageWin = null;

function initAttachmentWin(config){

	attachmentWin = new ERP.ui.ResourceUploadWindow(
		Ext.apply({
			id: 'attachment_window',
			//closeAction: 'hide',
			width:400,
			ownerShipSourceEntityId : $F("ownerShipSourceEntityId"),
			//hidden:true,
			success: function(cmp){
				create_attachment_callBack(cmp);
			}
		},config));
	attachmentWin.show();
}

function getPrimaryImage(){
	var config = sideAttatchmentConfig;
	var imgTpl = new Ext.XTemplate(
			'<tpl><center><div><img id="sideImage" src={url} width="150" height="150" onclick="view_images()"></img></div></center></tpl>'
	);
	
	if(CUtils.isTrueVal(config.imagePanel)){
		Ext.Ajax.request({
			url : '/erp/' + $F('APP_NAME') + '/resource/primaryPic',
			params :{
				ownerShipSourceEntityId:$F('ownerShipSourceEntityId')
			},
			method : 'GET',
			success : function(response) {
				var obj = Ext.decode(response.responseText);
				if(!Strings.isEmpty(obj.url)){
					imgTpl.overwrite($("divImage"), obj);
					var image = $("sideImage");
					image.onLoad = resizeImage(image);
					image.src = obj.url;
					if($("divImage")) {//be careful, if side bar is hidden, divImage is null, and it will throw js error
						$("divImage").style.display = "block";
					}
				}else{
					if($("divImage")) {
						$("divImage").style.display = "none";
					}
				}
			}
		});
	}
}


function _download_attachment(id){
	location.href = "/erp/" + $F("APP_NAME") + "/resource/download/"+id;

}

function _delete_attatchment() {
	var dataview =  Ext.getCmp('dataview_attatchment');
	
	if(!dataview) return;
	
	var selected = dataview.getSelectedIndexes();
	if (selected) {
		var record = dataview.getStore().getAt(selected[0]);
		
		if(record){
			
			var sourceEntityId = record.get("sourceEntityId");
			
			if(sourceEntityId != $F("ownerShipSourceEntityId") ){
				Ext.Msg.alert("warning" , "cannot delete it from here");
				return;
			}
			
			Ext.Ajax.request({
				url : '/erp/' + $F('APP_NAME') + '/resource/delete/' + record.get("id"),
				
				success : function(response) {
					var dataview = Ext.getCmp("dataview_attatchment");
					if(dataview && dataview.store){
						dataview.store.reload();
					}
//					var config = {imagePanel : true};
					getPrimaryImage();
				}
			});
		}
		
	}
}
function _create_attatchment(){
	//attachmentWin.form.getForm().reset();
	initAttachmentWin({action:'create'});
	var cmp = Ext.getCmp("cmp_type");
	cmp.enable();
	
//	cmp = Ext.getCmp("form-file-button");
//	cmp.enable();
	
	
	
}
function create_attachment_callBack(win){
	var cmp = Ext.getCmp("dataview_attatchment");
	if(cmp && cmp.store){
		cmp.store.reload();
	}
//	getPrimaryImage({ownerShipSourceEntityId : $F('ownerShipSourceEntityId'),imagePanel : true});
	getPrimaryImage();
}
ERP.ui.ResourceUploadWindow = Ext.extend(Ext.Window,{

    constructor: function(config){
	
        this._field_FileUpload = new Ext.form.FileUploadField({
            id: 'form-file',
            fieldLabel: 'File',
            vtype:'attachment',
            fileTypeFiled : 'cmp_type',
            name: 'file',
            buttonCfg: {
                text: 'Browse',
                iconCls: 'icon-upload'
            },
            allowBlank: false
        });
       
        this._resourceTypeStore = new Ext.data.JsonStore({
    		url : "/erp/${APP_NAME}/resource/fileType/json",
    		root : 'data',
    		fields : [{name:'code'}, {name:'text'}],
    		autoLoad :true
        });
        
        this._contentTypeStore = new Ext.data.JsonStore({
        	url : "/erp/${APP_NAME}/resource/contentType/json",
    		root : 'data',
    		fields :  [{name:'code'}, {name:'text'}],
    		autoLoad :true
        });
        
        
        this.form = new Ext.form.FormPanel({
            
        	url: "/erp/"+ $F("APP_NAME") +"/resource/ok",
        	myFileUploadDialog: this,
            fileUpload: true,
            method: 'POST',
            labelWidth: 125,
            autoHeight: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            frame: true,
            defaults: {
        		anchor: '95%',
        		msgTarget: 'side',
                allowBlank: false
            },
            baseCls: '',
            items: [{
            	id:"cmp_id",
            	name: 'id',
        		xtype: 'hidden'
           	},{
           		id:"cmp_name",
           		fieldLabel: 'Name',
        		name: 'name',
        		xtype: 'textfield',
        		width : 220
           	},
           	sideAttatchmentConfig.imagePanel ?  
           	{
           		id:"cmp_type",
           		disabled : !sideAttatchmentConfig.imagePanel ,
           		fieldLabel: 'File Type',
        		name: 'typeText',
        		xtype : 'combo',
        		hiddenName : 'type',
        		store : this._resourceTypeStore,
        		displayField: 'text',
        	    valueField: 'code',
        	    typeAhead: true,
                editable: false,
                triggerAction: 'all',
        		width : 220,
        		listeners : {
           		'select': function(/*Ext.form.ComboBox */ combo,/* Ext.data.Record */ record,/* Number*/ index ){
		           		var newValue = record.get("code");
           				var primary = Ext.getCmp("cmp_primary");
		           		var contentType = Ext.getCmp("cmp_contentType");
		           		if(newValue == "IMAGE"){
		           			contentType.disable();
		           			primary.enable();
		           			contentType.setValue("IMAGE");
		           		}else{
		           			contentType.enable();
		           			primary.disable();
		           			primary.setValue(false);
		           			contentType.setValue(null);
		           		}
	           		}
           		}
           	} : {
           		id:"cmp_type",
            	name: 'type',
        		xtype: 'hidden',
        		value : 'BINARY_FILE'
           	},{
           		id:"cmp_contentType",
           		fieldLabel: 'Content Type',
        		name: 'contentTypeText',
        		store : this._contentTypeStore,
        		xtype : 'combo',
        		hiddenName : 'contentType',
        		displayField: 'text',
        	    valueField: 'code',
        	    typeAhead: true,
                editable: false,
                triggerAction: 'all',
        		width : 220
        		
           	},{
           		id:"cmp_primary",
           		fieldLabel: 'Primary',
        		name: 'primary',
        		disabled:true,
        		xtype : 'checkbox',
        		width : 220
           	},{
           		id:"cmp_description",
           		fieldLabel: 'Description',
        		name: 'description',
        		xtype: 'textfield',
        		allowBlank:true,
        		width : 220
           	},
           		config.action == 'create' ? this._field_FileUpload : {xtype: 'hidden'}
           	,{
           		id:"cmp_comment",
           		fieldLabel: 'Comment',
        		name: 'comment',
        		xtype : 'textarea',
        		allowBlank:true,
        		width : 220
        			
           	},{
        		name: 'ownerShipSourceEntityId',
        		xtype : 'hidden',
        		value : config.ownerShipSourceEntityId
        			
           	}]
        });
        var btnCancel = new Ext.Button({
            text: 'Cancel',
            scope: this,
            iconCls : 'ss_sprite ss_cancel',
            handler: function () {
                this.close();
            }
        });
        var btnSubmit = new Ext.Action({
            text: 'OK',
            myForm: this.form,
            myFileUploadDialog: this,
            iconCls : 'ss_sprite ss_accept',
            handler: function () {
        		if(this.myForm.getForm().isValid()){
        			var ownerShipSourceEntityId = this.myForm.getForm().findField("ownerShipSourceEntityId").getValue();
        			if(Strings.isEmpty(ownerShipSourceEntityId)){
        				Ext.Msg.alert("Warning",sideAttatchmentConfig["notSaveMessage"]);
        				return;
        			}
        			Ext.getCmp("cmp_primary").enable();
        			Ext.getCmp("cmp_contentType").enable();
        			Ext.getCmp("cmp_type").enable();
        			
        			this.myForm.getForm().submit({
	                    waitMsg: 'Uploading...',
	                    url: this.myForm.url,
	                    method: "POST",
	                    success: function (form, action) {
	                        if (form.myFileUploadDialog.success) {
	                            form.myFileUploadDialog.success(form.myFileUploadDialog);
	                        };
	                        form.myFileUploadDialog.close();
	                    },
	                    failure: function (form, action) {
	                        Ext.Msg.show({
	                            title: 'FileUpload Error',
	                            msg: 'There has been a file upload error, please ensure that you have selected a file to upload and that the file is of the correct type',
	                            maxWidth: 800,
	                            height: 400
	                        });
	                    }
	                });
	        	}
            }
        });
        ERP.ui.ResourceUploadWindow.superclass.constructor.call(this, Ext.apply({
            width: 500,
            //height: 150,
            modal: true,
            items: this.form,
            buttons: [btnCancel, btnSubmit]
        }, config));
    }

});



function _edit_attachment(){
	var dataview = Ext.getCmp('dataview_attatchment');
	var store = dataview.getStore();
	var selected = dataview.getSelectedIndexes();
	if (selected.length) {
		initAttachmentWin({action:'edit'});
		var record = store.getAt(selected[0]);
		loadDataToForm( record );
	}
}

function loadDataToForm(record){
	var cmp = Ext.getCmp("cmp_id");
	var value = record.get("id");
	cmp.setValue(value);
	
	var cmp = Ext.getCmp("cmp_name");
	var value = record.get("name");
	cmp.setValue(value);
	
	cmp = Ext.getCmp("cmp_type");
	value = record.get("typeCode");
	cmp.setValue(value);
	cmp.disable();
	
	cmp = Ext.getCmp("cmp_contentType");
	value = record.get("contentTypeCode");
	cmp.setValue(value);
	cmp.disable();
	
	cmp = Ext.getCmp("cmp_description");
	value = record.get("description");
	cmp.setValue(value);
	
	cmp = Ext.getCmp("cmp_comment");
	value = record.get("comment");
	cmp.setValue(value);
	
	cmp = Ext.getCmp("cmp_primary");
	value = record.get("primary");
	cmp.setValue(value);
	
	if(record.get("typeCode") == "IMAGE"){
		cmp.enable();
	}else{
		cmp.disable();
	}
	

}

var chooser ;
function initImageWin(config){
	if(!chooser){
		chooser = new ImageChooser({
			width:800,
			height:600
		});
	}
}

function view_images(){
	
	chooser.show();
}

ERP.ui.FileUploadDialog = Ext.extend(Ext.Window, {
    constructor: function(config){
        this._field_FileUpload = new Ext.form.FileUploadField({
            id: 'form-file',
            fieldLabel: 'File',
            name: 'file-path',
            vtype: config['validateType'] || null,
            buttonCfg: {
                text: 'Browse',
                iconCls: 'icon-upload'
            },
            allowBlank: false
        });
        this.form = new Ext.form.FormPanel({
            myFileUploadDialog: this,
            fileUpload: true,
            method: 'POST',
            labelWidth: 50,
            autoHeight: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            frame: true,
            defaults: {
        		anchor: '95%',
        		msgTarget: 'side',
                allowBlank: false
            },
            baseCls: '',
            items: [this._field_FileUpload]
        });
        var btnCancel = new Ext.Button({
            text: 'Cancel',
            scope: this,
            handler: function () {
                this.hide();
            }
        });
        var btnSubmit = new Ext.Action({
            text: 'Upload',
            myForm: this.form,
            myFileUploadDialog: this,
            handler: function () {
	        	if(this.myForm.getForm().isValid()){
	        		this.myForm.getForm().submit({
	                    waitMsg: 'Uploading...',
	                    url: this.myFileUploadDialog.url,
	                    params: this.myFileUploadDialog.params,
	                    success: function (form, action) {
	                        if (form.myFileUploadDialog.success) {
	                            form.myFileUploadDialog.success(form.myFileUploadDialog, action);
	                        };
	                    },
	                    failure: function (form, action) {
	                    	if(form.myFileUploadDialog.failure){
	                    		form.myFileUploadDialog.failure(form.myFileUploadDialog, action);
	                    	}else{
	                    		Ext.Msg.show({
		                            title: 'FileUpload Error',
		                            msg: 'There has been a file upload error, please ensure that you have selected a file to upload and that the file is of the correct type',
		                            maxWidth: 800,
		                            height: 400
		                        });
	                    	}
	                    }
	                });
	        	}
            }
        });
        ERP.ui.FileUploadDialog.superclass.constructor.call(this, Ext.apply({
            width: 500,
            //height: 150,
            modal: true,
            items: this.form,
            buttons: [btnCancel, btnSubmit]
        }, config));
    }
});

Ext.apply(Ext.form.VTypes,{
	excelImport : function(val){
		val = val.replace(/^\s|\s$/g, ""); //trims string
		if (val.match(/([^\/\\]+)\.(xls|xlsx)$/i) ){
			return true;
		}
		return false;
	},
	excelImportText: 'Must be a valid excel: xls, xlsx',
	
	image:  function(v) {
        v = v.replace(/^\s|\s$/g, ""); //trims string
        if (v.match(/([^\/\\]+)\.(gif|png|jpg|jpeg)$/i) )
            return true;
        else
            return false;
    },
    imageText: 'Must be a valid image: gif,jpg,png,jpeg',
    
    attachment: function(v , field , idField){
    	 if (field.fileTypeFiled) {
             var fileType = Ext.getCmp(field.fileTypeFiled).getValue();
             if(fileType == "IMAGE"){
            	 return this.image(v);
             }else{
            	 return true;
             }
             return (val == pwd.getValue());
         }
    	return true;
    },
    attachmentText :  'Must be a valid image: gif,jpg,png,jpeg',
    
    gridColumnUnique: function(v, field){
    	if(field.gridName && field.fieldColumnName){
    		var grid = Ext.getCmp(field.gridName);
    		var store = grid.getStore();
    		var records = store.getRange();
    		
    		if(field.validateOnSave){
    			var values = [];
    			for(var i=0;i<records.length;i++){
    				var record = records[i];
    				values.push(record.get(field.fieldColumnName));
    			}
    			var count = 0;
    			for(var i=0;i<values.length;i++){
    				if(values[i] == v) count++;
    				if(count > 1) return false;
    			}
    		}else{
				var record = grid.getSelectionModel().getSelected();
				if(record){
					for(var i=0;i<records.length;i++){
						if(records[i].id == record.id)continue;
    					if(records[i].get(field.fieldColumnName)==v){
    						return false;
    					}
					}
				}
				
			}
    		field.validateOnSave = false;//reset to false
    	}
    	return true;
    },
    gridColumnUniqueText: 'This column value must be unique'
    	
});

Ext.namespace('Ext.ux.plugins');
/**
 * EditorGrid validation plugin
 * Adds validation functions to the grid
 *
 * Usage: 
 * grid = new Ext.grid.EditorGrid({plugins:new Ext.ux.plugins.GridValidator(), ...})
 */
Ext.ux.plugins.GridValidator = Ext.extend(Ext.util.Observable, {
	
	constructor: function(config){
	    Ext.apply(this, config);
	    Ext.ux.plugins.GridValidator.superclass.constructor.call(this);
	},

    // initialize plugin
    init: function(grid) {
		this.grid = grid;
    }, // end of function init
    /**
     * Checks if a grid cell is valid
     * @param {Integer} col Cell column index
     * @param {Integer} row Cell row index
     * @return {Boolean} true = valid, false = invalid
     */
    isCellValid:function(col, row) {
    	var grid = this.grid;
        if(!grid.colModel.isCellEditable(col, row)) {
            return true;
        }
        var ed = grid.colModel.getCellEditor(col, row);
        if(!ed) {
            return true;
        }
        var record = grid.store.getAt(row);
        if(!record) {
            return true;
        }
        var field = grid.colModel.getDataIndex(col);
        var xtype = ed.field.getXType();
        //only support textfield and numberfield
        if(xtype && (xtype == 'textfield' || xtype == 'numberfield')){
        	ed.field.setValue(record.data[field]);
            ed.field.validateOnSave = true;
            return ed.field.isValid();
        }
        return true;
    }, // end of function isCellValid
    /**
     * Checks if grid has valid data
     * @param {Boolean} editInvalid true to automatically start editing of the first invalid cell
     * @return {Boolean} true = valid, false = invalid
     */
    isValid:function(editInvalid) {
    	var grid = this.grid;
        var cols = grid.colModel.getColumnCount();
        var rows = grid.store.getCount();
        var r, c;
        var valid = true;
        for(r = 0; r < rows; r++) {
            for(c = 0; c < cols; c++) {
                valid = this.isCellValid(c, r);
                if(!valid) {
                    break;
                }
            }
            if(!valid) {
                break;
            }
        }
        if(editInvalid && !valid) {
        	grid.startEditing(r, c);
        }
        return valid;
    } // end of function isValid
}); // GridValidator plugin end 

ERP.ui.SideCredit = function(config) {
	var store = new Ext.data.JsonStore( {
		url : '/erp/'+$('APP_NAME').value+'/crm/creditLimit/json',
		root : 'data',
		fields: ['CustomerAccounting', 'CorporateAccounting', 'Aging']
	});

	//store.load(config);

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="sideBarLine">',
			'<div class="sideBarLineLeft">{Aging}</div>',
			'<div class="sideBarLineRight">{CustomerAccounting}</div></div>',
			'</tpl>');

	var dataview = new Ext.DataView( {
		id : 'dataview_credit',
		store : store,
		tpl : tpl,
		// height: 100,
		autoHeight : true,
		multiSelect : false,
		singleSelect : false,
		itemSelector : 'div.sideBarLine',
		emptyText : ''
	});

	var credit = new Ext.ux.Portlet(
			{
				id : 'credit_portlet',
				title : ss_icon('ss_creditcards') + 'Credit Info',
				draggable : {
					ddGroup : 'sideportal'
				},
				layout : 'anchor',
				// autoHeight:true,
				height : 'auto',
				collapseFirst : false,
				items : [
						{
							height : 20,
							hidden : true,
							html : '<a href="#" onclick="_show_credit()">click here to create a new note</a>'
						}, dataview ]
			});
	credit.get_customer_credit = function(config){
		//Ext.getCmp('credit_portlet').doLayout();
		if(config.isCreditInquiry) {
			store.proxy.conn.url = '/erp/'+$('APP_NAME').value+'/crm/creditLimit/calcAgingPeriod';
		} else {
			store.proxy.conn.url = '/erp/'+$('APP_NAME').value+'/crm/creditLimit/json';
		}
		store.load({params:config});
	};
	return credit;
};
Ext.reg('erpsidecredit', ERP.ui.SideCredit);

