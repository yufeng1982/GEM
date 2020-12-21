/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.dao;

import java.io.Serializable;
import java.math.BigInteger;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.internal.CriteriaImpl;
import org.hibernate.transform.ResultTransformer;
import org.springframework.util.Assert;

import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.ISerial;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.DateTimeUtils;
import com.em.boot.core.utils.EntityReflectionUtils;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.HibernateHelper;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;
import com.em.boot.core.utils.PropertyFilter.MatchType;
import com.em.boot.core.utils.ProxyTargetConverterUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author YF
 *
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
public class DefaultEntityDAO<T, PK extends Serializable> extends AbstractEntityDAO<T, PK> {
	protected static final String ORDER_ENTRIES = "orderEntries";
	protected static final String CORPORATION = "corporation";
	
	public DefaultEntityDAO() {
		super();
	}
	
	public DefaultEntityDAO(EntityManager entityManager, Class<T> entityClass) {
		super(entityManager, entityClass);
	}

	protected Criterion buildDatePropertyCriterion(final String propertyName, Date startDate, Date endDate, 
			final boolean leftClosed, final boolean rightClosed, final boolean withTime) {
		Criterion criterion = null;
		
		if (startDate != null) {
			if(!withTime) {
				startDate = DateTimeUtils.fromDate(FormatUtils.formatDate(startDate), FormatUtils.ISO_DATE_MASK);
			}
		}
		if (endDate != null) {
			if(!withTime) {
				endDate = DateTimeUtils.fromDate(FormatUtils.formatDate(endDate), FormatUtils.ISO_DATE_MASK);
			}
		}
		
		if(rightClosed || endDate != null) {
			if(withTime) {
				endDate = DateTimeUtils.plusSeconds(endDate, 1);
			} else {
				endDate = DateTimeUtils.plusDays(endDate, 1);
			}
		} 
		
		if(!leftClosed){
			startDate = DateTimeUtils.plusDays(startDate,1);
		}
		
		if(startDate != null && endDate != null){
			return Restrictions.and(Restrictions.ge(propertyName, startDate), Restrictions.lt(propertyName, endDate));
		} else if(startDate != null){
			return Restrictions.ge(propertyName, startDate);
		} else if(endDate != null){
			return Restrictions.lt(propertyName, endDate);
		} else {
 			return criterion;
		}
	}

	protected Criterion buildBetweenPropertyCriterion(final String propertyName, final Object minValue, final Object maxValue) {
		Criterion criterion = null;
		if(minValue != null && maxValue != null) {
			return Restrictions.and(Restrictions.ge(propertyName, minValue), Restrictions.le(propertyName, maxValue));
		} else if (minValue != null) {
			return Restrictions.ge(propertyName, minValue);
		} else if (maxValue != null) {
			return Restrictions.le(propertyName, maxValue);
		}
		return criterion;
	}
	
	protected Criterion buildPropertyCriterion(final String propertyName, final Object value, MatchType matchType) {
		if (MatchType.NNULL.equals(matchType)) {
			return Restrictions.isNotNull(propertyName);
		} else if (MatchType.NULL.equals(matchType)) {
			return Restrictions.isNull(propertyName);
		}
		if(value == null) return null;
		Assert.hasText(propertyName);
		Criterion criterion = null;
		
		if(HibernateHelper.isFormula(propertyName)) {
			criterion = HibernateHelper.buildPropertyCriterion(propertyName, value, matchType);
		} else if (MatchType.EQ.equals(matchType)) {
			criterion = Restrictions.eq(propertyName, value);
		} else if (MatchType.CASEEQ.equals(matchType)) {
			criterion = Restrictions.eq(propertyName, value).ignoreCase();
		} else if (MatchType.NEQ.equals(matchType)) {
			criterion = Restrictions.not(Restrictions.eq(propertyName, value));
		} else if (MatchType.LIKE.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.like(propertyName, (String) value, MatchMode.ANYWHERE).ignoreCase();
		} else if (MatchType.NLIKE.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.not(Restrictions.like(propertyName, (String) value, MatchMode.ANYWHERE).ignoreCase());
		} else if (MatchType.IN.equals(matchType)) {
			Collection<Object> valueList = (Collection<Object>) value;
			if (valueList.isEmpty()) return null;
			criterion = Restrictions.in(propertyName, valueList);
		} else if (MatchType.NIN.equals(matchType)) {
			Collection<Object> valueList = (Collection<Object>) value;
			if (valueList.isEmpty()) return null;
			criterion = Restrictions.not(Restrictions.in(propertyName, valueList));
		} else if (MatchType.LTE.equals(matchType)) {
			criterion = Restrictions.le(propertyName, value);
		} else if (MatchType.LT.equals(matchType)) {
			criterion = Restrictions.lt(propertyName, value);
		} else if (MatchType.GTE.equals(matchType)) {
			criterion = Restrictions.ge(propertyName, value);
		} else if (MatchType.GT.equals(matchType)) {
			criterion = Restrictions.gt(propertyName, value);
		} else if (MatchType.START.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.like(propertyName, (String) value, MatchMode.START).ignoreCase();
		} else if (MatchType.NSTART.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.not(Restrictions.like(propertyName, (String) value, MatchMode.START).ignoreCase());
		} else if (MatchType.END.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.like(propertyName, (String) value, MatchMode.END).ignoreCase();
		} else if (MatchType.NEND.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.not(Restrictions.like(propertyName, (String) value, MatchMode.END).ignoreCase());
		}
		return criterion;
	}

