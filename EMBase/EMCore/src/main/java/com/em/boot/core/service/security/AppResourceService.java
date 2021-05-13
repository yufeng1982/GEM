package com.em.boot.core.service.security;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.em.boot.core.dao.AbsRepository;
import com.em.boot.core.model.security.AppResource;
import com.em.boot.core.model.security.FunctionNode;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.SecurityLevel;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.utils.ERPServletContext;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.ResourceUtils;
import com.em.boot.core.utils.Strings;

/**
 * @author YF
 *
 */
@Component
public class AppResourceService extends AbsService<AppResource, PageInfo<AppResource>> {
	
	@Autowired private FunctionNodeService functionNodeService;
	@Autowired private ERPServletContext erpServletContext;
	
	private Map<FunctionNode, List<AppResource>> allAppResources = new HashMap<FunctionNode, List<AppResource>>();

	@Override
	public boolean isCommonAccess() {
		return false;
	}
	
	public Map<FunctionNode, List<AppResource>> getAll() {
		init();
		return allAppResources;
	}

	@SuppressWarnings("rawtypes")
	@PostConstruct
	protected void init() {
		allAppResources.clear();
		
		SAXReader reader = new SAXReader();
		try {
			String appFilePath = Strings.append(new StringBuffer(), erpServletContext.getRealPath(), File.separator, "WEB-INF", File.separator, "res", File.separator, "appResource-core.xml").toString();
			Document functionNodeDocument = reader.read(new File(appFilePath));
			
			Element root = functionNodeDocument.getRootElement();
			Iterator elementIterator = root.elementIterator();
			while (elementIterator.hasNext()) {
				Element fnElement = (Element) elementIterator.next();
				FunctionNode fn = functionNodeService.getFunctionNode(fnElement.attributeValue("id"));
				if(fn == null) continue;
				List<AppResource> arList = new ArrayList<AppResource>();
				Iterator nodeIterator = fnElement.elementIterator();
				while (nodeIterator.hasNext()) {
					Element arElement = (Element) nodeIterator.next();
					
					AppResource ar = new AppResource(fn);
					ar.setId(arElement.attributeValue("id"));
					ar.setKey(arElement.attributeValue("key"));
					ar.setCategory(arElement.attributeValue("category"));
					arList.add(ar);
				}
				allAppResources.put(fn, arList);
			}
			
		} catch (DocumentException e) {			
			e.printStackTrace();
		}
	}
	
	public JSONObject getAllAsTree(Role role) {
		JSONObject root = new JSONObject();
		root.put("title", ".");
		JSONArray nodeArray = new JSONArray();
		
		Map<FunctionNode, List<AppResource>> allResources = getAll();
		Iterator<FunctionNode> fnIterator = allResources.keySet().iterator();
		while (fnIterator.hasNext()) {
			FunctionNode fn = (FunctionNode) fnIterator.next();
//			if(functionNodeManager.getAuditFunctionNode().equals(fn)) continue;
			List<AppResource> resources = allResources.get(fn);
			nodeArray.put(toTreeNode(fn, resources, role));
		}
		
		root.put("children", nodeArray);
		return root;
	}
	
	private JSONObject toTreeNode(FunctionNode fn, List<AppResource> appResources, Role role) {
		JSONObject fnNode = new JSONObject();
		fnNode.put("title", ResourceUtils.getText(fn.getKey()));
		fnNode.put("id", fn.getId());
		fnNode.put("_id", fn.getId());
		fnNode.put("_parent", "");
		fnNode.put("_level", 1);
		
		fnNode.put("leaf", false);
		
		fnNode.put("_enable", false);
		fnNode.put("_visible", false);
		fnNode.put("children", buildResourceNodes(appResources, role));
		return fnNode;
	}

	private JSONArray buildResourceNodes(List<AppResource> appResources, Role role) {
		JSONArray nodeArray = new JSONArray();
		for (AppResource ar : appResources) {
			JSONObject cJO = new JSONObject();
			cJO.put("title", ResourceUtils.getText(ar.getKey()));
			cJO.put("id", ar.getFn().getId() + "_" + ar.getId());
			cJO.put("_id", ar.getId());
			cJO.put("_parent", ar.getFn().getId());
			cJO.put("_level", 2);
			
			cJO.put("leaf", true);
			cJO.put("_enable", ar.isChecked(role, SecurityLevel.enable));
			cJO.put("_visible", ar.isChecked(role, SecurityLevel.visible));
			cJO.put("_category", ar.getCategory());

			nodeArray.put(cJO);
		}
		return nodeArray;
	}
	
	public JSONObject getAvailableForCurrentUserByFunctionNodes(List<FunctionNode> fnList) {
		JSONObject resourceOperation = new JSONObject();
		if(!fnList.isEmpty()){
			Map<FunctionNode, List<AppResource>> allResources = getAll();
			for (FunctionNode fn : fnList) {
				List<AppResource> list = allResources.get(fn);
				if(list != null && !list.isEmpty()) {
					for (AppResource appResource : list) {
						String operation = getResourceOperate(appResource);
						if(!Strings.isEmpty(operation)){
							resourceOperation.put(appResource.getId(), operation);
						}
					}
				}
			}
		}
		return resourceOperation;
	}
	
	private String getResourceOperate(AppResource resource){
		String resourceName = resource.getFn().getId() + "_" + resource.getId();
		String enablePermission = resourceName + ":" + SecurityLevel.enable.getName();
		String visiblePermission = resourceName + ":" + SecurityLevel.visible.getName();
		Subject subject = SecurityUtils.getSubject();
		if(subject.isPermitted(enablePermission)){
			return "";
		} else if (subject.isPermitted(visiblePermission)){
			return SecurityLevel.disabled.getName();
		} else {
			return SecurityLevel.hidden.getName();
		}
	}
	
	@Override
	protected AbsRepository<AppResource> getRepository() {
		return null;
	}
}
