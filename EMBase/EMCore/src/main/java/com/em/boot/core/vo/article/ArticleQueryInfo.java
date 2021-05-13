package com.em.boot.core.vo.article;

import com.em.boot.core.model.article.Article;
import com.em.boot.core.utils.PageInfo;

public class ArticleQueryInfo extends PageInfo<Article> {

	private String sf_LIKE_title;
	private Integer sf_EQ_chapter;
	
	public String getSf_LIKE_title() {
		return sf_LIKE_title;
	}
	public void setSf_LIKE_title(String sf_LIKE_title) {
		this.sf_LIKE_title = sf_LIKE_title;
	}
	public Integer getSf_EQ_chapter() {
		return sf_EQ_chapter;
	}
	public void setSf_EQ_chapter(Integer sf_EQ_chapter) {
		this.sf_EQ_chapter = sf_EQ_chapter;
	}
	
	
}
