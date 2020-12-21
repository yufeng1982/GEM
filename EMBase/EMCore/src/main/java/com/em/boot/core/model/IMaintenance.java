/**
 * 
 */
package com.em.boot.core.model;

import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.service.security.Corporation;

public interface IMaintenance extends IEntity {
	
//	public JSONArray buildColumModel();
//	public String getShowedColumns();
	public MaintenanceType getMaintenanceType();
	public void setCorporation(Corporation corporation);
	public Corporation getCorporation();
	public String getSavePermission();
	public String getDeletePermission();
}
