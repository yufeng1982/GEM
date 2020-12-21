/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONObject;

import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author YF
 *
 */
public class FunctionNodeType {

	private String id;
	private String key;
	private String imgSrc;
	private String iconCls;

	private List<FunctionNode> list;
	private List<FunctionNode> list2; // used to build all json for a module
	private List<FunctionNode> list3; // used to build superAdmin  list
	
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
	
	public List<FunctionNode> getList2() {
		if(list2 == null) list2 = new ArrayList<FunctionNode>();
		Collections.sort(list2);
		return list2;
	}

	public void setList2(List<FunctionNode> list2) {
		this.list2 = list2;
	}
	
	public List<FunctionNode> getList3() {
		if(list3 == null) list3 = new ArrayList<FunctionNode>();
		Collections.sort(list3);
		return list3;
	}

	public void setList3(List<FunctionNode> list3) {
		this.list3 = list3;
	}
	
	public JSONObject toJson() {
		JSONObject treePanel = new JSONObject();
		treePanel.put("treePanelId", getId());
		treePanel.put("treePanelTitle", ResourceUtils.getText(getKey()));
		treePanel.put("treePanelIconCls", getIconCls());
		treePanel.put("treePanelIcon", getImgSrc());
		treePanel.put("treePanelRootTreeNodeId", "TreeRoot" + getKey());
		treePanel.put("functionTypeId", getId());
		treePanel.put("tree", toTree().toRootString());
		return treePanel;
	}
	
	private TreeNode toTree() {
		TreeNode root = TreeNode.createRoot();
		List<FunctionNode> loopList = ThreadLocalUtils.getCurrentUser().isSuperAdmin() ? getList3() : getList2();            // List3 is only for super admin menu tree;
		for (FunctionNode eachFun : loopList) {
			if(eachFun.isLeaf()) {
				root.appendRootChild(toTreeNode(eachFun));
			} else {
				TreeNode secondLevel = toTreeNode(eachFun);
				secondLevel.url(eachFun.getUrl());
				root.appendRootChild(secondLevel);
				for (FunctionNode ef : eachFun.getList2()) {
					secondLevel.appendChild(toTreeNode(ef));
				}
			}
		}
		return root;
	}
	
	private TreeNode toTreeNode(FunctionNode fn) {
		TreeNode node = TreeNode.createTreeNode();
		node.id(fn.getId());
		String text = ResourceUtils.getText(fn.getKey());
		node.text(text);
		node.icon(fn.getImgSrc());
		node.iconCls(fn.getIconCls());
		node.leaf(fn.isLeaf());
		node.singleClickExpand(true);
		node.url(fn.getUrl());
		node.qtip(text);
		return node;
	}
}
