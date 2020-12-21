package com.em.boot.core.vo;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.PageInfo;

public class UserQueryInfo extends PageInfo<User> {

	private String sf_LIKE_loginName;
	private Boolean sf_EQ_enabled = Boolean.TRUE;
//	private Role sf_EQ_roleId;
	
	public UserQueryInfo(){
		super();
		Sort sort = new Sort(Direction.ASC, "loginName");
		setSortObj(sort);
	}

	public String getSf_LIKE_loginName() {
		return sf_LIKE_loginName;
	}

	public void setSf_LIKE_loginName(String sf_LIKE_loginName) {
		this.sf_LIKE_loginName = sf_LIKE_loginName;
	}

	public Boolean getSf_EQ_enabled() {
		return sf_EQ_enabled;
	}

	public void setSf_EQ_enabled(Boolean sf_EQ_enabled) {
		this.sf_EQ_enabled = sf_EQ_enabled;
	}

//	public Role getSf_EQ_roleId() {
//		return sf_EQ_roleId;
//	}
//
//	public void setSf_EQ_roleId(Role sf_EQ_roleId) {
//		this.sf_EQ_roleId = sf_EQ_roleId;
//	}
}
