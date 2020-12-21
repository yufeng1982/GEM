/**
 * 
 */
package com.em.boot.core.model.security;

import java.text.ParseException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;
import org.json.JSONObject;
import org.springframework.beans.BeanUtils;

import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.enums.RoleType;
import com.em.boot.core.model.AbsCodeNameEntity;

/**
 * @author YF
 *
 */
@Entity
@Table(schema = "public")
@Audited
public class Role extends AbsCodeNameEntity {
	private static final long serialVersionUID = -7558841459726750931L;

	@Column(columnDefinition = "text")
	private String functionNodeIds;
	
	@Column(columnDefinition = "text")
	private String resources; // {fnID1:[{arID1:operation, arID2:operation, ...},{}], fnID2:[],...}

	@Type(type = "true_false")
	private Boolean isAdminRole = Boolean.FALSE;
	
	@Enumerated(EnumType.STRING)
	private RoleType roleType = RoleType.OrganizationRole;
	
	private String companyIds;
	
	private String companyCodes;
	
	public Role() {
		this("", "");
	}
	
	public Role(String code, String name) {
		super(code, name);
		this.isAdminRole = false;
		resources = new JSONObject().toString();
	}
	
	public String getFunctionNodeIds() {
		return functionNodeIds;
	}
	public void setFunctionNodeIds(String functionNodeIds) {
		this.functionNodeIds = functionNodeIds;
	}
	
	public String getResources() {
		if(resources == null) resources = new JSONObject().toString();
		return resources;
	}
	public void setResources(String resources) {
		this.resources = resources;
	}
	public void setResources(JSONObject json) {
		jsonResources = json;
		this.resources = json.toString();
	}
	
	public RoleType getRoleType() {
		return roleType;
	}
	public void setRoleType(RoleType roleType) {
		this.roleType = roleType;
	}
	public Boolean isAdminRole() {
		return isAdminRole;
	}
	public void setIsAdminRole(Boolean isAdminRole) {
		this.isAdminRole = isAdminRole;
	}

	public String getCompanyIds() {
		return companyIds;
	}
	public void setCompanyIds(String companyIds) {
		this.companyIds = companyIds;
	}
	public String getCompanyCodes() {
		return companyCodes;
	}
	public void setCompanyCodes(String companyCodes) {
		this.companyCodes = companyCodes;
	}

	@Transient
	private JSONObject jsonResources;
	public JSONObject getJSONResources() {
		if(jsonResources == null) {
			try {
				jsonResources = new JSONObject(this.getResources());
			} catch (ParseException e) {
				jsonResources = new JSONObject();
			}
		}
		return jsonResources;
	}
	public String getRoleName() {
		return "ROLE_" + getName();
	}

	public static Role copy(Role role) {
		Role newRole = new Role();
		BeanUtils.copyProperties(role, newRole);
		newRole.setName("");
		return newRole;
	}
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	
	@Override
	public MaintenanceType getMaintenanceType() {
		return null;
	}
	@Override
	public String getSavePermission() {
		return null;
	}
	@Override
	public String getDeletePermission() {
		return null;
	}
	@Override
	public String getDisplayString() {
		return this.getName();
	}
}