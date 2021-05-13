package com.em.boot.core.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.em.boot.core.controller.AbsController;
import com.em.boot.core.model.security.AppResource;
import com.em.boot.core.service.security.AppResourceService;

/**
 * @author FengYu
 *
 */
@Controller
@RequestMapping("/*/ui/resource*")
public class AppResourceController extends AbsController<AppResource> {

	@Autowired private AppResourceService appResourceService;

	@Override
	protected AppResourceService getEntityService() {
		return appResourceService;
	}
}
