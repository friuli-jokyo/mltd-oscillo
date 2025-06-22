import Highcharts from "highcharts";
import { dateFormat } from "highcharts";

export const highchartsOptions: Highcharts.Options = {
  chart: {
    type: "line"
  },
  credits: {
    enabled: false
  },
  title: {
    text: ""
  },
  time: {
    timezone: "Asia/Tokyo"
  },
  tooltip: {
    shared: true,
    useHTML: true,
    formatter: function () {
      let s = '<b>' +
        dateFormat('%m/%e %k:%M', this.x) + '</b>';
      if (this.points) {
        this.points.forEach(point => {
          if (!point.y) { return; }
          s += `<div style="margin-top: 8px;">` +
            `<div style="color:${point.color}; margin-right:5px; display:inline-block;">●</div>` +
            `<div style="display:inline-block; width:80px; text-align:right; margin-right:10px;">${point.series.name}</div>` +
            `<div style="display:inline-block; text-align:right;"><b>${point.y.toLocaleString()}</b></div>` +
            `</div>`;
        });
      }
      return s;
    }
  }
}

Highcharts.setOptions({
  time: {
    timezone: "Asia/Tokyo",
  },
})