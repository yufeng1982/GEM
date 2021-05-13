/**
 * 
 */
package com.em.boot.core.utils;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;

import com.em.boot.core.enums.Language;
import com.em.boot.core.model.security.SecurityLevel;

/**
 * @author FengYu
 * 
 */
public class ResourceUtils {
	private static Logger logger = LoggerFactory.getLogger(ResourceUtils.class);

	private static MessageSource messageSource;
	private static MessageSource coreAppSetting;

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
	public static boolean isPermitted(String p) {
		 return Strings.isEmpty(p) || (getSubject() != null && getSubject().isPermitted(p));
	}
	public static boolean isVisible(String id, String resources) {
		try {
			JSONObject jo = new JSONObject(resources);
			if(jo.has(id) && !Strings.isEmpty(jo.getString(id)) && jo.getString(id).equals(SecurityLevel.hidden.getName())){
				return false;
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return true;
	}
	public static boolean isEnable(String id, String resources) {
		try {
			JSONObject jo = new JSONObject(resources);
			if(jo.has(id) && !Strings.isEmpty(jo.getString(id)) && jo.getString(id).equals(SecurityLevel.disabled.getName())){
				return false;
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return true;
	}
	protected static Subject getSubject() {
        return SecurityUtils.getSubject();
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

	public static String replaceString(String value) {
		return value.replace("\"", "\\\"");
	}
	
	public static String reversedReplaceSpecialChar(String value) {
		value = value.replace("&lt;", "<")
					 .replace("&gt;", ">")
					 .replace("&gt;", ">")
					 .replace("&amp;", "&")
					 .replace("&quot;", "\"")
					 .replace("&#39;", "'")
					 .replace("&#33;", "!");
		return value;
	}
	
	public static String filterSpecialChar4HtmlEditor(String value) {
		if ((value == null) || (value.length() == 0)) {
			return value;
		}

		StringBuffer result = null;
		String filtered = null;

		for (int i = 0; i < value.length(); i++) {
			filtered = null;

			switch (value.charAt(i)) {
			case '&':
				filtered = "&amp;";

				break;

			case '"':
				filtered = "&quot;";

				break;

			case '\'':
				filtered = "&#39;";

				break;

			case '!':
				filtered = "&#33;";

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
	
	public static String getFileName(String filePath) {
		if (Strings.isEmpty(filePath)) {
			return "";
		} else {
			return filePath.substring(filePath.lastIndexOf("/") + 1);
		}
	}
}
