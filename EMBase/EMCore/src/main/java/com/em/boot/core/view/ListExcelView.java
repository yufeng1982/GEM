package com.em.boot.core.view;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.util.Assert;

import com.em.boot.core.utils.Strings;

public class ListExcelView extends AbstractErpExcelView {
	
	private JSONArray columnConfig;
	
	private JSONArray dataJSONArray;
	
	private List<String> headerIdArray = new ArrayList<String>();
	
	final int headerRowNum = 0;
	
	public ListExcelView(JSONArray columnConfigJSONArray, JSONArray orderingDocumentJSONArray){
		super();
	
		Assert.notNull(columnConfigJSONArray);
		Assert.notNull(orderingDocumentJSONArray);
		
		columnConfig = columnConfigJSONArray;
		dataJSONArray = orderingDocumentJSONArray;
	}
	
	@Override
	public void buildExcelWorkBook(HSSFWorkbook workBook, Map<String, Object> map) {
		Sheet sheet = workBook.createSheet();
		generateHeaderRow(workBook, sheet, getColumnConfig());
		
		if(getDataJSONArray() != null && getDataJSONArray().length() > 0) {
			generateDatasRowByArray(sheet);
			return;
		}
	}

	@SuppressWarnings("rawtypes")
	private void generateDatasRowByArray(Sheet sheet) {
		boolean isNumber = false;
		int columnType = Cell.CELL_TYPE_STRING;
		String col = null;
		for (int i = 0; i < getDataJSONArray().length(); i++) {
			JSONObject orderJSONObject = (JSONObject) getDataJSONArray().get(i);
			Row row = createRow(sheet, i + 1);
			for (short k = 0; k < getColumnConfig().length(); k++) {
				JSONObject headerObj = getColumnConfig().getJSONObject(k);
				isNumber = false;
				for (Iterator iterator = headerObj.keys(); iterator.hasNext();) {
					String key = (String) iterator.next();
					if("columnType".equals(key)) {
						if(isNumber(headerObj.getString(key))) {
							columnType = Cell.CELL_TYPE_NUMERIC;
							isNumber = true;
						}
					} else {
						col = key;
					}
				}
				
				if(!orderJSONObject.has(col) || orderJSONObject.get(col) == null){
					continue;
				}
				
				Object object = orderJSONObject.get(col);
				
			    Cell cell = createCell(row, k, columnType);
				
				if(isNumber && object != null && !Strings.isEmpty(object.toString())) {
					cell.setCellValue(new Double(object.toString()));
				} else {
					cell.setCellValue(new HSSFRichTextString(object == null ? "" : object.toString()));
				}
			}
		}
	}
	
	private boolean isNumber(String type) {
		if("number".equals(type) || "integer".equals(type)) {
			return true;
		}
		return false;
	}
	@SuppressWarnings("rawtypes")
	private void generateHeaderRow(HSSFWorkbook workBook, Sheet sheet, JSONArray columnConfigJSONObject) {
		
		CellStyle center = workBook.createCellStyle();
		center.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		int columnType = Cell.CELL_TYPE_STRING;
		String col = null, text = null;
		short width = 15;
		sheet.setDefaultColumnWidth(width);
		Row headerRow = createRow(sheet, headerRowNum);
		for (short i = 0; i < columnConfigJSONObject.length(); i++) {
			JSONObject headerObj = columnConfigJSONObject.getJSONObject(i);
			for (Iterator iterator = headerObj.keys(); iterator.hasNext();) {
				String key = (String) iterator.next();
				if("columnType".equals(key)) {
//					if(isNumber(headerObj.getString(key))) {
//						columnType = Cell.CELL_TYPE_NUMERIC;
//					}
				} else {
					col = key;
					text = headerObj.getString(key);
				}
			}
			
			headerIdArray.add(col);
			
		    Cell cell = createCell(headerRow, i, columnType);
			cell.setCellValue(new HSSFRichTextString(text));
			cell.setCellStyle(center);
		}
	}

	public JSONArray getColumnConfig() {
		return columnConfig;
	}

	public void setColumnConfig(JSONArray columnConfig) {
		this.columnConfig = columnConfig;
	}

	public JSONArray getDataJSONArray() {
		return dataJSONArray;
	}

	public void setDataJSONArray(JSONArray dataJSONArray) {
		this.dataJSONArray = dataJSONArray;
	}
}
