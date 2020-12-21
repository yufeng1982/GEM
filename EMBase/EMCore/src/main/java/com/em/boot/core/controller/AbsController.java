package com.em.boot.core.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.security.FunctionNode;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.service.SourceEntityService;
import com.em.boot.core.service.security.AppResourceService;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.service.security.FunctionNodeService;
import com.em.boot.core.utils.AppUtils;
import com.em.boot.core.utils.ClassUtils;
import com.em.boot.core.utils.EntityReflectionUtils;
import com.em.boot.core.utils.FormatUtils;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;
import com.em.boot.core.view.JSONView;


/**
 * @author YF
 */
public abstract class AbsController<T> {
	
	protected Logger logger = LoggerFactory.getLogger(getClass());
	private String cName = ClassUtils.getShortName(getClass());
	
	@Autowired protected SourceEntityService sourceEntityService;
	@Autowired protected FunctionNodeService functionNodeManager;
	@Autowired protected AppResourceService appResourceService;
	
	protected final static String APP_NAME = "APP_NAME";
	protected final static String APP_ENVIRONMENT = "APP_ENVIRONMENT";
	public final static String CONTROLLED_RESOURCES = "CONTROLLED_RESOURCES";
	protected final static String CONTROLLER_NAME = "__CONTROLLER_NAME__";
//	protected final static String PAGE_PREFERENCE_STATE = "__page_preference_state__";
	protected final static String SCOPE_OBJECT_TYPE = "_SCOPE_OBJECT_TYPE_";
	protected final static String NEW_ENTITY_ID = "NEW";
	protected final static String CLONE_ENTITY_ID = "CLONE";
	protected final static String SAVE_SUCCESS = "saveSuccess";
	protected final static String PORLET_COLLAPSE = "porletCollapse";
	protected final static String TRUE = "true";
	
	protected Class<T> entityClass;

	@SuppressWarnings("unchecked")
	public AbsController() {
		super();
		this.entityClass = EntityReflectionUtils.getSuperClassGenricType(getClass());
	}
	
	@Autowired
	@Qualifier("messageSource") protected MessageSource messageSource;

	protected abstract AbsService getEntityService();
	
	protected String getMessage(String key) {
		String returnValue = "???"+key+"???";
		if(messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, new Object[0], ThreadLocalUtils.getCurrentLocale());
			} catch (NoSuchMessageException e) {
				logger.error(e.getMessage());
			}
		}
		return returnValue;
	}
	
	protected String getMessage(String key, Object[] objects) {
		String returnValue = "???"+key+"???";
		if(messageSource != null) {
			try {
				returnValue = messageSource.getMessage(key, objects, ThreadLocalUtils.getCurrentLocale());
			} catch (NoSuchMessageException e) {
				logger.error(e.getMessage());
			}
		}
		return returnValue;
	}
	
	@ModelAttribute(AbsController.CONTROLLER_NAME)
    public String getControllerName() {
    	return cName;
    }
	
	protected ModelAndView toJSONView(JSONObject jsonObject) {
		return toJSONView(jsonObject.toString());
	}
	
	protected ModelAndView toJSONView(String jsonString) {
		return new ModelAndView(new JSONView(jsonString));
	}
	
//	protected ModelAndView toStreamView(Resource resource) {
//		return new ModelAndView(new StreamView(resource));
//	}
	
//	@ModelAttribute(AbsController.PAGE_PREFERENCE_STATE)
//	protected String initPageState(@RequestParam(value="gridUrl", required=false) String gridUrl) {
//    	return stateManager.getCurrentUserState(cName, gridUrl, ThreadLocalUtils.getCurrentUser(), ThreadLocalUtils.getCurrentOwnerCorporation()).toString();
//    }
	
	@ModelAttribute(AbsController.APP_NAME)
	protected String getAppName() {
		return AppUtils.APP_NAME;
    }
//	@ModelAttribute(AbsController.APP_ENVIRONMENT)
//	protected String getAppEnvironment() {
//		return AppUtils.APP_ENVIRONMENT;
//    }

	@ModelAttribute("defaultOwnerCorporation")
	protected Corporation getDefaultOwnerCorporation() {
		return ThreadLocalUtils.getCurrentCorporation();
    }
	
	protected String to(String toUrl){
		return new StringBuffer().append("/app/").append(AppUtils.APP_NAME).append("/").append(toUrl).toString();
	}
	protected String pagePath(String pagePath){
		return new StringBuffer().append(AppUtils.APP_NAME).append("/").append(pagePath).toString();
	}
	
	protected void setPageSize(PageInfo<? extends IEntity> page, int maxPagesize){
		page.setAutoCount(false);
		page.setPageSize(maxPagesize);
	}
	
	protected JSONArray buildJSONArray(Iterable<? extends IEntity> list) {
		JSONArray ja = new JSONArray();
		for (IEntity t : list) {
			JSONObject obj = t.toJSONObject();
			ja.put(obj);
		}
		return ja;
	}
	
	protected JSONArray buildExcelJSONArray(Collection<? extends IEntity> list) {
		return buildJSONArray(list);
	}
	
