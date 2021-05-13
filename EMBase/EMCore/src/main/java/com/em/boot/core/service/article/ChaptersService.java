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

import com.em.boot.core.dao.article.ChaptersRepository;
import com.em.boot.core.model.article.Chapters;
import com.em.boot.core.service.AbsEntityService;
import com.em.boot.core.vo.article.ChaptersQueryInfo;

/**
 * @author FengYu
 *
 */
@Service("chaptersService")
public class ChaptersService extends AbsEntityService<Chapters, ChaptersQueryInfo>{
	
	@Autowired private ChaptersRepository chaptersRepository;
	
	@Transactional(readOnly = false)
	public Chapters save(Chapters chapters) {
		return getRepository().save(chapters);
	}

	public Page<Chapters> getChaptersBySearch(final ChaptersQueryInfo queryInfo){
		return getRepository().findAll((Specification<Chapters>) (root, query, cb) -> {
			Predicate predicate = cb.conjunction();
			predicate.getExpressions().add(cb.equal(root.get("article"), queryInfo.getSf_EQ_article()));
			predicate.getExpressions().add(cb.equal(root.get("active"), true));
			return predicate;
		}, queryInfo);
	}
	
	@Override
	public boolean isCommonAccess() {
		return false;
	}

	@Override
	protected ChaptersRepository getRepository() {
		return chaptersRepository;
	}
}
