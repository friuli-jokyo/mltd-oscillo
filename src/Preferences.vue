<script setup lang="ts">
import { mltdEvents, event, rankingType, idols, idolId, rankRange } from './main';
import { fetchBorders, MltdEventBorders } from './matsurihime/borders';
import { computedAsync } from '@vueuse/core';

const eventBorers = computedAsync<MltdEventBorders>(async () => event.value ? await fetchBorders(event.value.id) : {});
const rankingTypes = computedAsync<string[]>(async () => eventBorers.value ? Object.keys(eventBorers.value) : []);
const idolIds = computedAsync<number[]>(async () => eventBorers.value?.idolPoint?.map(border => border.idolId) || []);

</script>

<template>
    <main class="container">
        <v-container>
            <label for="eventId">イベント名</label>
            <select name="eventId" v-model="event">
                <template v-for="event in mltdEvents">
                    <option v-if="event.item.name" :key="event.id" :value="event">
                        {{ event.name }}
                    </option>
                </template>
            </select>
        </v-container>
        <v-container>
            <label for="rankingType">ランキング種別</label>
            <select name="rankingType" v-model="rankingType">
                <option v-for="rankingType in rankingTypes" :key="rankingType" :value="rankingType">
                    {{ rankingType }}
                </option>
            </select>
        </v-container>
        <v-container>
            <template v-if="rankingType == 'idolPoint'">
                <label for="idolId">アイドル</label>
                <select name="idolId" v-model="idolId">
                    <template v-for="idol in idols">
                        <option v-if="idol.id in (idolIds || [])" :key="idol.id" :value="idol.id">
                            {{ `${idol.id}: ${idol.fullName}` }}
                        </option>
                    </template>
                </select>
            </template>
        </v-container>
        <v-container>
            <label for="rank">順位</label>
            <input type="text" name="rank" v-model="rankRange" placeholder="1-10,20,30">
        </v-container>
        <v-container>
            <v-btn color="primary" @click="$router.push('/graphview')">
                OK
            </v-btn></v-container>
    </main>
</template>

<style>
select {
    width: 50%;
    margin: 0.5em 0;
}

label {
    margin: 0.5em 0;
}
</style>