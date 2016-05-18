// Accessible SVG resources
// http://www.w3.org/TR/SVG/access.html#SVGAccessibilityGuidelines
// http://www.idpf.org/accessibility/guidelines/

// TODO
// add ONKEYPRESS handler if ONCLICK hanlder was added by highcharts (Not a normal function of highcharts, but it can be done.)
// add autoAccessible functinality for remaining charts

(function (H) {

	H.wrap(H.Chart.prototype, 'init', function (proceed) {

		// Do not run accesssibility if it wasn't setup by user
		if(!arguments[1].accessibleSettings){
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));
			return;
		}

		// set options
		var accOptions = {
			approvedTypes: ['bar', 'column', 'line', 'pie'],
			autoAccessible: (arguments[1].accessibleSettings.autoAccessible === undefined) ? true : arguments[1].accessibleSettings.autoAccessible, // default to auto-accessible feature on
			chartType: findChartTypes(arguments[1]),
			csvLinkText: arguments[1].accessibleSettings.csvLinkText || "Download chart data.",
			langAttribute: arguments[1].accessibleSettings.langAttribute || "en", // default to english,
			timeSeries: (arguments[1].accessibleSettings.timeSeries === undefined) ? true : arguments[1].accessibleSettings.timeSeries, // default to time series
			userDesc: arguments[1].accessibleSettings.desc || null,
			userTitle: arguments[1].accessibleSettings.title || null,
			xUnitPrefix: arguments[1].accessibleSettings.xUnitPrefix || "",
			xUnitSuffix: arguments[1].accessibleSettings.xUnitSuffix || "",
			yUnitPrefix: arguments[1].accessibleSettings.yUnitPrefix || "",
			yUnitSuffix: arguments[1].accessibleSettings.yUnitSuffix || ""
		};

		

		// Ensure title and desc text are entered if the autoAccessible feature is off.
		if( !accOptions.autoAccessible && !accOptions.userTitle || !accOptions.autoAccessible && !accOptions.userDesc ) {
			throw "highcharts-accessible plugin error: A description and title must be provided if the autoAccessible feature is set to false.";
		}

        // Let highcharts make the chart.
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));

		// Add manually-entered title and desc tags if autoAccessible feature is off.
		if(!accOptions.autoAccessible) {
			setTags(accOptions.userTitle, accOptions.userDesc, this, accOptions);
			return;
		}

		var titleToPost = processTitle(accOptions, this);
		var descToPost = processDesc(accOptions, this);

		// add the new tags and ARIA attributes
		setTags(titleToPost, descToPost, this, accOptions);

		// Add CSV download, if dependency not available suggest user adds export-csv.js to automatically allow for CSV download
		if( typeof this.getCSV !== 'function' ){
			console.warn('highcharts-accessible plugin warning: please load the export-csv.js plugin to enable CSV download functionality: http://www.highcharts.com/plugin-registry/single/7/Export%20Data ');
		} else {
			csvDownload( this.getCSV(), this.renderTo.id, accOptions);
		};
		
    });

    // return string for the description tag
    // in highcharts, data is generally y-vals and dates/labels are x-vals
    function processDesc(o, d) {

    	// return user-supplied desc to access if available
    	if( o.userDesc ) {
    		return o.userDesc;
    	}

    	var theReturn = "";
    	var series = d.series;

    	// number of data points combined. 
    	// This is used to keep the descriptions from getting too long.
    	var combinedSeriesLen = series[0].data.length * series.length;

    	for (var i = 0 ; i < series.length ; i++){
    		var s = series[i];
    		var seriesType = o.chartType[i];
    		var xVals = s.processedXData;
    		var xValsLen = xVals.length;
    		var xLabels = get(s, 'xAxis.categories')
    		var yVals = s.processedYData;
    		var yValsLen = yVals.length;
    		var yValsHighLow = getHighLow(yVals); // use this to build the bar time series chart, say which date is highest/lowest for each data series
    		var sName = s.name;

    		// Warn if this chart type isn't currently supported.
			if( o.approvedTypes.indexOf(seriesType) < 0 ) {
	            console.log("highcharts-accessible plugin error: This chart type is still in development. Access can only process " + o.approvedTypes.toString() + " charts. This data series will not be added to the description.");
	            continue;
	        }

	        // These build the string to place into the desc tag
	        // format text for pie chart, describe each series
	        if( seriesType == 'pie') {
	        	var total = yVals.reduce(function(a, b) { return a + b; });
	        	for (var ii=0; ii< xValsLen; ii++){
		        	theReturn += s.data[ii].name + " " + o.yUnitPrefix + yVals[ii] + o.yUnitSuffix + ", " + round( (yVals[ii]/total*100), 1 ) + "% of the total. ";
		        }
	        }

	        if( o.timeSeries ){
	        // format text for time series	
	        	if(seriesType == 'line' || seriesType == 'bar' || seriesType == 'column'){
	        		theReturn += sName + " " + getDirection(yVals[0], yVals[yValsLen-1]) + " to " + o.yUnitPrefix + yVals[yValsLen-1] + o.yUnitSuffix + " in " + o.xUnitPrefix + xVals[xValsLen-1] + o.xUnitSuffix + " from " + o.yUnitPrefix + yVals[0] + o.yUnitSuffix +  " in "  + o.xUnitPrefix + xVals[0] + o.xUnitSuffix + ". " + sName + " peaked at " + o.yUnitPrefix + yValsHighLow.high[0] + o.yUnitSuffix + " in " + o.xUnitPrefix + xVals[yValsHighLow.high[1]] + o.xUnitSuffix + ", and dipped lowest to "  + o.yUnitPrefix + yValsHighLow.low[0] + o.yUnitSuffix + " in " + o.xUnitPrefix + xVals[yValsHighLow.low[1]] + ". ";
	       		} 
	        } else {
	        	// format text for nominal series
	        	// list all values if there are less than 15 data points in the whole chart
	        	if(combinedSeriesLen < 15) {
		        	if(seriesType == 'line' || seriesType == 'bar' || seriesType == 'column'){
		        		for (var ii=0; ii< xValsLen; ii++){
		        			theReturn += o.xUnitPrefix + yVals[ii] + o.xUnitSuffix + ", " + xLabels[ii] + ", " + sName + ". ";
		        		}
		        	}
		        // otherwise just say the high, low for each series
		       } else {
		        	if(seriesType == 'line' || seriesType == 'bar' || seriesType == 'column'){
		        		theReturn += sName + ", highest value of " + o.yUnitPrefix + yValsHighLow.high[0] + o.yUnitSuffix + " for " + xLabels[yValsHighLow.high[1]] + ". " + sName + ", lowest value of " + o.yUnitPrefix + yValsHighLow.low[0] + o.yUnitSuffix + " for " + xLabels[yValsHighLow.low[1]] + ". ";
		        	}
		        }
	        }
    	}

    	if( theReturn == ""){
    		return "This chart format is not yet supported by the Accessible Highcharts plugin. Please see the link below to download the data.";
    	} else {
    		return theReturn;
    	}
    }

    function processTitle(o, d) {

    	// return user-supplied title to access if available
    	if( o.userTitle ) {
    		return o.userTitle;
    	}

    	// if not, try to use the title given to highcharts.js
    	var hgTitle = get(d, 'userOptions.title.text');
    	if( hgTitle && hgTitle != ""){
    		return hgTitle;
    	} 

    	// otherwise say its a chart and direct folks to the description tag
    	return "This is a data visualization. Please see the following description tag for a synopsis of what it shows.";
    }

    // Not sure if download attribute or opening new window is better
	// Both approaches seem to have the same result
    function csvDownload(d, chartID, userOptions){

    	// denote when the CSV file ends per 508-coordinator
    	d += '\nEnd of File';

    	var theSVG = document.getElementById(chartID);
    	var newlinkNode = document.createElement("a");
		var newlinkContent = document.createTextNode(userOptions.csvLinkText);
		newlinkNode.appendChild(newlinkContent);
		newlinkNode.setAttribute("href", "data:text/csv;charset=utf-8," + escape(d));
		newlinkNode.setAttribute("download", "chart-data.csv");
		theSVG.appendChild(newlinkNode);

		// newlinkNode.onclick = function() {
		// 	//window.open( "data:text/csv;charset=utf-8," + escape(d) );
		// };
    }

    // get chart type for each series item
	// return array of chart types
    function findChartTypes(d){

    	var theReturn = [];
    	var chartSeries = get(d, 'chart.type');

    	for(var i=0; i<d.series.length; i++) {

    		var seriesString = 'd.series[' + i + '].type';

    		if( get(d, seriesString) ){
    			theReturn.push(d.series[i].type)
    		} else if(chartSeries) {
    			theReturn.push(chartSeries)
    		} else {
    			theReturn.push('line');
    		}
    	
    	}
    	return theReturn;
    }

    // return object of arrays high/low value and index position
    // { high: [val, index], low: [val, index] }
    function getHighLow(d){
    	var theReturn = { high: [d[0], 0], low: [d[0], 0] };
    	for(var i=0; i<d.length; i++){

    		if(d[i] > theReturn.high[0]){
    			theReturn.high = [d[i], i];
    		}
    		if(d[i] < theReturn.low[0]){
    			theReturn.low = [d[i], i];
    		}
    	}
    	return theReturn;
    }

    function getDirection(s, e){
    	var equal;
    	var text;
    	if(s== e){
    		return 'did not change';
    	} else {
    		return s < e ? 'increased' : 'decreased';
    	}
    }

    // http://stackoverflow.com/questions/23808928/javascript-elegant-way-to-check-nested-object-properties-for-null-undefined
    function get(obj, key) {
	    return key.split(".").reduce(function(o, x) {
	        return (typeof o == "undefined" || o === null) ? o : o[x];
	    }, obj);
	}

	function round(num, places) {
	    var multiplier = Math.pow(10, places);
	    return Math.round(num * multiplier) / multiplier;
	}

	// add desc and title tags with ARIA attributres, add lang attibute to SVG
    function setTags(tTag, dTag, chartData, userOptions){

    	//console.log(userOptions);

    	var chartID = chartData.renderTo.id;
		var theSVG = document.getElementById(chartID).firstChild.firstChild; 
		var descNode = theSVG.firstChild; 

		// add lang attribute to SVG tag
		theSVG.setAttribute("xml:lang", userOptions.langAttribute);

		// add ID to desc node for ARIA
		descNode.setAttribute("id", chartID + "-accessible-desc");

		descText = descNode.firstChild.nodeValue = dTag;

		var newTitleNode = document.createElement("title");
		var newTitleContent = document.createTextNode(tTag);
		newTitleNode.appendChild(newTitleContent);

		// add ID to title node for Aria
		newTitleNode.setAttribute("id", chartID + "-accessible-title");

		// insert the titgle tag at the beginning of the svg
		theSVG.insertBefore(newTitleNode, descNode);

		// set ARIA attributes on SVG tag
		theSVG.setAttribute("aria-labelledby", chartID + "-accessible-title");
		theSVG.setAttribute("aria-describedby", chartID + "-accessible-desc");
    }

}(Highcharts));
