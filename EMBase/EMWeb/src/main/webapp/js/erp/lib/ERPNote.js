
Ext.define('ERP.SideNote',{

	store :  null,
	
	dataView : null,
	
	selected : null,
	
	constructor : function(config){
		
		this.store = this._buildStore(config);
		
		this.dataView = this._buildDataview(this.store, this.tpl);
	},
	
	_buildStore : function(config){
		
		var model = Ext.define('GridModelName', {
		    extend: 'Ext.data.Model',
		    fields : [{name: 'id'},{name: 'type'},{name: 'typeCode'},{name: 'description'},{name: 'createdBy'},{name: 'creationDate'}]
		});
		
		var isLastNote = config.isLastNote?config.isLastNote:false;
		
		var proxy = new Ext.data.proxy.Ajax({
	        type : 'ajax',
			url : '/app/' + $F('APP_NAME') + '/notes/json',
	        reader : {
	            type : 'json',
	            root : 'data',
	            idProperty: 'id'
	        },
	        extraParams : {
				entityId : config.ownerId,
				entityType : config.ownerType,
				isLastNote : isLastNote
			},
	        startParam: 'beginIndex',
	        limitParam: 'pageSize'
		});
		
		var store = Ext.create('Ext.data.JsonStore' , {
		    autoDestroy : true,
		    storeId: '_noteGRID_ID',
		    proxy: proxy,
		    model : model
		});
		
		store.load({callback: function(records, operation, success) {
			Ext.getCmp('note_portlet').doLayout();
	    }});
		return store;
	},
	
	tpl : new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="x-note-thumb-wrap"><div class="x-type">{type}</div>',
			'<div class="x-date">Date: <span>{creationDate}</span></div>',
			'<div class="x-note">{description:ellipsis(100)}</div></div>',
			'</tpl>', '<div class="x-clear"></div>')
	,
			
	_buildDataview : function(store,tpl){
		var me = this;
		return  Ext.create('Ext.view.View', {
			id : 'dataview_note',
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
    					me._dbclick_note(me.selected);
    				}
    			}
    		}
		});
	},
	_dbclick_note : function(record){
		var tpl = new Ext.XTemplate(
				'<div class="x-note-thumb-wrap"><div class="x-type">{type}</div>',
				'<div class="x-date">From: <span>{createdBy}</span> Date: <span>{creationDate}</span></div>',
				'<div class="x-note">{description}</div></div>');
		var html = tpl.applyTemplate(record.data);
		var window = new Ext.Window( {
			id : 'note_display_window',
			title : 'Notes',
			width : 500,
			height : 300,
			minWidth : 300,
			minHeight : 200,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			modal : true,
			html : html
		});
		window.show();
	}
});

