/**
 * 
 */
package com.em.boot.core.service.security;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.em.boot.core.model.security.FunctionNode;
import com.em.boot.core.model.security.FunctionNodeType;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.User;
import com.em.boot.core.utils.ERPServletContext;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;

/**
 * @author YF
 *
 */
@Service("functionNodeService")
public class FunctionNodeService {
	
	@Autowired private ERPServletContext erpServletContext;
	
	private List<FunctionNodeType> allModules = new ArrayList<FunctionNodeType>();
	private Map<String, FunctionNode> allLeafFunctionNodes = new HashMap<String, FunctionNode>();
	private Map<String, FunctionNode> allFolderFunctionNodes = new HashMap<String, FunctionNode>();
	private Map<String, FunctionNode> allStandAloneFunctionNodes = new HashMap<String, FunctionNode>();
	
	private void buildFunctionNodes(FunctionNodeType fnType, FunctionNode pFn, Element nodeElement) {
		FunctionNode node = convertToFunctionNode(nodeElement, fnType);
		
		if(pFn != null) {
			pFn.addFunctionNode(node);
		} else {
			fnType.addFunctionNode(node);
		}
		
		String name = nodeElement.getName();
		if(name.equals("folder")) {
			allFolderFunctionNodes.put(node.getId(), node);
			Iterator nodeIterator = nodeElement.elementIterator();
			while (nodeIterator.hasNext()) {
				Element subNodeElement = (Element) nodeIterator.next();
				buildFunctionNodes(fnType, node, subNodeElement);
			}
		} else {
			allLeafFunctionNodes.put(node.getId(), node);
		}
	}
	
	private FunctionNode convertToFunctionNode(Element moduleElement, FunctionNodeType fnType) {
		FunctionNode fn = new FunctionNode(fnType);
		fn.setId(moduleElement.attributeValue("id"));
		fn.setName(moduleElement.attributeValue("name"));
		fn.setKey(moduleElement.attributeValue("key"));
		fn.setImgSrc(moduleElement.attributeValue("imgSrc"));
		fn.setIconCls(moduleElement.attributeValue("iconCls"));
		fn.setIndex(moduleElement.attributeValue("index"));
		fn.setUrl(moduleElement.attributeValue("url"));
		fn.setPattern(moduleElement.attributeValue("pattern"));
		fn.setLeaf(Boolean.valueOf(moduleElement.attributeValue("leaf")));
		return fn;
	}
	private FunctionNodeType convertToFunctionNodeType(Element module) {
		String id = module.attributeValue("id");
		String key = module.attributeValue("key");
		String imgSrc = module.attributeValue("imgSrc");
		FunctionNodeType fnt = new FunctionNodeType(id, key, imgSrc);
		fnt.setIconCls(module.attributeValue("iconCls"));
		return fnt;
		
	}
	
	public List<FunctionNodeType> findAllFunctionNodeTypes() {
		return allModules;
	}
	
	public Map<String, FunctionNode> findAllLeafFunctionNodes() {
		return allLeafFunctionNodes;
	}
	
	public FunctionNode findFunctionNodeByUrl(String url) {
		Collection<FunctionNode> fns = allLeafFunctionNodes.values();
		for (FunctionNode functionNode : fns) {
			if(functionNode.isMatch(url)) return functionNode;
		}
		return null;
	}
	public List<FunctionNodeType> findValidFunctionNodeTypesForCurrentUser() {
		init();
		List<FunctionNodeType> functionTypeList = new ArrayList<FunctionNodeType>();
		String userFunctionNodeIds = getValidFunctionNodeIdsFromUser(ThreadLocalUtils.getCurrentUser());
		for (FunctionNodeType eachType : findAllFunctionNodeTypes()) {
			String typeId = eachType.getId();
			if(isValidFunctionNodeType(userFunctionNodeIds, typeId)) {
				functionTypeList.add(eachType);
			}
			
		}
		return functionTypeList;
	}

	public List<FunctionNode> findValidFunctionNodesForCurrentUser() {
		List<FunctionNode> functionNodeList = new ArrayList<FunctionNode>();
		String userFunctionNodeIds = getValidFunctionNodeIdsFromUser(ThreadLocalUtils.getCurrentUser());
		Collection<FunctionNode> fns = allLeafFunctionNodes.values();
		for (FunctionNode functionNode : fns) {
			String nodeId = functionNode.getId();
			if(isValidFunctionNodeType(userFunctionNodeIds, nodeId)) {
				functionNodeList.add(functionNode);
			}
		}
		return functionNodeList;
	}
	public FunctionNode getFunctionNode(String id) {
		FunctionNode fn = allLeafFunctionNodes.get(id);
		if(fn == null) fn = allStandAloneFunctionNodes.get(id);
		return fn;
	}
	
