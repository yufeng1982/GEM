package com.em.boot.core.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import org.jscience.economics.money.Currency;

import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.Corporation;

/**
 * @author YF
 *
 */
public class ThreadLocalUtils {
//	private static Logger logger = LoggerFactory.getLogger(ThreadLocalUtils.class);
	
	public final static Integer TL_C_USER = 1;
	public final static Integer TL_C_CORPORATION = 2;
	public final static Integer TL_C_LOCALE = 3;
	public final static Integer TL_C_WORK_DATE = 4;
	
//	public final static Integer TL_C_LOGS = 5;
	public final static Integer TL_C_ERROR_MSG = 6; 
	public final static Integer TL_C_INFO_LOG = 7;
	public final static Integer TL_C_TIME_ZONE = 8;
	public final static Integer TL_C_ERROR_TITLE = 9;
	
	private static Currency DEFAULT_APP_CURRENCY = Currency.CAD;
	private static User DEFAULT_APP_USDER = null;
	private static Date DEFAULT_APP_DATE = DateTimeUtils.dateTimeNow();
	public static int DEFAULT_LOGS_BATCH = -1;
	
	public final static Integer TL_C_P_WAREHOUSE = 11;
	public final static Integer TL_C_S_WAREHOUSE = 12;
	public final static Integer TL_C_PLANT = 15;
	public final static Integer TL_C_PPO_BOL_PRINTER = 16;
	public final static Integer TL_C_TO_BOL_PRINTER = 18;
	public final static Integer TL_C_SO_BOL_PRINTER = 20;
	
	private static ThreadLocal<Map<Integer, Object>> threadLocal = new ThreadLocal<Map<Integer, Object>>();
	
	public static User getDefaultAppUser() {
		return DEFAULT_APP_USDER;
	}

	public static TimeZone getTimeZone() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (TimeZone) map.get(TL_C_TIME_ZONE);
	}
	
	public static void setDefaultAppUser(User defaultAppUser) {
		ThreadLocalUtils.DEFAULT_APP_USDER = defaultAppUser;
	}
	
	public static void setSOBOLPrinterName(String printerName) {
		Map<Integer, Object> map = getThreadObjectMap();
		map.put(TL_C_SO_BOL_PRINTER, printerName);		
	}
	
	public static String getSOBOLPrinterName() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (String) map.get(TL_C_SO_BOL_PRINTER);
	}
	
	public static void setTOBOLPrinterName(String printerName) {
		Map<Integer, Object> map = getThreadObjectMap();
		map.put(TL_C_TO_BOL_PRINTER, printerName);		
	}
	
	public static String getTOBOLPrinterName() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (String) map.get(TL_C_TO_BOL_PRINTER);
	}
	
	public static void setPPOBOLPrinterName(String printerName) {
		Map<Integer, Object> map = getThreadObjectMap();
		map.put(TL_C_PPO_BOL_PRINTER, printerName);		
	}
	
	public static String getPPOBOLPrinterName() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (String) map.get(TL_C_PPO_BOL_PRINTER);
	}
	
	public static Currency getSystemCurrency() {
		return DEFAULT_APP_CURRENCY;
	}

	public static Date getWorkDate() {
		return getCurrentWorkDate();
	}
	
	public static void changeCurrentCorporation(Corporation corporation) {
		threadLocal.get().put(TL_C_CORPORATION, corporation);
	}
	
	public static Corporation getCurrentCorporation() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (Corporation) map.get(TL_C_CORPORATION);
	}

	public static Date getDefaultAppDate() {
		return new Date(DEFAULT_APP_DATE.getTime());
	}

	public static Map<Integer, Object> getContext() {
		return null;
	}
	
	/**
	 * just pass null for primaryWarehouse and secondaryWarehouse for NOVA
	 * @param currentUser
	 * @param currentCorporation
	 * @param currentLocale
	 * @param currentWorkDate
	 * @param primaryWarehouse
	 * @param secondaryWarehouse
	 * @param plant
	 * @param timeZone
	 */
	public static void initThreadLocal(User currentUser, Corporation currentCorporation, Locale currentLocale, Date currentWorkDate, TimeZone timeZone) {
		Map<Integer, Object> map = getThreadObjectMap();
		map.put(TL_C_USER, currentUser);
		map.put(TL_C_CORPORATION, currentCorporation);
		map.put(TL_C_LOCALE, currentLocale);
		map.put(TL_C_WORK_DATE, currentWorkDate);
		map.put(TL_C_ERROR_MSG, new HashSet<String>());
		map.put(TL_C_ERROR_TITLE, new String());
//		map.put(TL_C_INFO_LOG, new SystemInfoLog());
		if(timeZone == null) timeZone = TimeZone.getDefault();
		map.put(TL_C_TIME_ZONE, timeZone);
		map.put(TL_C_PPO_BOL_PRINTER, "");
		map.put(TL_C_TO_BOL_PRINTER, "");
		map.put(TL_C_SO_BOL_PRINTER, "");
		initLogsBatch();
	}
	
	private static void initLogsBatch() {
		if(DEFAULT_LOGS_BATCH <= 0) {
//			DEFAULT_LOGS_BATCH = Integer.parseInt(ResourceUtils.getAppSetting("erp.app.default.logs.batch.quantity"));
			DEFAULT_LOGS_BATCH = 1;
		}
	}

	public static Map<Integer, Object> getThreadObjectMap() {
		Map<Integer, Object> map = threadLocal.get();
		if(map == null) {
			map = new HashMap<Integer, Object>();
			threadLocal.set(map);
		}
		return map;
	}
	
	public static User getCurrentUser() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (User) map.get(TL_C_USER);
	}

	public static void setCurrentCorporation(Corporation corporation) {
		Map<Integer, Object> map = getThreadObjectMap();
		map.put(TL_C_CORPORATION, corporation);
	}
	
	public static Locale getCurrentLocale() {
		Map<Integer, Object> map = getThreadObjectMap();
		Locale l = (Locale) map.get(TL_C_LOCALE);
		if(l == null) l = Locale.ROOT;
		return l;
	}
	public static Date getCurrentWorkDate() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (Date) map.get(TL_C_WORK_DATE);
	}

	@SuppressWarnings("unchecked")
	public static Set<String> getErrorMsg() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (Set<String>) map.get(TL_C_ERROR_MSG);
	}
	public static void addErrorMsg(String errorMsg) {
		if(getErrorMsg() != null)
			getErrorMsg().add(errorMsg);
	}

	public static String getErrorTitle() {
		Map<Integer, Object> map = getThreadObjectMap();
		return (String) map.get(TL_C_ERROR_TITLE);
	}
	public static void addErrorTitle(String errorTitle) {
		getThreadObjectMap().put(TL_C_ERROR_TITLE, errorTitle);
	}

//	public static SystemInfoLog getInfoLog() {
//		Map<Integer, Object> map = getThreadObjectMap();
//		return (SystemInfoLog) map.get(TL_C_INFO_LOG);
//	}
//	public static void addInfoLog(Ownership ownership) {
//		Map<Integer, Object> map = getThreadObjectMap();
//		if(getInfoLog() != null){
//			getInfoLog().addChild(ownership);
//		}
//	}
	//receive login user
	public static User getLoginUser() {
		return getCurrentUser();
	}
}
