Ext.define('ERP.SideAttatchment' ,{
	
	selected : null, 
	
	menu : null,
	
	dataview : null,
	
	store : null,
	
	sideAttatchmentConfig : null,
	
	imageViewer : null,
	
	statics : {
		_reloadDataView : function(){
			var cmp = Ext.getCmp("dataview_attatchment");
			if(cmp && cmp.store){
				cmp.store.load({callback: function(records, operation, success) {
					Ext.getCmp('attatchment_portlet').doLayout();
			    }});
			}
		},
		_create_attatchment : function(){
			sideAttatchmentConfig.action = 'create';
			this.attachmentWin = new ERP.ResourceUploadWindow(
						Ext.apply({
							width:400
						},sideAttatchmentConfig));
			this.attachmentWin.show();
			var cmp = Ext.getCmp("cmp_resource_type");
			cmp.enable();
		},
		
		_download_attachment : function(id){
			location.href = "/app/" + $F("APP_NAME") + "/resource/download/"+id;
		},
		
		_viewImage : function (){
			if(this.imageViewer == null){
				this.imageViewer = new ERP.ImageViewer(Ext.apply({
					width:800,
					height:600
				},sideAttatchmentConfig));
			}
			this.imageViewer.showViewer();
		}
	},
	
	constructor : function(config){
		
		var me = this;
		
		sideAttatchmentConfig = config;
		
		this.menu = this._buildMenu();
		this.store = this._buildStore(config);
		this.dataview = this._buildDataview(this.store, this.tpl);
		
		var portlet = new ERP.ui.Portlet(
				{
					id : 'attatchment_portlet',
					title : ss_icon('ss_folder_picture') + 'Attachments',
					layout : 'anchor',
					tools : [ {
						type : 'gear',
						handler : function(event, toolEl, panel) {
							me.menu.showBy(toolEl);
						}
					} ],
					items : [
							{
								height : 20,
								html : '<a href="#" id="create_attachment" onclick="ERP.SideAttatchment._create_attatchment();">create a new attachment</a>'
							},
							{
								html :'<div id="divImage"></div>'
							},
							this.dataview ]
				});
		
		this._getPrimaryImage(config);
		
		return portlet;
	},
	
	_buildMenu : function(){
		var me = this;
		return new Ext.menu.Menu( {
			items : [{
				text : 'New',
				handler : function() {
					ERP.SideAttatchment._create_attatchment();
				}
			}, {
				text : 'Delete',
				handler : function(){
					me._delete_attatchment();
				}
			} ,{
				text : 'Edit',
				handler : function(){
					me._edit_attachment();
				}
			}]
		});
	},
	
	_getPrimaryImage : function(config){
		var imgTpl = new Ext.XTemplate(
				'<tpl><center><div><img id="sideImage" src={url} width="150" height="150" onclick="ERP.SideAttatchment._viewImage();"></img></div></center></tpl>'
		);
		
		if(CUtils.isTrueVal(config.imagePanel)){
			Ext.Ajax.request({
				url : '/app/' + $F('APP_NAME') + '/resource/primaryPic',
				params :{
					ownerType : config.ownerType,
					ownerId:config.ownerId
				},
				method : 'GET',
				success : function(response) {
					var obj = Ext.decode(response.responseText);
					if(!Strings.isEmpty(obj.url)){
						imgTpl.overwrite($("divImage"), obj);
						var image = $("sideImage");
						image.src = obj.url;
						if($("divImage")) {//be careful, if side bar is hidden, divImage is null, and it will throw js error
							$("divImage").style.display = "block";
						}
						Ext.getCmp('attatchment_portlet').doLayout();
					}else{
						if($("divImage")) {
							$("divImage").style.display = "none";
						}
					}
				}
			});
		}
	},
	
	_delete_attatchment : function(){
		var record =  this.selected;
		
		if(record){
			var sourceEntityId = record.get("sourceEntityId");
			
			if(sourceEntityId != sideAttatchmentConfig.ownerId ){
				Ext.Msg.alert("warning" , "cannot delete it from here");
				return;
			}
			
			Ext.Ajax.request({
				url : '/app/' + $F('APP_NAME') + '/resource/delete/' + record.get("id"),
				
				success : function(response) {
					var dataview = Ext.getCmp("dataview_attatchment");
					if(dataview && dataview.store){
						dataview.store.load({callback: function(records, operation, success) {
							Ext.getCmp('attatchment_portlet').doLayout();
					    }});
					}
					if(sideAttatchmentConfig.imagePanel){
						me._getPrimaryImage();
					}
				}
			});
		}
	},
	
	_edit_attachment : function(){
		var record = this.selected;
		if(record){
			sideAttatchmentConfig.action = 'edit';
			this._initAttachmentWin(sideAttatchmentConfig);
			this._loadDataToForm(record);
		}
	},
	
	_loadDataToForm : function(record){
		var cmp_id = Ext.getCmp("cmp_id");
		cmp_id.setValue(record.get("id"));
		
		var cmp_name = Ext.getCmp("cmp_name");
		cmp_name.setValue(record.get("name"));
		
		var cmp_resource_type = Ext.getCmp("cmp_resource_type");
		cmp_resource_type.setRawValue(record.get("typeCode"));
		cmp_resource_type.disable();
		
		var cmp_content_type = Ext.getCmp("cmp_content_type");
		cmp_content_type.setRawValue(record.get("contentTypeCode"));
		cmp_content_type.disable();
		
		var cmp_description = Ext.getCmp("cmp_description");
		cmp_description.setValue(record.get("description"));
		
		var cmp_comment = Ext.getCmp("cmp_comment");
		cmp_comment.setValue(record.get("comment"));
		
		var cmp_primary = Ext.getCmp("cmp_primary");
		cmp_primary.setRawValue(record.get("primaryResource"));
		
		if(record.get("typeCode") == "IMAGE"){
			cmp_primary.enable();
		}else{
			cmp_primary.disable();
		}
	},
	
	_initAttachmentWin : function(config){
		var me = this;
		me.attachmentWin = new ERP.ResourceUploadWindow(
				Ext.apply({
					width:400
				},config));
		me.attachmentWin.show();
	},
	
	_buildStore : function(config){
		
		var model = Ext.define('FileAttachModelName', {
		    extend: 'Ext.data.Model',
		    fields : [{name: 'id'},{name: 'type'},{name: 'typeCode'},{name: 'name'},{name: 'contentType'},{name: 'contentTypeCode'},{name: 'description'},{name: 'comment'},{name: 'primaryResource'},{name: 'createdBy'},{name: 'creationDate'},{name: 'url'},{name: 'size'},{name: 'sourceEntityId'}]
		});

		var proxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
			url : '/app/' + $F('APP_NAME') + '/resource/list/json',
	        reader : {
	            type : 'json',
	            root : 'data',
	            idProperty: 'id'
	        },
	        extraParams : {
	        	ownerId : config.ownerId,
	        	ownerType : config.ownerType
			}
		});
		
		var store = Ext.create('Ext.data.Store' , {
		    autoDestroy : true,
		    storeId: '_resourceGRID_ID',
		    proxy: proxy,
		    model : model
		});
		
		store.load({callback: function(records, operation, success) {
			Ext.getCmp('attatchment_portlet').doLayout();
	    }});
		return store;
	},
	
	tpl : new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="x-note-thumb-wrap">',
			'<div class="x-date">File Name : {name}</div>',
			'<div class="x-date">File Type : {type}</div>',
			'<div class="x-date">Created By : {createdBy}</div>',
			'<div class="x-date"> Date: {creationDate}</div>',
			'<div class="x-date"> Size: {size} (KB)</div>',
			'<div><a href="#" onclick="ERP.SideAttatchment._download_attachment(\'{id}\')">download</a></div>',
			'</div>',
			'</tpl>', '<div class="x-clear"></div>')
	,	
	_buildDataview : function(store,tpl){
		var me = this;
		return  Ext.create('Ext.view.View', {
			id : 'dataview_attatchment',
			store : store,
			tpl : tpl,
			overClass : 'x-view-over',
			itemSelector : 'div.x-note-thumb-wrap',
			emptyText : 'No Notes to Display',
    		listeners : {
    			'itemclick' : {
    				fn : function(view, record){
    					me.selected = record;
    				}
    			},
    			'itemdblclick' : {
    				fn : function(){
    					me._edit_attachment(me.selected);
    				}
    			}
    		}
		});
	},
    _resizeImage : function(image){
    	var max_width =  150;
    	image.style.max_width = max_width + "px";
    	image.style.height = "auto";
    	image.style.cursor = "pointer";
    	image.style.border = "1px dashed #4E6973";
    	image.style.padding = "3px";
    	image.style.zoom = 1;
    	if (image.width > max_width) {  
             var oldVW = image.width; 
             image.width = max_width;  
             image.height = image.height*(max_width /oldVW);
        }
    }
});

