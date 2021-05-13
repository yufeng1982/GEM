/**
 * 
 */
package com.em.boot.core.vo;

import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.PageInfo;

/**
 * @author YF
 *
 */
public class RoleQueryInfo extends PageInfo<Role> {
	
	private Boolean sf_EQ_isAdminRole;
	
	private User sf_EQ_createdBy;

	public Boolean isSf_EQ_isAdminRole() {
		return sf_EQ_isAdminRole;
	}

	public void setSf_EQ_isAdminRole(Boolean sf_EQ_isAdminRole) {
		this.sf_EQ_isAdminRole = sf_EQ_isAdminRole;
	}

	public User getSf_EQ_createdBy() {
		return sf_EQ_createdBy;
	}

	public void setSf_EQ_createdBy(User sf_EQ_createdBy) {
		this.sf_EQ_createdBy = sf_EQ_createdBy;
	}


}
