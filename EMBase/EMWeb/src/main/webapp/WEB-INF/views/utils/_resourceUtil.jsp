<script type="text/javascript">
function _processSecurityResources() {
	var controlledResources = ${CONTROLLED_RESOURCES};
	for(var i = 0; i < controlledResources.length; i ++) {
		var res = controlledResources[i];
		var resId = res["id"];
		var category = res["category"];
		var operation = res["operation"];
		//alert(resId + "   category="+ category + "  operation=" + operation);
		_protectResources[category][operation](resId);
	}
}

var _protectResources = {};
_protectResources['portlet'] = {};
_protectResources['portlet']['enable'] = function(id) {
	var res = Ext.getCmp(id);
	if(res && res.hidden != true) {
		res.show();
	}
}
_protectResources['portlet']['readonly'] = function(id) {
	// don't have readonly operation
}
_protectResources['portlet']['hidden'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.hide();
	}
}
_protectResources['treeInfoLog'] = {};
_protectResources['treeInfoLog']['enable'] = function(id) {
	// don't have enable operation
}
_protectResources['treeInfoLog']['readonly'] = function(id) {
	// don't have readonly operation
}
_protectResources['treeInfoLog']['hidden'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.hide();
	}
}

_protectResources['searchingSelect'] = [];
_protectResources['searchingSelect']['enable'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.setDisabled(false);
	}
}
_protectResources['searchingSelect']['readonly'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.setDisabled(true);
	}
}
_protectResources['searchingSelect']['hidden'] = function(id) {
	if($("fr_" + id)) $("fr_" + id).style.display = 'none';
}

_protectResources['checkbox'] = [];
_protectResources['checkbox']['enable'] = function(id) {
	if(Ext.getCmp(id)) Ext.getCmp(id).setDisabled(false);
}
_protectResources['checkbox']['readonly'] = function(id) {
	if(Ext.getCmp(id)) Ext.getCmp(id).setDisabled(true);
	if($(id)) $(id).onclick = function() { return false; }; //$(id).disabled = true;
}
_protectResources['checkbox']['hidden'] = function(id) {
	if($("fr_" + id)) $("fr_" + id).style.display = 'none';
	if(Ext.getCmp(id)) Ext.getCmp(id).setVisible(false);
}

_protectResources['select'] = [];
_protectResources['select']['enable'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.setDisabled(false);
	}
}
_protectResources['select']['readonly'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.setDisabled(true);
	}
}
_protectResources['select']['hidden'] = function(id) {
	if($("fr_" + id)) $("fr_" + id).style.display = 'none';
}

_protectResources['text'] = [];
_protectResources['text']['enable'] = function(id) {
	// TODO do nothing for now
}
_protectResources['text']['readonly'] = function(id) {
	if($(id)) $(id).readOnly = true;
}
_protectResources['text']['hidden'] = function(id) {
	if($("fr_" + id)) $("fr_" + id).style.display = 'none';
}

_protectResources['button'] = [];
_protectResources['button']['enable'] = function(id) {
	var res = Ext.getCmp(id);
	if(res && res.hidden == true) {
		res.show();
	}
}
_protectResources['button']['readonly'] = function(id) {
	// don't have readonly operation
}
_protectResources['button']['hidden'] = function(id) {
	var res = Ext.getCmp(id);
	if(res) {
		res.hide();
		//if(res.findParentByType("container")) res.findParentByType("container").syncSize();
		res.destroy();
	}
}

_protectResources['div'] = [];
_protectResources['div']['enable'] = function(id) {
	if($(id)) $(id).style.display = '';
}
_protectResources['div']['readonly'] = function(id) {
	
}
_protectResources['div']['hidden'] = function(id) {
	if($(id)) $(id).style.display = 'none';
}

_protectResources['gridColumn'] = [];
_protectResources_columns = {};
_protectResources['gridColumn']['enable'] = function(id) {
	_protectResources_columns[id] = "enable";
	__setGridColumnHidden(id, false);
}
_protectResources['gridColumn']['readonly'] = function(id) {
	_protectResources_columns[id] = "readonly";
	__setGridColumnHidden(id, false);
}
_protectResources['gridColumn']['hidden'] = function(id) {
	__setGridColumnHidden(id, true);
}
function __setGridColumnHidden(id, isHidden) {
	var array = id.split(":");
	if(array.length == 2) {
		var grid = Ext.getCmp(array[0]);
		if(grid) {
			var cm = GUtils.getColumn(array[1], grid);
			if(cm) {
				if(isHidden) {
					cm.hide();
				} else {
					cm.show();
				}
			}
		}
	}
}
function __isGridColumnEditable(columnName, gridId) {
	columnName = (gridId ? gridId : GRID_ID) + ":" + columnName;
	if(CUtils.sv(_protectResources_columns[columnName]) == 'readonly') {
		return false;
	}
	return true;
}
</script>