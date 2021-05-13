var PRes = [];
PRes['Warning']='${f:getText('Com.Warning')}';
PRes["new"] = "${f:getText('Com.New')}";
PRes["ok"] = "${f:getText('Com.Ok')}";
PRes["yes"] = "${f:getText('Com.Yes')}";
PRes["no"] = "${f:getText('Com.No')}";
PRes["cancel"] = "${f:getText('Com.Cancel')}";
PRes["close"] = "${f:getText('Com.Close')}";
PRes["apply"] = "${f:getText('Com.Apply')}";
PRes["save"] = "${f:getText('Com.Save')}";
PRes["add"] = "${f:getText('Com.Add')}";
PRes["delete"] = "${f:getText('Com.Delete')}";
PRes["general"] = "${f:getText('Com.General')}";
PRes["Alert.WeCannotProcessYourRequest"] = "${f:getText('Alert.WeCannotProcessYourRequest')}";
PRes["pagingDisplay"] = "${f:getText('Com.Record.DisplayMsg')}";
PRes["pagingNoRecord"] = "${f:getText('Com.NoRecord.DisplayMsg')}";
PRes["search"] = "${f:getText('Com.Search')}";
PRes["print"] = "${f:getText('Com.Print')}";
PRes["batchPrint"] = "${f:getText('Com.BatchPrint')}";
PRes["email"] = "${f:getText('Com.Email')}";
PRes["Alert.Thickness"] = " is an invalid thickness value, max value : 1.9999";
PRes["export"] = "${f:getText('Com.Export')}";
PRes["reset"] = "${f:getText('Com.Reset')}";
PRes["report"] = "${f:getText('Com.Report')}";
PRes["view"] = "${f:getText('Com.View')}";
PRes["Checking"] = "${f:getText('Com.Checking')}";
PRes["Saving"] = "${f:getText('Com.Saving')}";
// validate
PRes["Column"] = "${f:getText('Com.Column')}";
PRes["InLine"] = "${f:getText('Com.InLine')}";
PRes["AndLine"] = "${f:getText('Com.AndLine')}";
PRes["Line"] = "${f:getText('Com.Line')}";
PRes["SameValue"] = "${f:getText('Com.SameValue')}";
PRes["UniqueValue"] = "${f:getText('Com.UniqueValue')}";
PRes["NotEmpty"] = "${f:getText('Com.Validate.NotEmpty')}";
PRes["ColumnValueUnique"] = "${f:getText('Com.Validate.ColumnValueUnique')}";
PRes["CodeV"] = "${f:getText('Com.Code')}";
PRes["CodeVM"] = "${f:getText('Com.Validate.isExist')}";
PRes['AtLine'] = "${f:getText('Com.AtLine')}";
PRes['File'] = "${f:getText('Com.File')}";

PRes["name"] = "${f:getText('Com.Name')}";
PRes["code"] = "${f:getText('Com.Code')}";
PRes["description"] = "${f:getText('Com.Description')}";
PRes["PositiveNumber"] = "${f:getText('Com.PositiveNumber')}";

PRes["ExcelBtn"] = "${f:getText('Report.Btn.Excel')}";
PRes["PdfBtn"] = "${f:getText('Report.Btn.Pdf')}";

Ext.BLANK_IMAGE_URL = "/images/blank.gif";
Ext.form.field.Date.prototype.format = 'Y-m-d';
Ext.toolbar.TextItem.prototype.bindStore = Ext.emptyFn; // hack for display SearchingSelect, replace pagingToolBar by this one
Ext.data.Types.FLOAT.convert=function(v){
        return v !== undefined && v !== null && v !== '' ?
            parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';
};
Ext.data.Types.INT.convert=function(v){
    return v !== undefined && v !== null && v !== '' ?
            parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';
};
Ext.require('Ext.view.AbstractView',
    function() {
        Ext.override(Ext.view.AbstractView, {
            /**
             * Override to bind the mask to our store.
             * Not great, but simple.
             * See: http://www.sencha.com/forum/showthread.php?198680-ext-4.1-Load-mask-on-grid-gone
             */
            onRender: function() {
                var me = this;
                me.callOverridden(arguments);
                if (me.loadMask && Ext.isObject(me.store)) {
                    me.setMaskBind(me.store);
                }
            }
        });
    }
);
/** Nova Event handler end */

var DEFAULT_PAGE_SIZE = "${f:getAppSetting('app.page.default.size')}";
var SEQ_MULTIPLE = 1;
var DEFAULT_S_WIDTH = 160; // you can reset it if you page need more narrower or wider select field
var DEFAULT_SS_WIDTH = 160; // you can reset it if you page need more narrower or wider searching select field
var DEFAULT_DATE_WIDTH = 160; // you can reset it if you page need more narrower or wider date field

var DEFAULT_NEW_ID = "NEW";
var GRID_ID = "GRID_ID";
var G_CONFIG = {}; // this is for main grid of the page
var IS_PAGE_MODIFIED = false;

var CUtils = new ERP.CommonUtils();
var GUtils = new ERP.GridUtils();
var VUtils = new ERP.ValidatorUtils();
var LUtils = new ERP.LauncherUtils();

var PApp;
var PAction;
var isTargetWindow = false;

var workflowControllerBtn;
var btnCreate;