/**
 * 
 */
package com.em.boot.core.model.article;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.envers.Audited;

import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.model.AbsCodeNameEntity;

/**
 * @author YF
 *
 */
@Entity
@Table(name = "article_category", schema = "article")
@Audited
public class ArticleCategory extends AbsCodeNameEntity {

	private static final long serialVersionUID = -517644214380910260L;

	
	@Override
	public String getDisplayString() {
		return getName();
	}
	
	@Override
	public MaintenanceType getMaintenanceType() {
		return MaintenanceType.ArticleCategory;
	}
	
	@Override
	public String getSavePermission() {
		return null;
	}

	@Override
	public String getDeletePermission() {
		return null;
	}

}
