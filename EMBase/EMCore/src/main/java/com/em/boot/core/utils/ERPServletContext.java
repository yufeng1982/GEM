package com.em.boot.core.utils;

import javax.servlet.ServletContext;

import org.springframework.web.context.ServletContextAware;

/**
 * @author YF
 *
 */
public class ERPServletContext implements ServletContextAware {

	private ServletContext servletContext;
	
	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public ServletContext getServletContext() {
		return servletContext;
	}
	
	public String getRealPath() {
		return getServletContext() == null ? "" : getServletContext().getRealPath("/");
	}
	
	public String getMimeType(String file) {
		return getServletContext() == null ? "" : getServletContext().getMimeType(file);
	}

}
