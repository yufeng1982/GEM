/**
 * 
 */
package com.em.boot.core.enums;

import java.util.EnumSet;
import java.util.Locale;

import com.em.boot.core.model.IEnum;
import com.em.boot.core.utils.Strings;

public enum Language implements IEnum {
	English {
		public Locale getLocale() { return Locale.ENGLISH; } 
	},
	French {
		public Locale getLocale() { return Locale.CANADA_FRENCH; } 
	},
//	Chinese {
//		public Locale getLocale() { return Locale.CHINESE; }
//	},
	Spanish {
		public Locale getLocale() { return new Locale("es", "", ""); }
	};

	public String getKey() { 
		return new StringBuffer().append("Language.").append(name()).toString();
	}
	
	@Override
	public String getName() {
		return name();
	}
	
	public abstract Locale getLocale();
	
	Language() {}
	
	public static Locale getLocaleByLanguage(String language) {
		if (Strings.isEmpty(language))
			language = "";
		if (language.toLowerCase().startsWith("fr_CA") || language.toLowerCase().startsWith("fr")) {
			return Locale.CANADA_FRENCH;
//		} else if (language.toLowerCase().startsWith("ch")) {
//			return Locale.CHINESE;
		}  else if (language.toLowerCase().startsWith("es")) {
			return Spanish.getLocale();
		} else {
			return Locale.ENGLISH;
		}
	}
	
	public static Language fromLocale(Locale locale) {
		for (Language l : EnumSet.allOf(Language.class)) {
			if(locale.equals(l.getLocale())) return l;
		}
		return Language.English;
	}
	public static Language fromCode(String code) {
		if(code.equals("en")) return Language.English;
//		if(code.equals("zh")) return Language.Chinese;
		if(code.equals("fr")) return Language.French;
		if(code.equals("es")) return Language.Spanish;
		return Language.English;
	}
	public static EnumSet<Language> getLanguages() {
		return EnumSet.allOf(Language.class);
	}

	public String getText() {
		return "";
	}
	
}
