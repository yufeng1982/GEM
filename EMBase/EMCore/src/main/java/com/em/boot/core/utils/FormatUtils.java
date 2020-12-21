/**
 * 
 */
package com.em.boot.core.utils;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Currency;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.hibernate.engine.jdbc.internal.FormatStyle;
import org.hibernate.engine.jdbc.internal.Formatter;
import org.joda.time.DateTime;
import org.json.JSONObject;

import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.IEnum;


public class FormatUtils {
	public static final int FLOAT_DIGIT = 2;
	public static final int MAX_FLOAT_DIGIT = 6;
	public static final String DATE_MASK = "yyyy-MM-dd";
	public static final String DATE_PICKER = "dd/MM/yyyy";
	public static final String DATE_PICKER_IMPORT = "MM/dd/yy";
	public static final String DATE_EXCEL = "yyyy/MM/dd";
	public static final String TIME_MASK_SIMPLE = "HH:mm";
	public static final String ISO_TIME_ZONE_MASK = "yyyy-MM-dd'T'HH:mm:ss";
	public static final String TIME_ZONE_MASK = "yyyy-MM-dd HH:mm:ss";
	public static final String EN_TIME_ZONE_MASK = "dd/MM/yyyy HH:mm:ss";	
	public static final String DATE_MASK_4_EXPORT = "yyyy_MM_dd";
	public static final String ISO_DATE_MASK = "yyyy-MM-dd";
	public static final String DATE_TIME_MASK = "yyyyMMdd_HHmmss";
	public static final int MONEY_DIGIT = 3;
	public static final String DECIMALPATTERN = "\u00A4#,##0.00";
	public static final String X = " x ";
	public static final String VAR = "VAR";
	public static final String  EXPORT_XLSX_EXCEL_FILE_SUFFIX = ".xlsx";
	public static final String  EXPORT_TXT_FILE_SUFFIX = ".txt";
	public static final String  YEAER = "yyyy";
	public static final String  MONTH = "MM";
	public static final String  YEAER_MONTH = "yyyyMM";
	
	private static NumberFormat[] NFS = new NumberFormat[MAX_FLOAT_DIGIT+1];
	
	private static Formatter formatter = FormatStyle.BASIC.getFormatter();
	
	static {
		for(int i = 0; i <= MAX_FLOAT_DIGIT; i ++) {
			NFS[i] = NumberFormat.getNumberInstance();
			NFS[i].setGroupingUsed(false);
			NFS[i].setMinimumFractionDigits(i);
			NFS[i].setMaximumFractionDigits(i);
			if(i == MAX_FLOAT_DIGIT) {
				NFS[i].setMinimumFractionDigits(0);
			}
		}
	}

	
	public static String toString4Json(Object obj) {
		if (obj == null)
			return "";
		if (IEntity.class.isAssignableFrom(obj.getClass())) {
			return toString4Json((IEntity) obj);
		} else if (Date.class.isAssignableFrom(obj.getClass())) {
			return toString4Json((Date) obj);
		} else if (Double.class.equals(obj.getClass())) {
			return toString4Json((Double) obj);
		} else if (IEnum.class.isAssignableFrom(obj.getClass())) {
			return toString4Json((IEnum) obj);
		} else if (Long.class.equals(obj.getClass())) {
			return toString4Json((Long) obj);
		} else if (Integer.class.equals(obj.getClass())) {
			return toString4Json((Integer) obj);
		} else if (Boolean.class.equals(obj.getClass())) {
			return toString4Json((Boolean) obj);
		} else
			return toString4Json((String) obj);
	}

	public static String toString4Json(Boolean b) {
		return b == true ? "T" : "F";
	}

	public static String toString4Json(IEntity mc) {
		if (mc == null)
			return "";
		return mc.getId();
	}

	public static String toString4Json(String obj) {
		if (obj == null)
			return "";
		return obj;
	}

	public static String toString4Json(Date value) {
		if (value == null)
			return "";
		return formatDate(value);
	}

	public static String toString4Json(DateTime value) {
		return value == null ? "" : formatDateTime(value.toDate());
	}

	public static String toString4Json(IEnum ie) {
		if (ie == null)
			return "";
		return ie.getText();
	}

	public static String toString4Json(Double value) {
		return value == null ? "" : formatFloat(value, MAX_FLOAT_DIGIT);
	}

	public static String toString4Json(Integer value) {
		return value == null ? "" : formatInteger(value);
	}

