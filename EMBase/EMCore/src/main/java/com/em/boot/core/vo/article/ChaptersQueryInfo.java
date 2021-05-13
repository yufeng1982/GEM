package com.em.boot.core.vo.article;

import com.em.boot.core.model.article.Article;
import com.em.boot.core.model.article.Chapters;
import com.em.boot.core.utils.PageInfo;

public class ChaptersQueryInfo extends PageInfo<Chapters> {

	private Article sf_EQ_article;
	private String sf_LIKE_title;
	private Integer sf_EQ_chapterNo;
	
	
	public Article getSf_EQ_article() {
		return sf_EQ_article;
	}
	public void setSf_EQ_article(Article sf_EQ_article) {
		this.sf_EQ_article = sf_EQ_article;
	}
	public String getSf_LIKE_title() {
		return sf_LIKE_title;
	}
	public void setSf_LIKE_title(String sf_LIKE_title) {
		this.sf_LIKE_title = sf_LIKE_title;
	}
	public Integer getSf_EQ_chapterNo() {
		return sf_EQ_chapterNo;
	}
	public void setSf_EQ_chapterNo(Integer sf_EQ_chapterNo) {
		this.sf_EQ_chapterNo = sf_EQ_chapterNo;
	}
}
