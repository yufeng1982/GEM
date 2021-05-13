
Ext.namespace('ERP.ui');


//config include "ownerId","ownerType"
ERP.ui.LastSideNote = function(config) {
	var store = new Ext.data.JsonStore( {
		url : '/app/'+$('APP_NAME').value+'/entityNotes/lastNoteJson',
		root : 'data',
		baseParams : {
			entityId : config.ownerId,
			entityType : config.ownerType
		},
		id : 'id',
		fields : [ 'id', 'type', 'typeCode' , 'description', 'createdBy', 'creationDate' ]
	});

	store.load();

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="x-note-thumb-wrap"><div class="x-type">{type}</div>',
			'<div class="x-date">Date: <span>{creationDate}</span></div>',
			'<div class="x-note">{description:ellipsis(30)}</div></div>',
			'</tpl>', '<div class="x-clear"></div>');

	var dataview = new Ext.DataView( {
		id : 'dataview_last_note',
		store : store,
		tpl : tpl,
		// height: 100,
		autoHeight : true,
		multiSelect : false,
		singleSelect : true,
		overClass : 'x-view-over',
		itemSelector : 'div.x-note-thumb-wrap',
		emptyText : 'No Notes to Display',
		listeners : {
			'dblclick' : {
				fn : _dbclick_last_note
			}
		}
	});
	

	var lastNote = new Ext.ux.Portlet({
		id : 'last_note_portlet',
		title : ss_icon('ss_note') + "Customer's Latest Note",
		draggable : {
			ddGroup : 'sideportal'
		},
		layout : 'anchor',
		// autoHeight:true,
		height : 'auto',
		collapseFirst : false,
		items : [ dataview ]
	});
	return lastNote;
};
function _dbclick_last_note(dataview, index) {
	var record = dataview.getStore().getAt(index);
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
Ext.reg('erpsidelastnote', ERP.ui.LastSideNote);


//config include "ownerId","ownerType"
ERP.ui.SideNote = function(config) {
	var menu = new Ext.menu.Menu( {
		items : [ {
			text : 'View',
			handler : _view_note
		}, {
			text : 'New',
			handler : _create_note
		}, {
			text : 'Delete',
			handler : _delete_note
		},{
			text : 'Edit',
			handler : _edit_note
		} ]
	});

	var store = new Ext.data.JsonStore( {
		url : '/app/'+$('APP_NAME').value+'/entityNotes/json',
		root : 'data',
		baseParams : {
			entityId : config.ownerId,
			entityType : config.ownerType
		},
		id : 'id',
		fields : [ 'id', 'type', 'typeCode' , 'description', 'createdBy', 'creationDate' ]
	});

	store.load();

	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="x-note-thumb-wrap"><div class="x-type">{type}</div>',
			'<div class="x-date">From: <span>{createdBy}</span> Date: <span>{creationDate}</span></div>',
			'<div class="x-note">{description:ellipsis(30)}</div></div>',
			'</tpl>', '<div class="x-clear"></div>');

	var save = new Ext.Action( {
		text : 'Save',
		handler : function() {
			_save_note(config);
		}
	// iconCls : 'ss_sprite ss_accept'
			});
	var cancel = new Ext.Action( {
		text : 'Cancel',
		handler : _cancel_note
	// iconCls : 'ss_sprite ss_cancel'
			});

	var combo = new Ext.form.ComboBox( {
		id : 'note_combo',
		typeAhead : true,
		triggerAction : 'all',
		lazyRender : true,
		width : 180,
		mode : 'local',
		editable : false,
		hidden : config.hiddenNoteType ? config.hiddenNoteType : false,
		store : new Ext.data.ArrayStore( {
			id : 0,
			fields : [ 'myId', 'displayText' ],
			data : config.noteTypes
		}),
		valueField : 'myId',
		displayField : 'displayText'
	});

	var dataview = new Ext.DataView( {
		id : 'dataview_note',
		store : store,
		tpl : tpl,
		// height: 100,
		autoHeight : true,
		multiSelect : false,
		singleSelect : true,
		overClass : 'x-view-over',
		itemSelector : 'div.x-note-thumb-wrap',
		emptyText : 'No Notes to Display',
		listeners : {
			'dblclick' : {
				fn : _dbclick_note
			}
		}
	});

	var note = new Ext.ux.Portlet(
			{
				id : 'note_portlet',
				title : ss_icon('ss_note') + 'Notes',
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
							html : '<a href="#" onclick="_create_note()">click here to create a new note</a>'
						},
						{
							id : 'note_save_component',
							xtype : 'panel',
							layout : 'anchor',
							height : 'auto',
							hidden : true,
							items : [ {
								id : 'note_textarea',
								xtype : 'textarea',
								width : 180
							}, combo ,{
								id : 'note_id',
								xtype : 'hidden'
							}],
							buttons : [ new Ext.Button(save),
									new Ext.Button(cancel) ]
						}, dataview ]
			});
	return note;
};
Ext.reg('erpsidenote', ERP.ui.SideNote);
function _create_note() {
	Ext.getCmp('note_save_component').show();
	Ext.getCmp('note_portlet').doLayout();
	Ext.getCmp('note_combo').setValue('');
	Ext.getCmp('note_id').setValue('');
	Ext.getCmp('note_textarea').setValue('');
}

