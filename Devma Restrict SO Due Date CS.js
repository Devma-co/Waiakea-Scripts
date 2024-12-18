/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

/**
  Name        : Devma | Restrict SO Due Date CS
  Type        : Client
  Event       : Field Change
  Author      : Devma - Nazish
  Date        : 11-Nov-2023
  Description : This script is used for Due Date validation on sales order so that Due Date selected must be greater than 10 days from today otherwise it defaults Due Date as empty. This will trigger only if order is being created by Customer Center role.
  Version     : 1.00
  
  Script History :

 ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Requested By           Modified By         Request Date      Delivered Date   Description  
 ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Waiakea                Nazish              11-Nov-2023
 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
 */


define(['N/record','N/error','N/search','N/currentRecord','N/runtime'],
    function(record,error,search,currentRecord,runtime) {
	 function fieldChanged(context) {
		  var currRecord = context.currentRecord;
	      if(context.fieldId == 'custbody8') 
           {
			try{
	         var currentRole=runtime.getCurrentUser().role+'';
             log.debug('Internal ID of current user role:',currentRole)
             var dueDate = currRecord.getValue({ fieldId: 'custbody8' });
			 log.debug('dueDate',dueDate)
              if((dueDate != null && dueDate != '') && (currentRole == '14' || currentRole == '1057' || currentRole == '1058')){
			  var today = new Date()
			  var toDate = new Date()
		      toDate.setDate(toDate.getDate() + 10);
			  log.debug('toDate',toDate)
			  //var datesDiff = dateDiffInDays(dueDate, toDate)+1;
              //log.debug('datesDiff',datesDiff)
			  var dueDay = dueDate.getDate();
              var dueMonth = dueDate.getMonth();
              var dueYear = dueDate.getFullYear();
			  var dueDate = new Date(dueYear, dueMonth, dueDay, 0, 0, 0);
			   log.debug('New dueDate',dueDate)
			  var endDay = toDate.getDate();
              var endMonth = toDate.getMonth();
              var endYear = toDate.getFullYear();
			  var endDate = new Date(endYear, endMonth, endDay, 0, 0, 0);
			   log.debug('New endDate',endDate)
              var endDateTime = endDate.getTime();
              var dueDateTime = dueDate.getTime();
              log.debug('dueDateTime',dueDateTime)
              log.debug('endDateTime',endDateTime)
               if((parseInt(dueDateTime) < parseInt(endDateTime)) ||  (parseInt(dueDateTime) == parseInt(endDateTime))){
                 alert("Earliest Due Date selected must be greater than 10 days from today, Please adjust due date accordingly.")
                currRecord.setValue('custbody8','');
               }
              }
			}catch(e)
			{
				log.debug('Error',e.message)
			}
           }
   
		 }
	 return{
		 fieldChanged:fieldChanged		 
	 }
	 // a and b are javascript Date objects
function dateDiffInDays(a, b) {
	var MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}
});