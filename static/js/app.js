function init() {
  //  Grab dropdown event handler id
  const selector = d3.select("#selDataset");

  // Populate select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector 
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Intial plor builds from first sample
    let firstSample = sampleNames[0];
    buildViz(firstSample)
    metaData(firstSample)
  });
}
// Initialize dashboard app
init()
//  Metadata panel
function metaData(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter data
    let results = metadata.filter(sampleObject => sampleObject.id == sample);
    let result = results[0];
    // Dropdown panel
    let panel = d3.select("#sample-metadata");

    // Reset selection on panel
    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`)
    });
  });
}
// BUILD VIZ
function buildViz(sample) {
  d3.json("samples.json").then((data) => {
    let bacteriaSamples = data.samples;
    let resultsArray = bacteriaSamples.filter(x => x.id == parseInt(sample))
    let result = resultsArray[0]
    // Create otu_ids, otu_labels, and sample value variables
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    // BAR CHART
    let yticks = otu_ids.map(x => 'OTU' + x).slice(0, 10).reverse();
    // Bar chart data
    let barData = [{
      x: sample_values.slice(0,10).reverse(), 
      y: yticks, 
      type: "bar",
      hoverinfo: otu_labels.slice(0,10).reverse(),
      orientation: 'h',
      marker: {
        color: "729c21",
      }
    }];
    // Bar chart layout
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      plot_bgcolor: "black",
      paper_bgcolor: "#0d0d0d",
      font: {
        color: "white",
        family: "Open Sans, sans-serif",
      }
    };
    // Plot
    Plotly.newPlot("bar", barData, barLayout)

    // BUBBLE CHART
    // Bubble chart data 
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values.map(value => value*0.8),
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    // Create bubble chart layout
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: otu_labels,
      plot_bgcolor: "black",
      paper_bgcolor: "#0d0d0d",
      font: {
        color: "white",
        family: 'Open Sans, sans-serif'
      }
    };
    // Plot chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // GUAGE CHART
  d3.json("samples.json").then((data) => {
    let meta = data.metadata;
    let resultsArray = meta.filter(x => x.id == parseInt(sample))

    let result = resultsArray[0]
    // GAUGE CHART
    let wfreq = result.wfreq
    let gaugeData = [{
      value: wfreq,
      title: {text: "Belly Button Washing Frequency<br> Scrubs Per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [0,10], tickwidth: 1, tickcolor: "white", nticks: 20
        },
        bar: {color: "powderblue"},
        bgcolor: "black",
        borderwidth: 2, 
        bordercolor: "171717",
        steps: [
          { range: [0, 2], color: "#a9A18C" },
          { range: [2, 4], color: "#493829" },
          { range: [4, 6], color: "#613318"},
          { range: [6, 8], color:  "#729c21" },
          { range: [8, 10], color: "#088461"},
        ],
        threshold: {
          line: {'color': "brown", 'width': 6},
          'tickness': 1,
          'value': 9.95
        }
      }
    }];
    // Gauge layout
    let gaugeLayout = {
      automargin: true,
      plot_bgcolor: "black",
      paper_bgcolor: "#0d0d0d",
      font: {
        color: "white",
        family: 'Open Sans, sans-serif'
      }
    }
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  })
  })
}

