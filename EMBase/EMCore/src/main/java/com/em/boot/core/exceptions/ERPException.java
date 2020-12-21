package com.em.boot.core.exceptions;

public class ERPException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7858815717066790302L;

	private String detailErrorMsg;
	
	protected ERPException() {
		super();
	}
	protected ERPException(String message, Throwable cause) {
		super(message, cause);
	}
	protected ERPException(Throwable cause) {
		super(cause);
	}

	public ERPException(String message) {
		super(message);
	}
	public ERPException(String message, String detailMsg) {
		super(message);
		this.setDetailErrorMsg(detailMsg);
	}
	public void setDetailErrorMsg(String detailErrorMsg) {
		this.detailErrorMsg = detailErrorMsg;
	}
	public String getDetailErrorMsg() {
		return detailErrorMsg == null ? "" : detailErrorMsg;
	}
}
