package com.em.boot.web.controller;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.em.boot.core.controller.AbsController;
import com.em.boot.core.model.security.FunctionNode;
import com.em.boot.core.model.security.FunctionNodeType;
import com.em.boot.core.model.security.Role;
import com.em.boot.core.model.security.TreeNode;
import com.em.boot.core.service.AbsService;
import com.em.boot.core.service.StateService;
import com.em.boot.core.service.security.AppResourceService;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.service.security.RoleService;
import com.em.boot.core.utils.Strings;
import com.em.boot.core.utils.ThreadLocalUtils;



/**
 * @author FengYu
 */
@Controller
@SuppressWarnings("rawtypes")
public class MenuTreeController extends AbsController<FunctionNode> {
	
	@Autowired private StateService stateService;
	@Autowired private RoleService roleService;
	@Autowired private AppResourceService appResourceService;

	@Override
	protected AbsService getEntityService() {
		return null;
	}
	
	@RequestMapping(value = "/app/gem/ui/menu/tree/root")
	public ModelAndView tree() {
		return toJSONView(getRootLevelMenuJSON().toString());
	}
	
	private JSONArray getRootLevelMenuJSON() {
		List<FunctionNodeType> functionTypeList = functionNodeService.findValidFunctionNodeTypesForCurrentUser();
		JSONArray menuPanelItemsArray = new JSONArray();
		for (FunctionNodeType eachType : functionTypeList) {
			menuPanelItemsArray.put(eachType.toJson());
		}
		return menuPanelItemsArray;
	}

	@RequestMapping("/app/gem/ui/menu/tree/json")
	public ModelAndView getFirstLevelFunctionNodes(@RequestParam("node") String id) {
		TreeNode root = TreeNode.createRoot();
		String userFunctionNodeIds = functionNodeService.getValidFunctionNodeIdsFromUser(ThreadLocalUtils.getCurrentUser());
		List<FunctionNode> functionNodes = null;
		FunctionNodeType functionNodeType = functionNodeService.getFunctionNodeType(id);
		
		if(functionNodeType != null) {
			functionNodes = functionNodeType.getList();
		} else {
			FunctionNode functionNode = functionNodeService.getFunctionNodeFolder(id);
			functionNodes = functionNode.getList();
		}
		for (FunctionNode eachFun : functionNodes) {
			if(isValidFunctionNode(userFunctionNodeIds, eachFun)) root.appendRootChild(toTreeNode(eachFun));
		}

		return toJSONView(root.toRootString());
	}
	
	@RequestMapping(value = "/app/gem/ui/menu/tree/byRole")
	public ModelAndView getFunctionNodesByRole(@RequestParam("functionNodeIds") String functionNodeIds) {
		Corporation corporation = ThreadLocalUtils.getCurrentCorporation();
		List<FunctionNodeType> functionTypeList = functionNodeService.findAllFunctionNodeTypes();
		TreeNode root = TreeNode.createRoot();
		if(corporation != null){
//			Role adminRole = roleService.getAdminRole(corporation);
//			String corporationNodes = adminRole.getFunctionNodeIds();
//			functionTypeList = functionNodeManager.buildFunctionNodesByNodeIds(corporationNodes);
			String currentUserfunctionNodeIds = getFunctionNodeByCurrentUser();// 获取当前用户角色的所有fnids
			functionTypeList = functionNodeService.buildFunctionNodesByNodeIds(currentUserfunctionNodeIds);// 获取当前登录用户的角色的 fntype
		}
		for (FunctionNodeType functionNodeType : functionTypeList) {
			if(!functionNodeType.getId().equals("0")) {
				root.appendRootChild(toStaticTreeNode(functionNodeType, functionNodeIds));
			}
		}
		
		return toJSONView(root.toRootString());
	}

	private String getFunctionNodeByCurrentUser() {
		String functionNodeIds = "";
		Set<Role> roles = ThreadLocalUtils.getCurrentUser().getRoles();
		Iterator<Role> itRoles = roles.iterator();
		while(itRoles.hasNext()) {
			Role role = itRoles.next();
			if (Strings.isEmpty(functionNodeIds)) {
				functionNodeIds = role.getFunctionNodeIds();
			} else {
				String currentFnIds = role.getFunctionNodeIds();
				String fnIds[] = currentFnIds.split(",");
				for (String fnId : fnIds) {
					if (!functionNodeIds.contains(fnId)) {
						functionNodeIds += fnId + ",";
					}
				}
			}
		}
		return functionNodeIds;
	}
	
	@RequestMapping(value = "/app/gem/ui/menu/tree/allResources")
	public ModelAndView getAllResources(@RequestParam("role") Role role) {
		return toJSONView(appResourceService.getAllAsTree(role).toString());
	}
	
	private TreeNode toTreeNode(FunctionNode fn) {
		TreeNode node = TreeNode.createTreeNode();
		node.id(fn.getId());
		String text = getMessage(fn.getKey());
		node.text(text);
		node.icon(fn.getImgSrc());
		node.iconCls(fn.getIconCls());
		node.leaf(fn.isLeaf());
		node.singleClickExpand(true);
		node.url(fn.getUrl());
		node.qtip(text);
		return node;
	}
	
	private TreeNode toStaticTreeNode(FunctionNodeType fnt, String functionNodeIds) {
		TreeNode node = TreeNode.createTreeNode();
		node.id(fnt.getId());
		String text = getMessage(fnt.getKey());
		node.text(text);
		node.icon(fnt.getImgSrc());
//		node.iconCls(fnt.getIconCls());
		node.leaf(false);
		node.singleClickExpand(true);
		node.url("");
		node.qtip(text);
		List<FunctionNode> functionNodes = fnt.getList();
		for (FunctionNode eachFun : functionNodes) {
			appendStaticTreeNodeChild(node,  eachFun, functionNodeIds);
		}
		return node;
	}

	private void appendStaticTreeNodeChild(TreeNode pNode, FunctionNode fn, String functionNodeIds) {
		TreeNode node = TreeNode.createTreeNode();
		node.id(fn.getId());
		String text = getMessage(fn.getKey());
		node.text(text);
		node.icon(fn.getImgSrc());
		node.leaf(fn.isLeaf());
		if(fn.isLeaf()) {
			node.checked(isValidFunctionNode(functionNodeIds, fn.getId()));
		}
		node.singleClickExpand(true);
		node.url(fn.getUrl());
		node.qtip(text);
		List<FunctionNode> functionNodes = fn.getList();
		for (FunctionNode eachFun : functionNodes) {
			appendStaticTreeNodeChild(node, eachFun, functionNodeIds);
		}
		pNode.appendChild(node);
	}
	private boolean isValidFunctionNode(String functionNodeIds, String id) {
		Corporation corporation = ThreadLocalUtils.getCurrentCorporation();
		String corporationNodes = corporation != null?corporation.getFunctionNodes():functionNodeIds;
		if(functionNodeIds == null) return false;
		return functionNodeIds.indexOf(id) != -1 && corporationNodes.indexOf(id) != -1;
	}
	
	private boolean isValidFunctionNode(String functionNodeIds, FunctionNode fn) {
		// TODO, HACK ignore for admin user
		if(ThreadLocalUtils.getCurrentUser().getUsername().equals("admin")) return true;
		
		if(fn.isLeaf()) return isValidFunctionNode(functionNodeIds, fn.getId());
		
		List<FunctionNode> nodes = fn.getList();
		for (FunctionNode functionNode : nodes) {
			if(isValidFunctionNode(functionNodeIds, functionNode)) {
				return true;
			}
		}
		return false;
	}

}
