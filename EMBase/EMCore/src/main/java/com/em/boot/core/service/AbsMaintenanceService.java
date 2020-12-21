/**
 * 
 */
package com.em.boot.core.service;

import org.json.JSONArray;
import org.json.JSONObject;

import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.model.IMaintenance;
import com.em.boot.core.utils.PageInfo;

/**
 * @author YF
 *
 */
public abstract class AbsMaintenanceService<T extends AbsCodeNameEntity, P extends PageInfo<T>> extends AbsCodeNameEntityService<T, P> {

	
	public JSONArray buildStore(Iterable<T> modelList) {
		JSONArray jsonArray = new JSONArray();
		for(IMaintenance m : modelList){
			JSONObject record = m.toJSONObject();
			jsonArray.put(record);
		}
		return jsonArray;
	}

}
