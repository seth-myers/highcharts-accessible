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
![alt text](https://github.com/seth-myers/highcharts-accessible/blob/gh-pages/images/without.png "https://github.com/seth-myers/highcharts-accessible/blob/gh-pages/images/with.png")

## Dependency
Include the [export-csv.js](http://www.highcharts.com/plugin-registry/single/7/Export%20Data "export-csv.js download page") plugin to enable the CSV functionality.

## Usage
Import this file after `highcharts.js` and `export-csv.js` files like this:
```javascript
<script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="includes/export-csv.js"></script>
<script type="text/javascript" src="highcharts-accessible.js"></script>
```


*"Inclusive design is good design."*
