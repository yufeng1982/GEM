package com.em.boot.core.vo.article;

import com.em.boot.core.model.article.PaymentRecords;
import com.em.boot.core.utils.PageInfo;

public class PaymentRecordsQueryInfo extends PageInfo<PaymentRecords> {

	private String sf_LIKE_article;
	private String sf_LIKE_paymentUser;
	private String sf_LIKE_chapters;
	
	public String getSf_LIKE_article() {
		return sf_LIKE_article;
	}
	public void setSf_LIKE_article(String sf_LIKE_article) {
		this.sf_LIKE_article = sf_LIKE_article;
	}
	public String getSf_LIKE_paymentUser() {
		return sf_LIKE_paymentUser;
	}
	public void setSf_LIKE_paymentUser(String sf_LIKE_paymentUser) {
		this.sf_LIKE_paymentUser = sf_LIKE_paymentUser;
	}
	public String getSf_LIKE_chapters() {
		return sf_LIKE_chapters;
	}
	public void setSf_LIKE_chapters(String sf_LIKE_chapters) {
		this.sf_LIKE_chapters = sf_LIKE_chapters;
	}
	
}
