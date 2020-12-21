/**
 * 
 */
package com.em.boot.core.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.jpa.criteria.CriteriaBuilderImpl;
import org.hibernate.jpa.criteria.predicate.InPredicate;
import org.jscience.economics.money.Currency;
import org.springframework.util.Assert;

import com.em.boot.core.utils.PropertyFilter.MatchType;

public class AppUtils {
	public static String APP_NAME = null;
	public static String APP_PATH = null;
	public static String VELOCITY_PATH = null;

	public static int ACCOUNTING_SCALE = 4;
	
	public static String SALT_SOURCE="asdasdas";
	
	public static Currency DEFAULT_CURRENCY = Currency.CAD;
	
	private String appName;
	
	AppUtils() {}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
		APP_NAME = appName;
	}
	
	@SuppressWarnings("rawtypes")
	public static boolean isNotEmpty(Collection collection) {
		return (collection != null && !(collection.isEmpty()));
	}
	
	public static Predicate buildPredicate(Root<?> root, CriteriaBuilder builder, PropertyFilter pf) {
		if(pf.isMultiPropertyName()) {
			List<Predicate> predicates = new ArrayList<>();
			String propertyName = pf.getPropertyName();
			String[] pns = StringUtils.split(propertyName, ",");
			for (String pn : pns) {
				if(Strings.isEmpty(pn)) continue;
				
				Predicate p = buildPredicate(root, builder, pn, pf.getValue(), pf.getMatchType());
				if(p != null) predicates.add(p);
			}
			if(predicates.isEmpty()) return null;
			
			return builder.or(predicates.toArray(new Predicate[predicates.size()]));
		} else {
			return buildPredicate(root, builder, pf.getPropertyName(), pf.getValue(), pf.getMatchType());
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Predicate buildPredicate(Root<?> root, CriteriaBuilder builder, String propertyName, Object value, MatchType matchType) {
		Assert.hasText(propertyName);
		
		Predicate predicate = null;
		
		String[] names = StringUtils.split(propertyName, ".");
		Path expression = root.get(names[0]);
		for (int i = 1; i < names.length; i++) {
			expression = expression.get(names[i]);
		}
		if (MatchType.NNULL.equals(matchType)) {
			return builder.isNotNull(expression);
		} else if (MatchType.NULL.equals(matchType)) {
			return builder.isNull(expression);
		}
		
		if(value == null) return null;
		
		switch (matchType) {
		case EQ:
			predicate = builder.equal(expression, value);
			break;
		case LIKE:
			predicate = builder.like(builder.upper(expression), "%" + value.toString().toUpperCase() + "%");
			break;
		case GT:
			predicate = builder.greaterThan(expression, (Comparable) value);
			break;
		case LT:
			predicate = builder.lessThan(expression, (Comparable) value);
			break;
		case GTE:
			predicate = builder.greaterThanOrEqualTo(expression, (Comparable) value);
			break;
		case LTE:
			predicate = builder.lessThanOrEqualTo(expression, (Comparable) value);
			break;
		case CASEEQ:
			predicate = builder.equal(builder.upper(expression), ((String) value).toUpperCase());
			break;
		case NEQ:
			predicate = builder.notEqual(expression, value);
			break;
		case IN:
			predicate = new InPredicate((CriteriaBuilderImpl)builder, expression, value);
			break;
		case NIN:
			predicate = new InPredicate((CriteriaBuilderImpl)builder, expression, value).not();
			break;
		case NLIKE:
			predicate = builder.notLike(builder.upper(expression), "%" + value.toString().toUpperCase() + "%");
			break;
		case END:
			predicate = builder.like(builder.upper(expression), "%" + value.toString().toUpperCase());
			break;
		case START:
			predicate = builder.like(builder.upper(expression), value.toString().toUpperCase() + "%");
			break;
		case NEND:
			predicate = builder.notLike(builder.upper(expression), "%" + value.toString().toUpperCase());
			break;
		case NSTART:
			predicate = builder.notLike(builder.upper(expression), value.toString().toUpperCase() + "%");
			break;
		default:
			break;
		}
		return predicate;
	}
}
