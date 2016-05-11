# highcharts-accessible
This plugin improves accessibility of the graphs rendered by Highcharts.  
Full documenation at http://seth-myers.github.io/highcharts-accessible/

## About
It works by automatically applying three best practices for accessible SVGs.

1. Automatically creates and inserts intelligent title and description tags.
2. Inserts ARIA attributes and language definition in the SVG to further optimize the chart for screen readers
3. Automatically inserts a link to a downloadable CSV of the data.

Highchart SVG rendered **without** the plugin:
![alt text](https://github.com/seth-myers/highcharts-accessible/blob/gh-pages/images/without.png "Highchart SVG rendered without the plugin")

Highchart SVG rendered **with** the plugin:
![alt text](https://github.com/seth-myers/highcharts-accessible/blob/gh-pages/images/with.png "https://github.com/seth-myers/highcharts-accessible/blob/gh-pages/images/with.png")

## Dependency
Include the [export-csv.js](http://www.highcharts.com/plugin-registry/single/7/Export%20Data "export-csv.js download page") plugin to enable the CSV functionality.

## Installation
Import this plugin after `highcharts.js` and `export-csv.js`, like this:
```
<script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="export-csv.js"></script>
<script type="text/javascript" src="highcharts-accessible.js"></script>
```
## Usage
All parameters are optional, but `accessible settings: {}` must be called in order to run the plugin.
```javascript
$("#container").highcharts({  
  accessibleSettings: {  
```

> **autoAccessible: Boolean**  
> Allow a summary of the chart to be written automatically. This is the primary purpose of the plugin. If set to false, a user-defined title and description must be provided. Defaults to `true`.  
    
> **csvLinkText: String**  
> Text used in link to download a CSV file. If you have more than one highchart SVG on a page, it is important to add text that helps users associate the link with the chart. Defaults to “Download chart data.”.

> **langAttribute: String**  
> Change the language attribute for the SVG. [More information](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/xml:lang "Mozilla SVG lang") on lang attribute. Defaults to “en” for English.  

> **timeSeries:Boolean**  
> Indicate if the dataset has a time element. This affects how the autoAccessible feature process the text. Defaults to `true`.  

> **userDesc: String**  
> Text to be used in the SVG’s description tag. This will override the autoAccessible feature. I recommend using this option and writing your own summary of what the chart shows. It will likely be more readable than what the autoAccessible script can generate. Defaults to `null`.  

> **userTitle: String**  
> Text to be used in the SVG’s title tag. If this is tag is not used, access will use the text in highchart’s title.text in the SVG title tag. If that is empty, it defaults to "This is a data visualization. Please see the following description tag for a synopsis of what it shows.".  

> **xUnitPrefix: String**  
> Text to prepend to the x value in the description tag. Defaults to empty string.

> **xUnitSuffix: String**  
> Text to append to the x value in the description tag. Defaults to empty string.

> **yUnitPrefix: String**  
> Text to prepend to the y value in the description tag. Defaults to empty string.

> **yUnitSuffix: String**  
> Text to append to the y value in the description tag. Defaults to empty string.

```javascript
  }  
});  
```

*"Inclusive design is good design."*