//	protected ModelAndView generateExcelView(String columnConfigStr, ModelMap modelMap, JSONArray dataJSONArray, String fileName) {
//		Assert.notNull(fileName);
//		JSONArray ja =  null;
//		try {
//			ja = new JSONArray(columnConfigStr);
//		} catch (ParseException e) {
//			e.printStackTrace();
//		}
//		
//		String title = fileName + ".xls";
//		title = title.replace(" ", "_");
//		modelMap.put("fileName", title); 
//		ListExcelView view = new ListExcelView(ja, dataJSONArray);
//		return new ModelAndView(view , modelMap);
//	}
	
	protected ModelAndView redirectToBefor(ModelMap modelMap) {
		processErrorMsgAndInfoLog(modelMap);
		String url = (String) modelMap.get(AbsFormController.FROM_URI);
		return new ModelAndView(new RedirectView(url), removeUselessParameters4Redirect(modelMap));
	}
	/*ModelMap is used to pass message of workflow or somethig else*/
	protected ModelAndView redirectTo(String redirectToUrl, ModelMap modelMap){
		return redirectTo(AppUtils.APP_NAME , redirectToUrl , modelMap);
	}
	
	protected ModelAndView redirectTo(String appName , String redirectToUrl, ModelMap modelMap){
		processErrorMsgAndInfoLog(modelMap);
		String toUrl = new StringBuffer().append("/app/").append(appName).append("/").append(redirectToUrl).toString();
		modelMap.put(AbsFormController.FROM_URI, toUrl);
		RedirectView redirectView = new RedirectView(toUrl);
		return new ModelAndView(redirectView, removeUselessParameters4Redirect(modelMap));
	}
	
	protected String redirect(String appName, String redirectToUrl, ModelMap modelMap, RedirectAttributes redirectAttrs){
		boolean noError = processErrorMsgAndInfoLog(modelMap, redirectAttrs);
		String toUrl = new StringBuffer().append("/app/").append(appName).append("/").append(redirectToUrl).toString();
		modelMap.put(AbsFormController.FROM_URI, toUrl);
		removeUselessParameters4Redirect(modelMap);
		redirectAttrs.addFlashAttribute(SAVE_SUCCESS, noError);
		return "redirect:" + toUrl;
	}
	
	private ModelMap removeUselessParameters4Redirect(ModelMap modelMap) {
//		modelMap.remove(CONTROLLED_RESOURCES);
//		modelMap.remove(PAGE_PREFERENCE_STATE);
		return modelMap;
	}
	protected boolean hasErrorMessages() {
		Set<String> errorMsgs = ThreadLocalUtils.getErrorMsg();
		return errorMsgs != null && !errorMsgs.isEmpty();
	}
	protected boolean processErrorMsgAndInfoLog(ModelMap modelMap) {
		boolean noError = true;
		if(hasErrorMessages()) {
			noError = false;
			modelMap.put("errorMsgs", ThreadLocalUtils.getErrorMsg());
			modelMap.put("errorTitle", ThreadLocalUtils.getErrorTitle());
		}
    	
//		SystemInfoLog infoLog = ThreadLocalUtils.getInfoLog();
//		if(infoLog != null) {
//			if(infoLog.hasChild()) noError = false;
//			modelMap.put("systemInfoLog", infoLog.toJSONArray().toString());
//		}
		return noError;
	}
	protected boolean processErrorMsgAndInfoLog(ModelMap modelMap, RedirectAttributes redirectAttrs) {
		boolean noError = true;
		if(hasErrorMessages()) {
			noError = false;
			Set<String> errorMsg = ThreadLocalUtils.getErrorMsg();
			modelMap.put("errorMsgs", errorMsg);
			modelMap.put("errorTitle", ThreadLocalUtils.getErrorTitle());
			String msgs = "";
			for (String msg : errorMsg) {
				msgs = FormatUtils.getStrSeparateByComma(msgs, msg);
			}
			redirectAttrs.addFlashAttribute("errorMsgs", msgs);
		}
		
		return noError;
	}
	protected boolean isNew(String entityId) {
		return Strings.isEmpty(entityId) || NEW_ENTITY_ID.endsWith(entityId);
	}
	protected FunctionNode getBelongToFunctionNode() {
		return null;
	}
	
	protected List<FunctionNode> getBelongToFunctionNodeList() {
		return null;
	}
	
	private List<FunctionNode>  getAllBelongToFunctionNodeList() {
		List<FunctionNode> fnList = new ArrayList<FunctionNode>();
		FunctionNode singleFunctionNode = getBelongToFunctionNode();
		if(singleFunctionNode != null) {
			fnList.add(singleFunctionNode);
		}
		List<FunctionNode> multipleFunctionNodes = getBelongToFunctionNodeList();
		if(multipleFunctionNodes != null && multipleFunctionNodes.size() > 0) {
			for(FunctionNode fn : multipleFunctionNodes) {
				fnList.add(fn);
			}
		}
		return fnList;
	}
	@ModelAttribute(CONTROLLED_RESOURCES)
    public String getControlledResources() {
		if(ThreadLocalUtils.getCurrentUser() != null 
				&& "admin".equals(ThreadLocalUtils.getCurrentUser().getUsername())) {
			
			return new JSONObject().toString();
		}
		return appResourceService.getAvailableForCurrentUserByFunctionNodes(getAllBelongToFunctionNodeList()).toString();
    }
	
    @ModelAttribute(SCOPE_OBJECT_TYPE)
    public String getScopeObjectType(HttpServletRequest request) {
    	String url = request.getRequestURI();
    	String MethodName = url.substring(url.lastIndexOf("/") + 1);
    	return MethodName;
    }

	protected String getApproveCode(String passwordFor) {
//		Md5PasswordEncoder encoder = new Md5PasswordEncoder();
//		String corporation = ThreadLocalUtils.getCurrentOwnerCorporation();
//		Corporation c = Corporation.findByCode(corporation);
//    	
//    	try {
//    		Field field =ReflectionUtils.findField(Corporation.class, passwordFor);
//    		field.setAccessible(true);
//			return encoder.encodePassword((String)field.get(c), null);
//		} catch (IllegalArgumentException e) {
//			e.printStackTrace();
//			return null;
//		} catch (IllegalAccessException e) {
//			e.printStackTrace();
//			return null;
//		}
		return null;
	}
}
