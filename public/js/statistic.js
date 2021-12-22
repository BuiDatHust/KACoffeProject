// var statistic = document.getElementById('statistic-tab')

// statistic.addEventListener('click', function() {

//     // chart 1
//     Highcharts.chart('container1', {
//         chart: {
//             zoomType: 'xy'
//         },
//         title: {
//             text: 'Biểu đồ doanh thu và số khách hàng mới trung bình từ đầu năm'
//         },

//         xAxis: [{
//             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//             ],
//             crosshair: true
//         }],
//         yAxis: [{ // Primary yAxis
//             labels: {
//                 format: '{value} triệu',
//                 style: {
//                     color: Highcharts.getOptions().colors[1]
//                 }
//             },
//             title: {
//                 text: 'Doanh thu',
//                 style: {
//                     color: Highcharts.getOptions().colors[1]
//                 }
//             }
//         }, { // Secondary yAxis
//             title: {
//                 text: 'Khách hàng mới',
//                 style: {
//                     color: Highcharts.getOptions().colors[0]
//                 }
//             },
//             labels: {
//                 format: '{value} khách',
//                 style: {
//                     color: Highcharts.getOptions().colors[0]
//                 }
//             },
//             opposite: true
//         }],
//         tooltip: {
//             shared: true
//         },
//         legend: {
//             layout: 'vertical',
//             align: 'left',
//             x: 120,
//             verticalAlign: 'top',
//             y: 100,
//             floating: true,
//             backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
//                 'rgba(255,255,255,0.25)'
//         },
//         series: [{
//             name: 'Khách hàng mới',
//             type: 'column',
//             yAxis: 1,
//             data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//             tooltip: {
//                 valueSuffix: ' khách'
//             }

//         }, {
//             name: 'Doanh thu',
//             type: 'spline',
//             data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
//             // data: [<%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>],
//             tooltip: {
//                 valueSuffix: 'triệu'
//             }
//         }]
//     });

//     //chart 2
//     Highcharts.chart('container2', {
//         chart: {
//             plotBackgroundColor: null,
//             plotBorderWidth: null,
//             plotShadow: false,
//             type: 'pie'
//         },
//         title: {
//             text: 'Tỉ lệ số lượng các loại đồ uống được bán ra'
//         },
//         tooltip: {
//             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//         },
//         accessibility: {
//             point: {
//                 valueSuffix: '%'
//             }
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 dataLabels: {
//                     enabled: true,
//                     format: '<b>{point.name}</b>: {point.percentage:.1f} %'
//                 }
//             }
//         },
//         series: [{
//             name: 'Brands',
//             colorByPoint: true,
//             data: [{
//                 name: 'Nổi bật',
//                 y: 35,
//                 sliced: true,
//                 selected: true
//             }, {
//                 name: 'Cà phê',
//                 y: 15
//             }, {
//                 name: 'Trà trái cây-Trà sữa',
//                 y: 14
//             }, {
//                 name: 'Đá xay-Choco-Matcha',
//                 y: 17
//             }, {
//                 name: 'Đồ uống nhanh',
//                 y: 10
//             }, {
//                 name: 'Drinks',
//                 y: 9
//             }]
//         }]
//     });
// })
var statistic = document.getElementById('statistic-tab')

async function Thongke(time, money, guess, data1) {
    console.log(data1)
    let datachart2 = data1.split(",") 
    let m = money.split(",");
    let g = guess.split(",");
    let t = time.split(",");
    let mm = [];
    let gg = [];

    for (let i = 0; i <= 11; i++) {
        mm[i] = Number(m[i]);
        gg[i] = Number(g[i]);
    }

    console.log(m)
    console.log(mm)
        // chart 1
    Highcharts.chart('container1', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Biểu đồ doanh thu và số khách hàng mới trung bình từ đầu năm'
        },

        xAxis: [{
            categories: t,
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
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Khách hàng mới',
            type: 'column',
            yAxis: 1,
            // data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            data: gg,
            tooltip: {
                valueSuffix: ' khách'
            }

        }, {
            name: 'Doanh thu',
            type: 'spline',
            // data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            // data: [<%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>, <%= chart.sumorder %>],
            data: mm,
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
                name: 'Cà phê',
                y: Number(datachart2[0]),
                sliced: true,
                selected: true
            }, {
                name: 'Trà trái cây-Trà sữa',
                y: Number(datachart2[1])
            }, {
                name: 'Đá xay-Choco-Matcha',
                y: Number(datachart2[2])
            }, {
                name: 'Đồ uống nhanh',
                y: Number(datachart2[3])
            }, {
                name: 'Drinks',
                y: Number(datachart2[4])
            }]
        }]
    });
}