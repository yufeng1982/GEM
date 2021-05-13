/**
 * @author FengYu
 */
Ext.define('ERP.security.user.RoleAction' ,{
	extend : 'ERP.FormAction',
	resources : null,
	allResources : null,
	
	constructor : function(config) {
		this.callParent([config]);
		Ext.apply(this , config);
		return this;
	},
	nameOnchange : function(element) {
		VUtils.commonValidateUnique(element.id, element.id, 'string', CUtils.getSValue('corporation'));
	},
	corporationOnchange : function(value, text, record, countryBombox) {
		this.nameOnchange($('name'));
		return true;
	},
	uncheckedAll : function() {
		var view = this.getFunctionNodeTree().getView();
		view.node.cascadeBy(function(r) {
			if(r.get('leaf') == true) {
				r.set('checked', false);
			}
        });
	},
	checkedAll : function() {
		var view = this.getFunctionNodeTree().getView();
		view.node.cascadeBy(function(r) {
			if(r.get('leaf') == true) {
				r.set('checked', true);
			}
        });
	},
	getFunctionNodeTree : function() {
		return PApp.functionNodeTree;
	},
	getAppResourceTreeGrid : function() {
		return PApp.appResourceTreeGrid;
	},
	enableRenderer : function(value, metadata, record, rowIndex, colIndex, store) {
		var fnId = CUtils.sv(record.data._parent);
		if(Strings.isEmpty(fnId)) return "";
		var category = record.data._category;
		var arId = record.data._id;
		var resource = {arId: arId, fnId: fnId, category: category, op: "enable"};
		var cbName = this.getCheckboxName(resource);
		this.allResources[cbName] = resource;
		var checked = "";
		if(record.data._enable == true) checked = "checked";
		
		return "<input type='checkbox' id='" + cbName + "' name='" + cbName + "' value='true' onclick='return PAction.enableChange(this);' " + checked + " >";
	},
	visibleRenderer : function(value, metadata, record, rowIndex, colIndex, store) {
		var fnId = CUtils.sv(record.data._parent);
		if(Strings.isEmpty(fnId)) return "";
		var category = record.data._category;
		var arId = record.data._id;
		var resource = {arId: arId, fnId: fnId, category: category, op: "visible"};
		var cbName = this.getCheckboxName(resource);
		this.allResources[cbName] = resource;
		var checked = "";
		if(record.data._enable == true || record.data._visible == true) checked = "checked";

		return "<input type='checkbox' id='" + cbName + "' name='" + cbName + "' value='true' onclick='return PAction.visibleChange(this);' " + checked + " >";
	},
	enableChange : function(cb) {
		var resourceId = cb.id.firstStr2();
		if(cb.checked){
			this.check({arId : resourceId, op : "visible"}, true);
			this.resources[resourceId] = "enable";
		}else{
			this.resources[resourceId] = "visible";
		}
		
		if(!IS_PAGE_MODIFIED) IS_PAGE_MODIFIED = true;
	},
	visibleChange : function(cb) {
		var resourceId = cb.id.firstStr2();
		if(cb.checked){
			this.resources[resourceId] = "visible";
		}else{
			this.check({arId : resourceId, op : "enable"}, false);
			this.resources[resourceId] = "hidden";
		}
		
		if(!IS_PAGE_MODIFIED) IS_PAGE_MODIFIED = true;
	},
	getCheckboxName : function(resource) {
		return CUtils.sv(resource.fnId) + "_" + CUtils.sv(resource.arId) + "_" + CUtils.sv(resource.op);
	},

	check : function(resource, checked){
		var resourceId = resource.arId + "_" + CUtils.sv(resource.op);
		var cb = $(resourceId);
		if(cb) {
			cb.checked = checked;
		}
	},
	formProcessingBeforeSave : function() {
		 var records = this.getFunctionNodeTree().getView().getChecked();
		 $("functionNodeIds").value = "";
		 $('resources').value = CUtils.jsonEncode(this.resources);
		 Ext.Array.each(records, function(rec){
			 $("functionNodeIds").value += rec.get('id') + ",";
		 });
	}
});