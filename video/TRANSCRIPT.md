# TRANSCRIPT

Topic: US Traffic Accident

Team name: Survivors

Team members: Qianqian Tang, Yixiang Cao, Haonan Xu


-Qianqian Tang <tangq@usc.edu>

-Yixiang Cao <yixiangc@usc.edu>

-Haonan Xu <haonanxu@usc.edu>

---
##Introduction
  
  Hi everyone, in this video, I will introduce our visualization system about data related to traffic accident to you. Our system contained four dimensions: Time&Date, Driver, Weather and Infrastructure. And since the data related to drivers is not enough, we comine it with the Time&Date

##Time&Date&Driver
  
  Now let's see the first section, Time&Date&Driver. There is a d3map at the top left, which is a choropleth map representing the number of accidents in different states. And from the type selector, user could select to see the choropleth map representing the population in each state. And here is a scatter chart, whose x-axis is population and y-axis is accident. It is not difficult to see from this picture that the greater the population of an area, the greater the probability of a traffic accident.
This scatter graph is linked to the map. When you click on a state on the map, the scatter graph will highlight the point represented by the state. 
At the same time, you can also select the selector you want from the state selector.


And in the right t is a timeline chart. whose x-axis is time zone in one day, and y-aixs is the number of accidents. Obviously, during the day, the probability of a car accident from 7 am to 9 am and from 4 pm to 6 pm is higher. This may be caused by the peak period of get off work. Also this time line chart is interactive with map and state selector.

Continue to look down, Here is a calendar chart. 
Each box represents a day, and the color of the box represents the number of car accidents that occurred during that day. 
It can be inferred that the traffic safety risk is higher in the second half of each year, and the risk of working days is much higher than that of weekends.



##Weather
  
  When analyzing car accident data, the weather condition is necessary to be taken into consideration. This is a grouped bar chart that shows the relationship between the number of accidents, temperature, and visibility. These data collected from 2016 to 2020 are presented in three different sorted order. Users can press each button to change the sorted order. To look into the details of weather conditions in each state, one can hover over a bar to see the value of each of the data.

##Severity&Infrastructure
  
  Here is the Mapbox map that shows the severity of traffic accidents of the states and the counties in the US. Firstly, the pie chart shows the percentage of the appearance of the 10 different infrastructures when accidents happened in the US in the 5 years. When you hover over it, you can see the infrastructure percentage on the tooltip. If you click a state on the map, the pie chart will show the infrastructure data to the corresponding state. The legend of the infrastructure with 0 value will fade to gray. If you hover over the state, you are able to see the average severity level of the states on the tooltip in the top-left corner. There is also a button in the top-right corner. If you click it, the pie chart will reset to the infrastructure percentage of all states in the US. Also, you can zoom in to see the severity of counties, the tooltip will show up once you move your mouse and hover on a certain county. The bar chart shows the count of traffic accidents that happened near these 10 infrastructures in the 5 years with 4 different severities. You can use the slide bar to choose the severity to see the appearance of the infrastructures of different severity levels. The bars are sorted in descending order, so you are able to directly see what infrastructures cause a certain severity of traffic accidents more. Additionally, there are two buttons that allow you to choose all 10 or top 5 infrastructures to show on the chart.