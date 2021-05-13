/**
 * Copyright (c) 2005-20010 springside.org.cn
 * We change/add some extra methods in order to fulfill our project.
 */
package com.em.boot.core.utils;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.em.boot.core.model.IEntity;
import com.em.boot.core.model.IEnum;
import com.em.boot.core.service.security.Corporation;
import com.em.boot.core.utils.PropertyFilter.MatchType;
import com.google.common.collect.Lists;

/**
 * @author YF
 *
 */
public class PageInfo<T> implements Pageable {
	private static Logger logger = LoggerFactory.getLogger(PageInfo.class);
	
	public static final String SORTERS = "sorters";
	public final static String DIRECTION = "direction";
	public final static String PROPERTY = "property";
	public static final String ASC = "asc";
	public static final String DESC = "desc";
	public static final String LENGTH_ASC = "length_asc";
	public static final String LENGTH_DESC = "length_desc";

	public static final int MIN_PAGESIZE = 2;
	public static final int MAX_PAGESIZE = 5000;
	public static final int DEFAULT_PAGESIZE = 300;

	protected int page = 1;
	protected int pageSize = MIN_PAGESIZE;
//	protected String orderBy = null;
//	protected String order = ASC;
	protected boolean autoCount = true;

	protected List<T> result = null;
	protected List<Object[]> objResult = null;
	protected long totalCount = -1;
	public int beginIndex;

	protected Corporation sf_EQ_corporation;
	protected Boolean sf_EQ_active = Boolean.TRUE;
	private String sf_EQ_id;
	private String sf_LIKE_query;
//	private String sortBy;
	private Sort sort;
	private String sumFields;
	private String filter;
	private static Map<String, Object> sumFieldsMap = new HashMap<String, Object>();
	
//	private List<Order> extraOrders = new ArrayList<Order>();
	public PageInfo() {
		this(DEFAULT_PAGESIZE, 0, true);
		this.setSf_EQ_corporation(ThreadLocalUtils.getCurrentCorporation());
		@SuppressWarnings("unchecked")
		Class<T> z = EntityReflectionUtils.getSuperClassGenricType(getClass());
		Object clazz = null;
		try {
			Constructor<?> c = z.getDeclaredConstructor();
			c.setAccessible(true);
			clazz = c.newInstance();
		} catch (Exception e) {
			e.printStackTrace();
		}
		if(clazz != null) {
			if(EntityReflectionUtils.getDeclaredField(clazz, "code") != null && EntityReflectionUtils.getDeclaredField(clazz, "name") != null) {
				setSortObj(Sort.by(Direction.ASC, "code").and(Sort.by(Direction.ASC, "name")));
			} else if(EntityReflectionUtils.getDeclaredField(clazz, "code") != null ) {
				setSortObj(Sort.by(Direction.ASC, "code"));
			} else if(EntityReflectionUtils.getDeclaredField(clazz, "name") != null) {
				setSortObj(Sort.by(Direction.ASC, "name"));
			} else if(EntityReflectionUtils.getDeclaredField(clazz, "creationDate") != null ) {
				setSortObj(Sort.by(Direction.DESC, "creationDate"));
			}
		}
	}

	public PageInfo(final int pageSize, final int beginIndex) {
		this(pageSize, beginIndex, true);
	}
	
	public PageInfo(String orderBy, String order) {
		this();
		setSortObj(Sort.by(Direction.valueOf(order), orderBy));
	}
	
	public PageInfo(final int pageSize, final int beginIndex, final boolean autoCount) {
		setPageConfig(pageSize,  beginIndex, autoCount);
	}

	public int getBeginIndex() {
		return beginIndex;
	}
	
	public int getFirst() {
		return ((page - 1) * pageSize);
	}

	public int getNextPage() {
		if (isHasNext())
			return page + 1;
		else
			return page;
	}

	public List<Object[]> getObjResult() {
		if (objResult == null)
			return Collections.emptyList();
		return objResult;
	}

	public int getPage() {
		return page;
	}

	public int getPageSize() {
		return pageSize;
	}

	public int getPrePage() {
		if (isHasPre())
			return page - 1;
		else
			return page;
	}

	public List<T> getResult() {
		if (result == null)
			return Collections.emptyList();
		return result;
	}

	public long getTotalCount() {
		return totalCount;
	}

	public long getTotalPages() {
		if (totalCount < 0)
			return -1;

		long count = totalCount / pageSize;
		if (totalCount % pageSize > 0) {
			count++;
		}
		return count;
	}

	public boolean isAutoCount() {
		return autoCount;
	}

	public boolean isHasNext() {
		return (page + 1 <= getTotalPages());
	}

	public boolean isHasPre() {
		return (page - 1 >= 1);
	}
	public void setAutoCount(final boolean autoCount) {
		this.autoCount = autoCount;
	}
	
