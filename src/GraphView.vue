<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Highcharts, { SeriesOptionsType } from "highcharts";
import { fetchIdolRankingLog, fetchRankingLog, splitRanges } from "@/matsurihime/rankingLog";
import { event, idolId, rankRange, rankingType } from "./main";
import { rankingType2Name } from "./matsurihime";
import { highchartsOptions } from "./highchartsOptions";

const chartRef = ref<HTMLElement | null>(null);
const chart = ref<Highcharts.Chart | null>(null);

onMounted(async () => {
  if (chartRef.value) {
    const rankingLogs = await (async () => {
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
        return await fetchRankingLog(event.value.id, rankingType.value, splitRanges(rankRange.value));
      } else {
        if (!idolId.value) {
          throw new Error("Idol ID is not set for idolPoint ranking type");
        }
        return await fetchIdolRankingLog(event.value.id, idolId.value, splitRanges(rankRange.value));
      }
    })();
    const series: SeriesOptionsType[] = rankingLogs.map(v => {
      return {
        type: "line",
        name: `#${v.rank}`,
        data: v.data.map(d => { return { "x": d.aggregatedAt.getTime(), "y": d.score } }),
      }
    });
    chart.value = Highcharts.chart(chartRef.value, {
      ...highchartsOptions,
      xAxis: {
        type: "datetime",
        title: {
          text: "集計日時"
        },
        min: event.value?.schedule.beginAt.toISOString(),
        max: event.value?.schedule.endAt.toISOString(),
        crosshair: true
      },
      yAxis: {
        title: {
          text: rankingType2Name(rankingType.value)
        },
        min: 0
      },
      series: series,
    });
  }
});
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
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