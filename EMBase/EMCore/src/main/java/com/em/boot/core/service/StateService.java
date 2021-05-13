/**
 * 
 */
package com.em.boot.core.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.em.boot.core.dao.StateRepository;
import com.em.boot.core.model.State;
import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.PageInfo;
import com.em.boot.core.utils.PropertyFilter;
import com.em.boot.core.utils.PropertyFilter.MatchType;

/**
 * @author FengYu
 *
 */
@Component
public class StateService extends AbsService<State, PageInfo<State>> {
	
	@Autowired private StateRepository stateRepository;

	protected StateRepository getRepository() {
		return stateRepository;
	}

	public JSONArray getCurrentUserState(String pageName, String pageParameter, User currentUser, Corporation corporation) {
		List<State> states = findStateList(pageName, pageParameter, currentUser, corporation);
		JSONArray array = new JSONArray();
		if (states != null && !states.isEmpty()) {
			for (State state : states) {
				JSONObject jState = new JSONObject();
				jState.put("name", state.getName());
				jState.put("value", state.getValue());
				array.put(jState);
			}
		}
		return array;
	}

	public void saveUserStates(JSONArray jsonArray, String pageName, String pageParameter, User currentUser, Corporation corporation) {
		if (jsonArray != null) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jso = jsonArray.getJSONObject(i);
				State state = getState(pageName, pageParameter, jso.getString("name"), currentUser, corporation);
				if (state == null) {
					state = new State(currentUser, pageName, pageParameter, jso.getString("name"), jso.getString("value"), corporation);
				} else {
					state.setValue(jso.getString("value"));
				}
				save(state);
			}
		}
	}

	@Override
	public boolean isCommonAccess() {
		return false;
	}
	

	private State getState(String pageName, String pageParameter, String stateName, User currentUser, Corporation corporation) {
		List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
		filters.add(new PropertyFilter("user.id", currentUser.getId(), MatchType.EQ));
		filters.add(new PropertyFilter("pageName", pageName, MatchType.EQ));
		filters.add(new PropertyFilter("name", stateName, MatchType.EQ));
		filters.add(new PropertyFilter("corporation", corporation, MatchType.EQ));
		
		filters.add(new PropertyFilter("pageParameter", pageParameter, MatchType.EQ));
		
		return getRepository().findOne(bySearchFilter(filters)).get();
		
		
	}
	
	public List<State> findStateList(String pageName, String pageParameter, User currentUser, Corporation corporation) {
		if(currentUser == null) return new ArrayList<State>();
		
		List<PropertyFilter> filters = new ArrayList<PropertyFilter>();
		filters.add(new PropertyFilter("user.id", currentUser.getId(), MatchType.EQ));
		filters.add(new PropertyFilter("pageName", pageName, MatchType.EQ));
		filters.add(new PropertyFilter("corporation", corporation, MatchType.EQ));
		filters.add(new PropertyFilter("pageParameter", pageParameter, MatchType.EQ));
		
		return getRepository().findAll(bySearchFilter(filters));
	}
	
	public State getUserCorporationState(User currentUser) {
		return getState(State.COMPANY_SELECTION_PAGE_NAME, State.COMPANY_SELECTION_SCOPE_OBJECT_TYPE, State.COMPANY_SELECTION, currentUser, null);
	}
	
	public void saveUserCorporationState(String newCorporationId, User currentUser) {
		State state = getState(State.COMPANY_SELECTION_PAGE_NAME, State.COMPANY_SELECTION_SCOPE_OBJECT_TYPE, State.COMPANY_SELECTION, currentUser, null);
		if(state == null) {
			state = new State(currentUser, State.COMPANY_SELECTION_PAGE_NAME, State.COMPANY_SELECTION_SCOPE_OBJECT_TYPE, State.COMPANY_SELECTION, newCorporationId, null);
		} else {
			state.setValue(newCorporationId);
		}
		save(state);
	}
}