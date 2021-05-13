/**
 * 
 */
package com.em.boot.core.model.article;

import javax.persistence.Column;
import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import org.json.JSONObject;

import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.utils.FormatUtils;

/**
 * @author YF
 *
 */
@Entity
@Table(name = "chapters", schema = "article")
@Audited
public class Chapters extends AbsEntity {

	private static final long serialVersionUID = -5427010831622116471L;

	@ManyToOne
	@JoinColumn(name = "article_id", foreignKey = @ForeignKey(name = "none",value = ConstraintMode.NO_CONSTRAINT))
	private Article article;
	
	private String title;
	
	private Integer chapterNo;
	
	@Column(columnDefinition = "text")
	private String content;
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}


	public Article getArticle() {
		return article;
	}

	public void setArticle(Article article) {
		this.article = article;
	}

	public Integer getChapterNo() {
		return chapterNo;
	}

	public void setChapterNo(Integer chapterNo) {
		this.chapterNo = chapterNo;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}


	public JSONObject toJSONObject() {
    	JSONObject jo = super.toJSONObject();
    	jo.put("title", FormatUtils.stringValue(title));
    	jo.put("chapterNo", FormatUtils.stringValue(chapterNo));
    	jo.put("content", FormatUtils.stringValue(content));
    	return jo;
	}
	
	@Override
	public String getDisplayString() {
		return getTitle();
	}

}
