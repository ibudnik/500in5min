/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.56412048361172, "KoPercent": 7.435879516388287};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.027849605143615907, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01107011070110701, 500, 1500, "tickets/1933/list"], "isController": false}, {"data": [0.055483452303698895, 500, 1500, "news/list?type=Article"], "isController": false}, {"data": [0.0015105740181268882, 500, 1500, "games?type=history"], "isController": false}, {"data": [0.016289893617021278, 500, 1500, "tickets/stadium-ticket?id=2720&gameId=1931"], "isController": false}, {"data": [0.005720053835800807, 500, 1500, "games?type=upcoming"], "isController": false}, {"data": [0.0, 500, 1500, "stream?type=video"], "isController": false}, {"data": [0.014164305949008499, 500, 1500, "stream?type=audio"], "isController": false}, {"data": [0.040983606557377046, 500, 1500, "games/1933"], "isController": false}, {"data": [0.018691588785046728, 500, 1500, "games/1933/events"], "isController": false}, {"data": [0.018578878748370272, 500, 1500, "/tickets/list"], "isController": false}, {"data": [0.10194174757281553, 500, 1500, "news/list?type=Video"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14309, 1064, 7.435879516388287, 13386.484939548553, 68, 44434, 11424.0, 29853.0, 33082.0, 37965.99999999999, 31.518593084368238, 202.3395054789685, 33.840214011968435], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tickets/1933/list", 1084, 0, 0.0, 22141.510147601442, 297, 35608, 24108.0, 32668.0, 34476.5, 35258.75, 2.454404455966761, 4.007069290509561, 2.4999451636458323], "isController": false}, {"data": ["news/list?type=Article", 1541, 0, 0.0, 14446.17650876053, 698, 39053, 9474.0, 35909.2, 37141.4, 38277.899999999994, 3.406526117068663, 32.04470224466528, 4.174990504805832], "isController": false}, {"data": ["games?type=history", 1324, 0, 0.0, 22184.636706948622, 208, 40555, 24775.0, 32886.0, 34149.0, 39846.25, 2.9573176860552643, 32.66283238413636, 3.0670618970612216], "isController": false}, {"data": ["tickets/stadium-ticket?id=2720&gameId=1931", 1504, 0, 0.0, 10373.835106382985, 68, 19663, 11729.5, 15488.5, 16975.5, 19110.6, 3.35190550479162, 5.3382775936037445, 3.489386004011589], "isController": false}, {"data": ["games?type=upcoming", 1486, 0, 0.0, 21743.911843876172, 213, 44434, 24324.5, 34496.299999999996, 39351.84999999999, 43243.979999999996, 3.3132295069174256, 32.21581281145138, 3.4394169588410386], "isController": false}, {"data": ["stream?type=video", 1064, 1064, 100.0, 419.12687969924906, 182, 1918, 401.0, 552.0, 597.75, 859.1499999999955, 2.429306939735379, 3.316033761144788, 2.4743819708437504], "isController": false}, {"data": ["stream?type=audio", 1059, 0, 0.0, 10947.084985835687, 181, 19700, 12155.0, 15506.0, 15817.0, 18703.800000000032, 2.4173942818010614, 3.8141879601095705, 2.462248277264167], "isController": false}, {"data": ["games/1933", 1098, 0, 0.0, 6261.462659380692, 101, 11500, 6985.0, 9060.0, 10034.249999999998, 11266.05, 2.4641431267687186, 34.829870785372684, 2.4930198040355394], "isController": false}, {"data": ["games/1933/events", 1070, 0, 0.0, 10781.034579439249, 86, 19751, 11478.5, 15246.1, 17969.6, 19386.58, 2.435305095932813, 18.387798154175297, 2.5232995183444475], "isController": false}, {"data": ["/tickets/list", 1534, 0, 0.0, 12816.046284224278, 84, 28190, 12519.5, 24533.0, 25888.0, 27404.15, 3.413105970932975, 8.21894402445021, 3.5964270924186326], "isController": false}, {"data": ["news/list?type=Video", 1545, 0, 0.0, 11578.366343042084, 432, 37650, 7033.0, 32110.4, 34589.4, 36499.28, 3.415270347937575, 30.306282449903843, 4.179036861294708], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 1064, 100.0, 7.435879516388287], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14309, 1064, "422/Unprocessable Entity", 1064, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["stream?type=video", 1064, 1064, "422/Unprocessable Entity", 1064, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