	public List<FunctionNode> getFunctionNodes(String[] ids) {
		List<FunctionNode> fnList = new ArrayList<FunctionNode>();
		if(ids != null && ids.length > 0) {		
			for(String id : ids) {
				FunctionNode fn = allLeafFunctionNodes.get(id);
				if(fn == null) {
					fn = allStandAloneFunctionNodes.get(id);
				}
				fnList.add(fn);
			}
		}
		return fnList;
	}

	public FunctionNode getFunctionNodeFolder(String id) {
		return allFolderFunctionNodes.get(id);
	}
	
	public FunctionNodeType getFunctionNodeType(String id) {
		for (FunctionNodeType functionNodeType : allModules) {
			if(functionNodeType.getId().equals(id)) {
				return functionNodeType;
			}
		}
		return null;
	}
	
	public String getValidFunctionNodeIdsFromUser(User user) {
		StringBuffer fnIds = new StringBuffer();
		Corporation corporation = ThreadLocalUtils.getCurrentCorporation();
		Iterator<Role> roles = user.getAvailableRoles(corporation).iterator();
		while (roles.hasNext()) {
			Role role = roles.next();
			fnIds.append(role.getFunctionNodeIds());
		}
		return fnIds.toString();
	}
	

	@PostConstruct
	protected void init() {
		allStandAloneFunctionNodes.clear();
		allModules.clear();
		allFolderFunctionNodes.clear();
		allLeafFunctionNodes.clear();
		
		SAXReader reader = new SAXReader();
		try {
			String fnFilePath = Strings.append(new StringBuffer(), erpServletContext.getRealPath(), File.separator, "WEB-INF", File.separator, "res", File.separator, "functionNodes-core.xml").toString();
			Document functionNodeDocument = reader.read(new File(fnFilePath));
			
			Element root = functionNodeDocument.getRootElement();
			Iterator elementIterator = root.elementIterator();
			while (elementIterator.hasNext()) {
				Element moduleElement = (Element) elementIterator.next();
				if(moduleElement.getName().equals("standAloneModule")) {
					Iterator nodeIterator = moduleElement.elementIterator();
					while (nodeIterator.hasNext()) {
						Element nodeElement = (Element) nodeIterator.next();
						FunctionNode node = convertToFunctionNode(nodeElement, null);
						allStandAloneFunctionNodes.put(node.getId(), node);
					}
					continue;
				}
				FunctionNodeType module = convertToFunctionNodeType(moduleElement);
				allModules.add(module);
				
				Iterator nodeIterator = moduleElement.elementIterator();
				while (nodeIterator.hasNext()) {
					Element nodeElement = (Element) nodeIterator.next();
					buildFunctionNodes(module, null, nodeElement);
				}
			}
			
		} catch (DocumentException e) {
			e.printStackTrace();
		}
	}
	
	private boolean isValidFunctionNodeType(String functionNodeIds, String id) {
		// TODO, HACK ignore for admin user
		if(ThreadLocalUtils.getCurrentUser().getUsername().equals("admin")) return true;
		// TODO, HACK ignore for book mark
		if(id.equals("0")) return true;
		
		Corporation corporation = ThreadLocalUtils.getCurrentCorporation();
		String corporationNodes = corporation != null ? corporation.getFunctionNodes():functionNodeIds;
		
		return functionNodeIds.indexOf(id) != -1 && corporationNodes.indexOf(id) != -1;
	}
	
	public List<FunctionNodeType> buildFunctionNodesByNodeIds(String functionNodeIds){
		List<FunctionNodeType> list = new ArrayList<>();
		for(FunctionNodeType fnt : allModules){
			List<FunctionNode> functionNodes = fnt.getList();
			List<FunctionNode> nodeVerified = new ArrayList<>();
			for(FunctionNode fn : functionNodes){
				appendCheckedFunctionNode(fn, functionNodeIds,nodeVerified);
			}
			if(!nodeVerified.isEmpty()){
				fnt.setList(nodeVerified);
				list.add(fnt);
			}
		}
		return list;
	}
	
	private void appendCheckedFunctionNode(FunctionNode fn,String functionNodeIds,List<FunctionNode> nodeVerified){
		if(fn.isLeaf()){
			int beforeLength = functionNodeIds.length();
			String replacedIds = functionNodeIds.replaceFirst(fn.getId(), "");
			if(beforeLength != replacedIds.length()){
				nodeVerified.add(fn);
			}
		}else{
			List<FunctionNode> functionNodes = fn.getList();
			List<FunctionNode> subNodeVerified = new ArrayList<>();
			for(FunctionNode fnn : functionNodes){
				appendCheckedFunctionNode(fnn, functionNodeIds,subNodeVerified);
			}
			if(!subNodeVerified.isEmpty()){
				fn.setList(subNodeVerified);
				nodeVerified.add(fn);
			}
		}
	}
}
