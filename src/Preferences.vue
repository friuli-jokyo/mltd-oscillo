<script setup lang="ts">
import { mltdEvents, event, rankingType, idols, idolId, rankRange } from './main';
import { fetchBorders, MltdEventBorders } from './matsurihime/borders';
import { computedAsync } from '@vueuse/core';
import router from './router';

const eventBorers = computedAsync<MltdEventBorders>(async () => event.value ? await fetchBorders(event.value.id) : {});
const rankingTypes = computedAsync<string[]>(async () => eventBorers.value ? Object.keys(eventBorers.value) : []);
const idolIds = computedAsync<number[]>(async () => eventBorers.value?.idolPoint?.map(border => border.idolId) || []);

function validateRankRange(value: string): boolean {
    const regex = /^\d+(-\d+)?(,\d+(-\d+)?)*$/;
    return regex.test(value);
}

function sendForm(): void {
    if (!event.value) {
        alert("イベントを選択してください");
        return;
    }
    if (!rankingType.value) {
        alert("ランキング種別を選択してください");
        return;
    }
    if (rankingType.value === 'idolPoint' && !idolId.value) {
        alert("アイドルを選択してください");
        return;
    }
    if (!rankRange.value || !validateRankRange(rankRange.value)) {
        alert("順位の範囲を正しく入力してください（例: 1-10,1000,2500）");
        return;
    }
    router.push('/graphview')
}

</script>

<template>
    <main class="container">
        <v-container>
            <v-row class="justify-center">
                <v-col align="right" cols="2">
                    <label for="eventId">イベント名</label>
                </v-col>
                <v-col align="left" cols="10">
                    <select name="eventId" v-model="event">
                        <template v-for="event in mltdEvents">
                            <option v-if="event.item.name" :key="event.id" :value="event">
                                {{ event.name }}
                            </option>
                        </template>
                    </select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align="right" cols="2">
                    <label for="rankingType">ランキング種別</label>
                </v-col>
                <v-col align="left" cols="10">
                    <select name="rankingType" v-model="rankingType">
                        <option v-for="rankingType in rankingTypes" :key="rankingType" :value="rankingType">
                            {{ rankingType }}
                        </option>
                    </select>
                </v-col>
            </v-row>
            <v-row v-if="rankingType == 'idolPoint'">
                <v-col align="right" cols="2">
                    <label for="idolId">アイドル</label>
                </v-col>
                <v-col align="left" cols="10">
                    <select name="idolId" v-model="idolId">
                        <template v-for="idol in idols">
                            <option v-if="idol.id in (idolIds || [])" :key="idol.id" :value="idol.id">
                                {{ `${idol.id}: ${idol.fullName}` }}
                            </option>
                        </template>
                    </select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align="right" cols="2">
                    <label for="rank">順位</label>
                </v-col>
                <v-col align="left" cols="10">
                    <input type="text" name="rank" v-model="rankRange">
                </v-col>
            </v-row>
            <v-row>
                <v-col align="center" cols="12">
                    <v-btn color="primary" @click="sendForm">
                        OK
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<style>
.container {
    margin: 0 auto;
}

select, input {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
