/**
 * @author FengYu
 */
Ext.define('ERP.article.article.ArticleAction' ,{
	extend : 'ERP.FormAction',
	userNameUnique: false,
	checkMsgCount : 0,
	resetWin : null,
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	
	addLine :  function() {
		GUtils.addLine(this.getChaptersGrid());
		GUtils.resetSequence(this.getChaptersGrid(),'chapterNo');
	},
	removeLine : function() {
		var record = GUtils.getSelected();
		if(record) {
			GUtils.removeLine(this.getChaptersGrid(),'chaptersDeleteLines',record);
			GUtils.resetSequence(this.getChaptersGrid(),'chapterNo');
		}
	},
	getChaptersGrid : function() {
		return PApp.chaptersGrid;
	},
	loadChaptersGrid : function() {
		this.getChaptersGrid().getStore().load();
	},
	
	formValidationBeforeSave : function() {
		var msgarray = [];
		
		return msgarray;
	},
	formProcessingBeforeSave : function() {
		$("chapters").value = GUtils.allRecordsToJson(this.getChaptersGrid());
	},
	showContentWin : function (editor, e) {
		var me = this;
		if (e.field == 'chapterContent') {
			var win = Ext.create('Ext.window.Window', {
			    id : 'chapterWin',
				title: '章节编辑器',
			    height: 550,
			    width: 900,
			    layout: 'fit',
			    modal: true,
			    items: {  
			    	xtype: 'htmleditor',
			    	id: 'chapterEditorId',
			    	value : ''
			    },
			    buttons: [{ 
			    		  text: '确认',
			    		  handler : function(){
			    			  e.record.set('chapterContent',Ext.getCmp('chapterEditorId').getValue())
			    			  Ext.getCmp('chapterWin').close();
			    		  }
			    	  },{ 
			    		  text: '取消', 
			    		  handler : function(){
			    			  Ext.getCmp('chapterWin').close();
			    		  }
			    	  }
			    ]
			});
			win.on('show',function(t, e){
				var record = GUtils.getSelected(me.getChaptersGrid());
				Ext.getCmp('chapterEditorId').setValue(record.get('chapterContent'));
			})
			win.show();
		}
	}
});