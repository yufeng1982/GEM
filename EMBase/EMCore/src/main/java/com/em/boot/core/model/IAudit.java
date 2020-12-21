package com.em.boot.core.model;

import org.json.JSONObject;

public interface IAudit {

	public JSONObject toAuditJson(String clazz);
}
