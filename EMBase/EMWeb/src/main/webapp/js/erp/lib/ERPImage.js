Ext.define('ERP.ImageViewer' ,{
	
	lookup : {},
	
	store : null,
	
	view : null,
	
	thumbTemplate : null,
	
	detailsTemplate : null,
	
	win : null,
	
	constructor : function(config){

		this.initTemplates();
		
		this.store = this.buildStore(config);

		this.view = this.buildDataView(this.thumbTemplate);
		
		var me = this;
		
		var cfg = {
	    	title: 'Choose an Image',
	    	layout: 'border',
			minWidth: 500,
			minHeight: 300,
			modal: true,
			closeAction: 'hide',
			border: false,
			items:[{
				id: 'img-chooser-view',
				region: 'west',
				width: 200,
				autoScroll: true,
				items: this.view,
                tbar:[{
                	text: 'Filter:'
                },{
                	xtype: 'textfield',
                	id: 'filter',
                	selectOnFocus: true,
                	width: 100,
                	listeners: {
                		'render': {fn:function(){
					    	Ext.getCmp('filter').getEl().on('keyup', function(){
					    		me.filter();
					    	});
                		}}
                	}
                }]
			},{
				id: 'img-detail-panel',
				region: 'center',
				split: true,
				minWidth: 150
			}],
			buttons: [{
				text: 'Close',
				iconCls : 'ss_sprite ss_accept',
				handler: function(){ me.win.hide(); },
				scope: this
			}],
			keys: {
				key: 27, // Esc key
				handler: function(){ me.win.hide(); },
				scope: this
			}
		};
		Ext.apply(cfg, config);
	    this.win = new Ext.window.Window(cfg);
	},
	
	showViewer : function(){
		this.win.show();
		this.reset();
	},

//	formatSize : function(data){
//        if(data.size < 1024) {
//            return data.size + " bytes";
//        } else {
//            return (Math.round(((data.size*10) / 1024))/10) + " KB";
//        }
//    },
//    formatData : function(data){
//    	data.shortName = this.subString(data.shortName,15);
//    	data.sizeString = formatSize(data);
//    	data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
//    	this.lookup[data.name] = data;
//    	return data;
//    },
    buildStore : function(config){
    	var me = this;

    	if (!Ext.ModelManager.isRegistered('ImageModel')){
    		var model = Ext.define('ImageModel', {
    		    extend: 'Ext.data.Model',
    		    fields : [ 'id', 'type', 'typeCode', 'name', 'contentType' , 'contentTypeCode' ,'description' ,'comment' , 'primary' , 'createdBy', 'creationDate','url','size','sourceEntityId']
    		});
    	}
		
		var proxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
			url : '/app/'+$('APP_NAME').value+'/resource/list/json',
	        reader : {
	            type : 'json',
	            root : 'data',
	            idProperty: 'id'
	        },
	        extraParams : {
	        	type : 'IMAGE',
	        	ownerId : config.ownerId
			}
		});
		
		var store = Ext.create('Ext.data.Store' , {
		    autoDestroy : true,
		    storeId: '_IMAGE_GRID_ID',
		    proxy: proxy,
		    model : model
		});
		
		store.load({callback: function(records, operation, success) {
			me.initImages(records);
	    }});
		return store;
    },
	initTemplates : function(){
		this.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img id="img_{name}" src="{url}" title="{name}"></div>',
					'<b>Image Name : </b>',
					'<span>{name}</span><br>',
					'<b>Created By : </b>',
					'<span> {createdBy} </span><br>',
					'<b>Date : </b>',
					'<span> {creationDate} </span><br>',
					'<b>Size : </b>',
					'<span> {size} (KB) </span>',
				'</div>',
			'</tpl>'
		);

		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<img id="detailImage" src="{url}" class="detail-image"><div class="details-info">',
				'</tpl>',
			'</div>'
		);
	},
	buildDataView : function(thumbTemplate){
		var me = this;
		return Ext.create('Ext.view.View', {
			id : 'dataview_image',
			store : me.store,
			tpl: thumbTemplate,
			overClass : 'x-view-over',
			itemSelector : 'div.x-note-thumb-wrap',
			emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
			listeners: {
				'itemclick' : function(view, record){
							    var panel = Ext.getCmp('img-detail-panel');
							    var detailEl = panel.body;
								if(record){
						            detailEl.hide();
						            me.detailsTemplate.overwrite(detailEl, record);
						            var image = $("detailImage");
						            me.resizeImage(image , panel.getWidth());
						            detailEl.slideIn('l', {stopFx:true,duration:.2});
								}else{
								    detailEl.update('');
								}
					}
				
			}
		});
	},

	filter : function(){
		var filter = Ext.getCmp('filter');
		this.view.store.filter('name', filter.getValue());
	},

	reset : function(){
		Ext.getCmp('filter').reset();
	    this.view.store.clearFilter();
	},

	doCallback : function(){
//        var selNode = this.view.getSelectedNodes()[0];
//		var callback = this.callback;
//		var lookup = this.lookup;
//		this.win.hide(this.animateTarget, function(){
//            if(selNode && callback){
//				var data = lookup[selNode.id];
//				callback(data);
//			}
//		});
    },
    
    initImages : function(records){
    	for(var i = 0 ; i < records.length ; i++){
    		var r = records[i];
    		var image = $("img_" + r.get("name"));
    		image.onLoad=this.imagesLoaded(image);
    		image.src = r.get("url");
    	}
    },
    
    imagesLoaded : function(image){
    	var max_width = 150;
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
    },
    
    resizeImage : function(image,maxWidth){
    	var max_width =  maxWidth ? maxWidth : 150;
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
    },
    
    subString : function(value, maxLength){
    	if(value.length > maxLength){
    		return value.substr(0, maxLength-3) + '...';
    	}
    	return value;
    },

	onLoadException : function(v,o){
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
	}
})