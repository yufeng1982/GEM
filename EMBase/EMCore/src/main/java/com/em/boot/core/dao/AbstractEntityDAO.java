/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.dao;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import com.em.boot.core.model.IDelete;
import com.em.boot.core.model.IEntity;
import com.em.boot.core.utils.EntityReflectionUtils;
import com.em.boot.core.utils.HibernateHelper;
import com.em.boot.core.utils.OrderBySqlFormula;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.StringLengthOrder;

/**
 * @author YF
 *
 */
@SuppressWarnings("unchecked")
public abstract class AbstractEntityDAO<T, PK extends Serializable> {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	private EntityManager entityManager;
	
	protected Class<T> entityClass;

	public AbstractEntityDAO() {
		this.entityClass = EntityReflectionUtils.getSuperClassGenricType(getClass());
	}

	public AbstractEntityDAO(final EntityManager entityManager, final Class<T> entityClass) {
		this.entityManager = entityManager;
		this.entityClass = entityClass;
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}

	@PersistenceContext
	public void setEntityManager(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	public Session getSession() {
		Session session = entityManager.unwrap(Session.class);
		return session;
	}

	public void flush() {
		getSession().flush();
	}

	public void save(final T entity) {
		Assert.notNull(entity);
//		if(!this.isCommonAccess() && entity instanceof AbsEntity) {
//			if(Strings.isEmpty(((AbsEntity)entity).getCorporation())) {
//				throw new ERPException("ERROR", "Please set cororation for it when you save a multi-company object!");
//			}
//		}
		getSession().saveOrUpdate(entity);
	}

	public void merge(T entity) {
		Assert.notNull(entity);
		getSession().merge(entity);
	}

	public void initProxyObject(Object proxy) {
		Hibernate.initialize(proxy);
	}
	
	public void delete(final T entity) {
		Assert.notNull(entity);
		if(entity instanceof IDelete && !((IDelete)entity).isRealDelete()){
			((IDelete)entity).setToInactive();
			getSession().saveOrUpdate(entity);
		}else{
			getSession().delete(entity);
		}
	}

	public void delete(final PK id) {
		Assert.notNull(id);
		delete(get(id));
	}
	
	public int executeUpdate(final String queryString, final Object... values) {
		Assert.notNull(queryString);
		return createQuery(queryString, values).executeUpdate();
	}

	public int batchExecute(final String hql, final Object... values) {
		return createQuery(hql, values).executeUpdate();
	}
	
	public int batchExecute(final String hql, final Map<String, ?> values) {
		return createQuery(hql, values).executeUpdate();
	}
	
	public Query distinct(Query query) {
		query.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
		return query;
	}
	
	public Criteria distinct(Criteria criteria) {
		criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
		return criteria;
	}

	public T get(final PK id) {
		Assert.notNull(id);
		if(id instanceof String) Assert.hasText((String) id);
		return (T) getSession().get(entityClass, id);
	}

	public List<T> getAll() {
		return findByCriteria();
	}
	
	public List<T> getAllActive() {
		Criterion criterion = Restrictions.eq("active", Boolean.TRUE);
		return findByCriteria(criterion);
	}
	
	public List<T> getAllByCorporation(String corporation) {
		Criterion criterion = Restrictions.eq("corporation", corporation);
		return findByCriteria(criterion);
	}
	
	public List<T> getAllActiveByCorporation(String corporation) {
		Criterion criterion1 = Restrictions.eq("corporation", corporation);
		Criterion criterion2 = Restrictions.eq("active", Boolean.TRUE);
		Criteria criteria = createCriteria(criterion1,criterion2);
		return findByCriteria(criteria);
	}
	
	public List<T> getAll(String[] orderByArray, String[] orderArray) {
		Criteria criteria = createCriteria();
		buildOrderBy(criteria, orderByArray, orderArray);
		List<T> list = criteria.list();
		return list == null ? new ArrayList<T>() : list;
	}
	
	public List<T> getAllByCorporation(String corporation, String[] orderByArray, String[] orderArray) {
		Criteria criteria = createCriteria();
		buildOrderBy(criteria, orderByArray, orderArray);
		Criterion criterion = Restrictions.eq("corporation", corporation);
		List<T> list = createCriteria(criteria, criterion).list();
		return list == null ? new ArrayList<T>() : list;
	}
	
	public List<T> getAllActiveByCorporation(String corporation, String[] orderByArray, String[] orderArray) {
		Criteria criteria = createCriteria();
		buildOrderBy(criteria, orderByArray, orderArray);
		Criterion criterion1 = Restrictions.eq("corporation", corporation);
		Criterion criterion2 = Restrictions.eq("active", Boolean.TRUE);
		List<T> list = createCriteria(criteria, criterion1,criterion2).list();
		return list == null ? new ArrayList<T>() : list;
	}
	
	protected void buildOrderBy(final Criteria criteria, String[] orderByArray, String[] orderArray) {
		for (int i = 0; i < orderByArray.length; i++) {
			if (PageInfo.ASC.equalsIgnoreCase(orderArray[i])) {
				if(HibernateHelper.isFormula(orderByArray[i])) {
					criteria.addOrder(OrderBySqlFormula.sqlFormula(orderByArray[i] + " asc"));
				} else {
					criteria.addOrder(Order.asc(orderByArray[i]));
				}
			} else if(PageInfo.DESC.equalsIgnoreCase(orderArray[i])) {
				if(HibernateHelper.isFormula(orderByArray[i])) {
					criteria.addOrder(OrderBySqlFormula.sqlFormula(orderByArray[i] + " desc"));
				} else {
					criteria.addOrder(Order.desc(orderByArray[i]));
				}
			} else if(PageInfo.LENGTH_ASC.equalsIgnoreCase(orderArray[i])) {
				criteria.addOrder(new StringLengthOrder(orderByArray[i], true));
			} else if(PageInfo.LENGTH_DESC.equalsIgnoreCase(orderArray[i])) {
				criteria.addOrder(new StringLengthOrder(orderByArray[i], false));
			}
		}
	}

	public List<T> findByProperty(final String propertyName, final Object value) {
		Assert.hasText(propertyName);
		Criterion criterion = Restrictions.eq(propertyName, value);
		return findByCriteria(criterion);
	}
	
	public List<T> findByProperty(final String propertyName, final Object value, String[] orderByArray, String[] orderArray) {
		Assert.hasText(propertyName);
		Criterion criterion = Restrictions.eq(propertyName, value);
		Criteria criteria = createCriteria(criterion);
		buildOrderBy(criteria, orderByArray, orderArray);
		List<T> list = criteria.list();
		return list == null ? new ArrayList<T>() : list;
	}

	public T findUniqueByProperty(final String propertyName, final Object value) {
		Assert.hasText(propertyName);
		Criterion criterion = Restrictions.eq(propertyName, value);
		return (T) createCriteria(criterion).uniqueResult();
	}

	public List<T> find(final String hql, final Object... values) {
		List<T> list = createQuery(hql, values).list();
		return list == null ? new ArrayList<T>() : list;
	}

	public T findUnique(final String hql, final Object... values) {
		return (T) createQuery(hql, values).uniqueResult();
	}
	
	public String findString(final String hql, final Object... values) {
		return (String) findUnique(hql, values);
	}

	public Integer findInt(final String hql, final Object... values) {
		return (Integer) findUnique(hql, values);
	}

	public Long findLong(final String hql, final Object... values) {
		return (Long) findUnique(hql, values);
	}

	public Double findDouble(final String hql, final Object... values) {
		return (Double) findUnique(hql, values);
	}

	public Query createQuery(final String queryString, final Object... values) {
		Assert.hasText(queryString);
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}

	public List<T> findByCriteria(final Criterion... criterions) {
		List<T> list = createCriteria(criterions).list();
		return list == null ? new ArrayList<T>() : list;
	}
	
	public List<T> findByCriteria(Criteria criteria, final Criterion... criterions) {
		List<T> list = createCriteria(criteria, criterions).list();
		return list == null ? new ArrayList<T>() : list;
	}
	
	public T findUniqueByCriteria(final Criterion... criterions) {
		return (T) createCriteria(criterions).uniqueResult();
	}
	protected T findUniqueByCriteria(Criteria criteria, final Criterion... criterions) {
		return (T) createCriteria(criteria, criterions).uniqueResult();
	}

	public Criteria createCriteria(final Criterion... criterions) {
		Criteria criteria = getSession().createCriteria(entityClass);
		return createCriteria(criteria, criterions);
	}
	protected Criteria createCriteria(Criteria criteria, final Criterion... criterions) {
		for (Criterion c : criterions) {
			if(c != null) criteria.add(c);
		}
		return criteria;
	}

	public boolean isPropertyUnique(final String propertyName, final Object newValue, final Object orgValue) {
		if (newValue == null || newValue.equals(orgValue)) return true;
		
		Object object = findUniqueByProperty(propertyName, newValue);
		return object == null;
	}

	public String getIdName() {
//		ClassMetadata meta = getSessionFactory().getClassMetadata(entityClass);
//		Assert.notNull(meta, "Class " + entityClass.getSimpleName() + " not defined.");
//		return meta.getIdentifierPropertyName();
		return "id";
	}
	
	public List<String> extractIds(List<? extends IEntity> entities) {
		List<String> entityIds = new ArrayList<String>();
		for (IEntity entity : entities) {
			entityIds.add(entity.getId());
		}
		return entityIds;
	}
	
	/**
	 * 
	 * @return boolean
	 * 
	 * false as default, it means most of functions are multiple company
	 */
	public boolean isCommonAccess() {
		return false;
	}
}
