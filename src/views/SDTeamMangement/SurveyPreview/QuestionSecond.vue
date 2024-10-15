<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-card-text>
      <ToolbarSurvey :step="stepper.index" :is-done="stepper.prevCompleted" />
    </v-card-text>
    <div class="mt-2">
      <v-card elevation="1" color="#FFF1F0">
        <v-card-title class="text-center text-secondary">
          {{ questionnaireName?.title.split('<br>')[0] }}
          <br>
          {{ questionnaireName?.title.split('<br>')[1] }}
        </v-card-title>
        <v-card-text class="text-secondary">
          {{ questionnaireName?.description }}
        </v-card-text>
      </v-card>
    </div>
    <div class="preview-questionnaire">
      <QuestionnaireForm :sections="questionnaireForm" />
    </div>
    <v-row dense class="mt-5">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="secondary"
          width="140"
          class="text-capitalize ma-1"
          rounded
          @click="next"
        >
          ต่อไป
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import ToolbarSurvey from "@/components/items/ToolbarSurvey.vue";
import QuestionnaireForm from "@/components/forms/QuestionnaireForm.vue";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const questionnaireName = ref({});
const questionnaireForm = ref([]);

const stepper = ref({
  index: 3,
  prevCompleted: false,
});
onBeforeMount(() => {
  const info = sessionStorage.getItem("preview_question_second");
  const preview = JSON.parse(info);
  questionnaireName.value = preview.nameQuestionnaire;
  questionnaireForm.value = preview.createQuestionnaire;
});

const next = () => {
  router.push("/SDTeamMangement/Survey/Preview/QuestionThird");
};
</script>