	public static String toString4Json(Long value) {
		return value == null ? "" : formatInteger(value);
	}
	
	public static String toKey(String s) {
		return format(".", s);
	}
	public static String toText(String s) {
		return format(" ", s);
	}
	public static String format(String delimiter, String s) {
		return capitalFirst(s).replaceAll("(\\p{Ll})(\\p{Lu})", "$1"+delimiter+"$2");
	}
	
	public static Double formatNumber(String num) {
		return num == null ? null : Double.valueOf(num.replaceAll(",", ""));
	}
	public static String capitalFirst(String s) {
		if (s == null || "".equals(s)) {
			return ("");
		}
		return s.substring(0, 1).toUpperCase() + s.substring(1);
	}
	public static String formatSQL(String sql) {
		String formatted = formatter.format( sql );
		return formatted;
	}
	public static String computeDays(String date, String daysNbr) {
		if (!Strings.isEmpty(date) && !Strings.isEmpty(daysNbr)) {
			int nbr = Integer.parseInt(daysNbr);
			if (nbr < 0) {
				return formatDate(DateTimeUtils.minusDays(
						DateTimeUtils.stringToDate(date), -nbr));
			}
			return formatDate(DateTimeUtils.plusDays(
					DateTimeUtils.stringToDate(date), nbr));
		}
		return formatDate(new Date());

	}

	public static String computeMonths(String date, String monthsNbr) {
		if (!Strings.isEmpty(date) && !Strings.isEmpty(monthsNbr)) {
			int nbr = Integer.parseInt(monthsNbr);
			if (nbr < 0) {
				return formatDate(DateTimeUtils.minusMonths(
						DateTimeUtils.stringToDate(date),
						Integer.parseInt(monthsNbr)));
			}
			return formatDate(DateTimeUtils.plusMonths(
					DateTimeUtils.stringToDate(date),
					Integer.parseInt(monthsNbr)));
		}
		return formatDate(new Date());
	}

	public static String computeYears(String date, String yearsNbr) {
		if (!Strings.isEmpty(date) && !Strings.isEmpty(yearsNbr)) {
			int nbr = Integer.parseInt(yearsNbr);
			if (nbr < 0) {
				return formatDate(DateTimeUtils.minusYears(
						DateTimeUtils.stringToDate(date),
						Integer.parseInt(yearsNbr)));
			}
			return formatDate(DateTimeUtils.plusYears(
					DateTimeUtils.stringToDate(date),
					Integer.parseInt(yearsNbr)));
		}
		return formatDate(new Date());
	}
	public static String formatYearMonth(int year, int month) {
		return year + "-" + (month < 10 ? "0" + month : month);
	}
	public static String formatYearMonth(DateTime dateTime) {
		return formatYearMonth(dateTime.getYear(), dateTime.getMonthOfYear());
	}
	public static String formatCurrency(Double value, int decimalNumber) {
		if (value == null)
			return "";
		NumberFormat currencyFormat = new DecimalFormat(DECIMALPATTERN);
		currencyFormat.setMaximumFractionDigits(decimalNumber);
		return currencyFormat.format(value.doubleValue());
	}

	public static String formatDate(DateTime obj) {
		if (obj != null) {
			return formatDate(obj.toDate());
		}
		return "";
	}

	public static String formatDate(Date date) {
		if (date != null) {
			SimpleDateFormat sdf = (SimpleDateFormat) SimpleDateFormat.getDateInstance();
//			if(ThreadLocalUtils.getTimeZone() != null) {
//				sdf.setTimeZone(ThreadLocalUtils.getTimeZone());
//			}
			sdf.applyPattern(DATE_MASK);
			return sdf.format(date);
		}
		return "";
	}

	public static String formatDateTime(Object obj) {
		return formatDateTime(obj, TIME_ZONE_MASK);
	}

	public static String formatDateTime(Object obj, String mask) {
		if (obj != null) {
			Date date = (Date) obj;
			SimpleDateFormat format = new SimpleDateFormat(mask);
//			if(ThreadLocalUtils.getTimeZone() != null) {
//				format.setTimeZone(ThreadLocalUtils.getTimeZone());
//			}
			return format.format(date);
		}
		return "";
	}

	public static String formatDateTimeToISO(Object obj) {
		return formatDateTime(obj, ISO_TIME_ZONE_MASK);
	}

	public static String formatDateToISO(Object obj) {
		return formatDateTime(obj, ISO_DATE_MASK);
	}

