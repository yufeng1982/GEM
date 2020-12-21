/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import com.em.boot.core.model.AbsEntity;

/**
 * @author YF
 * 
 */
@SuppressWarnings("rawtypes")
public class EntityReflectionUtils {

	protected static Logger logger = LoggerFactory.getLogger(EntityReflectionUtils.class);
	
	@SuppressWarnings("unchecked")
	public static List fetchElementPropertyToList(final Collection collection,
			final String propertyName) throws Exception {

		List list = new ArrayList();
		for (Object obj : collection) {
			list.add(PropertyUtils.getProperty(obj, propertyName));
		}
		return list;
	}

	public static String fetchElementPropertyToString(
			final Collection collection, final String propertyName,
			final String separator) throws Exception {
		List list = fetchElementPropertyToList(collection, propertyName);
		return StringUtils.join(list, separator);
	}

	public static Field getDeclaredField(final Class clazz,
			final String fieldName) {
		Assert.notNull(clazz);
		Assert.hasText(fieldName);
		for (Class superClass = clazz; superClass != Object.class; superClass = superClass
				.getSuperclass()) {
			try {
				return superClass.getDeclaredField(fieldName);
			} catch (NoSuchFieldException e) {
			}
		}
		return null;
	}

	protected static Field getDeclaredField(final Object object,
			final String fieldName) {
		Assert.notNull(object);
		return getDeclaredField(object.getClass(), fieldName);
	}

