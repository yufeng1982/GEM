package com.em.boot.core.enums;

import java.util.EnumSet;

import com.em.boot.core.model.IEnum;
import com.em.boot.core.utils.ResourceUtils;

public enum RoleType implements IEnum {
	OrganizationRole, GroupRole;
    
	@Override
	public String getKey() {
		return new StringBuffer().append("RoleType.").append(name()).toString();
	}

	@Override
	public String getText() {
		return ResourceUtils.getText(getKey());
	}

	@Override
	public String getName() {
		return name();
	}
	
	public static EnumSet<RoleType> getRoleType() {
		return EnumSet.allOf(RoleType.class);
	}
}
