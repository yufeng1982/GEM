package com.em.boot.core.utils;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.Criterion;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.engine.spi.TypedValue;

/**
 * "formula" comparisons (with SQL binary operators)
 * 
 * @author YF
 */
public class FormulaExpression implements Criterion {

	private static final long serialVersionUID = -3699805625181370340L;
	
	private final String propertyName;
	private final Object value;
	private boolean ignoreCase;
	private final String op;

	private static final TypedValue[] NO_TYPED_VALUES = new TypedValue[0];
	
	protected FormulaExpression(String propertyName, Object value, String op) {
		this.propertyName = propertyName;
		this.value = value;
		this.op = op;
	}

	protected FormulaExpression(String propertyName, Object value, String op,
			boolean ignoreCase) {
		this.propertyName = propertyName;
		this.value = value;
		this.ignoreCase = ignoreCase;
		this.op = op;
	}

	public FormulaExpression ignoreCase() {
		ignoreCase = true;
		return this;
	}

	public String toSqlString(Criteria criteria, CriteriaQuery criteriaQuery)
			throws HibernateException {

		String column = HibernateHelper.toFormulaSqlString(propertyName, criteria, criteriaQuery);
		StringBuffer fragment = new StringBuffer();
		SessionFactoryImplementor factory = criteriaQuery.getFactory();
		if (ignoreCase) {
			fragment.append(factory.getDialect().getLowercaseFunction()).append('(');
		}
		fragment.append(column);
		if (ignoreCase)
			fragment.append(')');
//		fragment.append(getOp()).append("?");
		fragment.append(getOp()).append(value.toString());
		return fragment.toString();

	}

	public TypedValue[] getTypedValues(Criteria criteria,
			CriteriaQuery criteriaQuery) throws HibernateException {
//		Object icvalue = ignoreCase ? value.toString().toLowerCase() : value;
//		return new TypedValue[] { criteriaQuery.getTypedValue(criteria,
//				propertyName, icvalue) };
		return NO_TYPED_VALUES;
	}

	public String toString() {
		return propertyName + getOp() + value;
	}

	protected final String getOp() {
		return op;
	}

}