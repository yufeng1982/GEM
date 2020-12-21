/**
 * 
 */
package com.em.boot.core.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;

/**
 * This suppose to be the source entity of all kinds of document lines
 * 
 * @author YF
 */
@Entity
@Table(schema = "public")
public class DocumentLineSourceEntity extends AbsSourceEntity {
	private static final long serialVersionUID = 6793762124000109455L;
	public static final String CUMULATIVE_INVENTORY_SE_OWNER_ID = "CISOID";

	@ManyToOne(fetch = FetchType.LAZY)
	private DocumentSourceEntity headerSourceEntity;
	
	public DocumentLineSourceEntity() {
		super();
	}

	/**
	 * @param ownership
	 */
	public DocumentLineSourceEntity(Ownership ownership) {
		super(ownership);
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
	public DocumentLineSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId, String code, String name, String status, Corporation corporation, String description) {
		super(sourceEntityType, sourceEntityId, code, name, status, corporation, description);
	}

	/**
	 * @param sourceEntityType
	 * @param sourceEntityId
	 */
	public DocumentLineSourceEntity(SourceEntityType sourceEntityType, String sourceEntityId) {
		super(sourceEntityType, sourceEntityId);
	}

	public void setHeaderSourceEntity(DocumentSourceEntity headerSourceEntity) {
		this.headerSourceEntity = headerSourceEntity;
	}

	public DocumentSourceEntity getHeaderSourceEntity() {
		return headerSourceEntity;
	}
	
	public String getHeaderId() {
		return headerSourceEntity.getOwnerId();
	}

}
