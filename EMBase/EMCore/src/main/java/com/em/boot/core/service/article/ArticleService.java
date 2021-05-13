/**
 * 
 */
package com.em.boot.core.service.article;

import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.article.ArticlerRepository;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.service.AbsEntityService;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.vo.article.ArticleQueryInfo;

/**
 * @author FengYu
 *
 */
@Service("articleService")
public class ArticleService extends AbsEntityService<Article, ArticleQueryInfo>{
	
	@Autowired private ArticlerRepository articleRepository;
	
	@Transactional(readOnly = false)
	public Article save(Article article) {
		return getRepository().save(article);
	}

	public Page<Article> getArticlesBySearch(final ArticleQueryInfo queryInfo){
		return getRepository().findAll((Specification<Article>) (root, query, cb) -> {
			Predicate predicate = cb.conjunction();
			if(!Strings.isEmpty(queryInfo.getSf_LIKE_title())){
				predicate.getExpressions().add(cb.like(root.get("title"), "%" + queryInfo.getSf_LIKE_title() + "%"));
			}
			if(queryInfo.getSf_EQ_chapter() != null){
				predicate.getExpressions().add(cb.equal(root.get("chapter"), queryInfo.getSf_EQ_chapter()));
			}
			predicate.getExpressions().add(cb.equal(root.get("active"), true));
			return predicate;
		}, queryInfo);
	}
	
	@Override
	public boolean isCommonAccess() {
		return false;
	}

	@Override
	protected ArticlerRepository getRepository() {
		return articleRepository;
	}
}
