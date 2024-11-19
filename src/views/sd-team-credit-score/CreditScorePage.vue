<template>
  <v-container fluid>
    <v-card rounded class="mx-auto">
      <v-card-item class="d-flex align-center justify-center">
        <v-row dense no-gutters>
          <v-col cols="12" class="text-center">
            <h3>Your Credit Score</h3>
          </v-col>
          <v-col cols="12">
            <v-row justify="center" align="center">
              <v-col v-if="level" cols="auto" class="d-flex align-center">
                <v-avatar color="secondary" size="50"
                  ><h1>{{ level }}</h1></v-avatar
                >
              </v-col>
              <!-- <v-col cols="auto" class="d-flex align-center">
                <h4>Your Score {{ score }}/100</h4>
              </v-col> -->
            </v-row>
          </v-col>
          <v-col cols="12" class="justify-center">
            <v-progress-linear
              color="secondary"
              :model-value="score"
              :height="9"
              style="width: 50%; margin-top: 15px"
            ></v-progress-linear>
          </v-col>
          <v-col cols="12" class="mt-8 d-flex justify-center">
            <v-img
              :height="500"
              :width="1000"
              aspect-ratio="16/9"
              cover
              src="https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"
            ></v-img>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-text v-if="description">
        {{ description }}
      </v-card-text>
    </v-card>
    <v-container fluid>
      <v-row>
        <v-col v-for="item in items" :key="item.title" cols="12" md="6" lg="3">
          <cradit-item
            :value="item.value"
            :title="item.title"
            :description="item.description"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-footer color="transparent" style="margin-top: 120px">
      <v-row justify="center">
        <!-- <v-col cols="auto">
          <button-control
            color="black"
            text="ย้อนกลับ"
            width="100"
            @button-clicked="on_go_to_back"
          />
        </v-col> -->
        <v-col cols="auto">
          <button-control
            type="submit"
            @button-clicked="submit_cradit_score"
            color="secondary"
            text="ตกลง"
            width="100"
          />
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CraditItem from "@/components/items/CraditItem.vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";
import RspService from "@/apis/RspService";

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

const router = useRouter();
const route = useRoute();

const score = ref(0);
const survey_result_details = ref({});
const level = ref("A");

const state = ref(null);
const bp_number = ref(null);
const rsp_survey_id = ref(null);

onBeforeMount(() => {
  state.value = route.query.state;
  bp_number.value = route.query.bp_number;
  rsp_survey_id.value = route.query.rsp_survey_id;
});

onMounted(async () => {
  await getRspSurveyResultDetail(bp_number.value);
});

const description = ref("");

const items = ref([
  // { title: "Management approach known", value: 90, description: "Great" },
  // { title: "Management approach known", value: 65, description: "Not bad" },
  // {
  //   title: "Management approach known",
  //   value: 30,
  //   description: "Needs to improve",
  // },
  // { title: "Management approach known", value: 90, description: "Great" },
  // { title: "Management approach known", value: 65, description: "Not bad" },
  // {
  //   title: "Management approach known",
  //   value: 30,
  //   description: "Needs to improve",
  // },
  // { title: "Management approach known", value: 90, description: "Great" },
  // { title: "Management approach known", value: 65, description: "Not bad" },
]);

const getRspSurveyResultDetail = async (bp_number) => {
  try {
    const response = await RspService.getRspSurveyResultDetail(bp_number);
    if (response.data?.is_success) {
      survey_result_details.value = response.data?.data;

      if (
        survey_result_details.value?.survey_result
          ?.rsp_survey_evaluation_criteria?.description
      ) {
        description.value =
          survey_result_details.value?.survey_result?.rsp_survey_evaluation_criteria?.description;
      }

      if (survey_result_details.value?.survey_result?.score) {
        score.value = survey_result_details.value?.survey_result?.score;
      }

      if (
        survey_result_details.value?.survey_result
          ?.rsp_survey_evaluation_criteria?.name
      ) {
        level.value =
          survey_result_details.value?.survey_result?.rsp_survey_evaluation_criteria.name;
      }

      if (survey_result_details.value?.survey_result?.section) {
        items.value = survey_result_details.value?.survey_result?.section.map(
          (el) => {
            return {
              title: el.name,
              value: el.score_percentage,
            };
          }
        );
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

// const on_go_to_back = () => {};
const submit_cradit_score = () => {
  router.push(
    `/SDTeamMangement/Survey/Tranning/${bp_number.value}`
  );
};
</script>