Ext.define('ERP.ResourceUploadWindow', {
	extend : 'Ext.window.Window',
	
	constructor : function(config){
		
		var resourceTypeUrl = "/app/"+ $F("APP_NAME") +"/resource/fileType/json";
		var contentTypeUrl = "/app/"+ $F("APP_NAME") +"/resource/contentType/json";
        var resourceTypeCombo = this._buildResourceTypeCombo(this._buildStore(resourceTypeUrl,"Resource"));
        var contentTypeCombo = this._buildContentTypeCombo(this._buildStore(contentTypeUrl,"Content"));
        
        this.form = new Ext.form.Panel({
            
        	url: "/app/"+ $F("APP_NAME") +"/resource/ok",
        	myFileUploadDialog: this,
            fileUpload: true,
            method: 'POST',
            labelWidth: 125,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            frame: true,
            defaults: {
        		anchor: '95%',
        		msgTarget: 'side',
                allowBlank: false
            },
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
           	config.imagePanel ?  resourceTypeCombo : {
           		id:"cmp_resource_type",
            	name: 'type',
        		xtype: 'hidden',
        		value : 'BINARY_FILE'
           	},contentTypeCombo,{
           		id:"cmp_primary",
           		fieldLabel: 'Primary',
        		name: 'primary',
        		disabled:true,
        		margin : '5 0 0 0',
        		xtype : 'checkbox',
        		width : 220
           	},{
           		id:"cmp_description",
           		fieldLabel: 'Description',
        		name: 'description',
        		xtype: 'textfield',
        		margin : '5 0 0 0',
        		allowBlank:true,
        		width : 220
           	},
       		config.action == 'create' ? {
                xtype: 'filefield',
                name: 'file',
                fieldLabel: 'File',
                labelWidth: 100,
                msgTarget: 'side',
                allowBlank: false,
        		margin : '5 0 0 0',
                anchor: '100%',
                width: 300,
                buttonText: 'Browse'
            }: {xtype: 'hidden'}
           	,{
           		id:"cmp_comment",
           		fieldLabel: 'Comment',
        		name: 'comment',
        		margin : '5 0 0 0',
        		xtype : 'textarea',
        		allowBlank:true,
        		width : 220
        			
           	},{
        		name: 'ownerId',
        		xtype : 'hidden',
        		value : config.ownerId
        			
           	},{
        		name: 'sourceType',
        		xtype : 'hidden',
        		value : config.ownerType
        			
           	},{
           		id : 'type',
        		name: 'type',
        		xtype : 'hidden'
        			
           	},{
           		id : 'contentType',
        		name: 'contentType',
        		xtype : 'hidden'
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
        			var ownerId = this.myForm.getForm().findField("ownerId").getValue();
        			if(Strings.isEmpty(ownerId)){
        				Ext.Msg.alert("Warning",config.notSaveMessage);
        				return;
        			}
        			Ext.getCmp("cmp_primary").enable();
        			Ext.getCmp('type').setValue(Ext.getCmp("cmp_resource_type").getValue());
        			Ext.getCmp('contentType').setValue(Ext.getCmp("cmp_content_type").getValue());
        			Ext.getCmp("cmp_resource_type").enable();
        			Ext.getCmp("cmp_content_type").enable();
        			this.myForm.getForm().submit({
	                    waitMsg: 'Uploading...',
	                    url: this.myForm.url,
	                    method: "POST",
	                    success: function (form, action) {
		                    ERP.SideAttatchment._reloadDataView();
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
        ERP.ResourceUploadWindow.superclass.constructor.call(this, Ext.apply({
            width: 500,
            title: 'File',
            autoDestroy : false,
            modal: true,
            items: this.form,
            buttons: [btnCancel, btnSubmit]
        }, config));
	},
	_buildStore : function(url,type){
		if (!Ext.ModelManager.isRegistered(type)){
			model = Ext.define(type, {
			    extend: 'Ext.data.Model',
			    fields : [{name:'code'}, {name:'text'}]
			});
		}
		
		var proxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
			url : url,
	        reader : {
	            type : 'json',
	            root : 'data',
	            idProperty: 'id'
	        }
		});
		
		var store = Ext.create('Ext.data.Store' , {
		    autoDestroy : true,
		    storeId: '_STORE_ID',
		    proxy: proxy,
		    model : model
		});
		
		store.load();
		return store;
	},
	
	_buildResourceTypeCombo : function(store){
		var combo = Ext.create('Ext.form.field.ComboBox', {
			id : "cmp_resource_type",
			fieldLabel: 'Resource Type',
			displayField: 'text',
			valueField: 'code',
			store: store,
			allowBlank : false,
    		margin : '5 0 0 0',
			queryMode: 'local',
			typeAhead: false,
			listeners : {
           		'select': function(/*Ext.form.field.Picker */ field,/* Mixed */ value,/* Object*/ options  ){
           				var primary = Ext.getCmp("cmp_primary");
		           		var contentType = Ext.getCmp("cmp_content_type");
		           		if(value[0].data.code == "IMAGE"){
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
		});
		
		return combo;
	},
	
	_buildContentTypeCombo : function(store){
		var combo = Ext.create('Ext.form.field.ComboBox', {
			id : "cmp_content_type",
			fieldLabel: 'Content Type',
			displayField: 'text',
			valueField: 'code',
			store: store,
    		margin : '5 0 0 0',
			allowBlank : false,
			queryMode: 'local',
			typeAhead: false
		});
		
		return combo;
	}
});