import Highcharts from "highcharts";
import { dateFormat } from "highcharts";
import "highcharts/modules/accessibility";

Highcharts.setOptions({
  chart: {
    type: "line",
    zooming: {
      type: "x",
      resetButton: {
        position: {
          align: "left",
          verticalAlign: "top",
          x: 10,
          y: 0
        }
      }
    }
  },
  credits: {
    text: "Powered by matsurihi.me",
    href: undefined
  },
  lang: {
    resetZoom: "元の範囲に戻す",
    resetZoomTitle: "元の範囲に戻します"
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
        s += '<table style="margin-top: 8px; border-spacing: 0; border-collapse: collapse; width: 100%;">';
        this.points.forEach(point => {
          if (!point.y) { return; }
          s += `<tr>
            <td style="padding: 2px 8px 2px 0; white-space: nowrap;">
              <span style="color:${point.color};">●</span>
            </td>
            <td style="padding: 2px 8px; text-align: right; white-space: nowrap;">
              ${point.series.name}
            </td>
            <td style="padding: 2px 0 2px 8px; text-align: right; white-space: nowrap;">
              <b>${point.y.toLocaleString()}</b>
            </td>
          </tr>`;
        });
        s += '</table>';
      }
      return s;
    }
  }
})