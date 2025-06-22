import { createApp, ref } from "vue";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from "./App.vue";
import { MltdEvent } from "@/matsurihime/events";
import router from "./router";
import { MltdRankingType } from "@/matsurihime";
import { mltdIdols } from "@/matsurihime/idols";

const vuetify = createVuetify({
  components,
  directives,
})

export const mltdEvents = ref<MltdEvent[]>([]);
export const idols = mltdIdols();

export const event = ref<MltdEvent | null>(null);
export const rankingType = ref<MltdRankingType | null>("eventPoint");
export const idolId = ref<number | null>(null);
export const rankRange = ref<string>("1-10,1000,2500");

createApp(App)
    .use(vuetify)
    .use(router)
    .mount("#app");