package com.em.boot.core.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.model.IEntity;

/**
 * @author YF
 */
public abstract class AbsPagedListController<T extends IEntity> extends AbsListController<T> {
	
	protected ModelAndView toJSONView(Page<? extends IEntity> page, JSONArray jsonArray) {
		JSONObject jso = new JSONObject();
		jso.put("total", page.getTotalElements());
		jso.put("totalRecordSize", page.getTotalElements());
		jso.put("totalPageAmount",  page.getTotalPages());
		jso.put("data", jsonArray);
		return toJSONView(jso);
	}
	
	protected ModelAndView toJSONView(Page<? extends IEntity> page) {
		JSONObject jso = new JSONObject();
		jso.put("total", page.getTotalElements());
		jso.put("totalRecordSize", page.getTotalElements());
		jso.put("totalPageAmount",  page.getTotalPages());
		jso.put("data", buildJSONArray(page.getContent()));
		return toJSONView(jso);
	}
	
}
