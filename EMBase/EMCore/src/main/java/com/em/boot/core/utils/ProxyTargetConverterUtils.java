/**
 * 
 */
package com.em.boot.core.utils;

import org.hibernate.proxy.HibernateProxy;

/**
 * @author YF
 *
 */
public class ProxyTargetConverterUtils {

	private static ProxyTargetConverterUtils proxyTargetConverter = null;
	
	private ProxyTargetConverterUtils(){}
	
	public static synchronized ProxyTargetConverterUtils instance() {
		if (proxyTargetConverter == null) {
			proxyTargetConverter = new ProxyTargetConverterUtils();
		}
		return proxyTargetConverter;
	}
	
	public static Object getProxyImplementationObject(Object proxyObject) {
		if(proxyObject == null) return null;
		if(proxyObject instanceof HibernateProxy) {
			return ((HibernateProxy) proxyObject).getHibernateLazyInitializer().getImplementation();
		} else {
			return proxyObject;
		}
	}
	
	@SuppressWarnings("unchecked")
	public static <T> T getProxyImplementationObject(Object proxyObject, Class<T> cast) {
		if(proxyObject == null) return null;
		if(proxyObject instanceof HibernateProxy) {
			return (T) ((HibernateProxy) proxyObject).getHibernateLazyInitializer().getImplementation();
		} else {
			return (T) proxyObject;
		}
	}
}
