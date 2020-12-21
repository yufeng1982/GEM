/**
 * 
 */
package com.em.boot.core.model.security;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.em.boot.core.utils.Strings;

/**
 * @author YF
 *
 */
public class FunctionNode implements Comparable<FunctionNode>{

	private String id;
    private String name;
	private String key;
	private String index;
    private String url;
    private Pattern pattern;
    private String imgSrc;
    private String iconCls;
    private List<FunctionNode> list;
    private List<FunctionNode> list2;
    
	private Boolean leaf;
	private FunctionNodeType functionNodeType;
	private FunctionNode parent;
	
	public FunctionNode() {
		super();
	}

	public FunctionNode(FunctionNodeType functionNodeType) {
		this();
		this.functionNodeType = functionNodeType;
	}
	public FunctionNode(String id) {
	    this();
	    this.id = id;
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
	
	public void addFunctionNode2(FunctionNode node) {
		this.getList2().add(node);
	}
	
	public List<FunctionNode> getList2() {
		if(list2 == null) list2 = new ArrayList<FunctionNode>();
		return list2;
	}

	public void setList2(List<FunctionNode> list2) {
		this.list2 = list2;
	}
	
	public FunctionNode getParent() {
		return parent;
	}

	public void setParent(FunctionNode parent) {
		this.parent = parent;
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

	@Override
	public int compareTo(FunctionNode o) {
		return this.getIndex().compareTo(o.getIndex());
	}
}
