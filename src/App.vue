<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { event, mltdEvents } from './main';
import { fetchMltdEvents } from './matsurihime/events';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

onBeforeMount(async () => {
  if (isTauri) {
    document.addEventListener("contextmenu", event => { event.preventDefault(); });
    const { initMenu } = await import('./menu');
    await initMenu();
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const { getVersion } = await import('@tauri-apps/api/app');
    await getCurrentWindow().setTitle(`mltd-oscillo v${await getVersion()}`);
  }
  if (mltdEvents.value.length === 0) {
    console.log("Fetching MLTD events...");
    mltdEvents.value = await fetchMltdEvents();
    console.log("MLTD events fetched:", mltdEvents.value);
  }
  if (mltdEvents.value.length !== 0) {
    // イベントアイテム名が設定された最新のイベントを取得
    event.value = mltdEvents.value.find(event => event.schedule.boostBeginAt !== null) || null;
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
