# highcharts-accessible (access)
This plugin improves accessibility of the graphs rendered by Highcharts.
Documentation is here: http://seth-myers.github.io/highcharts-accessible/

## About
"Inclusive design is good design."  

Access improves the accessibility of Highcharts' graphs by automatically applying three separate best practices to creating SVG charts. 

#### 1. SVG Title and Description Tags
Access highjacks these tags two tags in the rendered SVG and adds informative text that describes what the graph is showing. Developers have the option of inserting their own custom text, or allowing the plugin to write the key-takeaways from the chart. Its important that an automated option exists, or it will be easy for web developers to overlook this crucial step.

#### 2. ARIA
ARIA attributes are inserted into the SVG to further optimize the chart for screen readers.

#### 3. CSV
A link to a downloadable CSV file containing all the data is inserted after the chart. This gives visually-impaired users the same opportunity to access all the data, and do a 'deep-dive' if they want.
