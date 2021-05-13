/**
 * 
 */
package com.em.boot.core.service.security;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.model.Ownership;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.Strings;

/**
 * @author YF
 *
 */
@Entity
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@Table(schema = "public", name = "organization")
@Audited
public class Corporation extends AbsCodeNameEntity implements Ownership, Comparable<Corporation> {
	private static final long serialVersionUID = -8283036857642742506L;

	private String shortName;
	private String keyWords;
	private String functionNodes;
	private String email;
	
//	@Type(type="commonEncryptedString")
	private String saltSource;
	
	public Corporation() {
		this("", "");
	}

	public Corporation(String code, String name) {
		super(code, name);
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getKeyWords() {
		return keyWords;
	}

	public void setKeyWords(String keyWords) {
		this.keyWords = keyWords;
	}

	public String getSaltSource() {
		return saltSource;
	}

	public void setSaltSource(String saltSource) {
		this.saltSource = saltSource;
	}

	public String getFunctionNodes() {
		if(functionNodes != null) return functionNodes;
		return "";
	}

	public void setFunctionNodes(String functionNodes) {
		this.functionNodes = functionNodes;
	}

	@Override
	public int compareTo(Corporation o) {
		if(o == null) return 1;
		
		Corporation cor = (Corporation) o;
		return this.getName().compareToIgnoreCase(cor.getName());
	}

	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("corporationId", FormatUtils.stringValue(getId()));
    	jo.put("shortName", FormatUtils.stringValue(shortName));
    	jo.put("keyWords", FormatUtils.stringValue(keyWords));
    	return jo;
	}

	@Override
	public String getOwnerId() {
		return getId();
	}

	@Override
	public SourceEntityType getOwnerType() {
		return SourceEntityType.Corporation;
	}

	@Override
	public String getOwnerStatus() {
		return null;
	}

	@Override
	public String getDisplayCode() {
		return getShortName();
	}

	@Override
	public String getDisplayName() {
		return getName();
	}

	@Override
	public String getSourceEntityId() {
		return null;
	}

	@Override
	public void setSourceEntityId(String sourceEntityId) {
		
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
	    return Strings.append(" - ", new StringBuffer(), getCode(), getShortName()).toString();
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
