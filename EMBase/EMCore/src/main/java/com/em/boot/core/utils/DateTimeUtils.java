
package com.em.boot.core.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Properties;
import java.util.TimeZone;
import java.util.regex.Pattern;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author YF
 * 
 */
@SuppressWarnings("static-access")
public class DateTimeUtils {
	private static final String YEAR = "Y";
	private static final String QUARTER = "Q";
	private static final String MONTH = "M";
	private static final String WEEK = "W";
	private static final String DAY = "D";
	private static final String HOUR = "h";
	private static final String MIN = "min";
	private static final String SEC = "s";
	private static final String DEFAULT_TIME_FORMAT = "00:00:00";
	static private Logger log = LoggerFactory.getLogger(DateTimeUtils.class);

	private static Calendar changeDateToCalendar(Date date) {
		if (date == null) return null;
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		return cal;
	}

	public static String computeTime(String dateString, String val,
			String timeUnit) {
		DateTime date = new DateTime();
		int value = 0;
		boolean isLong = false;
		if (!Strings.isEmpty(val) && !Strings.isEmpty(dateString)
				&& !Strings.isEmpty(timeUnit)) {
			if (dateString.substring(dateString.indexOf("T") + 1,
					dateString.length()).length() == 0) {
				dateString = dateString + DEFAULT_TIME_FORMAT;
			}
			date = new DateTime(dateString);
			if (val.indexOf(".") > 0) {
				val = val.substring(0, val.indexOf("."));
			}
			Long l = new Long(val);
			if ((l.longValue() < 0 && -l.longValue() > 32768)
					|| (l.longValue() > 0 && l.longValue() > 32768)) {
				isLong = true;
			}
			if (!isLong) {
				value = Integer.parseInt(val);
			}
			if (!Strings.isEmpty(timeUnit)) {
				if (timeUnit.equals("d")) {
					if (!isLong) {
						if (value > 0) {
							date = date.plusDays(value);
						} else {
							date = date.minusDays(-value);
						}
					} else {
						if (l.longValue() < 0) {
							date = date.minus(-l.longValue() * 24 * 60 * 60
									* 1000);
						} else {
							date = date.plus(l.longValue() * 24 * 60 * 60
									* 1000);
						}
					}
				} else if (timeUnit.equals(HOUR)) {
					if (!isLong) {
						if (value > 0) {
							date = date.plusHours(value);
						} else {
							date = date.minusHours(-value);
						}
					} else {
						if (l.longValue() < 0) {
							date = date.minus(-l.longValue() * 60 * 60 * 1000);
						} else {
							date = date.plus(l.longValue() * 60 * 60 * 1000);
						}
					}
				} else if (timeUnit.equals(MIN)) {
					if (!isLong) {
						if (value > 0) {
							date = date.plusMinutes(value);
						} else {
							date = date.minusMinutes(-value);
						}
					} else {
						if (l.longValue() < 0) {
							date = date.minus(-l.longValue() * 60 * 1000);
						} else {
							date = date.plus(l.longValue() * 60 * 1000);
						}
					}
				} else if (timeUnit.equals(SEC)) {
					if (!isLong) {
						if (value > 0) {
							date = date.plusSeconds(value);
						} else {
							date = date.minusSeconds(-value);
						}
					} else {
						if (l.longValue() < 0) {
							date = date.minus(-l.longValue() * 1000);
						} else {
							date = date.plus(l.longValue() * 1000);
						}
					}
				}
			}
		}
		return FormatUtils.formatDateTimeToISO(date.toDate());
	}
	
	public static Date dateTimeNow() {
		DateTime dt = new DateTime();
		return dt.toDate();
	}

