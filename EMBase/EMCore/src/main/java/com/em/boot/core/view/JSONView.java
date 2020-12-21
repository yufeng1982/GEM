package com.em.boot.core.view;

import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.View;

import com.em.boot.core.utils.FormatUtils;

public class JSONView implements View {
	private static final String DEFAULT_JSON_CONTENT_TYPE = "application/json";
	private static final String DEFAULT_JAVASCRIPT_TYPE = "text/javascript";
	protected String jsonString;

	public JSONView(String jsonString) {
		super();
		this.jsonString = jsonString;
	}

	public JSONView() {
		this(null);
	}

	public String getContentType() {
		return DEFAULT_JSON_CONTENT_TYPE;
	}

	
	
	@Override
	public void render(Map model, HttpServletRequest request,
		HttpServletResponse response) throws Exception {
		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 1);
		
		if (this.jsonString == null) {
			this.jsonString = FormatUtils.fromMap(model);
		}

		boolean scriptTag = false;
		String cb = request.getParameter("callback");
		if (cb != null) {
			scriptTag = true;
			response.setContentType(DEFAULT_JAVASCRIPT_TYPE);
		} else {
			response.setContentType(DEFAULT_JSON_CONTENT_TYPE);
		}

		PrintWriter out = response.getWriter();
		if (scriptTag) {
			out.write(cb + "(");
		}
		out.write(this.jsonString);
		if (scriptTag) {
			out.write(");");
		}
	}
}