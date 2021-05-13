/**
 * 
 */
package com.em.boot.core.utils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import javax.measure.unit.Unit;

import org.apache.commons.lang.StringUtils;
import org.hibernate.engine.jdbc.internal.FormatStyle;
import org.hibernate.engine.jdbc.internal.Formatter;
import org.joda.time.DateTime;
import org.json.JSONObject;

import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.IEnum;
/**
 * @author FengYu
 * 
 */
public class FormatUtils {
	public static final int FLOAT_DIGIT = 2;
	public static final int MAX_FLOAT_DIGIT = 6;
	public static final String DATE_MASK = "yyyy-MM-dd";
	public static final String DATE_PICKER = "dd/MM/yyyy";
	public static final String TIME_MASK_SIMPLE = "HH:mm";
	public static final String ISO_TIME_ZONE_MASK = "yyyy-MM-dd'T'HH:mm:ss";
	public static final String TIME_ZONE_MASK = "yyyy-MM-dd HH:mm:ss";
	public static final String ISO_DATE_MASK = "yyyy-MM-dd";
	public static final int MONEY_DIGIT = 3;
	public static final String DECIMALPATTERN = "\u00A4#,##0.00";
	public static final String X = " x ";
	public static final String VAR = "VAR";
	public static final String varDim = "99999";
	
	private static NumberFormat[] NFS = new NumberFormat[MAX_FLOAT_DIGIT+1];
	private static NumberFormat thicknessNumberFormat1;
	private static NumberFormat thicknessNumberFormat2;
	private static NumberFormat thicknessNumberFormat4TubeDimC;
	
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
		thicknessNumberFormat1 = NumberFormat.getNumberInstance();
		thicknessNumberFormat1.setMinimumIntegerDigits(2);
		thicknessNumberFormat1.setGroupingUsed(false);
		
		thicknessNumberFormat2 = NumberFormat.getNumberInstance();
		thicknessNumberFormat2.setMaximumFractionDigits(5);
		thicknessNumberFormat2.setMinimumIntegerDigits(5);
		thicknessNumberFormat2.setGroupingUsed(false);
		
		thicknessNumberFormat4TubeDimC = NumberFormat.getNumberInstance();
		thicknessNumberFormat4TubeDimC.setMinimumFractionDigits(3);
		thicknessNumberFormat4TubeDimC.setMinimumIntegerDigits(1);
		thicknessNumberFormat4TubeDimC.setGroupingUsed(false);
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
			sdf.setTimeZone(ThreadLocalUtils.getTimeZone());
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
			format.setTimeZone(ThreadLocalUtils.getTimeZone());
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
    public static String stringValue(String value) {
		return Strings.isEmpty(value) ? "" : value;
	}
    public static String stringValue(Object value) {
    	return value == null ? "" : value.toString();
    }
    public static String intValue(Integer value) {
		return value == null ? "" : formatInteger(value);
	}
    public static String doubleValue(Double value) {
		return value == null ? "" : formatFloat(value, MAX_FLOAT_DIGIT);
	}
    public static String doubleValue(Double value, int precision) {
    	return value == null ? "" : formatFloat(value, precision);
    }
    public static String doubleValue(Object value) {
		return value == null ? "" : value.toString();
	}
    public static String floatValue(Float value) {
		return value == null ? "" : formatFloat(value, MAX_FLOAT_DIGIT);
	}
    public static String longValue(Long value) {
		return value == null ? "" : value.toString();
	}
    public static String dateValue(Date value) {
		return value == null ? "" : formatDate(value);
	}
    public static String dateTimeValue(Date value) {
		return value == null ? "" : formatDateTime(value);
	}
    public static String dateTimeValue(DateTime value) {
		return value == null ? "" : formatDateTime(value.toDate());
	}
    public static String booleanValue(Boolean value) {
		return value == null ? "false" : String.valueOf(value);
	}
    public static String displayString(IEntity mc) {
    	if(mc == null) return "";
    	return mc.getDisplayString();
    }
    @SuppressWarnings("rawtypes")
	public static String displayString(Unit unit) {
    	if(unit == null) return "";
    	return unit.toString();
    }
    public static String idString(IEntity mc) {
    	if(mc == null) return "";
    	return mc.getId();
    }
    public static String displayString(IEnum ie) {
    	if(ie == null) return "";
    	return ie.getText();
    }
    public static String nameString(IEnum ie) {
    	if(ie == null) return "";
    	return ie.getName();
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
	

	public static String formatThickness4Set(String thickness) {
		if(Strings.isEmpty(thickness)) return "";
		String s = thickness.toUpperCase().replaceAll(" ", "");
		if(s.endsWith("GA")) {
			return thicknessNumberFormat1.format(Integer.parseInt(s.replaceFirst("GA", ""))) + " GA";
		} else {
			return thicknessNumberFormat2.format(Double.valueOf(s));
		}
	}
	public static String formatThickness4Get(String thickness) {
		if(Strings.isEmpty(thickness)) return "";
		String s = thickness.toUpperCase().replaceAll(" ", "");
		if(s.endsWith("GA")) {
			if(thickness.startsWith("0")) thickness = thickness.replaceFirst("0", "");
			return thickness;
		} else {
			BigDecimal bd = new BigDecimal(thickness);
			return bd.toPlainString();
		}
	}
	public static String formatThicknessWithScale4Get(String thickness, int scale) {
		if(Strings.isEmpty(thickness)) return "";
		String s = thickness.toUpperCase().replaceAll(" ", "");
		if(s.endsWith("GA")) {
			if(thickness.startsWith("0")) thickness = thickness.replaceFirst("0", "");
			return thickness;
		} else {
			BigDecimal bd = new BigDecimal(thickness);
			return bd.setScale(scale, BigDecimal.ROUND_HALF_UP).toPlainString();
		}
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