	public static String formatFloat(double value) {
		return formatFloat(value, FLOAT_DIGIT);
	}

	public static String formatFloat(double value, int precision) {
		return NFS[precision].format(value);
	}

	public static String formatFloat(Double value) {
		return formatFloat(value.doubleValue(), FLOAT_DIGIT);
	}

	public static String formatFloat(Double value, int precision) {
		if(value == null) value = new Double(0.0);
		return formatFloat(value.doubleValue(), precision);
	}

	public static String formatFloat(Object value) {
		if (!Strings.isEmpty(value != null ? value.toString() : ""))
			return formatFloat(Double.parseDouble(value.toString()));

		return value != null ? value.toString() : "";
	}

	public static String formatFloat(Object value, int precision) {
		if (!Strings.isEmpty(value != null ? value.toString() : ""))
			return formatFloat(Double.parseDouble(value.toString()), precision);

		return value != null ? value.toString() : "";
	}

	public static String formatInteger(Object value) {
		if (!Strings.isEmpty(value != null ? value.toString() : ""))
			return formatFloat(Double.parseDouble(value.toString()), 0);

		return value != null ? value.toString() : "";
	}

	public static String formatMoney(double value) {
		return formatFloat(value, MONEY_DIGIT);
	}

	public static String formatMoney(Double value) {
		return formatFloat(value.doubleValue(), MONEY_DIGIT);
	}

	public static String formatMoney(Object value) {
		if (!Strings.isEmpty(value != null ? value.toString() : ""))
			return formatMoney(Double.parseDouble(value.toString()));

		return value != null ? value.toString() : "";
	}

	public static String getDateTime() {
		return getDateTime(TIME_ZONE_MASK);
	}

	public static String getDateTime(String mask) {
		SimpleDateFormat format = new SimpleDateFormat(mask);
		return format.format(new Date());
	}

	public static String getISODateTime() {
		return getDateTime(ISO_TIME_ZONE_MASK);
	}

	public static String paddingString(String s, int n, char c,
			boolean paddingLeft) {
		if (s == null) {
			return s;
		}
		int add = n - s.length();
		if (add <= 0) {
			return s;
		}
		StringBuffer str = new StringBuffer(s);
		char[] ch = new char[add];
		Arrays.fill(ch, c);
		if (paddingLeft) {
			str.insert(0, ch);
		} else {
			str.append(ch);
		}
		return str.toString();
	}
	
	public static String formatDecimal(String formatString, Double value) {
		return new DecimalFormat(formatString).format(value);
	}
    public static Integer toInt(Integer value) {
		return value == null ? Integer.valueOf(0) : value;
	}
    public static Double toDouble(Double value) {
		return value == null ? new Double(0) : value;
	}
    public static Double toDouble(Object value) {
		return value == null ? new Double(0) : Double.valueOf(value.toString());
	}
    public static Float toFloat(Float value) {
		return value == null ? new Float(0) : value;
	}
    public static Long toLong(Long value) {
		return value == null ? Long.valueOf(0) : value;
	}
    public static String toString(String value) {
		return Strings.isEmpty(value) ? "" : value;
	}
    public static String toString(Integer value) {
		return value == null ? "" : formatInteger(value);
	}
    public static String toString(Double value) {
		return value == null ? "" : formatFloat(value, MAX_FLOAT_DIGIT);
	}
    public static String toString(Double value, int precision) {
    	return value == null ? "" : formatFloat(value, precision);
    }
    public static String toString(Float value) {
		return value == null ? "" : formatFloat(value, MAX_FLOAT_DIGIT);
	}
    public static String toString(Long value) {
		return value == null ? "" : value.toString();
	}
    public static String toString(Date value) {
		return value == null ? "" : formatDate(value);
	}
    public static String toStringWithTime(Date value) {
		return value == null ? "" : formatDateTime(value);
	}
    public static String toStringWithTime(DateTime value) {
		return value == null ? "" : formatDateTime(value.toDate());
	}
    public static String toString(Boolean value) {
		return value == null ? "false" : String.valueOf(value);
	}
    public static String toString(IEntity mc) {
    	if(mc == null) return "";
    	return mc.getDisplayString();
    }
    public static String toString(JSONObject jo, String key) {
		return jo == null ? "" : jo.has(key) ? jo.getString(key) : "";
	}
    public static String idString(IEntity mc) {
    	if(mc == null) return "";
    	return mc.getId();
    }
//    public static String ownerIdString(Ownership os) {
//    	if(os == null) return "";
//    	return os.getOwnerId();
//    }
    public static String idString(IEnum ie) {
    	if(ie == null) return "";
    	return ie.getName();
    }
	public static String idString(Currency currency) {
		return currency != null ? currency.toString() : "";
	}
//    @SuppressWarnings("rawtypes")
//	public static String toString(Unit unit) {
//    	if(unit == null) return "";
//    	return unit.toString();
//    }
    public static String toString(IEnum ie) {
    	if(ie == null) return "";
    	return ie.getText();
    }
	public static String capitalize(String v) {
		return StringUtils.capitalize(v);
	}
	
