/**
 * 
 */
package com.em.boot.core.dao.article;

import java.util.List;

import com.em.boot.core.dao.AbsEntityRepository;
import com.em.boot.core.model.article.Chapters;

/**
 * @author YF
 *
 */
public interface ChaptersRepository extends AbsEntityRepository<Chapters> {
	public List<Chapters> findByArticleIdAndActiveTrue(String articleId);
}
