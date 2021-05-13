//http://www.sencha.com/forum/showthread.php?141207-A-remote-storage-priovide-for-state-management&highlight=http+state
/* 
 * File: RemoteStorageProvider.js 
 * Date: 20-Jul-2011 
 * By  : Kevin L. Esteb 
 * 
 * This module provides a state provider that uses remote storage as 
 * the backing store. 
 * 
 *   RemoteStorageProvider.js is free software: you can redistribute 
 *   it and/or modify it under the terms of the GNU General Public License 
 *   as published by the Free Software Foundation, either version 3 of the 
 *   License, or (at your option) any later version. 
 * 
 *   RemoteStorageProvider.js is distributed in the hope that it will be 
 *   useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU 
 *   General Public License for more details. 
 * 
 *   You should have received a copy of the GNU General Public License 
 *   along with RemoteStorageProvider.js. If not, see 
 *   <http://www.gnu.org/licenses/>. 
 * 
 */ 

Ext.define('Ext.ux.state.RemoteStorageProvider', { 
    extend: 'Ext.state.Provider', 
    mixins: { 
        observable: 'Ext.util.Observable' 
    }, 

    store: {}, 
    throttled: false, 
    queue: 10, 
    count: 0, 

    constructor: function(config) { 

       config = config || {}; 
       this.initialConfig = config; 

       Ext.apply(this, config); 

       this.addEvents("statechange");

       this.store = this.storeage(); 

       // Have to block in order to load the store before leaving the 
       // constructor, otherwise, the first query may be against an 
       // empty store. There must be a better way... 

       Ext.data.Connection.prototype.async = false; 

       this.store.load(); 

       Ext.data.Connection.prototype.async = true; 

       this.mixins.observable.constructor.call(this, config); 

    }, 

    set: function(name, value) { 
        var pos, row; 

        if ((pos = this.store.find('name', name)) > -1) { 

            row = this.store.getAt(pos); 
            row.set('value', this.encodeValue(value)); 

        } else { 

            this.store.add({ 
                name: name, 
                value: this.encodeValue(value) 
            }); 

        } 

        this.sync(); 
        this.fireEvent('statechange', this, name, value); 

    }, 

    get: function(name, defaultValue) { 
        var pos, row, value; 

        if ((pos = this.store.find('name', name)) > -1) { 

            row = this.store.getAt(pos); 
            value = this.decodeValue(row.get('value')); 

        } else { 

            value = defaultValue; 

        } 

        return value; 

    }, 

    clear: function(name) { 
        var pos; 

        if ((pos = this.store.find('name', name)) > -1) { 

            this.store.removeAt(pos); 
            this.sync(); 
            this.fireEvent('statechange', this, name, null); 

        } 

    }, 

    sync: function() { 

        if (this.throttled) { 

            if (this.count >= this.queue) { 

                this.count = 0; 
                this.store.sync(); 

            } else { 

                this.count++; 

            } 

        } else { 

            this.store.sync(); 

        } 

    }, 

    storeage: Ext.emptyFn 

});

/* 
 * File: DesktopProvider.js 
 * Date: 19-Jul-2011 
 * By  : Kevin L. Esteb 
 * 
 * This module provides a state provider for the desktop using remote storage. 
 * 
 */ 

Ext.define('ERP.state.HttpProvider', { 
    extend: 'Ext.ux.state.RemoteStorageProvider', 

    app_rootp: '/', 

    storeage: function() { 

        Ext.define('ERPProvider.model.State', { 
            extend: 'Ext.data.Model', 
            idProperty: 'id', 
            fields: [ 
                { name: 'id',    type: 'string'}, 
                { name: 'name',  type: 'string' }, 
                { name: 'value',  type: 'string' }
            ], 
            proxy: { 
                api: { 
                    create:  this.app_rootp + 'state/save', 
                    read:    this.app_rootp + 'state/json', 
                    update:  this.app_rootp + 'state/save', 
                    destroy: this.app_rootp + 'state/destroy' 
                }, 
                type: 'ajax', 
                reader: { 
                    type: 'json', 
                    root: 'data', 
                    totalProperty: 'count', 
                    successProperty: 'success' 
                }, 
                writer: { 
                    type: 'json', 
                    root: 'data', 
                    encode: true 
                } ,
                extraParams : {
                	pageName : this.pageName,
                	scopeObjectType : this.scopeObjectType
                }
            } 
        }); 

        return new Ext.data.Store({ 
            model: 'ERPProvider.model.State' 
        }); 

    } 

});