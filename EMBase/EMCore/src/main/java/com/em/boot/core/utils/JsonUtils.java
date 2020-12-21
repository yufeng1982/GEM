package com.em.boot.core.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.jscience.economics.money.Currency;
import org.json.JSONArray;
import org.json.JSONObject;

import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.IEnum;
import com.em.boot.core.service.security.Corporation;

public final class JsonUtils {
	
	public static JSONArray buildCorporationCoboxData(List<Corporation> list) {
		JSONArray array = new JSONArray();
		try {
			if (!CollectionUtils.isEmpty(list)) {
				for (Corporation c : list) {
					JSONArray jso = new JSONArray();
					jso.put(c.getCode());
					jso.put(c.getName() + " ");
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return array;
	}
	public static JSONArray buildCurrencyCoboxData(List<Currency> list) {
		JSONArray array = new JSONArray();
		try {
			if (!CollectionUtils.isEmpty(list)) {
				for (Currency c : list) {
					JSONArray jso = new JSONArray();
					jso.put(c.getCode());
					jso.put(c.getCode() + " ");
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return array;
	}
	
	public static JSONArray buildEnmuCoboxData(List list) {
		JSONArray array = new JSONArray();
		try {
			if (!CollectionUtils.isEmpty(list)) {
				Method codeMethod = IEnum.class.getMethod("getName",new Class[] {});
				Method textMethod = IEnum.class.getMethod("getText",new Class[] {});
				for (Object obj : list) {
					JSONArray jso = new JSONArray();
					jso.put(codeMethod.invoke(obj, new Object[] {}));
					jso.put(textMethod.invoke(obj, new Object[] {})+" ");
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return array;
	}
	public static JSONArray buildAbsCodeNameEntityCoboxData(Iterable<? extends IEntity> list) {
		JSONArray array = new JSONArray();
		try {
			if (list != null) {
				for (IEntity obj : list) {
					AbsCodeNameEntity sg = (AbsCodeNameEntity) obj;
					JSONArray jso = new JSONArray();
					jso.put(sg.getCode());
					jso.put(sg.getDescription()+" ");
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return array;
	}
	public static JSONArray buildEntityCoboxData(Iterable<? extends IEntity> list) {
		JSONArray array = new JSONArray();
		try {
			if (list != null) {
				for (IEntity obj : list) {
					JSONArray jso = new JSONArray();
					jso.put(obj.getId());
					jso.put(obj.getDisplayString());
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return array;
		
	}
	public static JSONArray buildEnmuCoboxData(EnumSet<?> sets) {
		JSONArray array = new JSONArray();
		try {
			if (!CollectionUtils.isEmpty(sets)) {
				Method codeMethod = IEnum.class.getMethod("getName",new Class[] {});
				Method textMethod = IEnum.class.getMethod("getText",new Class[] {});
				for (Object obj : sets) {
					JSONArray jso = new JSONArray();
					jso.put(codeMethod.invoke(obj, new Object[] {}));
					jso.put(textMethod.invoke(obj, new Object[] {})+" ");
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return array;
	}
	
	public static JSONArray getEnmuDataByClazz(String className,String methodName) throws ClassNotFoundException{
		Class<?> clazz = Class.forName(className);
		if(Strings.isEmpty(methodName)) {
			return getEnmuDataByClazz(clazz);
		} else {
			return getEnmuDataByClazz(clazz, methodName);
		}
	}
	public static JSONArray getEnmuDataByClazz(Class<?> clazz){
		JSONArray ja = new JSONArray();
		if(clazz.isEnum()){
			Object[] enumConstants = clazz.getEnumConstants();
			ja = buildJSON(enumConstants);
			
		}
		return ja;
	}
	
	public static JSONArray getEnmuDataByClazz(Class<?> clazz , String methodName){
		JSONArray ja = new JSONArray();
		try {
			if(Strings.isEmpty(methodName)){
				return getEnmuDataByClazz(clazz);
			}
			if(clazz.isEnum()){
				Method m = clazz.getMethod(methodName);
				Object d = m.invoke(clazz, null);
				if(d instanceof EnumSet) {
					EnumSet result = (EnumSet) m.invoke(clazz, null);
					ja = buildEnmuCoboxData(result);
				} else {
					List result = (List) m.invoke(clazz, null);
					ja = buildJSON(result.toArray());
				}

			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return ja;
	}
	private static JSONArray buildJSON(Object[] enumConstants){
		JSONArray ja = new JSONArray();
		if(enumConstants == null) return ja;
		
		for(int i = 0 ; i < enumConstants.length ; i++ ){
			Object constant = enumConstants[i];
			JSONArray jo = new JSONArray();
			jo.put(EntityReflectionUtils.invokeGetterMethod(constant, "name"));
			jo.put(EntityReflectionUtils.invokeGetterMethod(constant, "text"));
			ja.put(jo);
		}
		return ja;
	}
	
	public static JSONArray buildJSONArray(EnumSet<?> sets) {
		JSONArray array = new JSONArray();
		try {
			if (!CollectionUtils.isEmpty(sets)) {
				Method codeMethod = IEnum.class.getMethod("getName",new Class[] {});
				Method textMethod = IEnum.class.getMethod("getText",new Class[] {});
				for (Object obj : sets) {
					JSONObject jso = new JSONObject();
					jso.put("name", codeMethod.invoke(obj, new Object[] {}));
					jso.put("text", textMethod.invoke(obj, new Object[] {}));
					array.put(jso);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return array;
	}
	
	public static JSONArray buildMapCoboxData(Map<String, String> map) {
		JSONArray array = new JSONArray();
		Set<String> keys = map.keySet();
		for (String key : keys) {
			JSONArray ja = new JSONArray();
			ja.put(key);
			ja.put(map.get(key));
			array.put(ja);
		}
		return array;
	}
}