function _edit_note(){
	_create_note();
	var dataview = Ext.getCmp('dataview_note');
	var selected = dataview.getSelectedIndexes();
	if (selected.length) {
		var record = dataview.getStore().getAt(selected[0]);
		_load_note_data(record, Ext.getCmp('note_save_component'));
	}
}

function _load_note_data(r , cmp){
	var noteId = r.get("id") ;
	var noteType = r.get("typeCode");
	var description = r.get("description");
	
	Ext.getCmp('note_combo').setValue(noteType);
	Ext.getCmp('note_id').setValue(noteId);
	Ext.getCmp('note_textarea').setValue(description);
	
}
function _save_note(config) {
	if (!config.ownerId || config.ownerId == 'NEW') {
		Ext.MessageBox.alert('Error',
				'<nobr>' + config.notSaveMessage + '</nobr>');
		return false;
	}
	if (!Ext.getCmp('note_textarea').getValue()) {
		Ext.MessageBox.alert('Error',
				'<nobr>Please fill in the note content.</nobr>');
		return false;
	}
	if (!CUtils.isTrueVal(config.hiddenNoteType) && !Ext.getCmp('note_combo').getValue()) {
		Ext.MessageBox
				.alert('Error', '<nobr>Please choose a note type.</nobr>');
		return false;
	}
	var selected = Ext.getCmp('dataview_note').getSelectedIndexes();
	Ext.Ajax.request( {
		url : '/app/'+$('APP_NAME').value+'/entityNotes/create',
		method : 'POST',
		success : function(response) { //debugger;
			var obj = Ext.decode(response.responseText);
			var store = Ext.getCmp('dataview_note').getStore();
			if(obj.data && obj.created){
				var T = store.recordType;
				store.insert(0, new T(obj.data));
			}else if(obj.data && obj.modified){
				var r = store.getAt(selected[0]);
				r.set('type' , obj.data.type);
				r.set('typeCode' , obj.data.typeCode);
				r.set('description' , obj.data.description);
				var index = store.indexOfId(obj.data.id);
				var dataview = Ext.getCmp('dataview_note');
				dataview.refreshNode(index);
			}
			Ext.getCmp('note_textarea').setValue("");
			Ext.getCmp('note_combo').setValue("");
			Ext.getCmp('note_save_component').hide();
			Ext.getCmp('note_portlet').doLayout();
		},
		failure : function() {
			alert("save error");
		},
		params : {
			entityId : config.ownerId,
			entityType : config.ownerType,
			noteType : Ext.getCmp('note_combo').getValue(),
			noteId : Ext.getCmp('note_id').getValue(),
			data : Ext.getCmp('note_textarea').getValue()
		}
	});

}
function _view_note() {
	var selected = Ext.getCmp('dataview_note').getSelectedIndexes();
	if (selected.length) {
		_dbclick_note(Ext.getCmp('dataview_note'), selected[0]);
	}
}
function _delete_note() {
	var selected = Ext.getCmp('dataview_note').getSelectedIndexes();
	var store = Ext.getCmp('dataview_note').getStore();
	if (selected) {
		var record = store.getAt(selected[0]);
		if(record){
			Ext.Ajax.request( {
				url : '/app/'+$('APP_NAME').value+'/entityNotes/delete/' + record.get('id'),
				method : 'DELETE',
				success : function(response) {// debugger;
					var obj = Ext.decode(response.responseText);
					if (obj.success) {
						store.remove(record);
						Ext.getCmp('note_id').setValue('','');					}
					Ext.getCmp('note_portlet').doLayout();
				},
				failure : function() {
					alert("save error");
				}
			});
		}
	}
}
function _cancel_note() {
	Ext.getCmp('note_save_component').hide();
	Ext.getCmp('note_portlet').doLayout();
}
function _dbclick_note(dataview, index) {
	var record = dataview.getStore().getAt(index);
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