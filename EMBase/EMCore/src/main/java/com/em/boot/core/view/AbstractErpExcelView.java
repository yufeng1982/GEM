package com.em.boot.core.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFPalette;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import com.em.boot.core.utils.Strings;


public abstract class AbstractErpExcelView extends AbstractExcelView{

	public abstract void buildExcelWorkBook(HSSFWorkbook workBook, Map<String, Object> map);
	
	@Override
	public void buildExcelDocument(Map<String, Object> map,
			HSSFWorkbook workBook, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		
		if(map.containsKey("fileName") && !Strings.isEmpty((String)map.get("fileName"))){
			response.setHeader("Content-Disposition", "attachment;Filename=" + map.get("fileName").toString()); 
			map.remove("fileName");
		}
		
		buildExcelWorkBook(workBook, map);
	}
	
	public Cell createCell(Row row, int columnIndex) {
		return createCell(row, columnIndex, Cell.CELL_TYPE_BLANK);
	}
	
	public Cell createCell(Row row, int columnIndex, int columnType) {
		return row.getCell(columnIndex) == null ? row.createCell(columnIndex, columnType) : row.getCell(columnIndex);
	}
	
	public Row createRow(Sheet sheet, int rowIndex) {
		return sheet.getRow(rowIndex) == null ? sheet.createRow(rowIndex) : sheet.getRow(rowIndex);
	}
	
	public CellStyle createNoneBorderCellStyle(HSSFWorkbook workbook, short cellAlign, short groudColor) {
		CellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setFillForegroundColor(groudColor);
		cellStyle.setAlignment(cellAlign);
		cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		
		return cellStyle;
	}
	
	public CellStyle createBorderCellStyle(HSSFWorkbook workbook, short cellAlign, short border, short borderColor, short groudColor) {
		CellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setFillForegroundColor(groudColor);
		cellStyle.setAlignment(cellAlign);
		cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		cellStyle.setBorderBottom(border);
		cellStyle.setBottomBorderColor(borderColor);
		cellStyle.setBorderLeft(border);
		cellStyle.setLeftBorderColor(borderColor);
		cellStyle.setBorderRight(border);
		cellStyle.setRightBorderColor(borderColor);
		cellStyle.setBorderTop(border);
		cellStyle.setTopBorderColor(borderColor);
		cellStyle.setLocked(false);
		
		return cellStyle;
	}
	
	public Font createFont(HSSFWorkbook workbook, short fontSize, short boldweight, String fontName) {
		Font font = workbook.createFont();
		font.setFontHeightInPoints(fontSize);
		font.setBoldweight(boldweight);
		font.setFontName(fontName);
		return font;
	}
	
	public void createCellRangeAddress(HSSFWorkbook workbook, Sheet sheet, String range) {
		sheet.addMergedRegion(CellRangeAddress.valueOf(range));
	}
	
	public void setupPalette(HSSFWorkbook workbook, PaletteHelper... paletteHelpers) {
		HSSFPalette palette = workbook.getCustomPalette();
		
		for (PaletteHelper paletteHelper : paletteHelpers) {
			palette.setColorAtIndex(paletteHelper.getColorIndex(), paletteHelper.getR(), paletteHelper.getG(), paletteHelper.getB());
		}
	}

	public void setDataVal(Object object, Cell cell) {
		if (object instanceof Double) {
			cell.setCellValue(((Double) object).doubleValue());
			return;
		}
		
		if (object instanceof Integer) {
			cell.setCellValue(((Integer) object).intValue());
			return;
		}
		
		if (object instanceof Float) {
			cell.setCellValue(((Float) object).floatValue());
			return;
		}
		
		if (object instanceof Short) {
			cell.setCellValue(((Short) object).shortValue());
			return;
		}
		
		if (object instanceof Long) {
			cell.setCellValue(((Long) object).longValue());
			return;
		}
		
		cell.setCellValue(new HSSFRichTextString(object == null ? "" : object.toString()));
	}
}
