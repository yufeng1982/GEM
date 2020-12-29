/**
 * 
 */
package com.em.boot.core.controller;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.ui.ModelMap;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.enums.Language;
import com.em.boot.core.model.AbsCodeNameEntity;
import com.em.boot.core.service.AbsMaintenanceService;
import com.em.boot.core.utils.ClassUtils;
import com.em.boot.core.utils.EntityReflectionUtils;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;
import com.em.boot.core.utils.PropertyFilter.MatchType;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;
import com.em.boot.core.vo.KeyValueEntity;

/**
 * @author YF
 *
 */
public abstract class AbsMaintenanceController <T extends AbsCodeNameEntity, P extends PageInfo<T>> extends AbsQueryPagedListController<T, P> {
	
	private static final String LIST_PAGE_PATH = "prop/props";
	public static final String KEY_PRIFIX = "FN.";
	public static final String ENTITY_ID = "id";
	public static final String POPUP_VALUE_SUBFIX = "-popup-value";
	public static final String COMBO_TEXT_SUBFIX = "-combo-text";
	public static final String PROP_PAGE_PATH = "product/coating/coating";

	protected WebDataBinder binder;
	
	protected abstract AbsMaintenanceService<T, P> getEntityService();
	
	public abstract String getPropUrl();
	
	public String getPropWinSizeSetupJsonStr() {
		return "";
	}
	
	public abstract boolean isPaged();
	
	public abstract boolean isInfinite();
	
	public abstract String list(ModelMap modelMap, HttpServletRequest request, @ModelAttribute("model") T model,
			@RequestParam(value="parameterNames", required=false) String parameterNames);
	
	public abstract String apply(@RequestParam("modifiedRecords") JSONArray records,
			@RequestParam("lineToDelete") String lineToDelete,
			@RequestParam(value="parameterNames", required=false) String parameterNames,
			@ModelAttribute("model") T model, ModelMap modelMap, HttpServletRequest request);

	public String listCommon(ModelMap modelMap, HttpServletRequest request, @ModelAttribute("model") T model,
			@RequestParam(value="parameterNames", required=false) String parameterNames) {
		populateAttributes(modelMap, request, model, parameterNames);
		return LIST_PAGE_PATH;
	}
	
	@RequestMapping("propPage")
	public String propPage(ModelMap modelMap, HttpServletRequest request, @ModelAttribute("model") T model,
			@RequestParam(value="type", required=false) String type) {
		modelMap.addAttribute("type", type);
		return PROP_PAGE_PATH;
	}
	
