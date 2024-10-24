<template>
  <v-card color="#FCD1D1" class="pa-5">
    <div class="d-flex justify-space-between">
      <h3 class="align-self-center">หัวข้อที่ {{ propsVar.index + 1 }}</h3>
      <div class="text-center">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi mdi-dots-horizontal"
              variant="plain"
              v-bind="props"
            >
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items_menu" :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-row dense>
      <v-col cols="10">
        <v-text-field
          v-model="item_title"
          variant="solo"
          density="compact"
          :rules="[(v) => !!v || 'Required']"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field variant="solo" density="compact">{{
          totalScoreSum
        }}</v-text-field>
      </v-col>
    </v-row>
    <draggable v-model="items_question" tag="ul" handle=".handle" item-key="id">
      <template v-slot:item="{ element, index }">
        <v-row>
          <v-col cols="12">
            <QuestionOption
              :type="element.typeQuestionCard"
              :id="element.id.toString()"
              :index="Number(index)"
              :data="element.data"
              :itemsId="
                store.survey3.tempQuestionIds.slice(
                  getIndex(element.id.toString()) + 1
                )
              "
              :count-question="items_question.length"
              @on-update="handleQuestionUpdate"
              @on-remove="handleQuestionRemove"
            />
          </v-col>
        </v-row>
      </template>
    </draggable>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn
          prepend-icon="mdi mdi-plus-circle-outline"
          variant="outlined"
          rounded
          class="ma-2 pa-2"
          @click="handleAddQuestionAlignment"
          >เพิ่มคำถาม Alignment</v-btn
        >
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
  </v-card>
</template>

<script setup>
const propsVar = defineProps({
  id: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  items: {
    type: Object,
    required: null,
  },
});

import draggable from "vuedraggable";
import QuestionOption from "@/components/survey/QuestionOption.vue";
import { ref, watch, computed, onMounted } from "vue";

import { useSurveyStore } from "@/stores/surveyStore";
const store = useSurveyStore();
const emit = defineEmits(["on-group-update", "on-group-title-update"]);

const items_menu = [{ title: "Option" }, { title: "Preview" }];
const items_question = ref([]);
const item_title = ref("");

onMounted(() => {
  if (propsVar.items) {
    item_title.value = propsVar?.items?.title ?? "";
    // item_title.value = ">>>>>" ?? "";
    items_question.value = propsVar?.items?.data ?? [];
  }
});

const getIndex = (id) => {
  const index = store.survey3.tempQuestionIds.findIndex((el) => el == id);
  if (index != -1) return index;
  return 0;
};

const handleQuestionUpdate = (item) => {
  const indexUpdate = items_question.value.findIndex((el) => el.id === item.id);
  if (indexUpdate > -1) {
    items_question.value[indexUpdate].data.metaData = item?.control;
    items_question.value[indexUpdate].index = item?.index;
    items_question.value[indexUpdate].data.controlType = item?.controlType;
  }
};

const handleQuestionRemove = (id) => {
  const indexOfById = items_question.value.findIndex((el) => el.id == id);
  const indexTempQuestId = store.survey3.tempQuestionIds.findIndex(
    (el) => el == id
  );

  if (indexTempQuestId > -1) store.survey3.tempQuestionIds.splice(indexTempQuestId, 1);
  if (indexOfById > -1) items_question.value.splice(indexOfById, 1);
};

const handleAddQuestionAlignment = () => {
  const id = (store.survey3.tempId++).toString();
  store.survey3.tempQuestionIds.push(id);
  items_question.value.push({
    id,
    index: items_question.value.length,
    typeQuestionCard: "Align",
    data: {
      controlType: "Multichoice",
      metaData: undefined,
    },
  });
};

const handleAddQuestion = () => {
  const id = (store.survey3.tempId++).toString();
  store.survey3.tempQuestionIds.push(id);
  items_question.value.push({
    id,
    index: items_question.value.length,
    typeQuestionCard: "None",
    data: {
      controlType: "Paragraph",
      metaData: undefined,
    },
  });
};

watch(
  () => item_title.value,
  (newValue) => {
    emit("on-group-title-update", { index: propsVar.index, title: newValue });
  }
);

watch(items_question.value, (newValue) => {
  emit("on-group-update", { index: propsVar.index, question: newValue });
});

const totalScoreSum = computed(() => {
  return items_question.value.reduce(
    (sum, question) => sum + (question.data?.metaData?.totalScore ?? 0),
    0
  );
});
</script>
