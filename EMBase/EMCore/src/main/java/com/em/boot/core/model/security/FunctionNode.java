/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.em.boot.core.utils.Strings;

/**
 * @author FengYu
 *
 */
public class FunctionNode {

	private String id;
    private String name;
	private String key;
	private String index;
    private String url;
    private Pattern pattern;
    private String imgSrc;
    private String iconCls;
    private List<FunctionNode> list;

	private Boolean leaf;
	private FunctionNodeType functionNodeType;
	
	public FunctionNode() {
		super();
	}

	public FunctionNode(FunctionNodeType functionNodeType) {
		this();
		this.functionNodeType = functionNodeType;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isMatch(String url) {
		if(pattern == null) return false;
		return pattern.matcher(url).find();
	}
	public void setPattern(String pattern) {
		if(!Strings.isEmpty(pattern)) {
			this.pattern = Pattern.compile("^" + pattern + ".+");
		}
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

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public FunctionNodeType getFunctionNodeType() {
		return functionNodeType;
	}

	public void setFunctionNodeType(FunctionNodeType functionNodeType) {
		this.functionNodeType = functionNodeType;
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
}
