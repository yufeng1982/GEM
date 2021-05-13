package com.em.boot.core.web.controller.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsQueryPagedListController;
import com.em.boot.core.model.ArticleStatus;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.service.article.ArticleService;
import com.em.boot.core.utils.JsonUtils;
import com.em.boot.core.vo.article.ArticleQueryInfo;

/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/article/list")
public class ArticleListController extends AbsQueryPagedListController<Article, ArticleQueryInfo> {
	
	private static final String PAGE_ARTICLE_LIST = "article/article/articles";
	
	@Autowired private ArticleService articleService;

	@Override
	protected ArticleService getEntityService() {
		return articleService;
	}
	
	@RequestMapping("show")
	public String show(ModelMap modelMap) {
		modelMap.addAttribute("statusList", JsonUtils.buildEnmuCoboxData(ArticleStatus.getArticleStatus()));
		return PAGE_ARTICLE_LIST;
	}
	
	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") ArticleQueryInfo queryInfo) {
		Page<Article> pagedArticles = getEntityService().getArticlesBySearch(queryInfo);
		return toJSONView(pagedArticles);
	}

	@Override
	public ArticleQueryInfo newPagedQueryInfo() {
		return new ArticleQueryInfo();
	}
	
}
