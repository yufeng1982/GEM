/**
 * 
 */
package com.em.boot.core.enums;

import java.util.EnumSet;

import org.json.JSONArray;
import org.json.JSONObject;

import com.em.boot.core.exceptions.SourceEntityError;
import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.model.IEnum;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.AppUtils;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.XType;

/**
 * @author YF
 *
 */
public enum SourceEntityType implements IEnum , XType {

	Employee {
		@Override public Class<?> getClazz() { return getRealClazz("com.ods.emp.model.Employee", AbsCodeNameEntity.class); }
		@Override public String getGridListUrl() { return "/app/" +AppUtils.APP_NAME+ "/hr/employee/list"; }
		@Override public String getSearchUrl() { return "/app/"+AppUtils.APP_NAME+"/hr/employee/list/json"; }
		@Override public String getGridUrl() { return "hr/employee/_includes/_employeesGrid"; }
		@Override public boolean isChangable() { return false; }
		@Override public String getOptionsTemplate(){ return"{code} - {firstName}"; }
		@Override public Class<?> getSourceEntityClazz() {return null;}
	},
	Corporation {
		@Override public Class<Corporation> getClazz() { return Corporation.class; }
		@Override public Class<?> getSourceEntityClazz() {return null;}
		@Override public String getGridListUrl() { return "/app/" +AppUtils.APP_NAME+ "/organization/list"; }
		@Override public String getSearchUrl() { return "/app/"+AppUtils.APP_NAME+"/organization/list/json"; }
		@Override public String getGridUrl() { return "security/organization/_includes/_organizationsGrid"; }
		@Override public boolean isChangable() { return false; }
		@Override public boolean isCreatable() { return false; }
	},
	Organization {
		@Override public Class<?> getClazz() { return getRealClazz("com.ods.emp.model.Organization", AbsCodeNameEntity.class); }
		@Override public Class<?> getSourceEntityClazz() {return null;}
		@Override public String getGridListUrl() { return "/app/" +AppUtils.APP_NAME+ "/organization/list/show"; }
		@Override public String getSearchUrl() { return "/app/"+AppUtils.APP_NAME+"/organization/list/json"; }
		@Override public String getGridUrl() { return "security/organization/_includes/_organizationsGrid"; }
		@Override public boolean isChangable() { return false; }
		@Override public String getOptionsTemplate(){ return "{code} - {shortName}"; }
		@Override public String getNameField() { return "shortName"; }
	};
	
	public static EnumSet<SourceEntityType> getSourceEntityTypes() {
		return EnumSet.allOf(SourceEntityType.class);
	}
	

	SourceEntityType() {}

	public String getKey() {
		return getClazz().getName();
	}
	
	public String getSearchUrl() { return ""; }
	public String getGridUrl() { return ""; }
	public String getFindUrl() { return ""; }
	public String getGridConfigName() { return ""; }
	public String getGridInitParameters() { return ""; }
	public String getValueField() { return "id"; }
	public String getDisplayField() { return "displayString"; }
	public String getNameField() { return "name"; }
	public String getGridListUrl() { return ""; }
	public boolean isChangable() { return true; }
	public boolean isLogable() { return false; }
	public boolean isCreatable() { return true; }
	public String getLauncher(String id) {
		JSONObject jo = new JSONObject();
		jo.put("showMethodName", "show" + getName());
		jo.put("id", id);
		return jo.toString();
	}
	
	public abstract Class<?> getClazz();
	public abstract Class<?> getSourceEntityClazz();
	protected Class<?> getRealClazz(String clazzName, Class<?> clazz) {
		if("emp".equals(AppUtils.APP_NAME)){
			try {
				return Class.forName(clazzName);
			} catch (ClassNotFoundException e) {
				throw new SourceEntityError(SourceEntityError.SOURCE_TYPE_CLAZZ_ERROR);
			}
		}
		return clazz;
		
	}
	public String getText() {
		return ResourceUtils.getText(getKey());
	}
	public String getName() {
		return name();
	}
	public static SourceEntityType fromName(String name) {
    	if(Strings.isEmpty(name)) return null;
        return SourceEntityType.valueOf(name);
	}
	
	public String toString() {
		return getText();
	}
	
	@Override
	public JSONObject regXtype() {
		JSONObject jo = new JSONObject();
		try {
			jo.put("modelName", getName());
			jo.put("storeFieldArray", getStoreFieldArray());
			jo.put("valueField", getValueField());
			jo.put("displayField", getDisplayField());
			jo.put("searchUrl", getSearchUrl());
			jo.put("gridUrl", getGridUrl());
			jo.put("gridInitParameters", getGridInitParameters());
			jo.put("optionsTemplate", getOptionsTemplate());
			jo.put("gridConfigName", getGridConfigName());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return jo;
	}
	
	public JSONArray getStoreFieldArray(){
		JSONArray array = new JSONArray();
		array.put(getValueField());
		array.put(getDisplayField());
		array.put(getNameField());
		return array;
	}
	
	public String getOptionsTemplate(){
		return "{" + getDisplayField() + "}";
	}
	
}
