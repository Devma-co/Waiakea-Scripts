/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

/**
 Name        : Devma | Customer Center SO Status UE
 Type        : User Event
 Event       : After Submit
 Author      : Devma - Nazish
 Date        : 07-Nov-2023
 Description : This script updates sales order status as "Pending Approval" if order is created from customer center role
 Version     : 1.00
 
 Script History :

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Requested By           Modified By         Request Date      Delivered Date   Description  
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Waiakea                Nazish              07-Nov-2023
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
*/


define(['N/record', 'N/error', 'N/search','N/runtime'],
  function (record, error, search, runtime) {
    function afterSubmitOfInv(context) {
      if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.COPY) {
        try {
          var currentRole=runtime.getCurrentUser().role+'';
             log.debug('Internal ID of current user role:',currentRole)
          var soRec = context.newRecord;
          var recId = soRec.id;
          var recType = soRec.type;
          var currRec = record.load({
            type: recType,
            id: recId,
            isDynamic: true
          });
          				var ssFilters =
							 [
                       ["mainline","is","T"], 
                       "AND", 
                       ["type","anyof","SalesOrd"], 
                      "AND", 
                      ["source","anyof","customerCenter"], 
                      "AND", 
                       ["datecreated","onorafter","10/31/2023 12:00 am"], 
                        "AND", 
                        ["internalid","anyof",recId]
                     ]

						var columns =
							[
                 search.createColumn({
         name: "trandate",
         sort: search.Sort.ASC,
         label: "Date"
      }),
      search.createColumn({name: "print", label: "Print"}),
      search.createColumn({name: "type", label: "Type"}),
      search.createColumn({name: "payrollbatch", label: "Payroll Batch"}),
      search.createColumn({
         name: "tranid",
         sort: search.Sort.ASC,
         label: "Document Number"
      }),
      search.createColumn({name: "transactionnumber", label: "Transaction Number"}),
      search.createColumn({name: "entity", label: "Name"}),
      search.createColumn({name: "account", label: "Account"}),
      search.createColumn({name: "otherrefnum", label: "PO/Check Number"}),
      search.createColumn({name: "statusref", label: "Status"}),
      search.createColumn({name: "trackingnumbers", label: "Tracking Numbers"}),
      search.createColumn({name: "memo", label: "Memo"}),
      search.createColumn({name: "amount", label: "Amount"}),
      search.createColumn({name: "posting", label: "Posting"}),
      search.createColumn({name: "custbodyiqityscrappedmoved", label: "Scrap Moved"}),
      search.createColumn({name: "custbodyiqfwodeliverydate", label: "Delivery Date"}),
      search.createColumn({name: "custbody_am_workorder_text", label: "AM Work Order Code"}),
      search.createColumn({name: "custbody_am_production_unitstype", label: "Production Units Type"}),
      search.createColumn({name: "custbody_am_production_units", label: "Production Units"}),
      search.createColumn({name: "custbody_am_production_unitsqty", label: "Quantity in Production Units"}),
      search.createColumn({name: "custbody_createdfrom_expensify", label: "Created From"}),
      search.createColumn({name: "custbodyintegrationstatus", label: "Integration Status"}),
      search.createColumn({name: "custbody_sps_acknowledgement_status", label: "Acknowledgement Status"}),
      search.createColumn({name: "custbody_sps_ponum_from_salesorder", label: "Related PO #"}) ,
      search.createColumn({name: "custbody_kk_approvedby", label: "Approved By"})
               ]

            var searchResults = getSearchResults('transaction', ssFilters, columns)
            log.debug('searchResults.length', searchResults.length); 
            if (searchResults != null && searchResults != '' && searchResults.length > 0) {
             currRec.setValue('orderstatus', 'A')
            var soRecID = currRec.save({ enableSourcing: false, ignoreMandatoryFields: true });
            log.debug('Order Status updated successfully', 'Id: ' + soRecID); 
           
            }
        } catch (e) {
        log.debug('unexpected error', e.message)

      }
    }
  }

    return {
  afterSubmit: afterSubmitOfInv
};
function getSearchResults(rectype, fils, cols) {
  var mySearch = search.create({
    type: rectype,
    columns: cols,
    filters: fils
  });
  var resultsList = [];
  var myPagedData = mySearch.runPaged({ pageSize: 1000 });
  myPagedData.pageRanges.forEach(function (pageRange) {
    var myPage = myPagedData.fetch({ index: pageRange.index });
    myPage.data.forEach(function (result) {
      resultsList.push(result);
    });
  });
  return resultsList;
}
  }); 