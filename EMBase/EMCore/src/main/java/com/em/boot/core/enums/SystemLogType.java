/**
 * 
 */
package com.em.boot.core.enums;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;



import com.em.boot.core.model.IEnum;
import com.em.boot.core.utils.ResourceUtils;

/**
 * @author YF
 *
 */
public enum SystemLogType implements IEnum {
	System, PriceChanged, Default, InternationTrade, DocumentPrint, DocumentEmail, DocumentExportXmlError, 
	ReplenishmentChanged, CostChanged, SalesOrderLineChanged, SalesOrderChanged, StatusChanged, PlantNull;
	
	public static EnumSet<SystemLogType> getSystemLogTypes() {
		return EnumSet.allOf(SystemLogType.class);
	}
	
	SystemLogType() {}

	public String getKey() {
		return new StringBuffer().append("SystemLogType.").append(name()).toString();
	}

	public String toString() {
		return getKey();
	}
	public String getText() {
		return ResourceUtils.getText(getKey());
	}
	
	public static List<SystemLogType> get4SalesOrder() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);
		list.add(SystemLogType.SalesOrderChanged);
		return list;
	}
	public static List<SystemLogType> get4PurchaseOrder() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);		
		return list;
	}
	public static List<SystemLogType> get4ReturnOrder() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);		
		return list;
	}
	public static List<SystemLogType> get4SalesInvoice() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);
		return list;
	}
	public static List<SystemLogType> get4PurchaseInvoice() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		//list.add(SourceEntityLogType.DocumentEmail);
		return list;
	}
	public static List<SystemLogType> get4CreditNote() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);
		return list;
	}
	public static List<SystemLogType> get4Shipment() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentEmail);
		return list;
	}
	public static List<SystemLogType> get4DCPurchaseOrder() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.DocumentPrint);
		list.add(SystemLogType.DocumentEmail);		
		list.add(SystemLogType.InternationTrade);
		return list;
	}
	public static List<SystemLogType> get4Item() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		list.add(SystemLogType.PriceChanged);
		list.add(SystemLogType.ReplenishmentChanged);
		list.add(SystemLogType.CostChanged);
		return list;
	}
	public static List<SystemLogType> get4Common() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		return list;
	}
	public static List<SystemLogType> get4Truckload() {
		List<SystemLogType> list = new ArrayList<SystemLogType>();
		list.add(SystemLogType.StatusChanged);
		return list;
	}

	@Override
	public String getName() {
		return name();
	}
}
