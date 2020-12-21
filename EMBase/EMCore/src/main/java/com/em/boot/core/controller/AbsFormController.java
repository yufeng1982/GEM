package com.em.boot.core.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.model.AbsEntity;
import com.em.boot.core.model.AbsSourceEntity;
import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.Ownership;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.Strings;
import com.google.common.collect.Lists;
import com.google.common.util.concurrent.Service.State;

/**
 * @author YF
 */
public abstract class AbsFormController<T extends IEntity> extends AbsController<T> {

	protected final static String RETURN_ACTION_NAME = "RETURN_ACTION";
	protected final static String RETURN_QUERYSTRING_NAME = "RETURN_QUERYSTRING";
	protected final static String RETURN_ACTION_OK = "ok";
	protected final static String RETURN_ACTION_CANCEL = "cancel";
	protected final static String RETURN_ACTION_APPLY = "apply";
	protected final static String VAR_NAME = "varName";
	protected final static String ACTION_NAME = "_action__";
	public final static String FROM_URI = "_FROM_URI__";
	public final static String ERROR_MSG = "errorMsg";
	public final static String ERROR_TITLE = "errorTitle";
	public final static String ERROR_MSG_KEY = "errorMsgKey";
	public final static String ERROR_MSGS = "errorMsgs";
	public final static String SYSTEM_INFO_LOG = "systemInfoLog";
	protected final static String LAUNCHER_CLOSE = "launcherClose";
	protected final static String OWNER_SHIP_SOURCE_ENTITY = "ownerShipSourceEntity";
	public final static String ERROR_MSG_SEPARATOR = ",";
	protected final static String TEMP_OWNER_SHIP_SOURCE_ENTITY_ID = "tempSourceEntityId";

	@RequestMapping(value = "get/{id}/json")
	public ModelAndView json(@PathVariable(value = "id") String id) {
		return toJSONView(getEntityService().get(id).toJSONObject());
	}

	@RequestMapping(value = "{id}/isUnique/double")
	public ModelAndView validateIntegerUnique(ModelMap modelMap, @PathVariable(value = "id") String id,
			@RequestParam(value = "propertyName") String propertyName,
			@RequestParam(value = "elementId", required = false) String elementId,
			@RequestParam(value = "newValue") Double newValue, @RequestParam(value = "corporation") String corporation) {

		return isUnique(id, propertyName, elementId, newValue, corporation);
	}

	@RequestMapping(value = "{id}/isUnique/integer")
	public ModelAndView validateIntegerUnique(ModelMap modelMap, @PathVariable(value = "id") String id,
			@RequestParam(value = "propertyName") String propertyName,
			@RequestParam(value = "elementId", required = false) String elementId,
			@RequestParam(value = "newValue") Integer newValue, @RequestParam(value = "corporation") String corporation) {

		return isUnique(id, propertyName, elementId, newValue, corporation);
	}

	@RequestMapping(value = "{id}/isUnique/string")
	public ModelAndView validateUnique(ModelMap modelMap, @PathVariable(value = "id") String id,
			@RequestParam(value = "propertyName") String propertyName,
			@RequestParam(value = "elementId", required = false) String elementId,
			@RequestParam(value = "newValue") String newValue, @RequestParam(value = "corporation") String corporation) {

		return isUnique(id, propertyName, elementId, newValue, corporation);
	}

	@ModelAttribute("entityId")
	public String populateId(@PathVariable(value = "id") String id) {
		return id;
	}

	private ModelAndView isUnique(String id, String propertyName, String elementId, Object newValue, String corporation) {
		boolean isUnique = true;
		if (Strings.isEmpty(corporation)) {
			isUnique = getEntityService().isPropertyUnique(propertyName, newValue, id);
		} else {
			isUnique = getEntityService().isPropertiesUnique(new String[] { propertyName, "corporation.id", "active"},
					new Object[] { newValue, corporation, true}, id);
		}
		JSONObject jo = new JSONObject();
		jo.put("isUnique", isUnique);
		jo.put("elementId", elementId);
		jo.put("propertyName", propertyName);
		return toJSONView(jo);
	}

