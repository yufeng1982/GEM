/**
 * @class Erp.app.Portlet
 * @extends Ext.Panel
 * A {@link Ext.Panel Panel} class that is managed by {@link Ext.app.PortalPanel}.
 */
Ext.define('ERP.ui.Portlet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portlet',
    layout: 'fit',
    anchor: '100%',
    frame: true,
    stateful :true,
    stateSeq:'',
    closable: false,
    collapsible: true,
    animCollapse: true,
    draggable:  {
        moveOnDrag: false,
        afterDragDrop : function(e1){
        	if(this.panel.stateful){
        		this.panel.saveAllPorletsState();
        	}
        }
    },

    cls: 'x-portlet',

    // Override Panel's default doClose to provide a custom fade out effect
    // when a portlet is removed from the portal
    doClose: function() {
        if (!this.closing) {
            this.closing = true;
            this.el.animate({
                opacity: 0,
                callback: function(){
                    this.fireEvent('close', this);
                    this[this.closeAction]();
                },
                scope: this
            });
        }
    },
    getState : function(inx, isDrag){
    	var state = this.callParent();
		state = this.addPropertyToState(state, 'stateSeq', this.stateSeq);
    	return state;
    },
    applyState: function(state){
    	var me = this;
        me.callParent(arguments);
    	if(state && state.stateSeq){
       	 	me.stateSeq =  state.stateSeq;
    	}
    },
    saveAllPorletsState : function(e1){
    	var portlets = Ext.ComponentQuery.query( "panel[isBodyItem=true]");
    	var newPortlets = this.getStateSeq(portlets);
    	for(var i=0; i<newPortlets.length; i++){
    		newPortlets[i].stateSeq =  i + 1;
    		newPortlets[i].saveState();
    	}
    }
    ,
    getStateSeq : function(portlets){
    	var temp;
    	for(var i=0; i<portlets.length; i++){
    		for(var j=0; j<portlets.length-i-1; j++){
    			if(portlets[j].getY() > portlets[j+1].getY()){
    				temp = portlets[j];
    				portlets[j] = portlets[j+1];
    				 portlets[j +1] = temp;
    			}
    		}
    	}
    	return portlets;
    }
});
