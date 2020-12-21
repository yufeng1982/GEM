/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;

/**
 * This suppose to be the source entity of Item / Misc Charge
 * 
 * @author YF
 */
@Entity
@Table(schema = "public")
public class ProductSourceEntity extends AbsSourceEntity {
	private static final long serialVersionUID = -4823617387666931905L;

	public ProductSourceEntity() {
		super();
	}

	/**
	 * @param sourceEntityType
	 * @param sourceEntityId
	 */
	public ProductSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId) {
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
	public ProductSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId, String code, String name, String status, Corporation corporation, String description) {
		super(sourceEntityType, sourceEntityId, code, name, status, corporation, description);
	}

	/**
	 * @param ownership
	 */
	public ProductSourceEntity(Ownership ownership) {
		super(ownership);
	}

}
