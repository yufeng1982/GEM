/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.em.boot.core.utils.ResourceUtils;

/**
 * @author FengYu
 *
 */
public class FunctionNodeType {

	private String id;
	private String key;
	private String imgSrc;
	private String iconCls;

	private List<FunctionNode> list;

	public FunctionNodeType(String id, String key, String imgSrc) {
		this.id = id;
		this.key = key;
		this.imgSrc = imgSrc;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getImgSrc() {
		return imgSrc;
	}

	public void setImgSrc(String imgSrc) {
		this.imgSrc = imgSrc;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public List<FunctionNode> getList() {
		if(list == null) list = new ArrayList<FunctionNode>();
		return list;
	}

	public void setList(List<FunctionNode> list) {
		this.list = list;
	}

	public void addFunctionNode(FunctionNode node) {
		this.getList().add(node);
	}

	
	public JSONObject toJson() {
		JSONObject treePanel = new JSONObject();
		treePanel.put("treePanelId", getId());
		treePanel.put("treePanelTitle", ResourceUtils.getText(getKey()));
		treePanel.put("treePanelIconCls", getIconCls());
		treePanel.put("treePanelIcon", getImgSrc());
		treePanel.put("treePanelRootTreeNodeId", "TreeRoot" + getKey());
		treePanel.put("functionTypeId", getId());
		return treePanel;
	}
}
