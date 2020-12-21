/**
 * 
 */
package com.em.boot.core.model;

import org.json.JSONObject;

public interface IEntity {
	
	public static final Integer SEQ_MULTIPLE = 1;
	
	/**
	 * get ID
	 * @return String
	 */
	public String getId();
	
	/**
	 * get display string
	 * @return String
	 */
	public String getDisplayString();
	
	/**
	 * to JSONObject
	 * @return JSONObject
	 */
	public JSONObject toJSONObject();
	
	/**
	 * get More info besides this entity;
	 * @return JSONObject
	 */
	public JSONObject toJSONObjectAll();
	/**
	 * if entity is new
	 * @return boolean
	 */
	public boolean isNewEntity();

}
