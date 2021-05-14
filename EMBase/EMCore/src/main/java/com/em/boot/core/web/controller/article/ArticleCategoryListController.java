/**
 * 
 */
package com.em.boot.core.web.controller.article;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.em.boot.core.controller.AbsMaintenanceController;
import com.em.boot.core.model.article.ArticleCategory;
import com.em.boot.core.service.article.ArticleCategoryService;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.vo.article.ArticleCategoryQueryInfo;

/**
 * @author FengYu
 *
 */
@Controller
@RequestMapping("/app/gem/articleCategory")
public class ArticleCategoryListController extends AbsMaintenanceController<ArticleCategory, PageInfo<ArticleCategory>> {

	@Autowired private ArticleCategoryService articleCategoryService;
	
	@Override
	protected ArticleCategoryService getEntityService() {
		return articleCategoryService;
	}

	@Override
	public String getPropUrl() {
		return null;
	}

	@Override
	public boolean isPaged() {
		return true;
	}
	
	@Override
//	@RequiresPermissions("position:list")
	@RequestMapping("list")
	public String list(ModelMap modelMap, HttpServletRequest request, @ModelAttribute("model") ArticleCategory articleCategory,
			@RequestParam(value="parameterNames", required=false) String parameterNames) {
		return super.listCommon(modelMap, request, articleCategory, parameterNames);
	}

	@Override
//	@RequiresPermissions("position:save")
	@RequestMapping("apply")
	public String apply(@RequestParam(value = "modifiedRecords") JSONArray modifiedRecords, 
			@RequestParam(value = "lineToDelete") String lineToDelete,
			@RequestParam(value = "parameterNames", required=false) String parameterNames, 
			@ModelAttribute("model") ArticleCategory articleCategory, ModelMap modelMap,
			HttpServletRequest request) {
		return super.applyCommon(modifiedRecords, lineToDelete, parameterNames, articleCategory, modelMap, request);
	}

	@RequestMapping("delete")
	public void delete(ModelMap modelMap, @RequestParam(value="id", required=true) String id) {
		getEntityService().delete(id);
	}
	
	@Override
	public ArticleCategoryQueryInfo newPagedQueryInfo() {
		return new ArticleCategoryQueryInfo();
	}
	
	@Override
	public boolean isInfinite() {
		return false;
	}
	@Override
	public boolean isAbleToRemoveLine() {
		return false;
	}
}
