/**
 * 
 */
package com.em.boot.core.utils;


/**
 * @author YF
 *
 */
public class ClassUtils {

	private ClassUtils() {}
	public static String getShortName(Class<?> cls) {
		return getShortName(cls.getName());
		
	}
	public static String getShortName(String clsName) {
		if (clsName.indexOf("$")<0)
		    return clsName.substring(clsName.lastIndexOf(".")+1);
        else 
            return clsName.substring(clsName.lastIndexOf(".")+1, clsName.indexOf("$"));
	}
	
}
