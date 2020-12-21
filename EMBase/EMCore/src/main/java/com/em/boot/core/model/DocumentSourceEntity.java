/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;

/**
 * This suppose to be the source entity of all kinds of document headers
 * 
 * @author YF
 */
@Entity
@Table(schema = "public")
public class DocumentSourceEntity extends AbsSourceEntity {
	private static final long serialVersionUID = 1876524547171652091L;

	public DocumentSourceEntity() {
		super();
	}

	/**
	 * @param sourceEntityType
	 * @param sourceEntityId
	 */
	public DocumentSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId) {
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
	public DocumentSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId, String code, String name, String status, Corporation corporation, String description) {
		super(sourceEntityType, sourceEntityId, code, name, status, corporation, description);
	}

	/**
	 * @param ownership
	 */
	public DocumentSourceEntity(Ownership ownership) {
		super(ownership);
	}

}
