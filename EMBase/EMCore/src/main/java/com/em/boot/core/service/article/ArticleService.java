/**
 * 
 */
package com.em.boot.core.service.article;

import java.util.List;

import javax.persistence.criteria.Predicate;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.em.boot.core.dao.article.ArticleRepository;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.model.article.Chapters;
import com.em.boot.core.service.AbsEntityService;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.vo.article.ArticleQueryInfo;

/**
 * @author FengYu
 *
 */
@Service("articleService")
public class ArticleService extends AbsEntityService<Article, ArticleQueryInfo>{
	
	@Autowired private ArticleRepository articleRepository;
	@Autowired private ChaptersService chaptersService;
	
	@Transactional(readOnly = false)
	public Article save(Article article, JSONArray chapters, List<String> chaptersDeleteLines) {
		getRepository().save(article);
		for(String id : chaptersDeleteLines){
			chaptersService.delete(id);
		}
		for(int i = 0; i < chapters.length(); i++){
			Chapters chapter = null;
			JSONObject jsonObj = chapters.getJSONObject(i);
			String id = jsonObj.getString("id");
			if(Strings.isEmpty(id)){
				chapter = new Chapters();
			} else {
				chapter = chaptersService.get(id);
			}
			chapter.setArticle(article);
			chapter.setChapterNo(jsonObj.getInt("chapterNo"));
			chapter.setTitle(jsonObj.getString("chapterTitle"));
			chapter.setContent(jsonObj.getString("chapterContent"));
			chaptersService.save(chapter);
		}
		return article;
	}

	public Page<Article> getArticlesBySearch(final ArticleQueryInfo queryInfo){
		return getRepository().findAll((Specification<Article>) (root, query, cb) -> {
			Predicate predicate = cb.conjunction();
			if(queryInfo.getSf_EQ_articleCategory() !=null ){
				predicate.getExpressions().add(cb.equal(root.get("articleCategory"), queryInfo.getSf_EQ_articleCategory()));
			}
			
			if(!Strings.isEmpty(queryInfo.getSf_LIKE_title())){
				predicate.getExpressions().add(cb.like(root.get("title"), "%" + queryInfo.getSf_LIKE_title() + "%"));
			}
			if(queryInfo.getSf_EQ_status() != null){
				predicate.getExpressions().add(cb.equal(root.get("status"), queryInfo.getSf_EQ_status()));
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
	protected ArticleRepository getRepository() {
		return articleRepository;
	}
}