	public void setBeginIndex(int beginIndex) {
		this.beginIndex = beginIndex;
		setPageConfig(pageSize,  beginIndex, autoCount);
	}

	public void setObjResult(final List<Object[]> objResult) {
		this.objResult = objResult;
	}

	private void setPageConfig(final int pageSize, final int beginIndex, final boolean autoCount){
		setPageSize(pageSize);
		setPage(getBeginIndex() / pageSize + 1);
		this.autoCount = autoCount;
	}

	public void setPage(int page) {
		this.page = page;

		if (page < 1) {
			this.page = 1;
		}
	}

	public void setPageSize(final int pageSize) {
		this.pageSize = pageSize;

		if (pageSize < MIN_PAGESIZE) {
			this.pageSize = MIN_PAGESIZE;
		}
		if (pageSize > MAX_PAGESIZE) {
			this.pageSize = MAX_PAGESIZE;
		}
	}

	public void setPageSizeDirect(final int pageSize) {
		this.pageSize = pageSize;
	}
	
	public void setResult(final List<T> result) {
		this.result = result;
	}

	public void setTotalCount(final long totalCount) {
		this.totalCount = totalCount;
	}

	public String getSf_LIKE_query() {
		return sf_LIKE_query;
	}

	public void setSf_LIKE_query(String sf_LIKE_query) {
		this.sf_LIKE_query = sf_LIKE_query;
	}

	public Corporation getSf_EQ_corporation() {
		return sf_EQ_corporation;
	}

	public void setSf_EQ_corporation(Corporation sf_EQ_corporation) {
		this.sf_EQ_corporation = sf_EQ_corporation;
	}

	public String getSf_EQ_id() {
		return sf_EQ_id;
	}

	public void setSf_EQ_id(String sf_EQ_id) {
		this.sf_EQ_id = sf_EQ_id;
	}

	public boolean isSf_EQ_active() {
		return sf_EQ_active;
	}

	public void setSf_EQ_active(boolean sf_EQ_active) {
		this.sf_EQ_active = sf_EQ_active;
	}

	public String getSumFields() {
		return sumFields;
	}
	
	public String[] getSumFieldArray() {
		if (Strings.isEmpty(sumFields)) return null;
		
		return sumFields.split(",");
	}
	
	public void setSumFields(String sumFields) {
		this.sumFields = sumFields;
	}

	public Map<String, Object> getSumFieldsMap() {
		return sumFieldsMap;
	}

	@Override
	public int getPageNumber() {
		return page;
	}

	@Override
	public long getOffset() {
		return (page - 1) * pageSize;
	}

	@Override
	public Sort getSort() {
		return sort;
	}
	
	public void setSort(Sort sort) {
		this.sort = sort;
	}
	
	public void setSortObj(Sort sort) {
		this.sort = sort;
	}

	@Override
	public Pageable next() {
		return null;
	}

	@Override
	public Pageable previousOrFirst() {
		return null;
	}

	@Override
	public Pageable first() {
		return null;
	}

	@Override
	public boolean hasPrevious() {
		return false;
	}
	
	public JSONObject toJSONObject() {
		JSONObject jo = new JSONObject();
		Class<?> subC = this.getClass();
		while(subC != null && !subC.equals(PageInfo.class)) {
			Field[] subFields = subC.getDeclaredFields();
			for (Field sf : subFields) {
				String name = sf.getName();
				Object value = EntityReflectionUtils.getFieldValue(this, name);
				if(value == null) continue;
				
				if(value instanceof IEntity) {
					jo.put(name, ((IEntity) value).getId());
					jo.put(name + "Text", ((IEntity) value).getDisplayString());
				} else if(value instanceof IEnum) {
					jo.put(name, ((IEnum) value).getName());
				} else if(value instanceof Date) {
					jo.put(name, FormatUtils.formatDate((Date) value));
				} else if(value instanceof Collection) {
					continue ;
				} else {
					jo.put(name, value);
				}
				
			}
			subC = subC.getSuperclass();
		}
		if(subC != null && subC.equals(PageInfo.class)) {
			jo.put("sf_EQ_id", this.getSf_EQ_id());
			jo.put("sf_LIKE_query", this.getSf_LIKE_query());
			jo.put("sf_EQ_corporation", FormatUtils.idString(getSf_EQ_corporation()));
			jo.put("sf_EQ_corporationText", FormatUtils.stringValue(getSf_EQ_corporation()));
		}
		return jo;
	}
	