	private FormatUtils() {
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static String fromMap(Map model) {
		JSONObject jsonObject = new JSONObject();
		Iterator<String> ite = model.keySet().iterator();
		while (ite.hasNext()) {
			String key = ite.next();
			jsonObject.put(key, model.get(key));
		}
		return jsonObject.toString();
	}
	public void appendFormattedSql(StringBuffer sb, String... strs) {
		for (String string : strs) {
			sb.append(sb.append(string));
		}
		sb.append( "\n");
	}
	
	public static String getStrSeparateByComma(String originalStr, String addStr){
		if(Strings.isEmpty(originalStr)) return addStr;
		if(!Strings.isEmpty(originalStr) && !Strings.isEmpty(addStr)) return originalStr + ", " + addStr;
		return originalStr;
	}
	public static String strRightSpace(String str, int minLength) {  
        String format = "%-" + (minLength < 1 ? 1 : minLength) + "s";  
        return String.format(format, str == null ? "" : str);
    }
	public static String strLeftSpace(String str, int minLength) {  
        String format = "%1$" + (minLength < 1 ? 1 : minLength) + "s";  
        return String.format(format, str == null ? "" : str);
    }
    public static String toIntString(Double value) {
		return value == null ? "" : toString(value.intValue());
	}
    
    public static String fillStr(String str, int totalLen)
	{
		if (null == str) str = "";

		String tmp = "";
		int len = str.length();
		if (len < totalLen) {
			for (int i = 0; i < totalLen - len; i++) {
				tmp += "0";
			}
			str = tmp + str;
		}
		return str;
	}
    public static String removeSpecificChar(String resource, char specificChar){
        StringBuffer buffer=new StringBuffer();
        int position=0;
        char currentChar;
        while(position < resource.length()){
            	currentChar = resource.charAt(position++);
            	if(currentChar != specificChar) buffer.append(currentChar); 
        }
        return buffer.toString();
    }
	public static void main(String[] args) {
		System.out.print(FormatUtils.strRightSpace("TR00223", 15));
		System.out.print("end");
//		System.out.println(FormatUtils.formatThickness4Set("12.22231"));
//		System.out.println(FormatUtils.formatThickness4Set("12.222316"));
//		System.out.println(FormatUtils.formatThickness4Set("0.278"));
//		System.out.println(FormatUtils.formatThickness4Set("0.56789"));
//		System.out.println(FormatUtils.formatThickness4Set(".56755"));
//		System.out.println(FormatUtils.formatThickness4Set(".3675"));
//		System.out.println(FormatUtils.formatThickness4Set("11"));
//		
//		System.out.println(FormatUtils.formatThickness4Get("00012.22231"));
//		System.out.println(FormatUtils.formatThickness4Get("00012.22232"));
//		System.out.println(FormatUtils.formatThickness4Get("00000.278"));
//		System.out.println(FormatUtils.formatThickness4Get("00000.56789"));
//		System.out.println(FormatUtils.formatThickness4Get("00000.56755"));
//		System.out.println(FormatUtils.formatThickness4Get("00000.3675"));
//		System.out.println(FormatUtils.formatThickness4Get("00011"));
//		
//		System.out.println(FormatUtils.formatThickness4Set("23ga"));
//		System.out.println(FormatUtils.formatThickness4Set("3 ga"));
//		System.out.println(FormatUtils.formatThickness4Set("3ga"));
//		System.out.println(FormatUtils.formatThickness4Set("23 ga"));
//		
//		System.out.println(FormatUtils.formatThickness4Get("23 GA"));
//		System.out.println(FormatUtils.formatThickness4Get("03 GA"));
//		System.out.println(FormatUtils.formatThickness4Get("00000.00001"));
	}
}
