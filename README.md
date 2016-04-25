# highcharts-accessible (access)
This plugin improves accessibility of the graphs rendered by Highcharts.

## About
"Inclusive design is good design."  

Access improves the accessibility of Highcharts' graphs by automatically applying three separate best practices to creating SVG charts. 

#### 1. SVG Title and Description Tags
Access highjacks these tags two tags in the rendered SVG and adds informative text that describes what the graph is showing. Developers have the option of inserting their own custom text, or allowing the plugin to write the key-takeaways from the chart. Its important that an automated option exists, or it will be easy for web developers to overlook this crucial step.

#### 2. ARIA
ARIA attributes are inserted into the SVG to further optimize the chart for screen readers.

#### 3. CSV
A link to a downloadable CSV file containing all the data is inserted after the chart. This gives visually-impaired users the same opportunity to access all the data, and do a 'deep-dive' if they want.

## Background
The vast majority of charts on the web are not accessible to the visually impaired. I believe the problem stems from the fundamental purpose of a chart, which is to quickly and concisely explain trends in data that would be hard to do with words. So, how do we put into words something that was specifically created to avoid them?

A common solution is to add a CSV file or insert a table of all the data displayed in the chart. This does give all users the same opportunity to access the information, but it misses the goal of making a chart in the first place. Visually-impaired users have to download a CSV file, sift through all the data, and draw their own conclusions about what it means while sighted-users can simply glance at the visualization. 

Instead of simply repeating all the data in a chart, this plugin attempts to summarize the key points the chart is likely to make, thereby doing a better job of aligning the accessibility feature with the actual purpose of making the visualization. 

In addition, the plugin can generate the description text itself. Having a person actually write the text would be best, but this fallback ensures all charts will have some amount of accessibility. 
