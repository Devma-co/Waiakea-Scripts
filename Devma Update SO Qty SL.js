define(["N/ui/dialog", 'N/ui/serverWidget', 'N/search', 'N/redirect', 'N/record', "N/url",
  "N/http", "N/https", "N/ui/message", "N/format", 'N/render', 'N/file'],

  function (dialog, serverWidget, search, redirect, record, url, http, https, message, format, render, file) {

    /**
     * Module Description...
     *
     * @exports XXX
     *
     * @copyright 2019 ${organization}
     * @author ${author} <${email}>
     *
     * @NApiVersion 2.x
     * @NScriptType Suitelet
     */
    var exports = {};

    /**
     * <code>onRequest</code> event handler
     *
     * @governance XXX
     *
     * @param context
     *        {Object}
     * @param context.request
     *        {ServerRequest} The incoming request object
     * @param context.response
     *        {ServerResponse} The outgoing response object
     *
     * @return {void}
     *
     * @static
     * @function onRequest
     */




    function onRequest(context) {
      var request = context.request;
      var response = context.response;
      var transPrintid = (context.request.parameters.recID);
      var type = (context.request.parameters.type);
      renderRecordToPdfWithTemplate(context, transPrintid, type);

    }



    function renderRecordToPdfWithTemplate(context, recId, recType) {
      try {
        var response = context.response;
        var currRec = record.load({
          type: recType,
          id: recId,
          isDynamic: true
        });
        var soCount = currRec.getLineCount('item');
        for (var i = 0; i < soCount; i++) {
          var itemId = currRec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i })
          var itemUnit = currRec.getSublistValue({ sublistId: 'item', fieldId: 'units_display', line: i })
          var quantity = currRec.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i })
          var itemPrice = currRec.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i })
          log.debug('itemUnit', itemUnit);
          if (itemUnit != null && itemUnit != '') {
            //itemUnit = itemUnit.split('(');
            //itemUnit = itemUnit[0];
              var spsConersion = fetchSPS_Conersion(itemId)
              log.debug('spsConersion', spsConersion);
              if(spsConersion != null && spsConersion != '')
              {
              if(quantity == null || quantity == '')
                quantity=0;
                 if(itemPrice == null || itemPrice == '')
                itemPrice=0;
              var itemQty = quantity / spsConersion
              var itemPrice =  itemPrice * spsConersion
              if(itemQty == 'NaN' || itemQty == null || itemQty == '')
                itemQty=0;
                
              itemQty = parseFloat(itemQty).toFixed(2);
              itemPrice = parseFloat(itemPrice).toFixed(2);
              log.debug('quantity', quantity);
              log.debug('itemQty', itemQty);
              log.debug('itemPrice', itemPrice); 
              currRec.selectLine({ sublistId: 'item', line: i });
              currRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: itemQty });
              currRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'price', value: -1 });
              currRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: itemPrice });
              currRec.commitLine({ sublistId: 'item' });

            }

          }
        }
         var soRecordID = currRec.save({ enableSourcing: false, ignoreMandatoryFields: true });

        response.sendRedirect({
          type: http.RedirectType.RECORD,
          identifier: recType,
          id: recId
        });
      } catch (e) {
        log.debug('unexpected error', e.message)
      }


    }

    exports.onRequest = onRequest;
    return exports;
    function fetchSPS_Conersion(itemId) {
      var itemFilts = []
      itemFilts.push({ name: 'internalid', operator: 'anyof', values: [itemId] });
      itemFilts.push({ name: 'type', operator: 'anyof', values: ['InvtPart','Assembly'] });
      itemFilts.push({ name: 'isinactive', operator: 'is', values: "F" });
      var itemCols = []
      itemCols.push(search.createColumn({ name: 'custitem_sps_conversion' }));

      var spsConersion;
      var itemSearchResult = getSearchResults('item', itemFilts, itemCols)
      if (itemSearchResult != null && itemSearchResult != '') {
        spsConersion = itemSearchResult[0].getValue('custitem_sps_conversion');
      }
      return spsConersion;

    }
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



  }
);