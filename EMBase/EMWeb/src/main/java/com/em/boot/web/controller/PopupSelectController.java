package com.em.boot.web.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsFormController;
import com.em.boot.core.enums.MaintenanceType;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.utils.Strings;

/**
 * @author FengYu
 */
@SuppressWarnings("rawtypes")
@Controller
@RequestMapping("/app/gem/ui/popup")
public class PopupSelectController extends AbsFormController {


	@Override
	protected AbsService getEntityService() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@RequestMapping(value = "{id}/show")
	public String show() {
		return "ui/popup2";
	}
	

	@RequestMapping(value = "{id}/ok")
	public ModelAndView ok(@ModelAttribute("selectedRecords") JSONArray selectedRecords, ModelMap modelMap) {
		return closePage(modelMap, selectedRecords);
	}

	@RequestMapping(value = "{id}/cancel")
	public ModelAndView cancel(ModelMap modelMap) {
		return closePage(modelMap);
	}
	
	@ModelAttribute("selectedRecords")
    public JSONArray getGridUrl(@RequestParam(value="selectedRecords", required=false) JSONArray selectedRecords) {
    	return selectedRecords;
    }
	
	@ModelAttribute("gridUrl")
    public String getGridUrl(@RequestParam(value="gridUrl", required=false) String gridUrl) {
    	return gridUrl;
    }

	@ModelAttribute("gridConfigName")
    public String getGridConfigName(@RequestParam(value="gridConfigName", required=false) String gridConfigName) {
    	return gridConfigName;
    }
	@ModelAttribute("searchable")
    public Boolean getSearchable(@RequestParam(value="searchable", required=false) boolean searchable) {
    	return searchable;
    }
	@ModelAttribute("multiple")
    public Boolean getMultiple(@RequestParam(value="multiple", required=false) boolean multiple) {
    	return multiple;
    }
	@ModelAttribute("queryParameterName")
    public String getQueryParameterName(@RequestParam(value="queryParameterName", required=false) String queryParameterName) {
		return Strings.isEmpty(queryParameterName) ? "" : queryParameterName;
    }
	@ModelAttribute("parameters")
    public JSONObject getParameters(@RequestParam(value="parameters", required=false) JSONObject parametersJSON) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		if(parametersJSON == null) parametersJSON = new JSONObject();
		parametersJSON.put("gridReadOnly", parametersJSON.has("gridReadOnly") ? parametersJSON.get("gridReadOnly"):true);
		return parametersJSON;
    }
	@ModelAttribute("mtype")
    public String getGridConfigName(@RequestParam(value="mtype", required=false) String mtype,
    		@RequestParam(value="searchUrl", required=false) String searchUrl, ModelMap modelMap) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		if(!Strings.isEmpty(mtype)){
			modelMap.put("hiddenColumns", MaintenanceType.fromName(mtype).getHiddenColumns());
			modelMap.put("columnConfigs", MaintenanceType.fromName(mtype).getColumModel());
			modelMap.put("searchUrl", MaintenanceType.fromName(mtype).getSearchUrl());
			modelMap.put("displayField", MaintenanceType.fromName(mtype).getDisplayField());
		}
		if(!Strings.isEmpty(searchUrl)) {
			modelMap.put("searchUrl", searchUrl);
		}
    	return mtype;
    }
	@ModelAttribute("seType")
    public String getSeType(@RequestParam(value="seType", required=false) String seType) {
    	return seType;
    }
	
	@ModelAttribute("columnsArray")
	public String getColumnsArray(@RequestParam(value = "columnsArray", required=false) String columnsArray) {
		return columnsArray;
	}

}