	protected List<Criterion> buildPropertyFilterCriterionList(List<PropertyFilter> filters) {
		return buildPropertyFilterCriterionList(filters.toArray(new PropertyFilter[filters.size()]));
	}
	
	public List<Criterion> buildPropertyFilterCriterionList(final PropertyFilter... filters) {
		List<Criterion> criterionList = new ArrayList<Criterion>();
		if(filters == null) {
			return criterionList;
		}
		for (PropertyFilter filter : filters) {
			
			// ignore null filter
			if(filter == null) continue;
			
			String propertyName = filter.getPropertyName();
			boolean multiProperty = StringUtils.contains(propertyName, PropertyFilter.OR_SEPARATOR);
			if (!multiProperty) { // only one 
				Criterion criterion = buildPropertyCriterion(propertyName, filter.getValue(), filter.getMatchType());
				if(criterion != null) criterionList.add(criterion);
			} else {// use "OR" for multiple properties
				Disjunction disjunction = Restrictions.disjunction();
				String[] params = StringUtils.split(propertyName, PropertyFilter.OR_SEPARATOR);
				boolean hasCriterion = false;
				for (String param : params) {
					Criterion criterion = buildPropertyCriterion(param, filter.getValue(), filter.getMatchType());
					if(criterion != null) {
						disjunction.add(criterion);
						hasCriterion = true;
					}
				}
				if(hasCriterion) criterionList.add(disjunction);
			}
		}
		return criterionList;
	}
	protected Criterion[] buildPropertyFilterCriterions(final PropertyFilter... filters) {
		List<Criterion> criterionList = buildPropertyFilterCriterionList(filters);
		return criterionList.toArray(new Criterion[criterionList.size()]);
	}
	
