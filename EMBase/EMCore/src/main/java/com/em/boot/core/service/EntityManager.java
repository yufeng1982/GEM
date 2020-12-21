/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.service;

import java.io.Serializable;
import java.util.List;

import com.em.boot.core.model.ISerial;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;

/**
 * @author YF
 *
 */
public interface EntityManager <T, PK extends Serializable> {

	public abstract void delete(PK id);

	public void delete(T entity);
	public void deleteBy(PropertyFilter... filters);

	public T findUniqueByFilters(PropertyFilter... filters);

	public abstract void flushAndClearSession();

	public abstract T get(PK id);
	
	public abstract List<T> getAll();
	public abstract List<T> getAllActive();
	public abstract List<T> getAllByCorporation(String corporation);
	public abstract List<T> getAllActiveByCorporation(String corporation);
	
	public abstract PageInfo<T> getAll(PageInfo<T> page);
	
	public List<T> getAll(String[] orderByArray, String[] orderArray);
	public List<T> getAllActiveByCorporation(String corporation, String[] orderByArray, String[] orderArray);
	
	public boolean isPropertyUnique(final String propertyName, final Object newValue, final PK id);
	public boolean isPropertiesUnique(final String[] propertyNames, final Object[] values, final PK id);
	public boolean isPropertiesUnique(final List<String> propertyNames, final List<Object> values, final PK id);
	
	public abstract void merge(T entity);
	
	public abstract void save(T entity);
	
	public abstract PageInfo<T> search(PageInfo<T> page, PropertyFilter... filters);

	public abstract List<T> search(PropertyFilter... filters);

	public PageInfo<T> searchByMultProperties(PageInfo<T> page, String queryStr, String...propertyNames);
	
	public List<T> searchByMultProperties(String queryStr, String...propertyNames);

	public abstract List<T> searchOrderBy(String[] orderByArray, String[] orderArray, final PropertyFilter... filters);

	
	public String getSerialNumber(ISerial iSerial);
	public int createSequence(String seqName);
	public int resetSequenceStart(String seqName, Long start);
	public List<T> getByIds(List<String> ids);
	public T getBySourceEntityId(String sourceEntityId);
	public boolean isCommonAccess();
}
