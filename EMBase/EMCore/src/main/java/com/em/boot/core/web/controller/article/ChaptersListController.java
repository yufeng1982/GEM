package com.em.boot.core.web.controller.article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsQueryPagedListController;
import com.em.boot.core.model.article.Chapters;
import com.em.boot.core.service.article.ChaptersService;
import com.em.boot.core.vo.article.ChaptersQueryInfo;

/**
 * @author FengYu
 */
@Controller
@RequestMapping(value="/app/gem/chapters/list")
public class ChaptersListController extends AbsQueryPagedListController<Chapters, ChaptersQueryInfo> {
	
	private static final String PAGE_CHAPTER_LIST = "article/chapters/chapters";
	
	@Autowired private ChaptersService chaptersService;

	@Override
	protected ChaptersService getEntityService() {
		return chaptersService;
	}
	
	@RequestMapping("show")
	public String show(ModelMap modelMap) {
		return PAGE_CHAPTER_LIST;
	}
	
	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") ChaptersQueryInfo queryInfo) {
		Page<Chapters> pagedArticles = getEntityService().getChaptersBySearch(queryInfo);
		return toJSONView(pagedArticles);
	}

	@Override
	public ChaptersQueryInfo newPagedQueryInfo() {
		return new ChaptersQueryInfo();
	}
	
}
