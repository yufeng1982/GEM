/**
 * @class Erp.app.CheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
var grid = Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
           text: 'Foo',
           ...
        },{
           xtype: 'checkcolumn',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
        }
    ]
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Erp.app.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    config : null,
    constructor: function(cfg) {
    	if(cfg.id && !cfg.dataIndex){
			cfg.dataIndex = cfg.id;
		}
    	cfg.id = cfg.gridId + "_" + cfg.id;
    	this.config = cfg;
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Erp.app.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Process and re-fire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
    	if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
    		// when the grid can edited then set value and fire event
        	if(this.config.editable){
        		var record = view.panel.store.getAt(recordIndex),
                	dataIndex = this.dataIndex,
                	checked = !record.get(dataIndex);
                var obj = {'grid':view.panel,'record':record,'field':dataIndex,'value':!checked,'originalValue':checked,rowIdx:recordIndex,colIdx:cellIndex};
                //Fire 'beforeedit', return false then do nothing;
                var isEditable = view.panel.fireEvent('beforeedit',this, obj);
                if(isEditable){
                	record.set(dataIndex, checked);
                    this.fireEvent('checkchange', this, recordIndex, checked);
                    
                    // fire grid's cell edit event
                    view.panel.fireEvent('edit',this, obj);
                }
            }
        	return true;
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
