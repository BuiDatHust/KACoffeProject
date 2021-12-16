
var statistic = document.getElementById('statistic-tab')

statistic.addEventListener('click', function(){

    // chart 1
    Highcharts.chart('container1', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: 'Biểu đồ doanh thu và số khách hàng mới trung bình từ đầu năm'
        },
        
        xAxis: [{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          crosshair: true
        }],
        yAxis: [{ // Primary yAxis
          labels: {
            format: '{value} triệu',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          title: {
            text: 'Doanh thu',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          }
        }, { // Secondary yAxis
          title: {
            text: 'Khách hàng mới',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value} khách',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 100,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
        },
        series: [{
          name: 'Khách hàng mới',
          type: 'column',
          yAxis: 1,
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          tooltip: {
            valueSuffix: ' khách'
          }
      
        }, {
          name: 'Doanh thu',
          type: 'spline',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
          tooltip: {
            valueSuffix: 'triệu'
          }
        }]
      });

      //chart 2
      Highcharts.chart('container2', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Tỉ lệ số lượng các loại đồ uống được bán ra'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
            name: 'Nổi bật',
            y: 35,
            sliced: true,
            selected: true
          }, {
            name: 'Cà phê',
            y: 15
          }, {
            name: 'Trà trái cây-Trà sữa',
            y: 14
          }, {
            name: 'Đá xay-Choco-Matcha',
            y: 17
          }, {
            name: 'Đồ uống nhanh',
            y: 10
          }, {
            name: 'Drinks',
            y: 9
          }]
        }]
      });
})