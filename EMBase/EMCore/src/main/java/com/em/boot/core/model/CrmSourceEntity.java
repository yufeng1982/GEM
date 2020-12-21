
/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;


/**
 * This suppose to be the source entity of customer / vendor
 * 
 * @author YF
 */
@Entity
@Table(schema = "public")
public class CrmSourceEntity extends AbsSourceEntity{

	private static final long serialVersionUID = 4347026622336585191L;

	public CrmSourceEntity() {
		super();
	}

	/**
	 * @param sourceEntityType
	 * @param sourceEntityId
	 */
	public CrmSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId) {
		super(sourceEntityType, sourceEntityId);
	}

	/**
	 * 
	 * @param sourceEntityType
	 * @param sourceEntityId
	 * @param code
	 * @param name
	 * @param status
	 * @param corporation
	 */
	public CrmSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId, String code, String name, String status, Corporation corporation, String description) {
		super(sourceEntityType, sourceEntityId, code, name, status, corporation, description);
	}

	/**
	 * @param ownership
	 */
	public CrmSourceEntity(Ownership ownership) {
		super(ownership);
	}

}
