/**
 * 
 */
package com.em.boot.core.utils;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.StringTokenizer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;

import com.em.boot.core.enums.Language;

public class ResourceUtils {
	private static Logger logger = LoggerFactory.getLogger(ResourceUtils.class);

	private static MessageSource messageSource;
	private static MessageSource coreAppSetting;
	public static Map<String, String> enumMap = new HashMap<String, String>();

	private ResourceUtils() {
	}

	public static void initMessageSource(MessageSource mSource, MessageSource caSetting) {
		if (messageSource == null) {
			messageSource = mSource;
		}
		if (coreAppSetting == null) {
			coreAppSetting = caSetting;
		}
	}

	public static boolean isInit() {
		return messageSource != null && coreAppSetting != null;
	}
	
	public static String getPrinter1(String corporation) {
		return getAppSetting("erp.app.printer.1." + corporation);
	}
	public static String getPrinter2(String corporation) {
		return getAppSetting("erp.app.printer.2." + corporation);
	}
	public static String getPrinterLabel(String corporation) {
		return getAppSetting("erp.app.printer.label." + corporation);
	}

	public static String getAppSetting(String key) {
		String returnValue = "???" + key + "???";
		if (coreAppSetting != null) {
			try {
				returnValue = coreAppSetting.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
			} catch (NoSuchMessageException e) {
				logger.error("Could not find app setting for : " + key);
			}
		}
		return returnValue;
	}

	public static boolean isAppSettingExist(String key) {
		if (coreAppSetting != null) {
			try {
				coreAppSetting.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
				return true;
			} catch (NoSuchMessageException e) {
				return false;
			}
		}
		return false;
	}

	public static boolean isMessageSourceExist(String key) {
		if (messageSource != null) {
			try {
				messageSource.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
				return true;
			} catch (NoSuchMessageException e) {
				return false;
			}
		}
		return false;
	}

	public static String getConvertedText(String key) {
		String returnValue = "???" + key + "???";
		if (messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
				returnValue = filterSpecialChar(returnValue);
			} catch (NoSuchMessageException e) {
//				logger.error("Could not find resource for : " + key);
				System.out.println(key+"="+key.replaceAll("(\\p{Ll})(\\p{Lu})", "$1 $2"));
			}
		}
		return returnValue;
	}
	public static String getText(String key) {
		String returnValue = "???" + key + "???";
		if (messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
			} catch (NoSuchMessageException e) {
//				logger.error("Could not find resource for : " + key);
				System.out.println(key+"="+key.replaceAll("(\\p{Ll})(\\p{Lu})", "$1 $2"));
			}
		}
		return returnValue;
	}
	
	public static String getText(String key, Locale locale) {
		String returnValue = "???"+key+"???";		
		if(locale == null) {
			String langIsoCode = getAppSetting("erp.app.systemOwner.languageIsoCode");
			locale = Language.getLocaleByLanguage(langIsoCode);
		}
		if(messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, new Object[0], locale);
			} catch (NoSuchMessageException e) {
			}
		}
		return returnValue;
	}

	public static String getText(String key, Object[] object, Locale locale) {
		String returnValue = "???"+key+"???";
		if(locale == null) {
			String langIsoCode = getAppSetting("erp.app.systemOwner.languageIsoCode");
			locale = Language.getLocaleByLanguage(langIsoCode);
		}
		if(messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, object, locale);
			} catch (NoSuchMessageException e) {
				System.out.println(key + "=" + key);
			}
		}
		return returnValue;
	}
	
	public static String getText(String key,String langIsoCode) {
		String returnValue = "???"+key+"???";
		if(Strings.isEmpty(langIsoCode)) {
			langIsoCode = getAppSetting("erp.app.systemOwner.languageIsoCode");
		}
		if(messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, new Object[0], Language.getLocaleByLanguage(langIsoCode));
			} catch (NoSuchMessageException e) {
			}
		}
		return returnValue;
	}
	
	public static String getText(String key, Object[] object) {
		String returnValue = "???" + key + "???";
		if (messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, object, ThreadLocalUtils.getCurrentLocale());
			} catch (NoSuchMessageException e) {
//				logger.error("Could not find resource for : " + key);
				System.out.println(key+"="+key.replaceAll("(\\p{Ll})(\\p{Lu})", "$1 $2"));
			}
		}
		return returnValue;
	}

	public static String filterSpecialChar(String value) {
		if ((value == null) || (value.length() == 0)) {
			return value;
		}

		StringBuffer result = null;
		String filtered = null;

		for (int i = 0; i < value.length(); i++) {
			filtered = null;

			switch (value.charAt(i)) {
			case '<':
				filtered = "&lt;";

				break;

			case '>':
				filtered = "&gt;";

				break;

			case '&':
				filtered = "&amp;";

				break;

			case '"':
				filtered = "&quot;";

				break;

			case '\'':
				filtered = "&#39;";

				break;
			}

			if (result == null) {
				if (filtered != null) {
					result = new StringBuffer(value.length() + 50);

					if (i > 0) {
						result.append(value.substring(0, i));
					}

					result.append(filtered);
				}
			} else {
				if (filtered == null) {
					result.append(value.charAt(i));
				} else {
					result.append(filtered);
				}
			}
		}

		return (result == null) ? value : result.toString();
	}
	public static EnumSet<?> enumSet(String className, String method) throws ClassNotFoundException {
		className = enumMap.get(className);
		Class<?> enumType = Class.forName(className);
		Object[] consts = enumType.getEnumConstants();
		if (Strings.isEmpty(method)) {
			method = "getAll";
		}
		return (EnumSet<?>)EntityReflectionUtils.invokeMethod(consts[0], method, new Class[] {}, new Object[] {});
	}
	
	public static EnumSet<?> enumSet(String className) throws ClassNotFoundException {
		return enumSet(className, "getAll");
	}
	
	public static List<String> getList(String key) {
		List<String> list = new ArrayList<String>();
		if (coreAppSetting != null) {
			try {
				String returnValue = coreAppSetting.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
				StringTokenizer tokens = new StringTokenizer(returnValue, ",");
				while (tokens.hasMoreTokens()) {
					list.add(tokens.nextToken().trim());
				}

			} catch (NoSuchMessageException e) {
				return list;
			}
		}
		return list;
	}
}
