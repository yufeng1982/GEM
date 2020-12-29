/**
 * 
 */
package com.em.boot.core.utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.jasypt.hibernate4.type.AbstractEncryptedAsStringType;

/**
 * @author YF
 *
 */
public class CustomEncryptedStringType extends AbstractEncryptedAsStringType {

	@Override
	public Object nullSafeGet(ResultSet rs, String[] names, SharedSessionContractImplementor session, Object owner)
			throws HibernateException, SQLException {
		checkInitialization();
        final String message = rs.getString(names[0]);
        return rs.wasNull() ? null : convertToObject(this.encryptor.decrypt(message));
	}

	@Override
	public void nullSafeSet(PreparedStatement st, Object value, int index, SharedSessionContractImplementor session)
			throws HibernateException, SQLException {
		 checkInitialization();
	        if (value == null) {
	            st.setNull(index, Types.VARCHAR);
	        } else {
	            st.setString(index, this.encryptor.encrypt(convertToString(value)));
	        }
	}
	
	
	@Override
	protected Object convertToObject(String string) {
		return string;
	}

	@Override
	public Class<String> returnedClass() {
		return String.class;
	}

}
