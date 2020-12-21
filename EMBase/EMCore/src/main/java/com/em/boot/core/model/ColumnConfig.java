/**
 * 
 */
package com.em.boot.core.model;

import java.lang.reflect.Field;

import org.json.JSONObject;

import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.utils.JsonUtils;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;

/**
 * @author YF
 *
 */
public class ColumnConfig {

	public static final String FIELD_TYPE_KEY = "fieldType";
	public static final String FIELD_DEFAULT_VALUE = "defaultValue";
	public static final String FIELD_DATE_FORMAT = "dateFormat";
	public static final String HEADER_KEY = "header";
	public static final String DATA_INDEX_KEY = "dataIndex";
	public static final String ID_KEY = "id";
	public static final String EDITABLE_KEY = "editable";
	public static final String DISABLED_KEY = "disable";
	public static final String ALLOW_BLANK_KEY = "notNull";
	public static final String MIN_VALUE_KEY = "minValue";
	public static final String MAX_VALUE_KEY = "maxValue";
	public static final String DECIMAL_NUMBER = "decimalPrecision";
	public static final String RESETABLE_AFTET_SAVED = "resetableAfterSaved";
	public static final String DEFAULT_MESSAGE_PREFIX = "Com.";
	public static final int DEFAULT_WIDTH = 100;
	public static final int DEFAULT_DIGIT = 2;
	
	public static JSONObject getStringColumn(String id) {
		return getStringColumn(id, "") ;
	}
	public static JSONObject getStringColumn(String id, String headerKey) {
		return getStringColumn(id, true, headerKey) ;
	}

	public static JSONObject getStringColumn(String id, boolean allowBlank) {
		return getStringColumn(id, allowBlank, "");
	}
	public static JSONObject getStringColumn(String id, boolean allowBlank, String headerKey) {
		return getStringColumn(id, allowBlank, false, headerKey);
	}
	
	public static JSONObject getStringColumn(String id, boolean allowBlank, boolean isUnique) {
		return getStringColumn(id, allowBlank, isUnique , "");
	}
	public static JSONObject getStringColumn(String id, boolean allowBlank, boolean isUnique, String headerKey) {
		JSONObject jo = new JSONObject();
		jo.put(FIELD_TYPE_KEY,"text");
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		if(isUnique){
			jo.put("unique", true);
		}
		putDefaultValue(jo, id, headerKey, false);
		return jo;
	}
	
	public static JSONObject getHiddenColumn(String id) {
		JSONObject jo = new JSONObject();

		putDefaultValue(jo, id, "", true);
		
		
		jo.put("hidden", true);
		if(jo.has(HEADER_KEY)) jo.remove(HEADER_KEY);
		if(jo.has(EDITABLE_KEY)) jo.remove(EDITABLE_KEY);
		return jo;
	}
	
	@SuppressWarnings("rawtypes")
	public static JSONObject getComboBoxColumn(String id ,Class clazz ) {
		return getComboBoxColumn(id,clazz, null , true);
	}
	
	@SuppressWarnings("rawtypes")
	public static JSONObject getComboBoxColumn(String id ,Class clazz , String methodName) {
		return getComboBoxColumn(id,clazz, methodName , true);
	}
	
	@SuppressWarnings("rawtypes")
	public static JSONObject getComboBoxColumn(String id ,Class clazz, String methodName , boolean allowBlank, String headerKey) {
		JSONObject jo = new JSONObject();
		jo.put(FIELD_TYPE_KEY, "combobox");
		jo.put("controlData", JsonUtils.getEnmuDataByClazz(clazz , methodName));
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		putDefaultValue(jo, id, headerKey, false);
		return jo;
	}
	
	@SuppressWarnings("rawtypes")
	public static JSONObject getComboBoxColumn(String id ,Class clazz, String methodName , boolean allowBlank) {
		return getComboBoxColumn(id, clazz, methodName , allowBlank, "");
	}

	@SuppressWarnings("unused")
	private static JSONObject getComboBoxColumn(Field field) {
		return getComboBoxColumn(field.getName(), field.getType());
	}

//	private static JSONObject getBrowserButtonColumn(Field field ) {
//		return getBrowserButtonColumn(field.getName());
//	}
	public static JSONObject getBrowserButtonColumn(String id, JSONObject parameters, String msgKey, MaintenanceType maintenanceType) {
		return getBrowserButtonColumn(id, parameters, msgKey, maintenanceType, false);
	} 
	public static JSONObject getBrowserButtonColumn(String id, JSONObject parameters, String msgKey, MaintenanceType maintenanceType, boolean allowBlank) {
		if(maintenanceType == null) return null;
		String gridUrl = maintenanceType.getGridUrl();
		String mtype = maintenanceType.name();
		return getBrowserButtonColumn(id, gridUrl, parameters, "G_CONFIG", allowBlank, msgKey, false, mtype);
	} 
	
	public static JSONObject getBrowserButtonColumn(String id, String gridUrl, JSONObject parameters, String gridConfigName ) {
		return getBrowserButtonColumn(id, gridUrl, parameters, gridConfigName, true );
	}
	
