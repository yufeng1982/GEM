/**
 * 
 */
package com.em.boot.core.model;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

import com.em.boot.core.utils.ResourceUtils;

/**
 * @author FengYu
 *
 */
public enum ArticleStatus implements IEnum {
	Draft, Published;

	@Override
	public String getKey() {
		return new StringBuffer().append("ArticleStatus.").append(name()).toString();
	}

	@Override
	public String getText() {
		return ResourceUtils.getText(getKey());
	}

	@Override
	public String getName() {
		return name();
	}
	
	public static EnumSet<ArticleStatus> getArticleStatus() {
		return EnumSet.allOf(ArticleStatus.class);
	}
	
	public static List<ArticleStatus> getgetArticleStatusList() {
		List<ArticleStatus> ass = new ArrayList<ArticleStatus>();
		ass.add(ArticleStatus.Draft);
		ass.add(ArticleStatus.Published);
		return ass;
	}
}
