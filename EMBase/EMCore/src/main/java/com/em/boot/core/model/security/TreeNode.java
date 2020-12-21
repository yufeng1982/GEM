/**
 * 
 */
package com.em.boot.core.model.security;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * @author YF
 *
 */
public class TreeNode {
	private JSONArray rootArray;
	private JSONObject nodeObj;
	
	private final String id = "id";
	 
	private TreeNode(boolean isRoot) {
		if (isRoot) rootArray = new JSONArray();
		else nodeObj = new JSONObject();
	}
	
	public static TreeNode createRoot() {
		return new TreeNode(true);
	}
	
	public static TreeNode createTreeNode() {
		return new TreeNode(false);
	}
	public JSONObject getNodeObj() {
		return nodeObj;
	}

	public void id(String id) {
		if (isRoot()) return;
		nodeObj.put("id", id);
	}
	public String getId() {
		if (nodeObj == null || !nodeObj.has(id)) return "";
		return nodeObj.getString(id);
	}
	public void text(String text) {
		if (isRoot()) return;
		nodeObj.put("text", text);
	} 
	
	public void qtip(String qtip) {
		if (isRoot()) return;
		nodeObj.put("qtip", qtip);
	} 
	
	public void icon(String imagePath) {
		if (isRoot()) return;
		nodeObj.put("icon", imagePath);
	}
	public void iconCls(String iconCls) {
		if (isRoot()) return;
		nodeObj.put("iconCls", iconCls);
	} 
	
	public void leaf(Boolean isLeaf) {
		if (isRoot()) return;
		nodeObj.put("leaf", isLeaf);
	}
	
	public void singleClickExpand(Boolean isSingleClickExpand) {
		if (isRoot()) return;
		nodeObj.put("singleClickExpand", isSingleClickExpand);
	} 
	
	public void expanded(Boolean expanded) {
		if (isRoot()) return;
		nodeObj.put("expanded", expanded);
	} 
	
	public void href(String href) {
		if (isRoot()) return;
		nodeObj.put("href", href);
	} 
	
	public void hrefTarget(String hrefTarget) {
		if (isRoot()) return;
		nodeObj.put("hrefTarget", hrefTarget);
	} 
	
	public void checked(boolean checked) {
		if (isRoot()) return;
		nodeObj.put("checked", checked);
	} 
	
	public void url(String url) {
		if (isRoot()) return;
		nodeObj.put("url", url);
	}
	
	public void setOtherProperty(String key, Object value) {
		if (isRoot()) return;
		nodeObj.put(key, value);
	}
	
	public void appendChild(TreeNode childNode) {
		if (isRoot()) return;
		leaf(false);
		JSONArray childrenArray = nodeObj.has("children") ? nodeObj.getJSONArray("children") : new JSONArray();
		childrenArray.put(childNode.getNodeObj());
		nodeObj.put("children", childrenArray);
	}
	
	public void appendRootChild(TreeNode rootChildNode) {
		if (!isRoot()) return;
		rootArray.put(rootChildNode.nodeObj);
	}
	
	public String toString() {
		if (isRoot()) return "";
		return nodeObj.toString();
	}
	
	public String toRootString() {
		if (!isRoot()) return "";
		return rootArray.toString();
	}
	public JSONArray toRootJSONArray() {
		if (!isRoot()) return null;
		return rootArray;
	}
	
	public boolean isRoot() {
		return nodeObj == null;
	}
}