	public static Object getFieldValue(final Object object,
			final String fieldName) {
		Field field = getDeclaredField(object, fieldName);

		if (field == null)
			throw new IllegalArgumentException("Could not find field ["
					+ fieldName + "] on target [" + object + "]");

		makeAccessible(field);

		Object result = null;
		try {
			result = field.get(object);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return result;
	}

	public static Class getSuperClassGenricType(Class clazz) {
		return getSuperClassGenricType(clazz, 0);
	}

	public static Class getSuperClassGenricType(Class clazz, int index) {

		Type genType = clazz.getGenericSuperclass();

		if (!(genType instanceof ParameterizedType)) {
			return Object.class;
		}

		Type[] params = ((ParameterizedType) genType).getActualTypeArguments();

		if (index >= params.length || index < 0) {
			return Object.class;
		}
		if (!(params[index] instanceof Class)) {
			return Object.class;
		}
		return (Class) params[index];
	}

	protected static void makeAccessible(Field field) {
		if (!Modifier.isPublic(field.getModifiers())
				|| !Modifier.isPublic(field.getDeclaringClass().getModifiers())) {
			field.setAccessible(true);
		}
	}

	public static void setFieldValue(final Object object,
			final String fieldName, final Object value) {
		Field field = getDeclaredField(object, fieldName);

		if (field == null) {
			throw new IllegalArgumentException("Could not find field ["
					+ fieldName + "] on target [" + object + "]");
		}
		makeAccessible(field);

		try {
			field.set(object, value);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
	}

	public static Object invokeIsMethod(Object target, String propertyName) {
		if(!Strings.isEmpty(propertyName) && (propertyName.length() == 1 || (propertyName.length() > 1 && (!StringUtils.isAlpha(propertyName.substring(1, 2)) || !propertyName.substring(1, 2).equals(propertyName.substring(1, 2).toUpperCase()))))) {
			propertyName = StringUtils.capitalize(propertyName);
		}
		String isMethodName = "is" + propertyName;
		return invokeMethod(target, isMethodName, new Class[] {},
				new Object[] {});
	}
	public static Object invokeGetterMethod(Object target, String propertyName) {
		if(!Strings.isEmpty(propertyName) && (propertyName.length() == 1 || (propertyName.length() > 1 && (!StringUtils.isAlpha(propertyName.substring(1, 2)) || !propertyName.substring(1, 2).equals(propertyName.substring(1, 2).toUpperCase()))))) {
			propertyName = StringUtils.capitalize(propertyName);
		}
		String getterMethodName = "get" + propertyName;
		return invokeMethod(target, getterMethodName, new Class[] {},
				new Object[] {});
	}

	public static void invokeSetterMethod(Object target, String propertyName, Object value, Class<?> propertyType) {
		if(!Strings.isEmpty(propertyName) && (propertyName.length() == 1 || (propertyName.length() > 1 && (!StringUtils.isAlpha(propertyName.substring(1, 2)) || !propertyName.substring(1, 2).equals(propertyName.substring(1, 2).toUpperCase()))))) {
			propertyName = StringUtils.capitalize(propertyName);
		}
		String setterMethodName = "set" + propertyName;
		Method setMethod = null;
		if(propertyType == null) {
			for (Class<?> superClass = value.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
				propertyType = superClass;
				setMethod = getDeclaredMethod(target, setterMethodName, new Class[] { propertyType });
				if(setMethod != null) break;
			}
		} else {
			setMethod = getDeclaredMethod(target, setterMethodName, new Class[] { propertyType });
		}
		if(setMethod == null && value.getClass() == Boolean.class) {
			propertyType = boolean.class;
			setMethod = getDeclaredMethod(target, setterMethodName, new Class[] { propertyType });
		}
		invokeMethod(target, setMethod, new Object[] { value });
	}

	public static Object invokeMethod(final Object object,
			final String methodName, final Class<?>[] parameterTypes,
			final Object[] parameters) {
		Method method = getDeclaredMethod(object, methodName, parameterTypes);
		if (method == null) {
			throw new IllegalArgumentException("Could not find method ["
					+ methodName + "] on target [" + object + "]");
		}

		return invokeMethod(object, method, parameters);
	}

	private static Object invokeMethod(final Object object, Method method, final Object[] parameters) {
		method.setAccessible(true);
		try {
			return method.invoke(object, parameters);
		} catch (Exception e) {
			throw convertReflectionExceptionToUnchecked(e);
		}
	}

	protected static Method getDeclaredMethod(Object object, String methodName,
			Class<?>[] parameterTypes) {
		Assert.notNull(object, "object cannot be null");

		for (Class<?> superClass = object.getClass(); superClass != Object.class; superClass = superClass.getSuperclass()) {
			try {
				return superClass.getDeclaredMethod(methodName, parameterTypes);
			} catch (NoSuchMethodException e) {// NOSONAR
				
			}
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public static List convertElementPropertyToList(
			final Collection collection, final String propertyName) {
		List list = new ArrayList();

		try {
			for (Object obj : collection) {
				list.add(PropertyUtils.getProperty(obj, propertyName));
			}
		} catch (Exception e) {
			throw convertReflectionExceptionToUnchecked(e);
		}

		return list;
	}

	public static String convertElementPropertyToString(
			final Collection collection, final String propertyName,
			final String separator) {
		List list = convertElementPropertyToList(collection, propertyName);
		return StringUtils.join(list, separator);
	}

	public static Object convertStringToObject(String value, Class<?> toType) {
		try {
			return ConvertUtils.convert(value, toType);
		} catch (Exception e) {
			throw convertReflectionExceptionToUnchecked(e);
		}
	}

	public static RuntimeException convertReflectionExceptionToUnchecked(
			Exception e) {
		if (e instanceof IllegalAccessException
				|| e instanceof IllegalArgumentException
				|| e instanceof NoSuchMethodException) {
			return new IllegalArgumentException("Reflection Exception.", e);
		} else if (e instanceof InvocationTargetException) {
			return new RuntimeException("Reflection Exception.",
					((InvocationTargetException) e).getTargetException());
		} else if (e instanceof RuntimeException) {
			return (RuntimeException) e;
		}
		return new RuntimeException("Unexpected Checked Exception.", e);
	}

	private EntityReflectionUtils() {
	}
	
	public static Object copy(Object newCopy , Object original){
		String fieldName = null;
		try{
			Class<?> clazz = original.getClass();
			while (!clazz.equals(AbsEntity.class)){
				Field[] fields = clazz.getDeclaredFields();
				
				if(fields != null) {
					for(int i = 0 ; i < fields.length ; i++){
						try{
							fieldName =  fields[i].getName();
							Object value = invokeGetterMethod(original , fieldName);
							invokeSetterMethod(newCopy , fields[i].getName() , value , fields[i].getType());
						}catch(Exception e){
							logger.info(fieldName + " --- " + e.getMessage());
						}
					}
				}
				clazz = clazz.getSuperclass();
			}
			return newCopy;
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
}
