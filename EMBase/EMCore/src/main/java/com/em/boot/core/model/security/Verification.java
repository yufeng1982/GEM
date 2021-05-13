/**
 * 
 */
package com.em.boot.core.model.security;

import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.em.boot.core.model.AbsEntity;

/**
 * @author FengYu
 *
 */
@Entity
@Table(schema = "public")
public class Verification extends AbsEntity {
	
	private static final long serialVersionUID = -8963417745385666452L;
	public static final long temp = 1425139200108l;
	public static final long acutal = 253370736000000l;
	private static final char[] HEX_DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Override
	public String getDisplayString() {
		return null;
	}
	
	public static String encode(String algorithm, String str) {
        if (str == null) {
            return null;
        }
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA1");
            messageDigest.update(str.getBytes());
            return getFormattedText(messageDigest.digest());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
 
    }

	private static String getFormattedText(byte[] bytes) {
        int len = bytes.length;
        StringBuilder buf = new StringBuilder(len * 2);
        // 把密文转换成十六进制的字符串形式
        for (int j = 0; j < len; j++) {buf.append(HEX_DIGITS[(bytes[j] >> 4) & 0x0f]);
            buf.append(HEX_DIGITS[bytes[j] & 0x0f]);
        }
        return buf.toString();
    }

	public static boolean isVerification() {
		Calendar cl = Calendar.getInstance();
		int year = cl.get(Calendar.YEAR);
		int month = cl.get(Calendar.MONTH);
		int date = cl.get(Calendar.DATE);
		cl.set(year, month, date);
		return cl.getTimeInMillis() > temp;
	}
	
	public static boolean isVerification(String compareDate) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String currentDate = sdf.format(new Date());
		return new Integer(currentDate) > new Integer(compareDate);
	}
}