Ext.define('ERP.LoadSideNote',{
	extend : 'ERP.SideNote',

	menu : null,
	
	statics: {
		_create_note : function() {
			if(Ext.getCmp('note_save_component')){
				Ext.getCmp('note_save_component').show();
			}
			if(Ext.getCmp('note_portlet')){
				Ext.getCmp('note_portlet').doLayout();
			}
			if(Ext.getCmp('note_id')){
				Ext.getCmp('note_id').setValue('');
			}
			if(Ext.getCmp('note_textarea')){
				Ext.getCmp('note_textarea').setValue('');
			}
		}
    },
    
    constructor : function(config){
    	
    	this.callParent([config]);
    	
    	var me = this;
		
		this.combo = this._buildCombo(config);
		
		this.menu = this._buildMenu();
		
		var save = new Ext.Action( {
			text : 'Save',
			handler : function() {
				me._save_note(config);
			}
		});
		
		var cancel = new Ext.Action( {
			text : 'Cancel',
			handler : this._cancel_note
		});
		
		var sideNote = new ERP.ui.Portlet(
				{
					id : 'note_portlet',
					title : ss_icon('ss_note') + 'Notes',
					layout : 'anchor',
					collapsible: true,
					tools : [ {
						type : 'gear',
						handler : function(event, toolEl, panel) {
							me.menu.showBy(toolEl);
						}
					} ],
					items : [
							{
								height: 20,
				    	        border : 0,
								html : '<a href="#" onclick="ERP.LoadSideNote._create_note();">click here to create a new note</a>'
							}, 
							{
								id : 'note_save_component',
								xtype : 'panel',
								layout : 'anchor',
				    	        border : 0,
								hidden : true,
								items : [ me.combo,{
									id : 'note_textarea',
									xtype : 'textarea',
									anchor: '90%'
								}  ,{
									id : 'note_id',
									xtype : 'hidden'
								}],
								buttons : [ new Ext.Button(save),
										new Ext.Button(cancel) ]
							}, me.dataView]
				});

		return sideNote;
    },
	_buildMenu : function() {
		var me = this;
		return new Ext.menu.Menu( {
			items : [ {
				text : 'View',
				handler : function() {
					me._dbclick_note(me.selected);
				}
			}, {
				text : 'New',
				handler : function() {
					ERP.LoadSideNote._create_note();
				}
			}, {
				text : 'Delete',
				handler : function(){
					me._delete_note();
				}
			},{
				text : 'Edit',
				handler : function() {
					me._edit_note();
				}
			} ]
		});
	},
	_buildCombo : function(config){
		
		var  hiddenNoteType = true;
		var noteTypes = [];
		if(config.noteTypes && config.noteTypes.length > 0){
			noteTypes = config.noteTypes;
			hiddenNoteType = false;
		}
		var states = Ext.create('Ext.data.Store', {
		    fields: ['name', 'text'],
		    data : noteTypes
		});
		var combo = Ext.create('Ext.form.field.ComboBox', {
			
			id : "note_combo",
			displayField: 'text',
			valueField: 'name',
			store: states,
			allowBlank : false,
			hidden : hiddenNoteType,
			queryMode: 'local',
			typeAhead: false
		});
		
		return combo;
	},
	_edit_note : function(){
		Ext.getCmp('note_save_component').show();
		Ext.getCmp('note_portlet').doLayout();
		Ext.getCmp('note_id').setValue('');
		Ext.getCmp('note_textarea').setValue('');
		var record = this.selected;
		if (record) {
			var noteId = record.get("id") ;
			var description = record.get("description");
			var noteType = record.get("typeCode");
			Ext.getCmp('note_id').setValue(noteId);
			Ext.getCmp('note_textarea').setValue(description);
			Ext.getCmp('note_combo').setValue(noteType);
		}
	},
	_save_note : function(config){
//		if (!config.ownerId || config.ownerId == 'NEW') {
//			Ext.MessageBox.alert('Error',
//					'<nobr>' + config.notSaveMessage + '</nobr>');
//			return false;
//		}
		if (!Ext.getCmp('note_textarea').getValue()) {
			Ext.MessageBox.alert('Error',
					'<nobr>Please fill in the note content.</nobr>');
			return false;
		}
		
		beginWaitCursor();
		var me = this;
		Ext.Ajax.request( {
			url : '/app/' + $F('APP_NAME') + '/notes/create',
			method : 'POST',
			success : function(response) {
				endWaitCursor();
				var obj = Ext.decode(response.responseText);
				var store = Ext.getCmp('dataview_note').getStore();
				if(obj.data && obj.created){
					store.insert(0, new GridModelName(obj.data));
				}else if(obj.data && obj.modified){
					var r = me.selected;
					r.set('type' , obj.data.type);
					r.set('typeCode' , obj.data.typeCode);
					r.set('description' , obj.data.description);
					var index = store.indexOfId(obj.data.id);
					var dataview = Ext.getCmp('dataview_note');
					dataview.refreshNode(index);
				}
				Ext.getCmp('note_textarea').setValue("");
				Ext.getCmp('note_save_component').hide();
				Ext.getCmp('note_portlet').doLayout();
			},
			failure : function() {
				endWaitCursor();
				alert("save error");
			},
			params : {
				entityId : config.ownerId,
				entityType : config.ownerType,
				noteType : Ext.getCmp('note_combo').getValue(),
				noteId : Ext.getCmp('note_id').getValue(),
				data : Ext.getCmp('note_textarea').getValue(),
				tempOwnerShipSourceEntityId : config.tempOwnerShipSourceEntityId
			}
		});
	},
	_view_note : function(){
		this._dbclick_note;
	},
	_delete_note : function(){
		var record = this.selected;
		var me = this;
		if (record) {
			Ext.Ajax.request( {
				url : '/app/' + $F('APP_NAME') + '/notes/delete/' + record.get('id'),
				method : 'DELETE',
				success : function(response) {// debugger;
					var obj = Ext.decode(response.responseText);
					if (obj.success) {
						me.store.remove(record);
						Ext.getCmp('note_id').setValue('','');					}
					Ext.getCmp('note_portlet').doLayout();
				},
				failure : function() {
					alert("save error");
				}
			});
		}
	},
	_cancel_note : function(){
		Ext.getCmp('note_save_component').hide();
		Ext.getCmp('note_portlet').doLayout();
	}
});

Ext.define('ERP.LastSideNote',{
	extend : 'ERP.SideNote',
	
	constructor : function(config){
		
		this.callParent([config]);
		
		var me = this;
		
		var lastNote = new ERP.ui.Portlet(
				{
					id : 'note_portlet',
					title : ss_icon('ss_note') + "Customer's Latest Note",
					layout : 'anchor',
					collapsible: true,
					items : [me.dataView ]
		});
					
		return lastNote;
	}
});