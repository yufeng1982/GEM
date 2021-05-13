/**
 * 
 */
package com.em.boot.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.em.boot.core.controller.AbsController;
import com.em.boot.core.service.AbsService;

/**
 * @author FengYu
 *
 */
@Controller
@RequestMapping("/core")
public class ClosePageController extends AbsController<Object>{

	@SuppressWarnings("rawtypes")
	@Override
	protected AbsService getEntityService() {
		return null;
	}
	
	@RequestMapping("/close")
	public String closePage() {
		return "close";
	}
}
