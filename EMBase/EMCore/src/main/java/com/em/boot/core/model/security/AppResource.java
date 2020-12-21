/**
 * 
 */
package com.em.boot.core.model.security;

import org.json.JSONObject;

import com.em.boot.core.model.IEntity;

/**
 * @author YF
 *
 */
public class AppResource implements IEntity {
	private String id;
	private String key;
	private FunctionNode fn;
	private String category;
	private String auditColumnCofig;
	
	public AppResource(FunctionNode fn) {
		super();
		this.fn = fn;
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
	public FunctionNode getFn() {
		return fn;
	}
	public void setFn(FunctionNode fn) {
		this.fn = fn;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	
	public enum CategoryType {
		portlet, button, text, checkbox, select, searchingSelect, treeInfoLog, gridColumn, div;
	}
	
	public boolean isChecked(Role role, SecurityLevel operation) {
		String idWithNode = getFn().getId() + "_" + getId();
		if(role != null && role.getJSONResources().has(idWithNode)) {
			JSONObject jo = role.getJSONResources();
			return jo.getString(idWithNode).indexOf(operation.getName()) > -1 ? true : false;
		}
		return false;
	}

	@Override
	public String getDisplayString() {
		return null;
	}

	@Override
	public JSONObject toJSONObject() {
		return null;
	}

	@Override
	public JSONObject toJSONObjectAll() {
		return null;
	}

	@Override
	public boolean isNewEntity() {
		return false;
	}

	public String getAuditColumnCofig() {
	    return auditColumnCofig;
	}

	public void setAuditColumnCofig(String auditColumnCofig) {
	    this.auditColumnCofig = auditColumnCofig;
	}

}
