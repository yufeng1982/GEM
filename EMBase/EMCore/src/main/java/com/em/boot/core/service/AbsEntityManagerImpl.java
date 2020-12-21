/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.service;

import java.io.Serializable;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.em.boot.core.dao.DefaultEntityDAO;
import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.ISerial;
import com.em.boot.core.utils.EntityReflectionUtils;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;
import com.em.boot.core.utils.PropertyFilter.MatchType;
import com.em.boot.core.utils.ProxyTargetConverterUtils;

/**
 * @author YF
 *
 */
public abstract class AbsEntityManagerImpl<T, PK extends Serializable> implements EntityManager<T, PK> {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected Class<T> entityClass;

	@SuppressWarnings("unchecked")
	public AbsEntityManagerImpl() {
		this.entityClass = EntityReflectionUtils.getSuperClassGenricType(getClass());
	}

	public void delete(PK id) {
		getEntityDAO().delete(id);
	}

	public void delete(T entity) {
		getEntityDAO().delete(entity);
	}
	
	public void deleteBy(PropertyFilter... filters) {
		List<T> list = getEntityDAO().findByFilters(filters);
		for (T t : list) {
			delete(t);
		}
	}
	
	public List<String> extractIds(List<? extends IEntity> entities) {
		return getEntityDAO().extractIds(entities);
	}
	
	public T findUniqueByFilters(PropertyFilter... filters){
		return getEntityDAO().findUniqueByFilters(filters);
	}

	public void flushAndClearSession() {
		getEntityDAO().getSession().flush();
		getEntityDAO().getSession().clear();
	}

	public T get(PK id) {
		return getEntityDAO().get(id);
	}
	
	public List<T> getAll() {
		return getEntityDAO().getAll();
	}
	
	public List<T> getAllActive() {
		return getEntityDAO().getAllActive();
	}

	public PageInfo<T> getAll(PageInfo<T> page) {
		return getEntityDAO().getAll(page);
	}

	public List<T> getAllByCorporation(String corporation) {
		return getEntityDAO().getAllByCorporation(corporation);
	}
	
	public List<T> getAllActiveByCorporation(String corporation) {
		return getEntityDAO().getAllActiveByCorporation(corporation);
	}
	
	public List<T> getAll(String[] orderByArray, String[] orderArray) {
		return getEntityDAO().getAll(orderByArray, orderArray);
	}
	public List<T> getAllByCorporation(String corporation, String[] orderByArray, String[] orderArray) {
		return getEntityDAO().getAllByCorporation(corporation, orderByArray, orderArray);
	}
	public List<T> getAllActiveByCorporation(String corporation, String[] orderByArray, String[] orderArray) {
		return getEntityDAO().getAllActiveByCorporation(corporation, orderByArray, orderArray);
	}
	
	protected abstract DefaultEntityDAO<T, PK> getEntityDAO();
	
	@SuppressWarnings("unchecked")
	protected PK getPK(IEntity t) {
		if(t == null) return null;
		return (PK) t.getId();
	}

	protected Object getProxyImplementationObj(Object proxyObject) {
		return ProxyTargetConverterUtils.getProxyImplementationObject(proxyObject);
	}
	
	public boolean isPropertyUnique(final String propertyName, final Object value, final PK id) {
		return isPropertiesUnique(new String[]{propertyName}, new Object[]{value}, id);
	}
	
	public boolean isPropertiesUnique(final String[] propertyNames, final Object[] values, final PK id) {
		return getEntityDAO().isPropertiesUnique(propertyNames, values, id);
	}
	public boolean isPropertiesUnique(final List<String> propertyNames, final List<Object> values, final PK id) {
		return getEntityDAO().isPropertiesUnique(propertyNames.toArray(new String[propertyNames.size()]), values.toArray(new Object[values.size()]), id);
	}
	
	public void merge(T entity) {
		getEntityDAO().merge(entity);
	}
	
	protected void rollbackTransaction() {
		StringBuffer sb = new StringBuffer();
		sb.append("\n");
		sb.append(">>>>>>>>>>>>>>====================<<<<<<<<<<<<<<<<\n");
		sb.append(">>>>>>>>>>>===TRANSACTION ROLLBACK===<<<<<<<<<<<<<\n");
		sb.append(">>>>>>>>>>>>>>====================<<<<<<<<<<<<<<<<\n");
		sb.append("\n");
		logger.warn(sb.toString());
		TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
	}
	public void save(T entity) {
		getEntityDAO().save(entity);
	}

	public PageInfo<T> search(PageInfo<T> page, PropertyFilter... filters) {
		return getEntityDAO().findByFilters(page, filters);
	}
	
	public List<T> search(PropertyFilter... filters){
		return getEntityDAO().findByFilters(filters);
	}
	
	public PageInfo<T> searchByMultProperties(PageInfo<T> page, String queryStr, String...propertyNames) {
		return getEntityDAO().findByFilters(page, new PropertyFilter(propertyNames, queryStr, MatchType.LIKE));
	}
	public List<T> searchByMultProperties(String queryStr, String...propertyNames) {
		return getEntityDAO().findByFilters(new PropertyFilter(propertyNames, queryStr, MatchType.LIKE));
	}
	
	public List<T> searchOrderBy(String[] orderByArray, String[] orderArray, final PropertyFilter... filters) {
		return getEntityDAO().findByFilters(orderByArray, orderArray, filters);
	}
	
	public String getSerialNumber(ISerial iSerial) {
		String seq = getEntityDAO().getSerialNumber(iSerial);

		List<String> propertyNames = iSerial.getOtherDiscriminatorNames();
		propertyNames.add("code");
		List<Object> propertyValues =  iSerial.getOtherDiscriminatorValues();
		propertyValues.add(seq);
		if(this.isPropertiesUnique(propertyNames, propertyValues, null)) {
			return seq;
		} else {
			return getSerialNumber(iSerial);
		}
	}
	public int createSequence(String seqName) {
		try {
			return getEntityDAO().createSequence(seqName);
		} catch(Exception e) {
			logger.warn("Sequence " + seqName + " already exists !");
		}
		return -1;
	}
	public int resetSequenceStart(String seqName, Long start) {
		try {
			return getEntityDAO().resetSequenceStart(seqName, start);
		} catch(Exception e) {
			logger.warn("Sequence " + seqName + " not exists !");
		}
		return -1;
	}
	
	public List<T> getByIds(List<String> ids) {
		PropertyFilter idsPF = new PropertyFilter("id", ids, MatchType.IN);
		PropertyFilter activePF = new PropertyFilter("active", true, MatchType.EQ);
		return getEntityDAO().findByFilters(idsPF, activePF);
	}
	
	public T getBySourceEntityId(String sourceEntityId) {
		return getEntityDAO().getBySourceEntityId(sourceEntityId);
	}
	
	public boolean isCommonAccess() {
		return getEntityDAO().isCommonAccess();
	}
}
