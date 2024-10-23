<template>
  <v-container>
    <v-card-text>
      <ToolbarSurvey :step="stepper.index" :is-done="stepper.prevCompleted" />
    </v-card-text>
    <v-card-title class="text-center">
      <b>{{header.title.split('<br>')[0]}}</b
      ><br />{{header.title.split('<br>')[1]}}
    </v-card-title>
    <div class="text-center mt-5">
      <v-row>
        <v-col cols="8" class="d-flex">
          <h3 v-if="sections?.id">{{ sections?.title }}</h3>
        </v-col>
        <!-- <v-col cols="4" class="d-flex justify-end">
          <v-btn color="secondary" variant="outlined" width="140" class="text-capitalize mr-2" rounded>
            <v-icon left>mdi-share</v-icon>
            ส่งต่อ
          </v-btn>
          <v-btn color="secondary" width="140" class="text-capitalize" rounded>
            <v-icon left>mdi-tag</v-icon>
            Save Darft
          </v-btn>
        </v-col> -->
      </v-row>
    </div>
    <div class="preview-questionnaire">
      <QuestionnaireForm :sections="sections?.data" />
    </div>
    <v-row dense class="mt-5">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="secondary"
          width="140"
          variant="outlined"
          class="text-capitalize ma-1"
          rounded
          @click="prov"
        >
          ย้อนกลับ
        </v-btn>
        <v-btn
          v-if="number(index) === questionnaires.length"
          :disabled="number(index) === questionnaires.length"
          color="secondary"
          width="140"
          class="text-capitalize ma-1"
          rounded
        >
          ส่งแบบสอบถาม
        </v-btn>
        <v-btn
          v-else
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
import QuestionnaireForm from "@/components/forms/QuestionnaireForm.vue";
import ToolbarSurvey from "@/components/items/ToolbarSurvey.vue";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const stepper = ref({
  index: 3,
  prevCompleted: false,
});
const header = ref({
  title: "",
  description: "",
});

const sections = ref([]);
const questionnaires = ref([]);
const index = ref(0);
const count = ref(0);
onBeforeMount(() => {
  const info = sessionStorage.getItem("preview_question_third");
  const preview = JSON.parse(info);

  header.value = preview.nameQuestionnaire;
  questionnaires.value = preview.createQuestionnaire;
  count.value = questionnaires.value.length;
  index.value = 0;
  sections.value = questionnaires.value[index.value];
});
const number = (index) => {
  return Number(index) + 1;
};

const prov = () => {
  if (index.value == 0) {
    router.push("/SDTeamMangement/Survey/Preview/QuestionSecond");
    return;
  }
  if (index.value > 0) {
    index.value = index.value - 1;
    sections.value = questionnaires.value[index.value];
  }
};
const next = () => {
  if (index.value < questionnaires.value.length) {
    index.value = index.value + 1;
    sections.value = questionnaires.value[index.value];
  }
};
// const handleSendQuestion = async () =>{
//   const confirmed = await showDialog("ยืนยันการส่งแบบสอบถาม",'กรุณาตรวจสอบ\nคลิกปุ่ม"ตกลง"เพื่อดำเนินการ');
//   if (confirmed) {
//     // window.alert("Cancel");
//     handleAlertSuccessfully();
//   } else {
//     window.alert("Cancel");
//   }
// }

// const handleAlertSuccessfully = async () => {
//   const confirmed = await showAlert(
//     "ส่งแบบสอบถามเรียบร้อย",
//     "ขอบคุณที่ให้ความร่วมมือในการทำแบบสอบถามคุณสามารถทราบคะแนนในหน้าถัดไป"
//   );
//   if (confirmed) {
//     // router.push('/SDTeamMangement/RspPolicies');
//   }
// };
</script>
