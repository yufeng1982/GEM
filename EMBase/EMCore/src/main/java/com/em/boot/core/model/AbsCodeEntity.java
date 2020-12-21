/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.MappedSuperclass;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.FormatUtils;

@MappedSuperclass
public class AbsCodeEntity extends AbsEntity {
	private static final long serialVersionUID = 7487113646045545686L;

	@Audited
	private String code;

	public AbsCodeEntity(String code) {
		super();
		this.code = code;
	}

	public AbsCodeEntity(String code, Corporation corporation) {
		super(corporation);
		this.code = code;
	}

	public AbsCodeEntity() {
		super();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public void setCode(Integer code) {
		setCode(code != null ? code.toString() : "");
	}
	
	public void setCode(Double code) {
		setCode(code != null ? code.toString() : "");
	}
	
	public void setCode(Long code) {
		setCode(code != null ? code.toString() : "");
	}
	
	public void setCodeNull() {
		this.code = null;
	}

	@Override
	public String getDisplayString() {
		return getCode();
	}

	public String getOwnerGroupSourceEntityId() {
		return "";
	}

//	public Language getOwnerLanguage() {
//		return null;
//	}
	
	@Override
	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("code", FormatUtils.toString(code));
    	return jo;
    }
	
	public boolean isAbleManualInput() {
		return false;
	}
}
