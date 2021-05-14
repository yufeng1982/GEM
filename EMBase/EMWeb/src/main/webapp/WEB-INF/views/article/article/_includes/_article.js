function page_OnLoad() {
	var actionBarItems = [];
	PRes["Publish"] = "${f:getText('Com.Publish')}";
	PRes["Chapter"] = "${f:getText('Com.Chapter')}";
//	var published = new Ext.Action( {
//		id : 'publishBtn',
//		text : PRes["Publish"],
//		iconCls: 'ss_sprite ss_wrench',
//		disabled: CUtils.isTrueVal(${entity.status ne 'Draft'}),
//		handler: function() {
//			PAction.publishActicle();
//		}
//	});
//	if($('entityId').value != DEFAULT_NEW_ID) actionBarItems[52] = new Ext.Button(published);
	
	var actionBar = new ERP.FormActionBar(actionBarItems);
//	G_CONFIG.isPaging = false;
	PAction = new ERP.article.article.ArticleAction({});
	var chaptersGrid = GUtils.initErpGrid(GRID_ID, {articleId: $('entityId').value});
	chaptersGrid.on('beforeedit', function(editor, e){
		PAction.showContentWin(editor, e);
	}); 
	
	PApp =  new ERP.FormApplication({
		chaptersGrid : chaptersGrid,
		pageLayout : {
			bodyItems : [ {
				xtype : "portlet",
				id : "articleGeneralPanel",
				height : 100,
				title : ss_icon('ss_application_form') + PRes["general"],
				contentEl : "divGeneral"
			}, {
				xtype : "portlet",
				id : "CHAPTER_GRID_PANEL_ID",
				collapseFirst: false,
				height : 500,
				layout : 'fit',
				title : ss_icon('ss_application_form') + PRes["Chapter"],
				dockedItems: [{
	                xtype: 'toolbar',
	                items: [{
	                	iconCls: 'ss_sprite ss_add',
	                    id : 'plus',
	                    text: PRes["add"],
	                    handler: function(event, toolEl, panel){
	                    	PAction.addLine();
	                    }
	                }, {
	                	iconCls: 'ss_sprite ss_delete',
	                    id : 'minus',
	                    text: PRes["delete"],
	                    handler: function(event, toolEl, panel){
	                    	 PAction.removeLine();
	                    }
	                }]
	            }],
				items : [chaptersGrid]
			}]
		},
		actionBar : actionBar
	});
	
	
	PAction.loadChaptersGrid();
}

function page_AfterLoad() {
	// handle those disable process ...
}