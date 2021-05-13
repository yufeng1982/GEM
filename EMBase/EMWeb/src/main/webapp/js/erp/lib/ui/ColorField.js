Ext.namespace('Erp.common.ext.util');

Erp.common.ext.util.initColorField = function(config){
	
	var trigger = new Ext.form.field.Trigger({
		id : config.id,
		name : config.path,
		renderTo : config.renderTo,
		tabIndex : config.tabIndex,
		triggerCls : 'colorTriggerBtn',
		disabled : config.disabled,
		editable : false,
		value : config.value,
		showHexValue : config.showHexValue ? true : false,
		fieldStyle : {
			'background-color': (Ext.isIE ? '' : '#') + config.value,
			'background-image': 'none'
		}
	});
	
	trigger.onTriggerClick = function(){
		if(this.disabled){
			return;
	    }
		if(!this.menu){
			this.menu = new Ext.picker.Color({
			    renderTo: config.id
			    ,style: {//css hack for chrome/firefox
                    marginLeft: Ext.isIE ? '0px' : '140px'
                }
			});
		    this.menu.show();
		}
		else{
			this.menu.destroy();
			this.menu = null;
			return;
		}
	  
		this.menu.on('select', function(picker, selColor){
			trigger.setValue(selColor);
			$("H_"+trigger.id).value = selColor;
			trigger.setFieldStyle( {
				'background-color': '#' + selColor,
				'background-image': 'none'
			});
			
//			if(trigger.showHexValue){
//				trigger.setFieldStyle({
//					'text-indent': '-100px'
//				});
//				if(Ext.isIE) {
//					trigger.setFieldStyle({
//						'margin-left': '100px'
//					});
//				}
//			}
			
			picker.destroy();
			trigger.menu = null;
		});
	};
	
//	trigger.on('blur', function(field){ 
//	if(this.menu){
//		trigger.menu.destroy();
//		trigger.menu = null;
//	}
//});
}