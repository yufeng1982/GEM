/**
 * 
 */
package com.em.boot.core.model.article;

import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.ArticleStatus;
import com.em.boot.core.utils.FormatUtils;

/**
 * @author YF
 *
 */
@Entity
@Table(name = "article", schema = "article")
@Audited
public class Article extends AbsEntity {

	private static final long serialVersionUID = -5427010831622116471L;

	private String title;
	
	@ManyToOne
	@JoinColumn(name = "article_category_id", foreignKey = @ForeignKey(name = "none",value = ConstraintMode.NO_CONSTRAINT))
	private ArticleCategory articleCategory;
	
	@Enumerated(EnumType.STRING)
	private ArticleStatus status = ArticleStatus.Draft;
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}


	public ArticleCategory getArticleCategory() {
		return articleCategory;
	}

	public void setArticleCategory(ArticleCategory articleCategory) {
		this.articleCategory = articleCategory;
	}

	public ArticleStatus getStatus() {
		return status;
	}

	public void setStatus(ArticleStatus status) {
		this.status = status;
	}

	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("title", FormatUtils.stringValue(title));
    	jo.put("articleCategory", FormatUtils.displayString(articleCategory));
    	jo.put("status", FormatUtils.stringValue(status));
    	return jo;
	}
	
	@Override
	public String getDisplayString() {
		return getTitle();
	}

}
