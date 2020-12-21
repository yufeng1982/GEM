/**
 * 
 */
package com.em.boot.core.exceptions;

/**
 * @author YF
 *
 */
public class SourceEntityError extends ERPException {
	private static final long serialVersionUID = 5065272479188871951L;
	
	public static final String SOURCE_TYPE_CLAZZ_ERROR = "SourceEntity.Type.Clazz.Error";

	public SourceEntityError() {
		super();
	}

	public SourceEntityError(String message, Throwable cause) {
		super(message, cause);
	}

	public SourceEntityError(String message) {
		super(message);
	}

	public SourceEntityError(Throwable cause) {
		super(cause);
	}
	
}
