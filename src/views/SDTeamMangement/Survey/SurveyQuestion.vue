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
import { ref, watch, watchEffect } from "vue";

const emit = defineEmits(["on-data-input"]);

const propsVar = defineProps({
  defaultItem: {
    type: Array,
    default: () => [],
  },
});

const itemQuestionUpdate = ref([]);

watchEffect(() => {
  itemQuestionUpdate.value = propsVar.defaultItem;
});


const handleGroupTitleUpdate = ({ index, title }) => {
  itemQuestionUpdate.value[index].title = title;
  console.log(JSON.stringify(itemQuestionUpdate.value));
};

const handleGroupQuestionUpdate = ({ index, question }) => {
  itemQuestionUpdate.value[index].data = question;
  console.log(JSON.stringify(itemQuestionUpdate.value));
};

const handleAddQuestion = () => {
  itemQuestionUpdate.value.push({
    id: itemQuestionUpdate.value.length.toString(),
    title: "",
    sumScore: 0,
    data: [],
  });
};

watch(itemQuestionUpdate.value, () => {
  emit("on-data-input", itemQuestionUpdate.value);
});
</script>
