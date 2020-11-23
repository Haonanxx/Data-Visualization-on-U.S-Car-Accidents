# TRANSCRIPT

Topic: US Traffic Accident

Team name: Survivors

Team members: Qianqian Tang, Yixiang Cao, Haonan Xu


-Qianqian Tang <tangq@usc.edu>

-Yixiang Cao <yixiangc@usc.edu>

-Haonan Xu <haonanxu@usc.edu>

---

## Cover Page
Our visualization is about traffic accidents that happened in the US.
## Slide 1
Our end users are people who want to know about the possible causes of traffic accidents. For example, the local department of transportation can get visualization analysis like the road conditions of most accidents in a specific state or county. Then they take measures to avoid accidents as much as possible.
## Slide 2
For now, Yixiang made a choropleth map, a line chart, and a calendar heatmap. Haonan made an interactive grouped bar chart. I made a Mapbox map and a pie chart.
## Slide 3
The data we are using contains 3.5 million accident records that are collected for almost five years, covering 49 states of the US. We used the data to show the hotspot locations and to analyze the possible causes of traffic accidents like the road conditions and the natural environmental factors.
## Slide 4
In our research, we were looking for the most important data that are relevant to our topic besides the number of accidents. To best utilize and visualize these data, we got inspired by some of the visualizations on this slide. Other visualizations have used maps to show the number of accidents in a region; a timeline to reflect the trend of accidents in 24 hours, and a proportional area to show how weather conditions are related to accidents.
## Slide 5
The original part about our project is that we integrated maps and line charts so that we can look at the number of accidents among states and more details in a specific state. To show the relevance of accidents and weather conditions, instead of using the total number of accidents versus every weather condition, we have an interactive bar chart to look at how each weather condition affects the number of accidents in each state.
## Slide 6
Let me introduce our story, we can analyze the traffic accident data from four dimensions: driver, location, time and date, and weather. 
They all might affect traffic accidents. Based on these four dimensions, we design and develop our structure of the system. 
## Slide 7
We draw a d3 map and a Mapbox map. And we use a calendar to show the number of accidents each day during the 4 years,  which is not a simple generator. What's more, we build some line charts, bar charts, and pie charts to help to analyze, and we also implement the interactions between graphs. 
## Slide 8
To complete the visualization, we use a lot of tools. We pre-processing data with python script and pandas library. And use JavaScript, HTML, D3 library, Node.js, GeoJSON, and Mapbox to draw graphs. And finally, structure our system by VUE.
## Slide 9
We divided labor according to different dimensions of analysis. Qianqian Tang is responsible for data visualization of places and landmarks. Haonan Xu is responsible for data visualization of data related to weather. And I am responsible for the driver and time part. 
## Slide 10
What we need to improve is the visualization of data related to the driver, which is because of the lack of data about it. Currently, we only analyze the relationship between the population and the accident. In the future, we will enrich our data sources and visualize data about drivers' age, gender, educational background, driving time, etc.