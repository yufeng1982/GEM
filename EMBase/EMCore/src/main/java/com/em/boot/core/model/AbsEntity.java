/**
 * 
 */
package com.em.boot.core.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.persistence.Version;

import org.hibernate.annotations.AttributeAccessor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;
import org.json.JSONObject;

import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.Strings;



@MappedSuperclass
public abstract class AbsEntity implements IEntity, IDelete, Serializable {
	private static final long serialVersionUID = -6684519880340264939L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
	@Column(length = 40)
	private String id;

	@Column(columnDefinition = "text")
	private String description;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition = "timestamp with time zone")
	private Date creationDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition = "timestamp with time zone")
	private Date modificationDate;

	private String createdBy;

	private String modifiedBy;

	@ManyToOne
	@Audited(targetAuditMode=RelationTargetAuditMode.NOT_AUDITED)
	private Corporation corporation;

	@Type(type = "true_false")
	@Audited
	private Boolean active = Boolean.TRUE;

	@Version
	private Integer version;

	@Transient
	private Integer originVersion;

	public AbsEntity() {
		super();
	}

	public AbsEntity(Corporation corporation) {
		this();
		this.corporation = corporation;
	}

	public String getId() {
		return id;
	}

	protected void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getModificationDate() {
		return modificationDate;
	}

	public void setModificationDate(Date modificationDate) {
		this.modificationDate = modificationDate;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Corporation getCorporation() {
		return corporation;
	}

	public void setCorporation(Corporation corporation) {
		this.corporation = corporation;
	}
	
	public Boolean isActive() {
		if(active == null) return Boolean.FALSE;
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Integer getOriginVersion() {
		if (originVersion == null) {
			this.originVersion = this.version;
		}
		return originVersion;
	}

	public void setOriginVersion() {
		this.originVersion = this.version;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		setOriginVersion();
		this.version = version;
	}

//	@Override
//	public boolean equals(Object obj) {
//		if (obj == null) return false;
//		if (this == obj) return true;
//
//		if (!ClassUtils.getProxyImplementationObject(this).getClass().equals(ClassUtils.getProxyImplementationObject(obj).getClass())) return false;
//		
//		final AbsEntity other = (AbsEntity) ClassUtils.getProxyImplementationObject(obj);
//		if (id == null) {
//			if (other.id != null)
//				return false;
//		} else if (!id.equals(other.id)) {
//			return false;
//		}
//		return true;
//	}
//
//	@AssertFalse(message = EntityOptimisticLockingFailureException.OPTIMISTIC_FAILURE_ERROR_KEY)
//	public boolean isOptimisticLockingFailure() {
//		if (getOriginVersion() == null)
//			return false;
//		boolean isBadVersion = !getOriginVersion().equals(this.version);
//		originVersion = null;
//		return isBadVersion;
//	}

	@Override
	public int hashCode() {
		return (id == null) ? 0 : id.hashCode();
	}

	@Override
	public JSONObject toJSONObject() {
		JSONObject jo = new JSONObject();
		return jo;
	}
	
	@Override
	public JSONObject toJSONObjectAll() {
		return toJSONObject();
	}
	public JSONObject toInquiryJSONObject() {
		return toJSONObject();
	}

	public JSONObject getExtraInfo() {
		JSONObject jsonObject = new JSONObject();
		return jsonObject;
	}

	@Override
	public boolean isNewEntity() {
		return Strings.isEmpty(getId());
	}

	@Override
	public boolean isRealDelete() {
		return false;
	}

	@Override
	public void setToInactive() {
		this.setActive(false);
	}
	
	public String getDisplayDescription() {
		return null;
	}

	public Boolean getActive() {
		return active;
	}
	
	public boolean isIgnore() {
		return false;
	}
	
	
	protected void clearNotCopyFields(AbsEntity entity) {
		entity.setCreationDate(null);
		entity.setModificationDate(null);
		entity.setCreatedBy(null);
		entity.setModifiedBy(null);
	}
	
}