	public static JSONObject getBrowserButtonColumn(String id, String gridUrl, JSONObject parameters, String gridConfigName, boolean allowBlank) {
		return getBrowserButtonColumn(id, gridUrl, parameters, gridConfigName ,allowBlank, null);
	}
	
	public static JSONObject getBrowserButtonColumn(String id, String gridUrl, JSONObject parameters, String gridConfigName, boolean allowBlank, String msgKey) {
		return getBrowserButtonColumn(id, gridUrl, parameters, gridConfigName, allowBlank, msgKey, true , null);
	}
	
	public static JSONObject getBrowserButtonColumn(String id, String gridUrl, JSONObject parameters, String gridConfigName, boolean allowBlank, String msgKey, boolean searchable, String mtype) {
		JSONObject jo = new JSONObject();
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		jo.put("browserButtonColumn", true);
		jo.put(FIELD_TYPE_KEY,"browerButton");
		jo.put("gridUrl", gridUrl);
		jo.put("popupSelectOnClick", "popupSelect_onclick");
		if(parameters == null) parameters = new JSONObject();
		jo.put("parameters", parameters);
		jo.put("mtype", mtype);
		jo.put("gridConfigName", gridConfigName);
		jo.put("searchable", searchable);
		jo.put("multiple", false);
		putDefaultValue(jo, id, msgKey, false);
		return jo; 
	}
	
	public static JSONObject getDateColumn(String id, boolean allowBlank) {
		JSONObject jo = new JSONObject();
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		jo.put(FIELD_TYPE_KEY, "date");
		jo.put(FIELD_DATE_FORMAT, "Y-m-d");
		putDefaultValue(jo, id);
		return jo;
	}
	
	public static JSONObject getDateColumn(String id) {
		return getDateColumn(id, true);
	}
	public static JSONObject getNumberColumn(String id) {
		return getNumberColumn(id, true);
	}
	public static JSONObject getNumberColumn(String id, boolean allowBlank) {
		return getNumberColumn(id, allowBlank, "");
	}
	public static JSONObject getNumberColumn(String id, boolean allowBlank, String headerKey) {
		return getNumberColumn(id, allowBlank, headerKey, Integer.MIN_VALUE, Integer.MAX_VALUE);
	}
	public static JSONObject getNumberColumn(String id, boolean allowBlank, String headerKey, double min, double max) {
		return getNumberColumn(id, allowBlank, headerKey, min, max, DEFAULT_DIGIT);
	}
	public static JSONObject getNumberColumn(String id, int decimalNumber) {
		return getNumberColumn(id, false, decimalNumber);
	}
	public static JSONObject getNumberColumn(String id, boolean allowBlank, int decimalNumber) {
		return getNumberColumn(id, allowBlank, "", Integer.MIN_VALUE, Integer.MAX_VALUE, decimalNumber);
	}
	public static JSONObject getNumberColumn(String id, boolean allowBlank, String headerKey, double min, double max, int decimalNumber) {
		JSONObject jo = new JSONObject();
		jo.put(FIELD_TYPE_KEY, "number");
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		jo.put(MIN_VALUE_KEY, min);
		jo.put(MAX_VALUE_KEY, max);
		jo.put(DECIMAL_NUMBER, decimalNumber);
		putDefaultValue(jo, id, headerKey, false);
		return jo;
	}
	public static JSONObject getCheckColumn(String id) {
		JSONObject jo = new JSONObject();
		jo.put(FIELD_TYPE_KEY, "checkbox");
		//jo.put("checkColumn", true);
		jo.put(FIELD_DEFAULT_VALUE, false);
		jo.put(DISABLED_KEY, false);
		putDefaultValue(jo, id);
		return jo;
	}
	
	public static JSONObject getColorField(String id, boolean allowBlank) {
		JSONObject jo = new JSONObject();
		jo.put(FIELD_TYPE_KEY, "colorField");
		jo.put(ALLOW_BLANK_KEY, !allowBlank);
		putDefaultValue(jo, id);
		return jo;
		
	}
	public static JSONObject getColorField(String id) {
		return getColorField(id, true);
	}
	
	private static void putDefaultValue(JSONObject jo, String id) {
		putDefaultValue(jo, id, DEFAULT_MESSAGE_PREFIX + Strings.firstCharUpperCase(id), false);
	}
	
	private static void putDefaultValue(JSONObject jo, String id, String msgKey, boolean isHidden) {
		jo.put(ID_KEY, id);
		if(!isHidden) {
			jo.put(DATA_INDEX_KEY, id);
			if(Strings.isEmpty(msgKey)){
				jo.put(HEADER_KEY, ResourceUtils.getText(DEFAULT_MESSAGE_PREFIX + Strings.firstCharUpperCase(id)));
			}else{
				jo.put(HEADER_KEY, ResourceUtils.getText(msgKey));
			}
			if(id.equals("description")){
				jo.put("width", DEFAULT_WIDTH * 3);
			}
			jo.put(EDITABLE_KEY, true);
		}
	}
	
	public static void putBrowserRecord(String colId, JSONObject jsonObject, String entityId, String entityDisplayString) {
		jsonObject.put(colId, entityId);
		jsonObject.put(colId + "_text", entityDisplayString);
	}
}
