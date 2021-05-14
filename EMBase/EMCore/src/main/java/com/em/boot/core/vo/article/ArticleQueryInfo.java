package com.em.boot.core.vo.article;

import com.em.boot.core.model.ArticleStatus;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.model.article.ArticleCategory;
import com.em.boot.core.utils.PageInfo;

public class ArticleQueryInfo extends PageInfo<Article> {

	private String sf_LIKE_title;
	private Integer sf_EQ_chapter;
	private ArticleStatus sf_EQ_status;
	private ArticleCategory sf_EQ_articleCategory;
	
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
	public ArticleStatus getSf_EQ_status() {
		return sf_EQ_status;
	}
	public void setSf_EQ_status(ArticleStatus sf_EQ_status) {
		this.sf_EQ_status = sf_EQ_status;
	}
	public ArticleCategory getSf_EQ_articleCategory() {
		return sf_EQ_articleCategory;
	}
	public void setSf_EQ_articleCategory(ArticleCategory sf_EQ_articleCategory) {
		this.sf_EQ_articleCategory = sf_EQ_articleCategory;
	}
	
	
}
