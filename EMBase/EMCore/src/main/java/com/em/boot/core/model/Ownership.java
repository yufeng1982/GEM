/**
 * 
 */
package com.em.boot.core.model;

import com.em.boot.core.enums.SourceEntityType;
import com.em.boot.core.service.security.Corporation;


/**
 * @author ryan
 *
 */
public interface Ownership {

	public String getOwnerId();
	
	public SourceEntityType getOwnerType();
	
	public String getOwnerStatus();
	
	public String getDisplayCode();
	
	public String getDisplayName();
	
	public Corporation getCorporation();
	
	public String getDisplayDescription();
	
	public String getSourceEntityId();
	
	public void setSourceEntityId(String sourceEntityId);
}
