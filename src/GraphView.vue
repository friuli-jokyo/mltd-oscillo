<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import Highcharts, { SeriesOptionsType } from "highcharts";
import { fetchIdolRankingLog, fetchRankingLog, RankingLog, splitRanges } from "@/matsurihime/rankingLog";
import { event, idolId, idols, rankRange, rankingType, viewRangeStrategy } from "./main";
import { rankingType2Name } from "./matsurihime";
import { highchartsOptions } from "./highchartsOptions";

let since: Date | null = null;
const chartRef = ref<HTMLElement | null>(null);
const chart = ref<Highcharts.Chart | null>(null);

const timer = ref<NodeJS.Timeout | null>(null);

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
    if (!idolId.value) {
      throw new Error("Idol ID is not set for idolPoint ranking type");
    }
    return await fetchIdolRankingLog(event.value.id, idolId.value, splitRanges(rankRange.value), since);
  }
}

async function updateLogs() {
  const newLogs = await fetchLogs(since ? since : undefined);
  if (since !== null) {
    logs.map(v => {
      const newLog = newLogs.find(n => n.rank === v.rank);
      if (newLog) {
        v.data.push(...newLog.data);
        const lastDate = v.data[v.data.length - 1].aggregatedAt;
        if (!since || lastDate > since) {
          since = lastDate;
        }
      }
    });
  } else {
    logs.push(...newLogs);
    since = newLogs.reduce((latest, log) => {
      const lastDate = log.data[log.data.length - 1].aggregatedAt;
      return !latest || lastDate > latest ? lastDate : latest;
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

function updateAxisRange() {
  if (!chart.value || !event.value) {
    return;
  }
  switch (viewRangeStrategy.value) {
    case "wholeEvent":
      chart.value.xAxis[0].setExtremes(
        event.value.schedule.beginAt.getTime(),
        event.value.schedule.endAt.getTime()
      );
      chart.value.yAxis[0].setExtremes(0, undefined);
      break;
    case "onlyAggregated":
      chart.value.xAxis[0].setExtremes(
        event.value.schedule.beginAt.getTime(),
        since ? since.getTime() + 1000 * 60 * 60 : event.value.schedule.endAt.getTime()
      );
      chart.value.yAxis[0].setExtremes(0, undefined);
      break;
    case "zoomed":
      chart.value.xAxis[0].setExtremes(
        since ? since.getTime() - 1000 * 60 * 60 * 26 : event.value.schedule.beginAt.getTime(),
        since ? since.getTime() + 1000 * 60 * 60 : event.value.schedule.endAt.getTime()
      );
      chart.value.yAxis[0].setExtremes(undefined, undefined);
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
    ...highchartsOptions,
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
    text: `${event.value?.name}` + (idolId.value ? ` - ${idols.find(idol => idol.id === idolId.value)?.fullName}` : ""),
  });
  updateSeries();
  updateAxisRange();
  if (event.value && new Date() < event.value?.schedule.endAt) {
    console.log("This event is still ongoing, setting up timer for updates");
    timer.value = setInterval(async () => {
      await updateLogs();
      updateSeries();
      updateAxisRange();
    }, 5 * 60 * 1000);
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