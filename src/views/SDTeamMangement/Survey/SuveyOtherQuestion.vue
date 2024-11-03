<template>
  <v-row dense>
    <v-col cols="12"> </v-col>
    <v-col cols="12">
      <draggable
        v-model="items_question"
        tag="ul"
        handle=".handle"
        item-key="id"
      >
        <template v-slot:item="{ element, index }">
          <v-row>
            <v-col cols="12">
              <!-- <v-form ref="form"> -->
              <QuestionOption
                :type="element.typeQuestionCard"
                :id="element.id.toString()"
                :index="Number(index)"
                :data="element.data"
                :items-id="
                  items_question
                    .slice(Number(index)+1)
                    .map((item) => (item.index+1).toString())
                "
                :count-question="items_question.length"
                @on-update="handleQuestionUpdate"
                @on-remove="handleQuestionRemove"
              />
            </v-col>
          </v-row>
        </template>
      </draggable>
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
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import QuestionOption from "@/components/survey/QuestionOption.vue";

const propsVar = defineProps({
  defaultItem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["on-data-input"]);

const items_question = ref([]);

const questionCounter = ref(0);

watch(
  () => propsVar.defaultItem,
  () => {
    items_question.value = propsVar.defaultItem;
    let lastId = items_question.value[items_question.value.length - 1].id;
    questionCounter.value = lastId + 1;
  }
);

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
  if (indexOfById > -1) items_question.value.splice(indexOfById, 1);
};

const handleAddQuestion = () => {
  const id = (questionCounter.value++).toString();
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

watch(items_question.value, (newValue) => {
  emit("on-data-input", newValue);
});
</script>
