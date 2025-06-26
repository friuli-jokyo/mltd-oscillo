<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { initMenu } from './menu';
import { event, mltdEvents } from './main';
import { fetchMltdEvents } from './matsurihime/events';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';

onBeforeMount(async () => {
  if (window.location.hostname === "tauri.localhost") {
    document.addEventListener("contextmenu", event => { event.preventDefault(); })
  }
  await initMenu();
  await getCurrentWindow().setTitle(`mltd-oscillo v${await getVersion()}`);
  if (mltdEvents.value.length === 0) {
    console.log("Fetching MLTD events...");
    mltdEvents.value = await fetchMltdEvents();
    console.log("MLTD events fetched:", mltdEvents.value);
  }
  if (mltdEvents.value.length !== 0) {
    // イベントアイテム名が設定された最新のイベントを取得
    event.value = mltdEvents.value.find(event => event.item.name !== null) || null;
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
