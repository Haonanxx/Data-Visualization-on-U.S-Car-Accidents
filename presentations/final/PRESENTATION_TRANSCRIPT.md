# TRANSCRIPT

Topic: US Traffic Accident

Team name: Survivors

Team members: Qianqian Tang, Yixiang Cao, Haonan Xu


-Qianqian Tang <tangq@usc.edu>

-Yixiang Cao <yixiangc@usc.edu>

-Haonan Xu <haonanxu@usc.edu>

---

## Slide 1
Our visualization is about traffic accidents that happened in the US.
## Slide 2
Our end users are people who want to know about the possible causes of traffic accidents. For example, the local department of transportation can get visualization analysis like the road conditions of most accidents in a specific state or county. Then they take measures to avoid accidents as much as possible.
## Slide 3
For now, Yixiang made a choropleth map, a line chart, and a calendar heatmap. Haonan made an interactive grouped bar chart. I made a Mapbox map and a pie chart for now.
## Slide 4
The data we are using contains 3.5 million accident records which are collected for almost five years, covering 49 states of the US. We used the data to show the hotspot locations and to analyze the possible causes of traffic accidents like the road conditions and the natural environmental factors.
## Slide 5
In our research, we were looking for the most important data that are relevant to our topic besides the number of accidents. To best utilize and visualize these data, we got inspired by some of the visualizations on this slide. Other visualizations have used maps to show the number of accidents in a region; a timeline to reflect the trend of accidents in 24 hours, and a proportional area to show how weather conditions are related to accidents.
## Slide 6
The original part about our project is that we integrated maps and line charts so that we can look at the number of accidents among states and more details in a specific state. To show the relevance of accidents and weather conditions, instead of using the total number of accidents versus every weather condition, we have an interactive bar chart to look at how each weather condition affects the number of accidents in each state.
## Slide 7
Basically, we will filter and reorganize the data using python and SQL based on our design. We will use HTML, CSS, JavaScript, D3 library, and Vega-Lite to develop the visualization interface.
## Slide 8
In detail, our dataset contains many attributes, and we divided them into three classes. For data related to location, we will use maps to show the accident hotspot locations with colors from light to dark. We will use the bar chart and pie chart to show the environmental factors of car accidents, which are very intuitive for the users to recognize the main causes of car accidents. For time-related data, we plan to use line charts to demonstrate the occurrences of car accidents. We might use more charts and graphs in other forms during the process. At the same time, we will also establish interaction between different graphs, and implement filtering, sorting, and other functions to facilitate the use of our end users. In addition, we are going to test the visualization with Cairo's wheel in the editorial process.
## Slide 9
There are three students in our group, all of whom have rich experience in data analysis and front-end development. I believe that after learning about data visualization technology, we can complete this project with high quality. 
We will design our visualization plan together to make it more comprehensive and divide labor according to different types of diagrams. 
I will be responsible for the map graph. Qianqian Tang will mainly be responsible for the time-related trend graphs and interactions. And Haonan Xu will be responsible for the links and comparison diagrams between accident-related variables.
## Slide 10
Here is the timeline we planned for our project. We will use one week to research our dataset and the topic. Then we will use one week to design our visualization. 
After completing the visual analysis, we will spend a week optimizing it, as well as video recording and paper writing. 
