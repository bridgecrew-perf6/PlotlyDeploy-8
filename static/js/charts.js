function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samplesdata = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samplesdata.filter(samplesObj => samplesObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var wfreqArray = metadata.filter(metaObj => metaObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var samples_first =  samplesArray[0];

    // 2. Create a variable that holds the first sample in the metadata array; or you can call a veriable = result.
    var meta_first = wfreqArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = samples_first.otu_ids;
    var otuLabels = samples_first.otu_labels;
    var sampleValues = samples_first.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wFreq = meta_first.wfreq;

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.slice(0, 10).map(otuID => `OTU: ${otuID}`).reverse();

    //marker: { color: ['Red', 'OrangeRed', 'Orange', 'Yellow', 'LimeGreen', 'Green', 'MidnightBlue', 'CornFlowerBlue', 'MediumOrchid', 'indigo'] },
    // Create the trace for the bar chart. 
    var barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        marker: { color: ['Red', 'OrangeRed', 'Orange', 'Yellow', 'LimeGreen', 'Green', 'MidnightBlue', 'CornFlowerBlue', 'MediumOrchid', 'indigo'] },
        type:"bar",
        orientation: "h",
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: {text: '<b>Top 10 Bacteria Cultures Found (OTU)</b>',
                font: {
                    size: 18,
                    color: 'black'
                  }},
        yaxis:{
            tickmode:"linear"
        },
        margin: {
            l: 100,
            r: 20,
            t: 50,
            b: 30
        },
        font: {
          size: 12,
          color: 'black',

         }
        };
       
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  

    // Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Rainbow"}
        }
    ];

    //  title: {text: '<b>Bacteria Cultures Per Sample</b>',
    //font: {
    //  size: 24,
    //  color: 'black'
    //}},
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      showlegend: false,
      xaxis: {title: "Operational Taxonomic Unit (OTU) ID"},
      height: 600,
      width: 1200,
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 100},
      hovermode:'closest'
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // title: { text: "Scrubs per Week", font: { size: 18 } },
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
            type: 'indicator',
            mode: "gauge+number",
            value: wFreq,
            gauge: {
                bar: { color: "black" },
                axis: { range: [0, 10] },
                steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "yellow" },
                    { range: [6, 8], color: "green"},
                    { range: [8, 10], color: "CornFlowerBlue" }
              ]
            }
        } 
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        title: {
            text: '<b>Scrubs per Week</b>',
            font: {size: 18}
        },
        width: 500, 
        height: 400, 
        margin: { r: 25, l: 25 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 
  
   });
}
