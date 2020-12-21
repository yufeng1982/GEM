/**
 * 
 */
package com.em.boot.core.model;


public interface IDelete {
	/**
	 * entity is going to delete or update to inactive
	 * @return boolean
	 */
	public boolean isRealDelete();
	
	/**
	 * update to inactive when delete
	 */
	public void setToInactive();
}
