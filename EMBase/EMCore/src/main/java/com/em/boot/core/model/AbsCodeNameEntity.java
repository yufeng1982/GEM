/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.MappedSuperclass;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.Strings;

@MappedSuperclass
public abstract class AbsCodeNameEntity extends AbsCodeEntity implements IMaintenance {
	private static final long serialVersionUID = 5035040484773248500L;
	
	@Audited
	private String name;
	
	public AbsCodeNameEntity() {
		super();
	}

	public AbsCodeNameEntity(String code, String name) {
		super(code);
		this.name = name;
	}

	public AbsCodeNameEntity(String code, String name, Corporation corporation) {
		super(code, corporation);
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String getDisplayString() {
		return Strings.append(" - ", new StringBuffer(), getCode(), getName()).toString();
	}
	
	@Override
	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("name", FormatUtils.toString(name));
    	return jo;
    }

	@Override
	public MaintenanceType getMaintenanceType() {
		return null;
	}
}
