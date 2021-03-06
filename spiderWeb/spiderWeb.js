(function() {
  var viz = {
    id: "highcharts_spiderweb",
    label: "Spiderweb",
    options: {
      chartName: {
        section: "Chart",
        label: "Chart Name",
        type: "string",
      },
      color_range: {
        type: "array",
        label: "Color Range",
        display: "colors",
        default: ["#dd3333", "#80ce5d", "#f78131", "#369dc1", "#c572d3", "#36c1b3", "#b57052", "#ed69af"],
      },
    },
    // Set up the initial state of the visualization
    create: function(element, config) {
      element.innerHTML = ""
    },
    // Render in response to the data or settings changing
    update: function(data, element, config, queryResponse) {
      if (!handleErrors(this, queryResponse, {
        min_pivots: 0, max_pivots: 0,
        min_dimensions: 1, max_dimensions: 1,
        min_measures: 1, max_measures: undefined,
      })) return;

      let x = queryResponse.fields.dimension_like[0]
      let measures = queryResponse.fields.measure_like
      let xCategories = data.map(function(row) {return row[x.name].value})

      let series = measures.map(function(m) {
        let format = formatType(m.value_format)
        return {
          name: m.label_short ? m.label_short : m.label,
          pointPlacement: 'on',
          data: data.map(function(row) {
            return row[m.name].value
          }),
          color: '#FF9F00',
          fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#FFC057'],
                    [1, '#ED7C00']
                ]
            },
          tooltip: {
            pointFormatter: function() {
              return `<span style="color:${this.series.color}">${this.series.name}: <b>${format(this.y)}</b><br/>`
            }
          },
        }
      })
      let avg_value= new Array();
      for (var i = 0, max = data.length; i < max; i += 1) {
            avg_value.push(50);
      }
      series.push({
          name: 'Avg Value',
          data: avg_value,
          pointPlacement: 'on',
          fillOpacity: 0.0001,
          lineColor: '#2A7E9D',
          color: '#2A7E9D'
      })
      let options = {
        colors: config.color_range,
        credits: {
          enabled: false
        },
        chart: {
          polar: true,
          type: 'area',
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, '#A0DEF5'],
                [1, '#328CAD']
            ]
          },
          style: {
            fontFamily: 'helvetica'
          }
        },
        title: {text: config.chartName},
        pane: {
            size: '90%'
        },
        xAxis: {
          categories: xCategories,
          tickmarkPlacement: 'on',
          lineWidth: 0,
          labels: {
              style: {
                  color: '#2A333C',
                  fontSize: '23px',
                  font: 'open-sans'
              },
            offset: -100
          }
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          min: 0,
          max: 100,
          labels: {
               format: '{value}'
          },
          gridLineColor: '#2A333C'
        },
        tooltip: {
          shared: true,
        },
        series: series,
      }
      let myChart = Highcharts.chart(element, options);
    }
  };
  looker.plugins.visualizations.add(viz);
}());
