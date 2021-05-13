/**
 * 
 */
package com.em.boot.core.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.json.JSONObject;

import com.em.boot.core.model.security.User;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.Strings;

/**
 * @author FengYu
 *
 */
@Entity
@Table(schema = "public")
public class State implements IEntity, Serializable {
	private static final long serialVersionUID = -346447268183679854L;

	public final static String BOOK_MARK_PAGE_NAME = "MAIN_WIN_BOOK_MARK";
	public final static String BOOK_MARK_SCOPE_OBJECT_TYPE = "BOOK_MARK";
	public final static String COMPANY_SELECTION = "C_SELECTION";
	public final static String COMPANY_SELECTION_PAGE_NAME = "C_SELECTION_PN";
	public final static String COMPANY_SELECTION_SCOPE_OBJECT_TYPE = "C_SELECTION_SOT";
	
	
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid.hex")
	private String id;
	
	@ManyToOne(optional=true,fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
	
	private String name;

	@Column(columnDefinition = "text")
	private String value;
	
	private String pageName;
	
	private String pageParameter;

	@ManyToOne(fetch = FetchType.LAZY)
	private Corporation corporation;
	
	State(){}
		
	public State(User user, String pageName, String pageParameter, String name, String value, Corporation corporation) {
		super();
		this.user = user;
		this.pageName = pageName;
		this.pageParameter = pageParameter;
		this.name = name;
		this.value = value;
		this.corporation = corporation;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getPageName() {
		return pageName;
	}

	public void setPageName(String pageName) {
		this.pageName = pageName;
	}

	public String getPageParameter() {
		return pageParameter;
	}

	public void setPageParameter(String pageParameter) {
		this.pageParameter = pageParameter;
	}

	public Corporation getCorporation() {
		return corporation;
	}

	public void setCorporation(Corporation corporation) {
		this.corporation = corporation;
	}

	@Override
	public String getDisplayString() {
		return getPageName() + " | " + getPageParameter();
	}

	@Override
	public JSONObject toJSONObject() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public JSONObject toJSONObjectAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isNewEntity() {
		return Strings.isEmpty(getId());
	}
}
