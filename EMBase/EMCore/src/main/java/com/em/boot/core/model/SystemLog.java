/**
 * 
 */
package com.em.boot.core.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.json.JSONObject;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.enums.SystemLogType;
import com.em.boot.core.utils.DateTimeUtils;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author YF
 *
 */
@Entity
@Table(schema = "public")
public class SystemLog extends AbsEntity {
	private static final long serialVersionUID = -7200274924566628330L;
	
	@Enumerated(EnumType.STRING) private SystemLogType type;
	
	@Enumerated(EnumType.STRING) private SourceEntityType referType;
	
	private String referId;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition = "timestamp with time zone")
	private Date logDate;
	
	public static SystemLog create(SystemLogType type, Ownership refer, String description) {
		SystemLog sel = new SystemLog(type, refer);
		sel.setDescription(description);
		sel.setModifiedBy(ThreadLocalUtils.getCurrentUser().getUsername());
		return sel;
	}
	public static SystemLog create(SystemLogType type, AbsSourceEntity se, String description) {
		SystemLog sel = new SystemLog(type, se.getOwnerId(), se.getOwnerType(), DateTimeUtils.dateTimeNow());
		sel.setDescription(description);
		sel.setModifiedBy(ThreadLocalUtils.getCurrentUser().getUsername());
		return sel;
	}
	
	public SystemLog(SystemLogType type, Ownership referOwnership) {
		this(type, referOwnership.getOwnerId(), referOwnership.getOwnerType(), DateTimeUtils.dateTimeNow());
	}
	protected SystemLog() {
		super();
	}
	protected SystemLog(SystemLogType type, String referId, SourceEntityType referType, Date logDate) {
		this();
		this.type = type;
		this.logDate = logDate;
		setReferId(referId);
		setReferType(referType);
	}

	public SystemLogType getType() {
		return type;
	}

	public void setType(SystemLogType type) {
		this.type = type;
	}
	public SourceEntityType getReferType() {
		return referType;
	}
	public void setReferType(SourceEntityType referType) {
		this.referType = referType;
	}
	public String getReferId() {
		return referId;
	}
	public void setReferId(String referId) {
		this.referId = referId;
	}
	public Date getLogDate() {
		return logDate;
	}

	public void setLogDate(Date logDate) {
		this.logDate = logDate;
	}

	@Override
	public String getDisplayString() {
		return getDescription();
	}
	
    public JSONObject toJSONObject() {
    	JSONObject jsonObject = super.toJSONObject();
    	jsonObject.put("type", FormatUtils.toString(type));
    	jsonObject.put("logDate", logDate == null ? "" : FormatUtils.formatDate(logDate));
    	jsonObject.put("referId", FormatUtils.toString(getReferId()));
    	jsonObject.put("referType", FormatUtils.toString(getReferType()));
    	jsonObject.put("referName", "");
    	jsonObject.put("referCode", "");
    	jsonObject.put("modifiedBy", FormatUtils.toString(getModifiedBy()));

    	return jsonObject;
    }
}