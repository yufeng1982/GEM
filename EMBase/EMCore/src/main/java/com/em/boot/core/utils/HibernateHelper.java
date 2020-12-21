package com.em.boot.core.utils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.hibernate.dialect.H2Dialect;
import org.hibernate.dialect.MySQL5InnoDBDialect;
import org.hibernate.dialect.Oracle10gDialect;
import org.hibernate.dialect.PostgreSQL82Dialect;
import org.hibernate.dialect.SQLServer2008Dialect;

import com.em.boot.core.utils.PropertyFilter.MatchType;

/**
 * 
 * @author YF
 */
public class HibernateHelper {

	public static Pattern propertyPattern = Pattern.compile("[a-zA-Z._]+");
	public static Pattern isFormulaPattern = Pattern.compile("[\\+\\-\\*/()]+");

	public static final String DATETIME_TYPE = "org.jadira.usertype.dateandtime.joda.PersistentDateTime";

	/**
	 * Initialize the lazy property value.
	 * 
	 * eg.
	 * Hibernates.initLazyProperty(user.getGroups()); 
	 */
	public static void initLazyProperty(Object proxyedPropertyValue) {
		Hibernate.initialize(proxyedPropertyValue);
	}

	/**
	 * get connection from DataSoure
	 */
	public static String getDialect(DataSource dataSource) {

		String jdbcUrl = null;
		Connection connection = null;
		try {
			connection = dataSource.getConnection();
			if (connection == null) {
				throw new IllegalStateException("Connection returned by DataSource [" + dataSource + "] was null");
			}
			jdbcUrl = connection.getMetaData().getURL();
		} catch (SQLException e) {
			throw new RuntimeException("Could not get database url", e);
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
				}
			}
		}

		// return the dialect accoring to jdbc url
		if (StringUtils.contains(jdbcUrl, ":postgresql:")) {
			return PostgreSQL82Dialect.class.getName();
		} else if (StringUtils.contains(jdbcUrl, ":h2:")) {
			return H2Dialect.class.getName();
		} else if (StringUtils.contains(jdbcUrl, ":mysql:")) {
			return MySQL5InnoDBDialect.class.getName();
		} else if (StringUtils.contains(jdbcUrl, ":oracle:")) {
			return Oracle10gDialect.class.getName();
		} else if (StringUtils.contains(jdbcUrl, ":sqlserver:")) {
			return SQLServer2008Dialect.class.getName();
		} else {
			throw new IllegalArgumentException("Unknown Database of " + jdbcUrl);
		}
	}
	
	public static String toFormulaSqlString(String propertyName, Criteria criteria, CriteriaQuery criteriaQuery) {
		if(Strings.isEmpty(propertyName)) {
			return propertyName;
		}
		StringBuffer sb = new StringBuffer();
//		propertyName = propertyName.replaceAll(" ", "");
		Matcher mat = propertyPattern.matcher(propertyName);
		while(mat.find()) {
			for (int j = 0; j <= mat.groupCount(); j++) {
				String c = mat.group(j);
				if(c.equals("cast") || c.equals("as") || c.equals("integer") || c.equals("coalesce")) {
					continue;
				}
				String[] columns = criteriaQuery.getColumnsUsingProjection(criteria, c);
				for (int i=0; i<columns.length; i++) {
					mat.appendReplacement(sb, columns[i]);
				}
			}
		}
		mat.appendTail(sb);
		return sb.toString();
	}
	public static Criterion buildPropertyCriterion(PropertyFilter filter) {
		
		if(filter == null) return null;
		
		String propertyName = filter.getPropertyName();
		Object value = filter.getValue();
		MatchType matchType = filter.getMatchType();
		
		return buildPropertyCriterion(propertyName, value, matchType);
	}
	
	public static Criterion buildPropertyCriterion(final String propertyName, final Object value, MatchType matchType) {
		if(value == null) return null;
		Criterion criterion = null;
		
		if (MatchType.EQ.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, "=");
		} else if (MatchType.CASEEQ.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, "=", true);
		} else if (MatchType.NEQ.equals(matchType)) {
			criterion = Restrictions.not(new FormulaExpression(propertyName, value, "="));
		} else if (MatchType.LTE.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, "<=");
		} else if (MatchType.LT.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, "<");
		} else if (MatchType.GTE.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, ">=");
		} else if (MatchType.GT.equals(matchType)) {
			criterion = new FormulaExpression(propertyName, value, ">");
		} else if (MatchType.START.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = new FormulaExpression(propertyName, MatchMode.START.toMatchString((String)value), " like ", true);
		} else if (MatchType.NSTART.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.not( new FormulaExpression(propertyName, MatchMode.START.toMatchString((String)value), " like ", true));
		} else if (MatchType.END.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = new FormulaExpression(propertyName, MatchMode.END.toMatchString((String)value), " like ", true);
		} else if (MatchType.NEND.equals(matchType)) {
			if(PropertyFilter.ALL.equals(value)) return null;
			criterion = Restrictions.not(new FormulaExpression(propertyName, MatchMode.END.toMatchString((String)value), " like ", true));
		}
		return criterion;
	}
	
	public static Criterion buildBetweenPropertyCriterion(final String propertyName, final Object minValue, final Object maxValue) {
		Criterion criterion = null;
		if(minValue != null && maxValue != null) {
			return Restrictions.and(new FormulaExpression(propertyName, minValue, ">="), new FormulaExpression(propertyName, maxValue, "<="));
		} else if (minValue != null) {
			return new FormulaExpression(propertyName, minValue, ">=");
		} else if (maxValue != null) {
			return new FormulaExpression(propertyName, maxValue, "<=");
		}
		return criterion;
	}
	
	public static boolean isFormula(String expression) {
		if(!Strings.isEmpty(expression)) {
			Matcher mat = isFormulaPattern.matcher(expression);
			while(mat.find()) {
				return true;
			}
		}
		return false;
	}
}
