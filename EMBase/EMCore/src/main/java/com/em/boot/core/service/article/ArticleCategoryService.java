/**
 * 
 */
package com.em.boot.core.service.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.article.ArticleCategoryRepository;
import com.em.boot.core.model.article.ArticleCategory;
import com.em.boot.core.service.AbsMaintenanceService;
import com.em.boot.core.utils.PageInfo;

/**
 * @author FengYu
 *
 */
@Service
@Transactional(readOnly = true)
public class ArticleCategoryService extends AbsMaintenanceService<ArticleCategory, PageInfo<ArticleCategory>> {

	@Autowired private ArticleCategoryRepository articleCategoryRepository;
	
	public ArticleCategory findOne(String id){
		return articleCategoryRepository.findById(id).orElse(null);
	}
	
	@Override
	protected ArticleCategoryRepository getRepository() {
		return articleCategoryRepository;
	}

	@Override
	public boolean isCommonAccess() {
		return true;
	}

}
