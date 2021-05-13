/**
 * 
 */
package com.em.boot.core.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

import com.em.boot.core.dao.AbsRepository;
import com.em.boot.core.model.IDelete;
import com.em.boot.core.model.IEntity;
import com.em.boot.core.utils.AppUtils;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;
import com.em.boot.core.utils.PropertyFilter.MatchType;
import com.em.boot.core.utils.ProxyTargetConverterUtils;
import com.google.common.collect.Lists;

/**
 * @author YF
 *
 */
public abstract class AbsService<T extends IEntity, P extends PageInfo<T>> {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	protected abstract AbsRepository<T> getRepository();
	
	/**
	 * TRUE - company regardless
	 * @return
	 */
	public abstract boolean isCommonAccess();

	public T get(String id) {
		return getRepository().findById(id).orElse(null);
	}

	public T save(T entity) {
		return getRepository().save(entity);
	}
	
	public Iterable<T> save(Iterable<T> entities) {
		return getRepository().saveAll(entities);
	}
	
	public void delete(T entity) {
		Assert.notNull(entity);
		if(entity instanceof IDelete && !((IDelete) entity).isRealDelete()){
			((IDelete) entity).setToInactive();
			getRepository().save(entity);
		}else{
			getRepository().delete(entity);
		}
	}
	
	public void realDelete(T entity) {
		Assert.notNull(entity);
		getRepository().delete(entity);
	}

	public T findOne(PropertyFilter... filters) {
		return getRepository().findOne(this.bySearchFilter(filters)).orElse(null);
	}

//	TODO public abstract void flushAndClearSession();

	
	
	public Iterable<T> getByIds(Iterable<String> ids) {
		return getRepository().findAllById(ids);
	}
	
	public Page<T> search(P page) {
		return getRepository().findAll(this.byPage(page), page);
	}

	public Iterable<T> search(PropertyFilter... filters) {
		return getRepository().findAll(this.bySearchFilter(filters));
	}
	
//	public abstract Page<T> getAll(Page<T> page);
//	
//	public List<T> getAll(String[] orderByArray, String[] orderArray);
//	public List<T> getAllActiveByCorporation(String corporation, String[] orderByArray, String[] orderArray);
//	
	public boolean isPropertyUnique(final String propertyName, final Object newValue, final String id) {
		
		return isPropertiesUnique(new String[]{propertyName}, new Object[]{newValue}, id);
	}
	public boolean isPropertiesUnique(final String[] propertyNames, final Object[] values, final String id) {
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
		
		Long totalQty = getRepository().count(this.bySearchFilter(filters));
		
		if(totalQty == null || totalQty == 0) {
			return true;
		}
		return false;
	}


	public Page<T> search(P p, String queryStr, String...propertyNames) {
		Assert.notNull(propertyNames);
		int size = propertyNames.length;
		List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
		for (int i = 0; i < size; i++) {
			filters.add(new PropertyFilter(propertyNames[i], queryStr, MatchType.LIKE));
		}
		return search(p, filters.toArray(new PropertyFilter[filters.size()]));
	}
	
	public Page<T> search(P p, final PropertyFilter... filters) {
		return getRepository().findAll(this.bySearchFilter(filters), p);
	}
	
	public Iterable<T> search(Sort sort, String queryStr, String...propertyNames) {
		Assert.notNull(propertyNames);
		int size = propertyNames.length;
		List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
		for (int i = 0; i < size; i++) {
			filters.add(new PropertyFilter(propertyNames[i], queryStr, MatchType.LIKE));
		}
		return search(sort, filters.toArray(new PropertyFilter[filters.size()]));
	}

	public Iterable<T> search(Sort sort, final PropertyFilter... filters) {
		return getRepository().findAll(this.bySearchFilter(filters), sort);
	}
	
	protected Specification<T> byPage(P page) {
//		if(!this.isCommonAccess() && page.getSf_EQ_corporation() == null) {
//			page.setSf_EQ_corporation(ThreadLocalUtils.getCurrentCorporation());
//		}
		return bySearchFilter(page.toSearchFilters());
	}
	
	protected Specification<T> bySearchFilter(PropertyFilter...filters) {
		return bySearchFilter(Lists.newArrayList(filters));
	}
	
	protected Specification<T> byHeaderFilter(List<PropertyFilter> pfList) {
		return bySearchFilter(pfList);
	}
	
	protected Specification<T> bySearchFilter(final Collection<PropertyFilter> filters) {
		return new Specification<T>() {
			
			@Override
			public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
				if (AppUtils.isNotEmpty(filters)) {

					List<Predicate> predicates = Lists.newArrayList();
					for (PropertyFilter filter : filters) {
						if(filter == null) continue;
						
						Predicate predicate = buildPredicate(root, builder, filter);
						
						if(predicate != null) predicates.add(predicate);
					}
					if (predicates.size() > 0) {
						return builder.and(predicates.toArray(new Predicate[predicates.size()]));
					}
				}

				return builder.conjunction();
			}
		};
		
	}
	
	protected Predicate buildPredicate(Root<T> root, CriteriaBuilder builder, PropertyFilter pf) {
		return AppUtils.buildPredicate(root, builder, pf);
	}
	
	protected Predicate buildPredicate(Root<T> root, CriteriaBuilder builder, String propertyName, Object value, MatchType matchType) {
		return AppUtils.buildPredicate(root, builder, propertyName, value, matchType);
	}
	
}
