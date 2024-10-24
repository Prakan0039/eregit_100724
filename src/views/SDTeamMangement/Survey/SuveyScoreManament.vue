<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        label="คะแนนรวมทั้งหมด"
        variant="outlined"
        readonly
        v-model="dataInput.totalScore"
        density="compact"
      ></v-text-field>
    </v-col>
    <v-col
      cols="12"
      v-for="(item, index) in dataInput.listOfScore"
      :key="index"
    >
      <UploadScore
        :metaDataUploadScore="item"
        :index="index"
        @on-update="handleUpdateScore"
        @on-remove="handleRemoveScoreById"
      />
    </v-col>
    <v-col cols="1">
      <v-btn
        prepend-icon="mdi mdi-plus-circle-outline"
        variant="outlined"
        block
        rounded
        color="secondary"
        class="ma-2 pa-2"
        @click="handleAddScoreCard"
        >เพิ่ม</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, watch } from "vue";
import UploadScore from "@/components/survey/forms/uploads-control/UploadScoreMgmt.vue";

const propsVar = defineProps({
  defaultItem: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["on-update"]);

const dataInput = reactive({
  totalScore: 0,
  listOfScore: [],
});

const handleAddScoreCard = () => {
  dataInput.listOfScore.push({
    score: "",
    rank: "",
    desc: "",
    files: [],
  });
};

watch(
  () => propsVar.defaultItem,
  () => {
    propsVar.defaultItem.forEach((item) => {
      dataInput.listOfScore.push({
        id: item.rsp_survey_evaluation_criteria_id,
        score: item.minimum_score_criteria,
        rank: item.name,
        desc: item.description,
        files: [],
      });
    });
  },
  { deep: true }
);

watch(
  () => dataInput,
  () => {
    emit("on-update", dataInput);
  },
  { deep: true }
);

watch(
  dataInput.listOfScore,
  (newValue) => {
    console.log(newValue);
    dataInput.totalScore = newValue.reduce(
      (sum, question) => sum + (Number(question.score) || 0),
      0
    );
  },
  { deep: true }
);

const handleUpdateScore = (item) => {
  // console.log(JSON.stringify(dataInput.listOfScore))
  const { upload_file_score, index } = item;
  dataInput.listOfScore[index] = upload_file_score;
};

const handleRemoveScoreById = (index) => {
  dataInput.listOfScore.splice(index, 1);
};
</script>
