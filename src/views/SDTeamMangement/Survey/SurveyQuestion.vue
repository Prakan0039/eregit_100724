<template>
  <v-row dense>
    <v-col cols="12" v-for="(i, index) in itemQuestionUpdate" :key="index">
      <GroupQuestionOption
        :index="index"
        :id="i.id.toString()"
        :items="i"
        @on-group-title-update="handleGroupTitleUpdate"
        @on-group-update="handleGroupQuestionUpdate"
      />
    </v-col>
    <v-col cols="12" class="d-flex justify-center">
      <v-btn
        prepend-icon="mdi mdi-plus-circle-outline"
        variant="outlined"
        rounded
        class="ma-2 pa-2"
        @click="handleAddQuestion"
        >เพิ่มคำถาม</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
import GroupQuestionOption from "@/components/survey/GroupQuestionOption.vue";
import { ref, watch, onMounted } from "vue";

const emit = defineEmits(["on-data-input"]);

import { useSurveyStore } from "@/stores/surveyStore";
const store = useSurveyStore();

const questionCounter = ref(0);

const propsVar = defineProps({
  defaultItem: {
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
  let countDataQuest = 0;
  itemQuestionUpdate.value.forEach((item) => {
    countDataQuest += item.data.length;
  });
  if (countDataQuest == 0) {
    store.survey3.tempId = 0;
    store.survey3.tempQuestionIds = [];
  }
});

const itemQuestionUpdate = ref([]);

watch(
  () => propsVar.defaultItem,
  () => {
    if (propsVar.defaultItem && itemQuestionUpdate.value.length == 0) {
      itemQuestionUpdate.value = propsVar.defaultItem;
      itemQuestionUpdate.value.forEach((item) => {
        store.survey3.tempQuestionIds.push(...item.data.map((el) => el.id));
        store.survey3.tempId =
          store.survey3.tempQuestionIds[
            store.survey3.tempQuestionIds.length - 1
          ];
        store.survey3.tempId++;
      });
    }
  }
);

// watchEffect(() => {
//   if (propsVar.defaultItem && itemQuestionUpdate.value.length == 0) {
//     console.log("Survey watchEffect")
//     itemQuestionUpdate.value = propsVar.defaultItem;
//     itemQuestionUpdate.value.forEach((item) => {
//       store.survey3.tempQuestionIds.push(...item.data.map((el) => el.id));
//       store.survey3.tempId =
//         store.survey3.tempQuestionIds[store.survey3.tempQuestionIds.length - 1];
//     });
//   }
// });

const handleGroupTitleUpdate = ({ index, title }) => {
  itemQuestionUpdate.value[index].title = title;
  // console.log(JSON.stringify(itemQuestionUpdate.value));
};

const handleGroupQuestionUpdate = ({ index, question }) => {
  itemQuestionUpdate.value[index].data = question;
  // console.log(JSON.stringify(itemQuestionUpdate.value));
};

const handleAddQuestion = () => {
  itemQuestionUpdate.value.push({
    id:  (questionCounter.value++).toString(),
    title: "",
    sumScore: 0,
    data: [],
  });
};

watch(itemQuestionUpdate.value, () => {
  emit("on-data-input", itemQuestionUpdate.value);
});
</script>