	public List<PropertyFilter> getHeaderFilter4PF() {
		List<PropertyFilter> pfList = Lists.newArrayList();
		if (!Strings.isEmpty(getFilter())) {
			try {
				JSONArray ar = new JSONArray(getFilter());
				MatchType mt = null;
				for (int i = 0; i < ar.length(); i++) {
					JSONObject obj = ar.getJSONObject(i);
					String pro = obj.getString("property");
					if(pro.startsWith("sf_EQ_")) {
						mt = MatchType.EQ;
						pro = Strings.replace(pro, "sf_EQ_", "");
					} else if(pro.startsWith("sf_LIKE_")) {
						pro = Strings.replace(pro, "sf_LIKE_", "");
						mt = MatchType.LIKE;
					} else if(pro.startsWith("sf_START_")) {
						pro = Strings.replace(pro, "sf_START_", "");
						mt = MatchType.START;
					}
					PropertyFilter pf = new PropertyFilter(pro, obj.getString("value"), mt);
					pfList.add(pf);
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return pfList;
	}
	
	public List<Predicate> getHeaderFilters(Root<T> root, CriteriaBuilder cb) {
		List<Predicate> predicates = Lists.newArrayList();
		if(!Strings.isEmpty(getFilter())) {
			JSONArray ar;
			try {
				ar = new JSONArray(getFilter());
				MatchType mt = null;
				for (int i = 0; i < ar.length(); i++) {
					JSONObject obj = ar.getJSONObject(i);
					String pro = obj.getString("property");
					if(pro.startsWith("sf_EQ_")) {
						mt = MatchType.EQ;
						pro = Strings.replace(pro, "sf_EQ_", "");
					} else if(pro.startsWith("sf_LIKE_")) {
						pro = Strings.replace(pro, "sf_LIKE_", "");
						mt = MatchType.LIKE;
					} else if(pro.startsWith("sf_START_")) {
						pro = Strings.replace(pro, "sf_START_", "");
						mt = MatchType.START;
					}
					predicates.add(AppUtils.buildPredicate(root, cb, pro, obj.getString("value"), mt));
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return predicates;
	}
	
	public Collection<PropertyFilter> toSearchFilters() {
		List<PropertyFilter> filters = new ArrayList<>();
		Collection<Field> fields = getSearchFields();
		for (Field field : fields) {
			String name = field.getName();
			Object value = EntityReflectionUtils.getFieldValue(this, name);
			
			if(value == null) continue;
			
			Collection<PropertyFilter> newFilters = parseSearchFilter(name, value);
			if(newFilters != null) {
				filters.addAll(newFilters);
			}
		}
		return filters;
	}
	
	protected Collection<PropertyFilter> parseSearchFilter(String name, Object value) {
		String[] parameters = name.split("_");
		if(parameters == null || parameters.length != 3) return null;
		try {
			MatchType matchType = MatchType.valueOf(parameters[1]);
			return parseSearchFilter(parameters[2], value, matchType);
		} catch (Exception e) {
			logger.error(name + " is not a valid search filter name [" + e.getMessage() + "]");
			return null;
		}
	}
	
	protected Collection<PropertyFilter> parseSearchFilter(String name, Object value, MatchType matchType) {
		List<PropertyFilter> filters = new ArrayList<>();
		if("query".equals(name)) {
			filters.add(new PropertyFilter(getQueryFieldNames(), value, matchType));
		} else if("filter".equals(name)) {
			if(!Strings.isEmpty(getFilter())) {
				JSONArray ar;
				try {
					ar = new JSONArray(getFilter());
					for (int i = 0; i < ar.length(); i++) {
						JSONObject obj = ar.getJSONObject(i);
						filters.add(new PropertyFilter(obj.getString("property"), obj.getString("value"), MatchType.LIKE));
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
		} else if("dateType".equals(name)) {
			filters.add(new PropertyFilter((String) value, EntityReflectionUtils.getFieldValue(this, "dateStart"), MatchType.GTE));
			filters.add(new PropertyFilter((String) value, EntityReflectionUtils.getFieldValue(this, "dateEnd"), MatchType.LTE));
		} else {
			filters.add(new PropertyFilter(name, value, matchType));
		}
		return filters;
	}
	
	/**
	 * you can override this method to make different fields for the query purpose
	 * @return
	 */
	protected String[] getQueryFieldNames() {
		return new String[]{"code", "name"};
	}
	
	protected Collection<Field> getSearchFields() {
		List<Field> fields = new ArrayList<>();
		Class<?> subC = this.getClass();
		while(subC != null && !subC.equals(Object.class)) {
			Field[] subFields = subC.getDeclaredFields();
			for (Field sf : subFields) {
				String name = sf.getName();
				if(name.startsWith("sf_")) {
					fields.add(sf);
				}
			}
			subC = subC.getSuperclass();
		}
		return fields;
	}

	public String getFilter() {
		return filter;
	}

	public void setFilter(String filter) {
		this.filter = filter;
	}
}