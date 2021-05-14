/**
\ * @author FengYu
 */
package com.em.boot.core.enums;

import java.text.ParseException;
import java.util.EnumSet;

import org.json.JSONArray;
import org.json.JSONObject;

import com.em.boot.core.exceptions.SourceEntityError;
import com.em.boot.core.model.ColumnConfig;
import com.em.boot.core.model.IEnum;
import com.em.boot.core.utils.AppUtils;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.XType;

public enum MaintenanceType implements IEnum , XType {
	
	Position {
		@Override public Class<?> getClazz() { return getRealClazz("com.ods.core.model.Position"); }
		@Override public String getSearchUrl() { return "/app/" + AppUtils.APP_NAME + "/hr/position/json"; }
		@Override public JSONArray getColumModel() {
			JSONArray ja = getDefaultColumModelWithDescription();
			return ja;
		}
	},
	ArticleCategory {
		@Override public Class<?> getClazz() { return getRealClazz("com.em.boot.core.model.article.ArticleCategory"); }
		@Override public String getSearchUrl() { return "/app/" + AppUtils.APP_NAME + "/articleCategory/json"; }
		@Override public JSONArray getColumModel() {
			JSONArray ja = getDefaultColumModelWithDescription();
			return ja;
		}
	};

	public static EnumSet<MaintenanceType> getMaintenanceTypes() {
		return EnumSet.allOf(MaintenanceType.class);
	}

//	MaintenanceType() {}
	
	public abstract String getSearchUrl();
	public abstract Class<?> getClazz();
	
	public JSONArray getColumModel(){
		return getDefaultColumModel();
	}
	public String getHiddenColumns(){
		return "id";
	}
	
	public static JSONArray getDefaultColumModel(){
		JSONArray ja = new JSONArray();
		ja.put(ColumnConfig.getStringColumn("id"));
		ja.put(ColumnConfig.getStringColumn("code", false, true));
		ja.put(ColumnConfig.getStringColumn("name", false));
		ja.put(ColumnConfig.getHiddenColumn("displayString"));
		return ja;
	}
	public static JSONArray getDefaultColumModelWithDescription(){
		JSONArray ja = getDefaultColumModel();
		ja.put(ColumnConfig.getStringColumn("description", true, false));
		return ja;
	}
	
	public String getStoreFieldArray(){
		JSONArray array = getColumModel();
		StringBuffer strbff = new StringBuffer("[");
		for(int i  = 0; i < array.length(); i++){
			JSONObject jsobj = array.getJSONObject(i);
			strbff.append("'").append(jsobj.getString("id")).append("'");
			if(i != array.length() - 1){
				strbff.append(",");
			}
		}
		strbff.append("]");
		return strbff.toString();
	}
	
	public String getKey() {
		return new StringBuffer().append("FN.").append(name()).toString();
	}
	protected Class<?> getRealClazz(String strClazz) {
		if("emp".equals(AppUtils.APP_NAME))
			try {
				return Class.forName(strClazz);
			} catch (ClassNotFoundException e) {
				throw new SourceEntityError(SourceEntityError.SOURCE_TYPE_CLAZZ_ERROR);
			}
		return null;
	}
	public String getParameterNames() {
		return "";
	}
	public String getSaveParameterNames() {
		return "";
	}
	public String getGridUrl(){
		return "/maintenance/_includes/_maintenanceGrid";
	}
	
	public String getGridInitMethod(){
		return "";
	}
	
	public String getGridConfigName(){
		return "";
	}
	
	public String getGridInitParameters(){
		return "";
	}
	
	public String getValueField(){
		return "id";
	}
	public String getDisplayField(){
		return "displayString";
	}
	public String getNameField(){
		return "name";
	}
	
	public String getOptionsTemplate(){
		return "{" + getDisplayField() + "}";
	}
	
	public String getText() {
		return ResourceUtils.getText(getKey());
	}
	
	public String getName() {
		return name();
	}
	
	public static MaintenanceType fromName(String name) {
    	if(Strings.isEmpty(name)) return null;
        return MaintenanceType.valueOf(name);
	}
	
	public String toString() {
		return getText();
	}
	
	@Override
	public JSONObject regXtype() {
		JSONObject jo = new JSONObject();
		try {
			jo.put("modelName", getName());
			jo.put("storeFieldArray", new JSONArray(getStoreFieldArray()));
			jo.put("valueField", getValueField());
			jo.put("displayField", getDisplayField());
			jo.put("searchUrl", getSearchUrl());
			jo.put("gridUrl", getGridUrl());
//			jo.put("gridInitMethod", getGridInitMethod());
			jo.put("parameters", new JSONObject());
			jo.put("mtype", getName());
			jo.put("gridInitParameters", getGridInitParameters());
			jo.put("optionsTemplate", getOptionsTemplate());
		} catch (NullPointerException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return jo;
	}
}
