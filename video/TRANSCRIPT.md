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
Now let's see the first section, Time&Date&Driver. There is a d3map at the top left, which is a choropleth map representing the number of accidents in different states. And from the type selector, user could select to see the choropleth map representing the population in each state. And at the top right, there is a scatter chart, whose x-axis is population and y-axis is accident. It is not difficult to see from this picture that the greater the population of an area, the greater the probability of a traffic accident.
This scatter graph is linked to the map. When you click on a state on the map, the scatter graph will highlight the point represented by the state. 
At the same time, you can also select the selector you want from the state selector.


Continue to look down, it is a timeline chart. 


##Weather
When analysing car accidents data, weather condition is necessary to be taken into consideration. This is a grouped bar chart that shows the relation among number of accidents, temperature and visibility. These data collected from 2016 to 2020 are presented in three different sorted order. Users can press each button to change the sorted order. To look into the details of weather conditions in each state, one can hover over a bar to see the value of each of data.
##Severity&Infrastructure