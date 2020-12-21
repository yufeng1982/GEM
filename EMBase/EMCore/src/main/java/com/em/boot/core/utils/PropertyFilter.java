/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author YF
 *
 */
public class PropertyFilter {

	public final static String OR_SEPARATOR = ",";
	public final static String ALL = "*";
	public final static String AND = "AND";
	public final static String OR ="OR";
	public enum MatchType {
		EQ, CASEEQ, NEQ, IN, NIN, NNULL, NULL, 
		START, NSTART, END, NEND, LIKE, NLIKE,
		LT, GT, LTE, GTE;
	}

	private String propertyName;
	private Object value;
	private MatchType matchType = MatchType.EQ;
	
	public PropertyFilter() {
	}

	public PropertyFilter(String propertyName, Object value, MatchType matchType) {
		this.propertyName = propertyName;
		this.value = value;
		this.matchType = matchType;
		processValue();
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public PropertyFilter(String propertyName, Object leftValue, Object rightValue, MatchType matchType) {
		this.propertyName = propertyName;
		Map map = null;
        if(leftValue != null || rightValue != null) {
        	map = new HashMap();
    		map.put("leftValue", leftValue);
    		map.put("rightValue", rightValue);
        }

		this.value = map;
		this.matchType = matchType;
	}
	public PropertyFilter(String[] propertyNames, Object value, MatchType matchType) {
		this.setPropertyNames(propertyNames);
		this.value = value;
		this.matchType = matchType;
		processValue();
	}
	
	public static PropertyFilter corporationFilter(String corporation){
		PropertyFilter corporationFilter = new PropertyFilter("corporation", corporation, MatchType.EQ);
		return corporationFilter;
	}
	public static PropertyFilter activeFilter() {
		PropertyFilter activeFilter = new PropertyFilter("active", true, MatchType.EQ);
		return activeFilter;
	}

	private void processValue() {
		if(value != null && value instanceof String) {
			if(Strings.isEmpty((String) value)) value = null;
		}
	}

	public String getPropertyName() {
		return propertyName;
	}

	public void setPropertyName(final String propertyName) {
		this.propertyName = propertyName;
	}
	
	public boolean isMultiPropertyName() {
		return !Strings.isEmpty(getPropertyName()) && getPropertyName().indexOf(PropertyFilter.OR_SEPARATOR) != -1;
	}
	
	private void setPropertyNames(final String...propertyNames) {
		StringBuffer propertyNamesSB = new StringBuffer();
		for (String propertyName : propertyNames) {
			if(propertyNamesSB.length() > 0) {
				propertyNamesSB.append(PropertyFilter.OR_SEPARATOR);
			}
			propertyNamesSB.append(propertyName);
		}
		setPropertyName(propertyNamesSB.toString());
	}

	public Object getValue() {
		return value;
	}

	public void setValue(final Object value) {
		this.value = value;
	}

	public MatchType getMatchType() {
		return matchType;
	}

	public void setMatchType(final MatchType matchType) {
		this.matchType = matchType;
	}
}