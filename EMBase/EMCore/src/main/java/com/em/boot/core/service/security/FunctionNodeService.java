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
@Service("functionNodeManager")
public class FunctionNodeService {
	public final static String AUIDT_FUNTION_NODE = "auditFuntionNode";

	@Autowired private ERPServletContext erpServletContext;
	
	private List<FunctionNodeType> allModules = new ArrayList<FunctionNodeType>();
	private Map<String, FunctionNode> allLeafFunctionNodes = new HashMap<String, FunctionNode>();
	private Map<String, FunctionNode> allFolderFunctionNodes = new HashMap<String, FunctionNode>();
	private Map<String, FunctionNode> allStandAloneFunctionNodes = new HashMap<String, FunctionNode>();
	
	private FunctionNode auditFuntionNode;
	private void buildFunctionNodes(FunctionNodeType fnType, FunctionNode pFn, Element nodeElement) {
		FunctionNode node = convertToFunctionNode(nodeElement, fnType);
		
		if(pFn != null) {
			pFn.addFunctionNode(node);
			node.setParent(pFn);
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
		Map<FunctionNodeType, List<FunctionNode>> typeNodes = new HashMap<FunctionNodeType, List<FunctionNode>>();
		List<FunctionNodeType> functionTypeList = new ArrayList<FunctionNodeType>();
		if(ThreadLocalUtils.getCurrentUser().isSuperAdmin()) {
			List<FunctionNodeType> AdminFunctionTypeList = new ArrayList<FunctionNodeType>();
			for (FunctionNodeType eachType : findAllFunctionNodeTypes()) {
				if(eachType.getId().equals("SEC")) {
					List<FunctionNode> list = new ArrayList<FunctionNode>();
					for(FunctionNode node : eachType.getList()) {
						if(node.getId().equals("SEC01") || node.getId().equals("SEC02") || node.getId().equals("SEC03") 
								|| node.getId().equals("SEC09") || node.getId().equals("SEC10")) list.add(node);
					}
					eachType.setList3(list);
					AdminFunctionTypeList.add(eachType);
				}
				eachType.setList2(eachType.getList());
				functionTypeList.add(eachType);
			}
			Collection<FunctionNode> folders = allFolderFunctionNodes.values();
			for(FunctionNode folder : folders) {
				folder.setList2(folder.getList());
			}
			return AdminFunctionTypeList;
		} else {
			functionTypeList.add(getBookMark());
			String userFunctionNodeIds = getValidFunctionNodeIdsFromUser(ThreadLocalUtils.getCurrentUser());
			List<FunctionNode> nodes = getFunctionNodes(userFunctionNodeIds.split(","));
			for (FunctionNode o : nodes) {
				if(o != null && isValidFunctionNodeType(userFunctionNodeIds, o.getId())) {
					FunctionNodeType t = o.getFunctionNodeType();
					List<FunctionNode> ns = typeNodes.get(t);
					if(ns == null) {
						ns = new ArrayList<FunctionNode>();
						typeNodes.put(t, ns);
					}
					if(o.getParent() == null) {
						ns.add(o);
					} else {
						FunctionNode parent = o.getParent();
						if(!ns.contains(parent)) {
							ns.add(parent);
						}
						if(!parent.getList2().contains(o)) {
							parent.addFunctionNode2(o);
						}
					}
					
//					typeNodes.get(t);
					if(!functionTypeList.contains(t)) {
						functionTypeList.add(t);
					}
				}
			}
			for (FunctionNodeType type : functionTypeList) {
				type.setList2(typeNodes.get(type));
			}
		}
		return functionTypeList;
	}

	public FunctionNodeType getBookMark() {
		for (FunctionNodeType t : allModules) {
			if("0".equals(t.getId())) {
				return t;
			}
		}
		return null;
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
				if(fn == null) return fnList;
				if(!fnList.contains(fn)) {
					fn.setList2(null);
					if(fn.getParent() != null && !fn.getParent().getList2().isEmpty()) {
						fn.getParent().setList2(null);
					}
					fnList.add(fn);
				}
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
			if(!Strings.isEmpty(role.getFunctionNodeIds())) fnIds.append(role.getFunctionNodeIds());
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
			String fnFilePath = Strings.append(new StringBuffer(), erpServletContext.getRealPath(), File.separator, "WEB-INF", File.separator, "res", File.separator, "functionNodes.xml").toString();
			Document functionNodeDocument = reader.read(new File(fnFilePath));
			
			Element root = functionNodeDocument.getRootElement();
			Iterator elementIterator = root.elementIterator();
			auditFuntionNode = new FunctionNode(AUIDT_FUNTION_NODE);
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
		return functionNodeIds.indexOf(id) != -1;
	}
	
	public List<FunctionNodeType> buildFunctionNodesByNodeIds(String functionNodeIds){
		List<FunctionNodeType> list = new ArrayList<>();
		for(FunctionNodeType fnt : allModules){
			List<FunctionNode> functionNodes = fnt.getList2();
			List<FunctionNode> nodeVerified = new ArrayList<>();
			for(FunctionNode fn : functionNodes){
				appendCheckedFunctionNode(fn, functionNodeIds,nodeVerified);
			}
			if(!nodeVerified.isEmpty()){
				fnt.setList2(nodeVerified);
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
			List<FunctionNode> functionNodes = fn.getList2();
			List<FunctionNode> subNodeVerified = new ArrayList<>();
			for(FunctionNode fnn : functionNodes){
				appendCheckedFunctionNode(fnn, functionNodeIds,subNodeVerified);
			}
			if(!subNodeVerified.isEmpty()){
				fn.setList2(subNodeVerified);
				nodeVerified.add(fn);
			}
		}
	}
	
	public FunctionNode getAuditFunctionNode() {
	    return this.auditFuntionNode;
	}
}
