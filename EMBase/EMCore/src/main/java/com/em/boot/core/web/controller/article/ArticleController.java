package com.em.boot.core.web.controller.article;

import java.util.List;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsFormController;
import com.em.boot.core.enums.Language;
import com.em.boot.core.model.ArticleStatus;
import com.em.boot.core.model.article.Article;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.article.ArticleService;
import com.em.boot.core.utils.Strings;


/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/article/form")
public class ArticleController extends AbsFormController<Article> {
	
	private static final String PAGE_ARTICLE_FORM = "article/article/article";

	@Autowired private ArticleService articleService;
	
	@Override
	protected ArticleService getEntityService() {
		return articleService;
	}
	
	@RequestMapping(value = "{id}/cancel", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView cancel(ModelMap modelMap) {
		return closePage(modelMap);
	}
	
	@RequestMapping(value = "{id}/apply", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView apply(ModelMap modelMap, @ModelAttribute("entity") Article article, 
			@RequestParam(name = "chapters") JSONArray chapters, 
			@RequestParam List<String> chaptersDeleteLines,
			BindingResult result) {
		saveArticle(article, chapters, chaptersDeleteLines, result);
		return redirectTo("article/form/" + (Strings.isEmpty(article.getId()) ? NEW_ENTITY_ID : article.getId())  + "/show", modelMap);
	}
	@RequestMapping(value = "{id}/ok", method = {RequestMethod.PUT, RequestMethod.POST})
	public ModelAndView ok(ModelMap modelMap, @ModelAttribute("entity") Article article,
			@RequestParam(name = "chapters") JSONArray chapters, 
			@RequestParam List<String> chaptersDeleteLines,
			BindingResult result) {
		if(saveArticle(article, chapters, chaptersDeleteLines, result)) {
			return closePage(modelMap);
		}
		return redirectTo("article/form/" + (Strings.isEmpty(article.getId()) ? NEW_ENTITY_ID : article.getId())  + "/show", modelMap);
	}
	
	
	private boolean saveArticle(Article article, JSONArray chapters, List<String> chaptersDeleteLines, BindingResult result) {
		boolean isSucceed = !hasErrorMessages();
		if (isSucceed) {
			getEntityService().save(article, chapters, chaptersDeleteLines);
		}
		return isSucceed;
	}
	
	@RequestMapping(value = "{id}/show")
	public String showUser(@ModelAttribute("entity") Article article, ModelMap modelMap) {
		modelMap.addAttribute("statusList", ArticleStatus.getgetArticleStatusList());
		return PAGE_ARTICLE_FORM;
	}
	
	protected void populateAttributes(User user, ModelMap modelMap) {
		modelMap.addAttribute("corporations", user.getAvailableCorporations());
		modelMap.addAttribute("languages", Language.getLanguages());
		modelMap.addAttribute("userId", user.getId());
	}

	@ModelAttribute("entity")
	public Article populateArticle(@PathVariable(value="id") String id) {
		Article article = null;
		if(isNew(id)) {
			article = new Article();
		} else {
			article = getEntityService().get(id);
		}
		
		return article;
	}
}
