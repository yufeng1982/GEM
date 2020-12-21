/**
 * 
 */
package com.em.boot.core.vo;

import com.em.boot.core.enums.RoleType;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.PageInfo;

/**
 * @author YF
 *
 */
public class RoleQueryInfo extends PageInfo<Role> {
	
	private Boolean sf_EQ_isAdminRole;
	private RoleType sf_EQ_roleType;
	private User user;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public RoleType getSf_EQ_roleType() {
		return sf_EQ_roleType;
	}

	public void setSf_EQ_roleType(RoleType sf_EQ_roleType) {
		this.sf_EQ_roleType = sf_EQ_roleType;
	}

	public Boolean isSf_EQ_isAdminRole() {
		return sf_EQ_isAdminRole;
	}

	public void setSf_EQ_isAdminRole(Boolean sf_EQ_isAdminRole) {
		this.sf_EQ_isAdminRole = sf_EQ_isAdminRole;
	}

}
