<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import Highcharts, { SeriesOptionsType } from "highcharts";
import { fetchIdolRankingLog, fetchRankingLog, RankingLog, splitRanges } from "@/matsurihime/rankingLog";
import { aggregateAll, event, idol, rankRange, rankingType, viewRangeStrategy } from "./main";
import { rankingType2Name } from "./matsurihime";
import "./highchartsOptions";

let since: Date | null = null;
const chartRef = ref<HTMLElement | null>(null);
const chart = ref<Highcharts.Chart | null>(null);
const zoomed = ref<boolean>(false);

const timer = ref<NodeJS.Timeout | null>(null);
const countDown = ref<number>(0);

const logs: RankingLog[] = [];

async function fetchLogs(since?: Date): Promise<RankingLog[]> {
  if (!event.value) {
    throw new Error("Event is not set");
  }
  if (!rankRange.value) {
    throw new Error("Rank range is not set");
  }
  if (!rankingType.value) {
    throw new Error("Ranking type is not set");
  }
  if (rankingType.value !== "idolPoint") {
    return await fetchRankingLog(event.value.id, rankingType.value, splitRanges(rankRange.value), since);
  } else {
    if (!idol.value) {
      throw new Error("Idol ID is not set for idolPoint ranking type");
    }
    return await fetchIdolRankingLog(event.value.id, idol.value.id, splitRanges(rankRange.value), aggregateAll.value, since);
  }
}

async function updateLogs() {
  const newLogs = await fetchLogs(since ? since : undefined);
  if (since !== null) {
    logs.map(v => {
      const newLog = newLogs.find(n => n.rank === v.rank);
      if (newLog) {
        v.data.push(...newLog.data);
        const lastDate = v.data.length ? v.data[v.data.length - 1].aggregatedAt : null;
        if (!since || (lastDate && lastDate > since)) {
          since = lastDate;
        }
      }
    });
  } else {
    logs.push(...newLogs);
    since = newLogs.reduce((latest, log) => {
      const lastDate = log.data.length ? log.data[log.data.length - 1].aggregatedAt : null;
      return !latest || (lastDate && lastDate > latest) ? lastDate : latest;
    }, null as Date | null);
  }
}

function updateSeries() {
  if (!chart.value) {
    console.error("Chart is not initialized");
    return;
  }
  const series: SeriesOptionsType[] = logs.map(v => {
    return {
      type: "line",
      name: `#${v.rank}`,
      data: v.data.map(d => { return { "x": d.aggregatedAt.getTime(), "y": d.score } }),
    }
  });
  chart.value.update({
    series: series,
  }, true, true);
  console.log("Graph updated");
}

function updateAxisRange(minDate?: Date, maxDate?: Date) {
  if (!chart.value || zoomed.value) {
    return;
  }
  if (minDate && maxDate) {
    chart.value.xAxis[0].setExtremes(minDate.getTime(), maxDate.getTime());
    chart.value.redraw();
    return;
  }
  if (!event.value) {
    console.error("Event is not set, cannot update axis range");
    return;
  }
  switch (viewRangeStrategy.value) {
    case "wholeEvent":
      chart.value.xAxis[0].setExtremes(
        event.value.schedule.beginAt.getTime(),
        Math.max(since ? since.getTime() : 0, event.value.schedule.endAt.getTime())
      );
      break;
    case "onlyAggregated":
      chart.value.xAxis[0].setExtremes(
        event.value.schedule.beginAt.getTime(),
        since ? since.getTime() : event.value.schedule.endAt.getTime()
      );
      break;
    case "zoomed":
      chart.value.xAxis[0].setExtremes(
        since ? since.getTime() - 1000 * 60 * 60 * 26 : event.value.schedule.beginAt.getTime(),
        since ? since.getTime() : event.value.schedule.endAt.getTime()
      );
      break;
  }
  chart.value.redraw();
}

watch(viewRangeStrategy, () => {
  updateAxisRange();
})

onMounted(async () => {
  if (!chartRef.value) {
    return;
  }
  await updateLogs();
  chart.value = Highcharts.chart(chartRef.value, {
    chart: {
      events: {
        selection: (e) => {
          if (e.xAxis) {
            const min = e.xAxis[0].min;
            const max = e.xAxis[0].max;
            if (min && max) {
              updateAxisRange(new Date(min), new Date(max));
              chart.value?.showResetZoom();
              zoomed.value = true;
            }
          } else {
            setTimeout(updateAxisRange, 0);
            zoomed.value = false;
          }
          return true;
        }
      }
    },
    xAxis: [{
      type: "datetime",
      title: {
        text: "集計日時"
      },
      plotLines: event.value && event.value.schedule.boostBeginAt ? [{
        color: "red",
        dashStyle: "Dash",
        value: event.value?.schedule.boostBeginAt?.getTime()
      }] : [],
      crosshair: true,
      tickInterval: 1000 * 60 * 60 * 24,
      labels: {
        format: "{value:%m/%d %H:%M}",
        style: {
          fontSize: "0.6em"
        }
      }
    }],
    yAxis: [{
      title: {
        text: rankingType2Name(rankingType.value)
      },
      labels: {
        format: "{value:,.0f}",
        style: {
          fontSize: "0.6em"
        }
      }
    }]
  });
  chart.value.setTitle({
    text: `${event.value?.name}` + (idol.value ? ` - ${idol.value.fullName}` : ""),
  });
  updateSeries();
  updateAxisRange();
  if (event.value && new Date() < event.value?.schedule.endAt) {
    console.log("This event is still ongoing, setting up timer for updates");
    countDown.value = 300;
    timer.value = setInterval(async () => {
      countDown.value -= 1;
      if (countDown.value <= 0) {
        countDown.value = 300;
        await updateLogs();
        updateSeries();
        updateAxisRange();
      }
      if (chart.value) {
        chart.value.setSubtitle({
          text: `更新まで残り${countDown.value}秒`,
          style: {
            textAlign: "right",
            fontSize: "0.6em",
            color: "#666"
          }
        });
      }
    }, 1000);
  }
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
  if (timer.value) {
    console.log("Clearing timer");
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <main class="container">
    <div class="chart" ref="chartRef"></div>
  </main>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  padding-right: 10px;
}
</style>
<style>
.container {
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>