	protected ModelAndView closePage(ModelMap modelMap) {
		return closePage(modelMap, new JSONObject());
	}

	protected ModelAndView closePage(ModelMap modelMap, JSONObject returnValue) {
		ModelAndView mav = new ModelAndView(LAUNCHER_CLOSE, modelMap);
		modelMap.addAttribute(RETURN_QUERYSTRING_NAME, returnValue.toString());
		return mav;
	}

	protected ModelAndView closePage(ModelMap modelMap, JSONArray returnValues) {
		ModelAndView mav = new ModelAndView(LAUNCHER_CLOSE, modelMap);
		modelMap.addAttribute(RETURN_QUERYSTRING_NAME, returnValues.toString());
		return mav;
	}

	@ModelAttribute(AbsFormController.VAR_NAME)
	public String getVarName(@RequestParam(value = VAR_NAME, required = false) String varName) {
		return varName;
	}

	@ModelAttribute(AbsFormController.ACTION_NAME)
	public String getAction(@RequestParam(value = ACTION_NAME, required = false) String action) {
		return action;
	}

	@ModelAttribute(AbsFormController.FROM_URI)
	public String getFromURI(@RequestParam(value = FROM_URI, required = false) String fromURI,
			HttpServletRequest request) {
		return Strings.isEmpty(fromURI) ? request.getRequestURI() : fromURI;
	}

	@ModelAttribute(AbsFormController.ERROR_MSG)
	public String getErrorMsg(@RequestParam(value = ERROR_MSG, required = false) String errorMsg) {
		return errorMsg;
	}

	@ModelAttribute(AbsFormController.ERROR_MSGS)
	public String[] getErrorMsgs(@RequestParam(value = ERROR_MSGS, required = false) String errorMsgs) {
		if (!Strings.isEmpty(errorMsgs)) {
			return errorMsgs.split(ERROR_MSG_SEPARATOR);
		}
		return null;
	}

	@ModelAttribute(AbsFormController.ERROR_MSG_KEY)
	public String getErrorMsgKey(@RequestParam(value = ERROR_MSG_KEY, required = false) String errorMsgKey) {
		return errorMsgKey;
	}

	@ModelAttribute(AbsFormController.ERROR_TITLE)
	public String getErrorTitle(@RequestParam(value = ERROR_TITLE, required = false) String errorTitle) {
		return errorTitle;
	}

	@ModelAttribute(AbsFormController.SYSTEM_INFO_LOG)
	public String getSystemInfoLog(@RequestParam(value = "systemInfoLog", required = false) String systemInfoLog) {
		return systemInfoLog;
	}

	protected void populateSourceEntity(ModelMap modelMap, Ownership owner) {
		AbsSourceEntity sourceEntity = null;
		if (Strings.isEmpty(owner.getOwnerId())) {
			sourceEntity = new AbsSourceEntity(owner);
		} else {
			sourceEntity = sourceEntityService.getSourceEntity(owner);
		}
		modelMap.addAttribute(OWNER_SHIP_SOURCE_ENTITY, sourceEntity);
	}

	@RequestMapping(value = "delete")
	@ResponseBody
	public String delete(@RequestParam String id) {
		String deleteMsg = "false";
		if (!isNew(id) && !Strings.isEmpty(id)) {
			deleteById(id);
			deleteMsg = "success";
		}
		return deleteMsg;
	}
	
	protected void buildModelMap(ModelMap modelMap, T t) {}
	
	abstract protected String getPath();
	protected void deleteById(String id) {
		getEntityService().delete(getEntityService().get(id));
	};
	abstract protected PageInfo<T> getPageInfo();
	abstract protected PageInfo<T> buildQueryInfo(IEntity t, PageInfo<T> queryInfo, String pageName);
	abstract protected Page<T> getPageResult(PageInfo<T> queryInfo);
	
}
