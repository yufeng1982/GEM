
package com.em.boot.core.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.AttributeAccessor;
import org.hibernate.annotations.GenericGenerator;
import org.json.JSONObject;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.ProxyTargetConverterUtils;
import com.em.boot.core.utils.Strings;

/**
 * @author YF
 *
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "discriminator", discriminatorType = DiscriminatorType.STRING)
public class AbsSourceEntity implements Serializable, IEntity, IDelete {
	private static final long serialVersionUID = 6893584923505097918L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(length = 40)
	private String id;
	
	private String code;
	
	private String name;
	
	@Enumerated(EnumType.STRING) private SourceEntityType ownerType;
	
	private String ownerId;
	
	private String status;

	@ManyToOne(fetch = FetchType.LAZY)
	private Corporation corporation;
	
	@Column(length = 255)
	private String description;
	
	protected AbsSourceEntity() {
		super();
	}
	public AbsSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId) {
		this(sourceEntityType, sourceEntityId, "", "", "", null,"");
	}
	protected AbsSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId, String code, String name, String status, Corporation corporation, String description) {
		this();
		this.ownerType = sourceEntityType;
		this.ownerId = sourceEntityId;
		this.code = code;
		this.name = name;
		this.status = status;
		this.corporation = corporation;
		this.description = description;
	}
	
	public AbsSourceEntity(Ownership ownership) {
		this(ownership.getOwnerType(), ownership.getOwnerId(), ownership.getDisplayCode(), ownership.getDisplayName(), ownership.getOwnerStatus(), ownership.getCorporation(), ownership.getDisplayDescription());
	}

	public void setOwnership(Ownership ownership) {
		this.ownerType = ownership.getOwnerType();
		this.ownerId = ownership.getOwnerId();
		this.code = ownership.getDisplayCode();
		this.name = ownership.getDisplayName();
		this.status = ownership.getOwnerStatus();
		this.corporation = ownership.getCorporation();
		this.description = ownership.getDisplayDescription();
	}
	
	public String getId() {
		return id;
	}
	protected void setId(String id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public SourceEntityType getOwnerType() {
		return ownerType;
	}
	public void setOwnerType(SourceEntityType sourceEntityType) {
		this.ownerType = sourceEntityType;
	}
	public String getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(String sourceEntityId) {
		this.ownerId = sourceEntityId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public Corporation getCorporation() {
		return corporation;
	}
	public void setCorporation(Corporation corporation) {
		this.corporation = corporation;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((ownerType == null) ? 0 : ownerType.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null) return false;
		if (!ProxyTargetConverterUtils.getProxyImplementationObject(this).getClass().equals(ProxyTargetConverterUtils.getProxyImplementationObject(obj).getClass())) return false;
		final AbsSourceEntity other = (AbsSourceEntity) ProxyTargetConverterUtils.getProxyImplementationObject(obj);

		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id)) {
			return false;
		}
		return isSame(other);
	}
	
	public boolean isSame(AbsSourceEntity se) {
		if (ownerId == null) {
			if (se.ownerId != null) return false;
		} else if (!ownerId.equals(se.ownerId)) {
			return false;
		}
		if (ownerType == null) {
			if (se.ownerType != null) return false;
		} else if (!ownerType.equals(se.ownerType)) {
			return false;
		}
		return true;
	}
	@Override
	public String getDisplayString() {
		return getCode();
	}
	@Override
	public JSONObject toJSONObject() {
		JSONObject jo = new JSONObject();
		jo.put("id", FormatUtils.stringValue(id));
		jo.put("sourceEntityId", FormatUtils.stringValue(id)); //hack for the searching select search use
		jo.put("ownerId", FormatUtils.stringValue(ownerId));
		jo.put("ownerType", FormatUtils.stringValue(ownerType));
		jo.put("code", FormatUtils.stringValue(code));
		jo.put("name", FormatUtils.stringValue(name));
		jo.put("status", FormatUtils.stringValue(status));
		jo.put("description", FormatUtils.stringValue(description));
		return jo;
	}
	
    public boolean isNewEntity() {
		return Strings.isEmpty(id);
	}
	@Override
	public boolean isRealDelete() {
		return true;
	}
	@Override
	public void setToInactive() {}
	
	@Override
	public JSONObject toJSONObjectAll() {
		return toJSONObject();
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDescription() {
		return description;
	}
//	public boolean isDocumentSourceEntity() {
//		return DocumentSourceEntity.class.equals(this.getOwnerType().getSourceEntityClazz());
//	}
//	public boolean isDocumentLineSourceEntity() {
//		return DocumentLineSourceEntity.class.equals(this.getOwnerType().getSourceEntityClazz());
//	}
//	public boolean isCrmSourceEntity() {
//		return CrmSourceEntity.class.equals(this.getOwnerType().getSourceEntityClazz());
//	}
//	public boolean isProductSourceEntity() {
//		return ProductSourceEntity.class.equals(this.getOwnerType().getSourceEntityClazz());
//	}
	
}
