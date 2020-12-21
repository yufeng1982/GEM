package com.em.boot.core.utils;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.criterion.CriteriaQuery;
import org.hibernate.criterion.Order;

public class StringLengthOrder extends Order {
    private static final long serialVersionUID = 1L;

    private boolean ascending;
    private String  propName;

    public StringLengthOrder(String prop, boolean asc) {
        super(prop, asc);
        ascending    = asc;
        propName = prop;
    }

    public String toSqlString(Criteria criteria, CriteriaQuery criteriaQuery) throws HibernateException {
        String[] columns = criteriaQuery.getColumnsUsingProjection(criteria, propName);
        StringBuffer fragment = new StringBuffer();
        for ( int i=0; i<columns.length; i++ ) {
            fragment.append(" length( ");
            fragment.append( columns[i] );
            fragment.append( ')');
            fragment.append( ascending ? " asc" : " desc" );
            if ( i<columns.length-1 ){
            	fragment.append(", ");
            }
        }
        return fragment.toString();
    }

    public static Order asc(String propertyName) {
        return new StringLengthOrder(propertyName, true);
    }


    public static Order desc(String propertyName) {
        return new StringLengthOrder(propertyName, false);
    }
}
