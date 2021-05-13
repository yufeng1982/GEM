Ext.define('Erp.lib.ui.FileUploadDialog', {
	extend : 'Ext.window.Window',
	alias : 'window.fileUploadDialog',
	
	constructor : function(config) {
		var me = this;
		me._file_uploadField = Ext.create("Ext.form.field.File", {
			id: 'form-file',
			fieldLabel: 'File',
			labelWidth: 30,
			width: 400,
			name: 'file-path',
			vtype: config["validateType"] || null,
			buttonCfg: {
                text: 'Browse'
            },
            allowBlank: false
		});
		
		me.form = Ext.create("Ext.form.Panel", {
			myFileUploadDialog: me,
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
            items: [me._file_uploadField]
		});
		var btnCancel = new Ext.Button({
            text: 'Cancel',
            scope: me,
            handler: function () {
            	me.hide();
            }
        });
        var btnSubmit = new Ext.Action({
            text: 'Upload',
            myForm: me.form,
            myFileUploadDialog: me,
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
        me.superclass.constructor.call(me, Ext.apply({
            width: 430,
            modal: true,
            items: me.form,
            buttons: [btnCancel, btnSubmit]
        }, config));
        
        return me;
	}
});

Ext.apply(Ext.form.field.VTypes, {
	excelImport : function(val){
		val = val.replace(/^\s|\s$/g, ""); //trims string
		if (val.match(/([^\/\\]+)\.(xls|xlsx)$/i) ){
			return true;
		}
		return false;
	},
	excelImportText: 'Must be a valid excel: xls, xlsx',
	
	txtImport : function(val){
		val = val.replace(/^\s|\s$/g, ""); //trims string
		if (val.match(/([^\/\\]+)\.(txt)$/i) ){
			return true;
		}
		return false;
	},
	
	txtImportText: 'Must be a valid txt: txt',
	
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
    attachmentText :  'Must be a valid image: gif,jpg,png,jpeg'
});