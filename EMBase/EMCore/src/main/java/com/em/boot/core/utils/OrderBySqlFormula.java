package com.em.boot.core.utils;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.Order;

/**
 * 
 * @author YF
 */
public class OrderBySqlFormula extends Order {
    /**
	 * 
	 */
	private static final long serialVersionUID = 7154495192047518506L;
	private String sqlFormula;
 
    /**
     * Constructor for Order.
     * @param sqlFormula an SQL formula that will be appended to the resulting SQL query
     */
    protected OrderBySqlFormula(String sqlFormula) {
        super(sqlFormula, true);
        this.sqlFormula = sqlFormula;
    }
 
    public String toString() {
        return sqlFormula;
    }
 
    public String toSqlString(Criteria criteria, CriteriaQuery criteriaQuery) throws HibernateException {
    	String[] orders = sqlFormula.split(",");
    	StringBuffer s = new StringBuffer();
    	for (int k = 0; k < orders.length; k++) {
			String o = orders[k];
	    	String order = o.toLowerCase().endsWith("asc") ? "asc" : "desc";
//	    	o = o.replaceAll(" ", "");
	    	String f = o.substring(0, o.lastIndexOf(order));
	    	
	    	// for more formula
	    	if(f.endsWith("asc")) {
	    		order = "asc";
	    		f = o.substring(0, o.lastIndexOf("asc"));
	    	} else if(f.endsWith("desc")) {
	    		order = "desc";
	    		f = o.substring(0, o.lastIndexOf("desc"));
	    	}
	    	
			StringBuffer sb = new StringBuffer();
			String column = HibernateHelper.toFormulaSqlString(f, criteria, criteriaQuery);
			sb.append(column);
			sb.append(" " + order);
			s.append(sb);
			if ( k < orders.length-1 ) s.append(", ");
		}
        return s.toString();
    }
 
    /**
     * Custom order
     *
     * @param sqlFormula an SQL formula that will be appended to the resulting SQL query
     * @return Order
     */
    public static Order sqlFormula(String sqlFormula) {
        return new OrderBySqlFormula(sqlFormula);
    }
}