	public static Date getDateFromDateDesc(String leadTime) {
		DateTime dateTime = new DateTime(0, 12, 31, 0, 0, 0, 0);
		if (!Strings.isEmpty(leadTime)) {
			String time = "0";
			if (leadTime.indexOf(".") > 0) {
				time = leadTime.substring(0, leadTime.indexOf("."));
			} else {
				time = leadTime.substring(0, leadTime.length() - 1);
			}
			int timeVal = Integer.parseInt(time);
			if (leadTime.indexOf(DAY) >= 0) {
				if (timeVal > 0) {
					dateTime = dateTime.plusDays(timeVal);
				} else {
					dateTime = dateTime.minusDays(Math.abs(timeVal));
				}
			} else if (leadTime.indexOf(WEEK) >= 0) {
				if (timeVal > 0) {
					dateTime = dateTime.plusWeeks(timeVal);
				} else {
					dateTime = dateTime.minusWeeks(Math.abs(timeVal));
				}
			} else if (leadTime.indexOf(MONTH) >= 0) {
				if (timeVal > 0) {
					dateTime = dateTime.plusMonths(timeVal);
				} else {
					dateTime = dateTime.minusMonths(Math.abs(timeVal));
				}
			} else if (leadTime.indexOf(QUARTER) >= 0) {
				if (timeVal > 0) {
					dateTime = dateTime.plusMonths(timeVal * 3);
				} else {
					dateTime = dateTime.minusMonths(Math.abs(timeVal * 3));
				}
			} else if (leadTime.indexOf(YEAR) >= 0) {
				if (timeVal > 0) {
					dateTime = dateTime.plusYears(timeVal);
				} else {
					dateTime = dateTime.minusYears(Math.abs(timeVal));
				}
			}
			return dateTime.toDate();
		}
		return dateTime.toDate();
	}

	public static long getDateValueFromDateDesc(String leadTime) {
		if (!Strings.isEmpty(leadTime)) {
			DateTime dateTime = new DateTime(
					DateTimeUtils.getDateFromDateDesc(leadTime));
			DateTime todayDateTime = new DateTime(0, 12, 31, 0, 0, 0, 0);
			return dateTime.getMillis() - todayDateTime.getMillis();
		}
		return 0;
	}