	protected Long countCriteriaResult(final Criteria c, final PageInfo<T> page) {
		CriteriaImpl impl = (CriteriaImpl) c;

		Projection projection = impl.getProjection();
		ResultTransformer transformer = impl.getResultTransformer();

		List<CriteriaImpl.OrderEntry> orderEntries = null;
		try {
			orderEntries = (List) EntityReflectionUtils.getFieldValue(impl, ORDER_ENTRIES);
			EntityReflectionUtils.setFieldValue(impl, ORDER_ENTRIES, new ArrayList());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		ProjectionList projectionList = Projections.projectionList();
		projectionList.add(Projections.rowCount());
		
		long totalCount;
		if (page.getSumFieldArray() == null) {
			totalCount = (Long) c.setProjection(projectionList).uniqueResult();
		} else {
			for (String sumField : page.getSumFieldArray()) {
				projectionList.add(Projections.sum(sumField));
			}
			
			Object[] results = (Object[])c.setProjection(projectionList).uniqueResult();
			totalCount = (Long) results[0];
			
			int i = 1;
			for (String sumField : page.getSumFieldArray()) {
				page.getSumFieldsMap().put(sumField, results[i]);
				i++;
			}
		}

		c.setProjection(projection);

		if (projection == null) {
			c.setResultTransformer(CriteriaSpecification.ROOT_ENTITY);
		}
		if (transformer != null) {
			c.setResultTransformer(transformer);
		}
		try {
			EntityReflectionUtils.setFieldValue(impl, ORDER_ENTRIES, orderEntries);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return totalCount;
	}

	public PageInfo<T> find(final PageInfo<T> page, final String hql, final Object... values) {
		Assert.notNull(page);

		Query q = createQuery(hql, values);
		setPageParameter(q, page);
		List result = q.list();
		page.setResult(result);
		return page;
	}

	public PageInfo<T> findByCriteria(final PageInfo<T> page, Criteria c) {
		Assert.notNull(page);
		
		setCorporationParameter(c, page);
		if (page.isAutoCount()) {
			long totalCount = countCriteriaResult(c, page);
			page.setTotalCount(totalCount);
		}

		setPageParameter(c, page);
		List result = c.list();
		page.setResult(result);
		return page;
	}

	public PageInfo<T> findByCriterions(final PageInfo<T> page, Criteria criteria, final Criterion... criterions) {
		Criteria c = createCriteria(criteria, criterions);
		return findByCriteria(page, c);
	}

	public PageInfo<T> findByCriterions(final PageInfo<T> page, Criteria criteria, List<Criterion> criterions) {
		return findByCriterions(page, criteria, criterions.toArray(new Criterion[criterions.size()]));
	}

	public PageInfo<T> findByCriterions(final PageInfo<T> page, final Criterion... criterions) {
		Criteria c = createCriteria(criterions);
		return findByCriteria(page, c);
	}

	public PageInfo<T> findByCriterions(final PageInfo<T> page, List<Criterion> criterions) {
		return findByCriterions(page, criterions.toArray(new Criterion[criterions.size()]));
	}
	
	public PageInfo<T> findByFilters(final PageInfo<T> page, final PropertyFilter... filters) {
		Criterion[] criterions = buildPropertyFilterCriterions(filters);
		return findByCriterions(page, criterions);
	}
	
	public List<T> findByFilters(final PropertyFilter... filters) {
		Criterion[] criterions = buildPropertyFilterCriterions(filters);
		return findByCriteria(criterions);
	}

	public List<T> findByFilters(String[] orderByArray, String[] orderArray, final PropertyFilter... filters) {
		Criterion[] criterions = buildPropertyFilterCriterions(filters);
		Criteria criteria = createCriteria(criterions);
		buildOrderBy(criteria, orderByArray, orderArray);
		List<T> list = criteria.list();
		return list;
	}

	public List<T> findByProperty(final String propertyName, final Object value, MatchType matchType) {
		Criterion criterion = buildPropertyCriterion(propertyName, value, matchType);
		if(criterion != null) return findByCriteria(criterion);
		return findByCriteria();
	}
	
	public T findUniqueByFilters(final PropertyFilter... filters) {
		Criterion[] criterions = buildPropertyFilterCriterions(filters);
		return findUniqueByCriteria(criterions);
	}
	public PageInfo<T> getAll(final PageInfo<T> page) {
		return findByCriterions(page);
	}

	protected String getCondition(StringBuffer sb) {
		if(sb.indexOf("WHERE") > 0) {
			return " AND ";
		}else {
			return " WHERE ";
		}
	}
	
	protected PK getPK(IEntity t) {
		if(t == null) return null;
		return (PK) t.getId();
	}
	protected Criteria setCorporationParameter(final Criteria c, final PageInfo<T> page) {
		Corporation corporation = page.getSf_EQ_corporation();
		if (corporation != null) {
			c.add(Restrictions.eq(CORPORATION, corporation));
		} else if(!isCommonAccess()) {
			c.add(Restrictions.eq(CORPORATION, ThreadLocalUtils.getCurrentCorporation()));
		}
		return c;
	}
	protected Criteria setPageParameter(final Criteria c, final PageInfo<T> page) {
		c.setFirstResult(page.getFirst()); 
		c.setMaxResults(page.getPageSize());
// HACK by Ryan
//		if(CollectionUtils.isNotEmpty(page.getExtraOrders())){
//			for(Order order : page.getExtraOrders()){
//				c.addOrder(order);
//			}
//		}
//		
//		if (page.isOrderBySetted()) {
//			String[] orderByArray = StringUtils.split(page.getOrderBy(), ',');
//			String[] orderArray = StringUtils.split(page.getOrder(), ',');
//
//			Assert.isTrue(orderByArray.length == orderArray.length, "order by error");
//
//			buildOrderBy(c, orderByArray, orderArray);
//		}
		
		return c;
	}
	
	protected Query setPageParameter(final Query q, final PageInfo<T> page) {
		q.setFirstResult(page.getFirst());
		q.setMaxResults(page.getPageSize());
		return q;
	}
	
	public boolean isPropertiesUnique(final String[] propertyNames, final Object[] values, final PK id) {
		Assert.notNull(propertyNames);
		Assert.notNull(values);
		int size = propertyNames.length;
		Assert.isTrue(size == values.length);
		List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
		for (int i = 0; i < size; i++) {
			Object value = ProxyTargetConverterUtils.getProxyImplementationObject(values[i]);
			MatchType mt = value instanceof String ? MatchType.CASEEQ : MatchType.EQ;
			filters.add(new PropertyFilter(propertyNames[i], value, mt));
		}
		if(id != null) filters.add(new PropertyFilter("id", id, MatchType.NEQ));
		
		Criteria criteria = createCriteria();
		criteria.setProjection(Projections.count("id"));
		List<Criterion> criterionList = buildPropertyFilterCriterionList(filters);
		Long totalQty = (Long) createCriteria(criteria, criterionList.toArray(new Criterion[criterionList.size()])).uniqueResult();
		
		if(totalQty == null || totalQty == 0) {
			return true;
		}
		return false;
	}
	

	public T getBySourceEntityId(String sourceEntityId) {
		PropertyFilter filter = new PropertyFilter("sourceEntityId", sourceEntityId, MatchType.EQ);
		return findUniqueByFilters(filter);
	}
	
	public String getSerialNumber(ISerial iSerial) {
		StringBuffer sb = new StringBuffer();
//		sb.append("select nextval('").append(iSerial.getSequenceName());
		sb.append("select NEXT VALUE FOR ").append(iSerial.getSequenceName());
		
		String suffix = iSerial.getSequenceNameSuffix();
		
		if(!Strings.isEmpty(suffix)) {
			sb.append("_").append(iSerial.getSequenceNameSuffix());
		}
		
//		sb.append("')");
		Integer lSerialNumber = (Integer) getSession().createSQLQuery(sb.toString()).uniqueResult();
		
		StringBuffer numOfZeros = new StringBuffer();
		for (int i = 0; i < iSerial.getSequenceLength(); i ++) {
			numOfZeros.append("0");
		}
		
		String sq = iSerial.getSequenceLength() == 0 ? lSerialNumber.toString() : new DecimalFormat(numOfZeros.toString()).format(lSerialNumber);

		String seq = new StringBuffer().append(iSerial.getPrefix()).append(sq).toString();

		List<String> propertyNames = iSerial.getOtherDiscriminatorNames();
		propertyNames.add("code");
		List<Object> propertyValues =  iSerial.getOtherDiscriminatorValues();
		propertyValues.add(seq);
		if(isPropertiesUnique(propertyNames.toArray(new String[propertyNames.size()]), propertyValues.toArray(new Object[propertyValues.size()]), null)) {
			return seq;
		} else {
			return getSerialNumber(iSerial);
		}
	}
	
	// this method was used to MSSQL
	public Integer getSerialNumber(String sequenceName) {
		StringBuffer sb = new StringBuffer();
		sb.append("SELECT nextval('").append(sequenceName).append("')");// for pg sql
		BigInteger lSerialNumber = (BigInteger) getSession().createSQLQuery(sb.toString()).uniqueResult();
		return lSerialNumber.intValue();
	}
	
	public int createSequence(String seqName) {
	    long increment = 1;
	    long minValue = 1;
	    long maxValue = 9223372036854775807l;
	    long start = 1;
		StringBuffer sb = new StringBuffer();
		sb.append("CREATE SEQUENCE ").append(seqName).append(" INCREMENT ").append(increment);
		sb.append(" MINVALUE ").append(minValue ).append(" MAXVALUE ").append(maxValue).append(" START ").append(start);	            	            

	    return getSession().createSQLQuery(sb.toString()).executeUpdate();
	}
	public int resetSequenceStart(String seqName, Long start) {
	    if(start == null) start = 1L;
	    
		StringBuffer sbNext = new StringBuffer();
//		sbNext.append("select nextval('").append(seqName).append("')");
		sbNext.append("select NEXT VALUE FOR ").append(seqName);
		
		Integer lSerialNumber = (Integer) getSession().createSQLQuery(sbNext.toString()).uniqueResult();
		
		if(lSerialNumber.longValue() > start.longValue()) {
			start = lSerialNumber.longValue() - 1;
		}
		
	    long increment = 1;
	    long minValue = 1;
	    long maxValue = 9223372036854775807l;
	    
	    StringBuffer sb = new StringBuffer();
		sb.append("ALTER SEQUENCE ").append(seqName).append(" INCREMENT ").append(increment);
		sb.append(" MINVALUE ").append(minValue ).append(" MAXVALUE ").append(maxValue).append(" START 1 ").append(" RESTART ").append(start).append(" CACHE 1 NO CYCLE ");          	            

	    return getSession().createSQLQuery(sb.toString()).executeUpdate();
	}
}
