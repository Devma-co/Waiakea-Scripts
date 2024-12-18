/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

 define(['N/record','N/log','N/url','N/redirect'], function(record,log,url,redirect) {
    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW)
        {
        var Rec_id = context.newRecord.id;
           var objForm = context.form;
		 var type = context.newRecord.type;
		  var suiteletURL = url.resolveScript({scriptId: 'customscript_devma_update_so_qty_sl',deploymentId: 'customdeploy_devma_update_so_qty_sl',returnExternalUrl: false});                        
	 
          suiteletURL +='&recID='+Rec_id+'&type='+type; 
            objForm.addButton ({
                id: 'custpage_update_so_qty',
                label: 'Update SO Qty',
              functionName: 'window.open(\''+suiteletURL+'\',\'_self\')'
            });
          }
        
    }
   
    return {
        beforeLoad: beforeLoad
    }
});