	public static java.util.Calendar getMaxDateLastMonth() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.set(java.util.Calendar.DATE, 0);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMaxDateLastWeek() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setFirstDayOfWeek(java.util.Calendar.SUNDAY);
		cal.add(java.util.Calendar.DATE, -7);
		cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.SATURDAY);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMaxDateLastYear() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.YEAR, -1);
		int MaxDayNowYear = 1;
		int NowYear = cal.get(cal.YEAR);
		int MaxMonthNowYear = 12;
		cal.clear();
		cal.set(NowYear, MaxMonthNowYear - 1, MaxDayNowYear);
		MaxDayNowYear = cal.getActualMaximum(cal.DAY_OF_MONTH);
		cal.clear();
		cal.set(NowYear, MaxMonthNowYear - 1, MaxDayNowYear);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMaxDateThisMonth() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.MONTH, 1);
		cal.set(java.util.Calendar.DATE, 0);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMaxDateThisWeek() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setFirstDayOfWeek(java.util.Calendar.SUNDAY);
		cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.SATURDAY);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMaxDateThisYear() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		int MaxDayNowYear = 1;
		int NowYear = cal.get(cal.YEAR);
		int MaxMonthNowYear = 12;
		cal.clear();
		cal.set(NowYear, MaxMonthNowYear - 1, MaxDayNowYear);
		MaxDayNowYear = cal.getActualMaximum(cal.DAY_OF_MONTH);
		cal.clear();
		cal.set(NowYear, MaxMonthNowYear - 1, MaxDayNowYear);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateLastMonth() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.MONTH, -1);
		cal.set(java.util.Calendar.DATE, 1);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateLastWeek() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setFirstDayOfWeek(java.util.Calendar.SUNDAY);
		cal.add(java.util.Calendar.DATE, -7);
		cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.SUNDAY);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateLastYear() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.YEAR, -1);
		int MixDayNowYear = 1;
		int NowYear = cal.get(cal.YEAR);
		int MixMonthNowYear = 0;
		cal.clear();
		cal.set(NowYear, MixMonthNowYear, MixDayNowYear);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateThisMonth() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.set(java.util.Calendar.DATE, 1);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateThisWeek() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setFirstDayOfWeek(java.util.Calendar.SUNDAY);
		cal.set(java.util.Calendar.DAY_OF_WEEK, java.util.Calendar.SUNDAY);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}
	
	public static java.util.Calendar getStartDateThisWeek(int firstDayOfWeek) {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setFirstDayOfWeek(firstDayOfWeek);
		cal.set(java.util.Calendar.DAY_OF_WEEK, firstDayOfWeek);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getMinDateThisYear() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		int MixDayNowYear = 1;
		int NowYear = cal.get(cal.YEAR);
		int MixMonthNowYear = 0;
		cal.clear();
		cal.set(NowYear, MixMonthNowYear, MixDayNowYear);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static Date getNextDate(Date firstPaymentDate,
			Date secondPaymentDate, Date actulFirstDate) {
		Calendar firstPaymentDateCal = changeDateToCalendar(firstPaymentDate);
		int monthOfFirstDate = firstPaymentDateCal.get(Calendar.MONTH);
		int dayOfFirstDate = firstPaymentDateCal.get(Calendar.DAY_OF_MONTH);

		Calendar secondPaymentDateCal = changeDateToCalendar(secondPaymentDate);
		int yearOfSecondDate = secondPaymentDateCal.get(Calendar.YEAR);
		int monthOfSecondDate = secondPaymentDateCal.get(Calendar.MONTH);
		int dayOfSecondDate = secondPaymentDateCal.get(Calendar.DAY_OF_MONTH);

		Calendar actulPaymentDateCal = changeDateToCalendar(actulFirstDate);
		int yearOfActulFirstDate = actulPaymentDateCal.get(Calendar.YEAR);

		if (firstPaymentDate != null && secondPaymentDate != null) {
			if (monthOfSecondDate < monthOfFirstDate) {
				return plusYears(secondPaymentDate, 1);
			}
			if (monthOfSecondDate == monthOfFirstDate) {
				if (dayOfSecondDate < dayOfFirstDate) {
					return plusYears(secondPaymentDate, 1);
				}
			}
			if (monthOfSecondDate >= monthOfFirstDate) {
				if (yearOfSecondDate != yearOfActulFirstDate) {
					return plusYears(secondPaymentDate, 1);
				}
			}
		}
		return secondPaymentDate;
	}

	public static java.sql.Timestamp getTimestamp(long time) {
		return new java.sql.Timestamp(time);
	}

	public static java.util.Calendar getToday() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getTomorrow() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.DATE, 1);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static java.util.Calendar getYesterday() {
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.add(java.util.Calendar.DATE, -1);
		cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
		cal.set(java.util.Calendar.MINUTE, 0);
		cal.set(java.util.Calendar.SECOND, 0);
		cal.set(java.util.Calendar.MILLISECOND, 0);
		return cal;
	}

	public static boolean isDateAfter(String isoStartDate, String isoEndDate) {
		Date startDate = stringToDate(isoStartDate);
		Date endDate = stringToDate(isoEndDate);
		return endDate.after(startDate);
	}

	public static Date minusDays(Date date, int numberOfDays) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusDays(numberOfDays).toDate();
	}

	public static Date minusMonths(Date date, int numberOfmonths) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusMonths(numberOfmonths).toDate();
	}

	public static Date minusYears(Date date, int numberOfYears) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusYears(numberOfYears).toDate();
	}

	public static Date minusHours(Date date, int numberOfHours) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusHours(numberOfHours).toDate();
	}
	public static Date minusMinutes(Date date, int numberOfMinutes) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusMinutes(numberOfMinutes).toDate();
	}
	public static Date minusSeconds(Date date, int numberOfSeconds) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.minusSeconds(numberOfSeconds).toDate();
	}

	public static java.sql.Timestamp nowTimestamp() {
		return getTimestamp(System.currentTimeMillis());
	}

	public static Date plusDays(Date date, int numberOfDays) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusDays(numberOfDays).toDate();
	}

	public static Date plusMonths(Date date, int numberOfmonths) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusMonths(numberOfmonths).toDate();
	}

	public static Date plusYears(Date date, int numberOfYears) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusYears(numberOfYears).toDate();
	}

	public static Date plusHours(Date date, int numberOfHours) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusHours(numberOfHours).toDate();
	}

	public static Date plusMinutes(Date date, int numberOfMinutes) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusMinutes(numberOfMinutes).toDate();
	}

	public static Date plusSeconds(Date date, int numberOfSeconds) {
		if(date == null) date = new Date();
		DateTime dt = new DateTime(date);
		return dt.plusSeconds(numberOfSeconds).toDate();
	}
	
	public static Date stringToDate(String isoDate) {
		DateTime dt = null;

		if (Strings.isEmpty(isoDate))
			return null;

		try {
			dt = new DateTime(isoDate);
		} catch (IllegalArgumentException e) {
			if (isoDate.indexOf(' ') > 0)
				isoDate = isoDate.replace(' ', 'T');
			try {
				dt = new DateTime(isoDate);
			} catch (IllegalArgumentException ex) {
				log.error("parameter error");
			}
		}
		if (dt == null) return null;
		
		return dt.toDate();
	}
	
	public static Date stringToDateWithZone(String isoDate) {
		DateTime dt = null;

		if (Strings.isEmpty(isoDate))
			return null;

		try {
			dt = new DateTime(isoDate, DateTimeZone.forTimeZone(TimeZone.getDefault()));
		} catch (IllegalArgumentException e) {
			if (isoDate.indexOf(' ') > 0)
				isoDate = isoDate.replace(' ', 'T');
			try {
				dt = new DateTime(isoDate, DateTimeZone.forTimeZone(TimeZone.getDefault()));
			} catch (IllegalArgumentException ex) {
				log.error("parameter error");
			}
		}
		if (dt == null) return null;
		
		return dt.toDate();
	}

	private DateTimeUtils() { }
	
	@SuppressWarnings("rawtypes")
	public static void printSysProperties() {
		Properties props = System.getProperties();
		Iterator iter = props.keySet().iterator();
		while (iter.hasNext()) {
			String key = (String) iter.next();
			System.out.println(key + " = " + props.get(key));
		}
	}

	public static Date fromDate(String text) {
		if(!Pattern.compile("\\d[1,2]:d[1,2]").matcher(text).find()) {
			text = text + " 12:00:00";
		}
		return fromDate(text, FormatUtils.TIME_ZONE_MASK);
	}
	
	public static Date fromDate(String text, String mask) {
		SimpleDateFormat format = new SimpleDateFormat(mask);
		if(ThreadLocalUtils.getTimeZone() != null) format.setTimeZone(ThreadLocalUtils.getTimeZone());
		try {
			return format.parse(text);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String args[]) {
		
		TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
	
		DateTime dt = new DateTime();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		System.out.println("- " + sdf.format(dt.toDate()));
//		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
//		System.out.println("- " + sdf.format(dt.toDate()));
		
		String sd = "2011-03-18 16:30:39";
		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
		Date d = null;
		try {
			d = sdf.parse(sd);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		System.out.println("- " + sdf.format(d));
		sdf.setTimeZone(TimeZone.getTimeZone("America/Bogota"));
		System.out.println("- " + sdf.format(d));
		
		try {
			d = sdf.parse(sd);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		System.out.println("- " + sdf.format(d));
		
		DateTime nDt = dt.withZone(DateTimeZone.forTimeZone(TimeZone.getTimeZone("Asia/Shanghai")));
		System.out.println(sdf.format(nDt.toDate()));
		
		DateTime dt2 = new DateTime(DateTimeZone.forTimeZone(TimeZone.getTimeZone("Asia/Tokyo")));
		
		sdf.setTimeZone(TimeZone.getTimeZone("America/Bogota"));
		System.out.println(sdf.format(dt2.toDate()));
		
//		System.out.println(getFormatedDateString(""));
//		System.out.println(getFormatedDateString("America/Bogota"));
//
//		//printSysProperties();
//		
//		System.out.println("------------------------------------------");
////		System.setProperty("user.timezone", "America/Bogota");
//		TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
//
//		System.out.println(getFormatedDateString(""));
//		System.out.println(getFormatedDateString("Asia/Shanghai"));

		//printSysProperties();
	}
}
