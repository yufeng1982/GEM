package com.em.boot.core.vo;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.PageInfo;

public class UserQueryInfo extends PageInfo<User> {

	private String sf_LIKE_username;
	private Boolean sf_EQ_enabled = Boolean.TRUE;
	private Role sf_EQ_roleId;
	private User sf_EQ_createdBy;
	
	public UserQueryInfo(){
		super();
		Sort sort = Sort.by(Direction.ASC, "loginName");
		setSortObj(sort);
	}

	public String getSf_LIKE_username() {
		return sf_LIKE_username;
	}

	public void setSf_LIKE_username(String sf_LIKE_username) {
		this.sf_LIKE_username = sf_LIKE_username;
	}

	public Boolean getSf_EQ_enabled() {
		return sf_EQ_enabled;
	}

	public void setSf_EQ_enabled(Boolean sf_EQ_enabled) {
		this.sf_EQ_enabled = sf_EQ_enabled;
	}

	public Role getSf_EQ_roleId() {
		return sf_EQ_roleId;
	}

	public void setSf_EQ_roleId(Role sf_EQ_roleId) {
		this.sf_EQ_roleId = sf_EQ_roleId;
	}

	public User getSf_EQ_createdBy() {
		return sf_EQ_createdBy;
	}

	public void setSf_EQ_createdBy(User sf_EQ_createdBy) {
		this.sf_EQ_createdBy = sf_EQ_createdBy;
	}
	
	
}
