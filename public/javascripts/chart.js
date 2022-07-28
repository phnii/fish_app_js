$(function () {
  let fishesPerMonth = document.getElementById("fishesPerMonth").innerHTML;
  let fishName = document.getElementById("fishName").innerHTML;
  let fishesPerMonthArry = []
  fishesPerMonth = fishesPerMonth.toString().split(",");
  fishesPerMonth.forEach(i => {
    fishesPerMonthArry.push(Number(i));
  })

  $('#container').highcharts({
    chart: {
      width:1000,
      heigth:300
    },
    title: {
      text: `${fishName}の月別釣果数`,
      x: -20 //center
    },
    xAxis: {
      categories: ['1', '2', '3', '4', '5', '6',
        '7', '8', '9', '10', '11', '12']
    },
    yAxis: {
      title: {
        text: '件数'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      valueSuffix: '件'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: '釣果',
      data: fishesPerMonthArry
    }]
  });
});