	@RequestMapping("json")
	public ModelAndView json(@ModelAttribute("pageQueryInfo") P page, boolean paged, boolean infinite,
			@RequestParam(value="parameterNames", required=false) String parameterNames, @ModelAttribute("model") T model, HttpServletRequest request) {
		JSONArray jsonArray = new JSONArray();
		boolean isCommonAccess = getEntityService().isCommonAccess();
		if(ThreadLocalUtils.getCurrentCorporation() == null && !isCommonAccess) {
			return toJSONView(jsonArray);
		}
		
		PropertyFilter commonFilter = new PropertyFilter(new String[]{"code", "name"}, page.getSf_LIKE_query(), MatchType.LIKE);
		PropertyFilter activeFilter = PropertyFilter.activeFilter();
		
		PropertyFilter[] filters;
		String[] parameterNameArray = getParameterNameArray(parameterNames, model);

		if(parameterNameArray.length > 0){
			filters = new PropertyFilter[parameterNameArray.length + 3];
			filters[0] = commonFilter;
			filters[1] = activeFilter;
			for(int i = 0; i < parameterNameArray.length; i++){
				String name = parameterNameArray[i].trim();
				if(Strings.isEmpty(name)) continue;
				try {
					Class clazz = model.getClass();
					T entity = (T) clazz.newInstance();
					Field field = ReflectionUtils.findField(entity.getClass(), name);
					Object value = getValueFromRequest(field , name , request, binder);
					PropertyFilter filter = new PropertyFilter(name, value, MatchType.EQ);
					filters[i+3] = filter;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
		} else {
			filters = new PropertyFilter[3];
			filters[0] = commonFilter;
			filters[1] = activeFilter;
		}
		
		if(!getEntityService().isCommonAccess()) {
			filters[2] = new PropertyFilter("corporation", ThreadLocalUtils.getCurrentCorporation(), MatchType.EQ);
		}
		
		if(!paged && !infinite){
			Sort sort = Sort.by(Direction.ASC, "code");
			sort.and(Sort.by(Direction.ASC, "name"));
			Iterable<T> list = getEntityService().search(sort, filters);
			jsonArray = getEntityService().buildStore(list);
			return toJSONView(jsonArray);
		} else {
			Page<T> pagedItems = getEntityService().search(page, addMorePropertyFilters4Search(filters, request));
			List<T> list = pagedItems.getContent();
			for (T t : list) {
				JSONObject obj = t.toJSONObject();
				jsonArray.put(obj);
			}
			return toJSONView(pagedItems, jsonArray);
		}
	}
	
	/**
	 * if you want to add more filters just for search, you can override this method
	 * @param filters
	 * @param request
	 * @return
	 */
	protected PropertyFilter[] addMorePropertyFilters4Search(PropertyFilter[] filters, HttpServletRequest request) {
		return filters;
	}
	
	public String[] getParameterNameArray(String parameterNames, T model) {
		parameterNames = Strings.isEmpty(parameterNames) ? model.getMaintenanceType().getParameterNames() : parameterNames;
		String[] parameterNameArray = parameterNames.split(",");
		return parameterNameArray;
	}
	
	public String[] getSaveParameterNameArray(String parameterNames, T model) {
		parameterNames = Strings.isEmpty(parameterNames) ? model.getMaintenanceType().getSaveParameterNames() : parameterNames;
		String[] parameterNameArray = parameterNames.split(",");
		return parameterNameArray;
	}
	
	public String applyCommon(@RequestParam("modifiedRecords") JSONArray records,
			@RequestParam("lineToDelete") String lineToDelete,
			@RequestParam(value="parameterNames", required=false) String parameterNames,
			@ModelAttribute("model") T model, ModelMap modelMap, HttpServletRequest request) {
		saveMaintenancedModel(records, lineToDelete, parameterNames, model, request);
		populateAttributes(modelMap, request, model, parameterNames);
		return LIST_PAGE_PATH;
	}
	
	private void saveMaintenancedModel(JSONArray records, String lineToDelete, String parameterNames, T model, HttpServletRequest request) {
		for(int i = 0 ; i < records.length(); i++ ){
			JSONObject jo = records.getJSONObject(i);
			T entity = null;
			if(jo.has(ENTITY_ID)){
				entity = bulid(jo, parameterNames, model, jo.getString(ENTITY_ID), binder, request);
			}else{
				entity = bulid(jo, parameterNames, model, "", binder, request);
			}
			getEntityService().save(entity);
		}
	}

	protected T bulid(JSONObject jo, String parameterNames, T model, String id, WebDataBinder binder, HttpServletRequest request) {
		try {
			Class clazz = model.getClass();
			T entity = null;
			if(!Strings.isEmpty(id)){
				entity = (T) getEntityService().get(id);
			}else{
				entity = (T) clazz.newInstance();
				if(!getEntityService().isCommonAccess()) {
					entity.setCorporation(ThreadLocalUtils.getCurrentCorporation());
				}
			}

			String[] parameterNameArray = getSaveParameterNameArray(parameterNames, model);
			if(parameterNameArray != null) {
				for (int i = 0; i < parameterNameArray.length; i++) {
					String key = parameterNameArray[i].trim();
					if(Strings.isEmpty(key) || "corporation".equals(key)) continue;
					Field field = ReflectionUtils.findField(entity.getClass(), key);
					Object value = getValueFromRequest(field , key , request, binder);
					EntityReflectionUtils.invokeSetterMethod(entity, key, value, field.getType());
				}
			}
			
			Iterator<String> it = jo.keys();
			while(it.hasNext()){
				String key = it.next();
				if(key.endsWith("_text")) continue;
				
				Field field = ReflectionUtils.findField(entity.getClass(), key);
				Object value = getValueFromJson(field , key , jo, binder);
				EntityReflectionUtils.invokeSetterMethod(entity, key, value, field.getType());
			}
			return entity;
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	private Object getValueFromJson(Field field, String name, JSONObject jo, WebDataBinder binder) {
		return binder.getConversionService().convert(jo.get(name), field.getType());
	}

	private Object getValueFromRequest(Field field, String name, HttpServletRequest request, WebDataBinder binder) {
		String parameter = request.getParameter(name);
		// if the maintenance need a corporation filter parameter, we could get from thread local as default corporation

//		String ignoreCorporation = request.getParameter("ignoreCorporation");
//		boolean isIgnoreCorporation = Strings.isEmpty(ignoreCorporation) ? false : Boolean.valueOf(ignoreCorporation);
//		if(!isIgnoreCorporation) {
//			if(Strings.isEmpty(parameter) && "corporation".equals(name)) parameter = ThreadLocalUtils.getCurrentOwnerCorporation();
//		}
		
		return binder.getConversionService().convert(parameter, field.getType());
	}
	
	protected void populateAttributes(ModelMap modelMap, HttpServletRequest request, T model, String parameterNames) {
		modelMap.addAttribute("isPopupEditor", isPopupEditor());
		modelMap.addAttribute("isAbleToRemoveLine", isAbleToRemoveLine());
		modelMap.addAttribute("specialValidate", specialValidate());
		modelMap.addAttribute("savePermission", model.getSavePermission());
		modelMap.addAttribute("deletePermission", model.getDeletePermission());
		String ableToClosePage = request.getParameter("ableToClosePage");
		modelMap.addAttribute("ableToClosePage", Strings.isEmpty(ableToClosePage) ? false : Boolean.valueOf(ableToClosePage));
		modelMap.addAttribute("propWinSizeSetupJsonStr", getPropWinSizeSetupJsonStr());
		modelMap.addAttribute("hiddenColumns", model.getMaintenanceType().getHiddenColumns());
		modelMap.addAttribute("columnModelConfig", model.getMaintenanceType().getColumModel());
		logger.info(model.getMaintenanceType().toString());
		logger.info(model.getMaintenanceType().getColumModel().toString());
		modelMap.addAttribute("languages", Language.getLanguages());
		modelMap.addAttribute("title", getTitle());
		modelMap.addAttribute("propUrl", getPropUrl() == null ? "" :  getPropUrl());
		modelMap.addAttribute("formUrl", getFormUrl(request));
		modelMap.addAttribute("jsonUrl", getJsonUrl(request , model));
		String ignoreCorporation = request.getParameter("ignoreCorporation");
		modelMap.addAttribute("ignoreCorporation", Strings.isEmpty(ignoreCorporation) ? false : Boolean.valueOf(ignoreCorporation));
		modelMap.addAttribute("paged", isPaged());
		modelMap.addAttribute("isInfinite", isInfinite());
		String[] parameterNameArray = getParameterNameArray(parameterNames, model);
		List<KeyValueEntity> filterParams = new ArrayList<KeyValueEntity>();
		for (int i = 0; i < parameterNameArray.length; i++) {
			String key = parameterNameArray[i];
			if(Strings.isEmpty(key) || Strings.isEmpty(request.getParameter(key))) continue;
			filterParams.add(new KeyValueEntity(key, request.getParameter(key)));
		}
		modelMap.addAttribute("filterParams", filterParams);
		populateExtraAttributes(modelMap, model, request, parameterNames);
	}

	private Object getFormUrl(HttpServletRequest request) {
		String url = request.getRequestURI();
		url = url.substring(0, url.lastIndexOf('/'));
		return url;
	}

	private Object getJsonUrl(HttpServletRequest request , T model) {
		String url = request.getRequestURI();
		url = url.substring(0, url.lastIndexOf('/')) + "/json";
		if(isPaged()){
			url +="?paged=true&infinite=" + isInfinite();
		}else{
			url +="?paged=false&infinite=" + isInfinite();
		}
		
//		if(StringUtils.isNotBlank(model.getMaintenanceType().getParameterNames())
//				&& CORPORATION.equals(model.getMaintenanceType().getParameterNames())){
//			String param = CORPORATION + "=" + ThreadLocalUtils.getCurrentOwnerCorporation();
//			
//			if(url.indexOf("?") >= 0 ){
//				url += "&" + param;
//			}else{
//				url += "?" + param;
//			}
//		}
		return url;
	}

	protected String getTitle() {		
		return ResourceUtils.getText(KEY_PRIFIX + ClassUtils.getShortName(entityClass));
	}
	
	@InitBinder
	public void initBinder(WebDataBinder binder) {
		this.binder = binder;
	}

	public String getUniqueCols(){
		return "code";
	}
	
	private boolean isPopupEditor(){
		return StringUtils.isNotBlank(getPropUrl());
	}
	
	public boolean isAbleToRemoveLine() {
		return true;
	}
	public String specialValidate() {
		return "";
	}
	
	protected void buildBtnAttributes(ModelMap modelMap, String type) {
		modelMap.addAttribute("showValuesMethodName", "show" + type + "List");
		modelMap.addAttribute("showBtnName", "Com." + type + "Values");
	}
	
	protected void populateExtraAttributes(ModelMap modelMap, T model, HttpServletRequest request, String parameterNames) {}
}