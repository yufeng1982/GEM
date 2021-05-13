
var ImageChooser = function(config){
	this.config = config;
};

ImageChooser.prototype = {
    // cache data by image name for easy lookup
    lookup : {},

	show : function(el, callback){
		if(!this.win){
			this.initTemplates();

			this.store = new Ext.data.JsonStore({
			    url: '/erp/'+$('APP_NAME').value+'/resource/list/json',
			    root : 'data',
			    autoLoad : true,
				baseParams : {
					ownerShipSourceEntityId : $F('ownerShipSourceEntityId'),
					type : 'IMAGE'
				},
				fields : [ 'id', 'type', 'typeCode', 'name', 'contentType' , 'contentTypeCode' ,'description' ,'comment' , 'primary' , 'createdBy', 'creationDate','url','size','sourceEntityId'],
			    listeners: {
			    	'load': {
						fn:function(store){
							initImages(store);
							this.view.select(0); 
						}, 
						scope:this, 
						single:true
			    	}
			    }
			});

			var formatSize = function(data){
		        if(data.size < 1024) {
		            return data.size + " bytes";
		        } else {
		            return (Math.round(((data.size*10) / 1024))/10) + " KB";
		        }
		    };

			var formatData = function(data){
		    	data.shortName = data.name.ellipse(15);
		    	data.sizeString = formatSize(data);
		    	data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
		    	this.lookup[data.name] = data;
		    	return data;
		    };

		    this.view = new Ext.DataView({
				tpl: this.thumbTemplate,
				singleSelect: true,
				overClass:'x-view-over',
				itemSelector: 'div.thumb-wrap',
				emptyText : '<div style="padding:10px;">No images match the specified filter</div>',
				store: this.store,
				listeners: {
					'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
					'dblclick'       : {fn:this.doCallback, scope:this},
					'loadexception'  : {fn:this.onLoadException, scope:this},
					'beforeselect'   : {fn:function(view){
				        return view.store.getRange().length > 0;
				    }}
				},
				prepareData: formatData.createDelegate(this)
			});

			var cfg = {
		    	title: 'Choose an Image',
		    	id: 'img-chooser-dlg',
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
						    		this.filter();
						    	}, this, {buffer:500});
                    		}, scope:this}
                    	}
                    }]
				},{
					id: 'img-detail-panel',
					region: 'center',
					split: true,
					width: 150,
					minWidth: 150,
					maxWidth: 250
				}],
				buttons: [{
					text: 'Close',
					iconCls : 'ss_sprite ss_accept',
					handler: function(){ this.win.hide(); },
					scope: this
				}],
				keys: {
					key: 27, // Esc key
					handler: function(){ this.win.hide(); },
					scope: this
				}
			};
			Ext.apply(cfg, this.config);
		    this.win = new Ext.Window(cfg);
		}

		this.reset();
	    this.win.show();
		this.callback = callback;
//		this.animateTarget = el;
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
		this.thumbTemplate.compile();

		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<img id="detailImage" src="{url}" class="detail-image"><div class="details-info">',
				'</tpl>',
			'</div>'
		);
		this.detailsTemplate.compile();
	},

	showDetails : function(){
		var selNode = this.view.getSelectedNodes();
	    var panel = Ext.getCmp('img-detail-panel');
	    var detailEl = panel.body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];
		    var data = this.lookup[selNode.id];
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            var image = $("detailImage");
            resizeImage(image , panel.getWidth());
            detailEl.slideIn('l', {stopFx:true,duration:.2});
		}else{
		    detailEl.update('');
		}
	},

	filter : function(){
		var filter = Ext.getCmp('filter');
		this.view.store.filter('name', filter.getValue());
		this.view.select(0);
	},

	sortImages : function(){
		var v = Ext.getCmp('sortSelect').getValue();
    	this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
    	this.view.select(0);
    },

	reset : function(){
		if(this.win.rendered){
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
		}
	    this.view.store.clearFilter();
		this.view.select(0);
	},

	doCallback : function(){
        var selNode = this.view.getSelectedNodes()[0];
		var callback = this.callback;
		var lookup = this.lookup;
		this.win.hide(this.animateTarget, function(){
            if(selNode && callback){
				var data = lookup[selNode.id];
				callback(data);
			}
		});
    },

	onLoadException : function(v,o){
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
	}
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};

function initImages(store){
	for(var i = 0 ; i < store.getCount() ; i++){
		var r = store.getAt(i);
		var image = $("img_" + r.get("name"));
		image.onLoad=imagesLoaded(image);
		image.src = r.get("url");
	}
}

function imagesLoaded(image){
	resizeImage(image);
}

function resizeImage(image,maxWidth){
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
}