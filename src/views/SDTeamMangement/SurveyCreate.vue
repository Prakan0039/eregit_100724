<template>
  <v-container fluid>
    <div>
      <h2>Mangement > Survey</h2>
      <v-col color="12" style="margin-left: 0px; margin-top: 0px">
        <StepperControl
          :currentStepNumber="stepper"
          :titles="[
            'ชื่อแบบสอบถาม',
            'คำถามเพิ่มเติม',
            'สร้างแบบสอบถาม',
            'สร้างเกณฑ์การประเมิน',
          ]"
        />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="secondary"
          variant="outlined"
          width="140"
          class="text-capitalize mr-2"
          v-if="stepper === 2 || stepper === 3"
          rounded
          @click="
            stepper === 2
              ? previewSecond()
              : stepper === 3
              ? previewThird()
              : null
          "
        >
          <v-icon left>mdi-tag</v-icon>
          Preview
        </v-btn>
        <v-btn color="secondary" width="140" class="text-capitalize" rounded>
          <v-icon left>mdi-tag</v-icon>
          Save Darft
        </v-btn>
      </v-col>
      <div class="mr-15 ml-15">
        <div v-show="stepper === 1">
          <v-row justify="end" class="mt-2 mb-2"> </v-row>
          <v-card class="elevation-1">
            <v-card-text>
              <v-form ref="descForm">
                <v-row no-gutters dense>
                  <v-col>
                    <h4>ชื่อแบบสอบถาม</h4>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="setp2Quest.nameQuestionnaire.title"
                      variant="outlined"
                      placeholder="ชื่อแบบสอบถาม"
                      required
                      density="compact"
                      :rules="[(v) => !!v || 'ชื่อแบบสอบถาม เป็นสิ่งจำเป็น.']"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters dense>
                  <v-col>
                    <h4>คำอธิบาย</h4>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="setp2Quest.nameQuestionnaire.description"
                      variant="outlined"
                      required
                      placeholder="คำอธิบาย"
                      :rules="[(v) => !!v || 'คำอธิบาย เป็นสิ่งจำเป็น.']"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <div v-show="stepper === 2">
          <v-form ref="suveyOtherQuestionForm">
            <SuveyOtherQuestion
              :default-item="setp2Quest.createQuestionnaire"
              @on-data-input="handleItemSuevayOhterUpdate"
            />
          </v-form>
        </div>
        <div v-show="stepper === 3">
          <v-form ref="suveyQuestionForm">
            <SurveyQuestion
              ref="suveyQuestion"
              :default-item="setp3Quest.createQuestionnaire"
              @on-data-input="handleItemSuevayQuestionUpdate"
            />
          </v-form>
        </div>
        <div v-show="stepper === 4">
          <v-form ref="suveyScoreMgmt">
            <SuveyScoreManament
              :default-item="itemScoreMgmtFetch"
              @on-update="handleScoreMgmtUpdated"
            />
          </v-form>
        </div>
      </div>
      <div v-show="stepper === 5">
        <SuveyActived @on-updated="handeldateUpdated" />
      </div>

      <div class="text-center mt-5">
        <v-btn
          rounded
          variant="outlined"
          class="ma-2"
          color="secondary"
          style="width: 100px"
          @click="back"
        >
          <strong>ย้อนกลับ</strong>
        </v-btn>
        <v-btn
          rounded
          class="ma-2"
          color="secondary"
          style="width: 100px"
          @click="next"
        >
          <strong>{{ stepper != 4 ? "ต่อไป" : "เสร็จ" }}</strong>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script setup>
import StepperControl from "@/components/controls/StepperControl.vue";
import SurveyQuestion from "@/views/SDTeamMangement/Survey/SurveyQuestion.vue";
import SuveyOtherQuestion from "@/views/SDTeamMangement/Survey/SuveyOtherQuestion.vue";
import SuveyScoreManament from "@/views/SDTeamMangement/Survey/SuveyScoreManament.vue";
import SuveyActived from "@/views/SDTeamMangement/SurveyQuestion/SurveyActived.vue";
import { ref, watch, onMounted } from "vue";
import ResService from "@/apis/RspService.js";
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
import { useRoute, useRouter } from "vue-router";
import RspService from "@/apis/RspService.js";
import mapperSurvay from "@/utils/mapperSurvay";

const route = useRoute();
const router = useRouter();
const { showAlert } = useAlertDialogDialog();

const stepper = ref(1);

const descForm = ref(null);
const suveyOtherQuestionForm = ref(null);
const suveyQuestionForm = ref(null);
const suveyScoreMgmt = ref(null);

const itemQuestion = ref([]);
const itemOtherQuest = ref([]);
const itemScoreMgmt = ref({});

const itemScoreMgmtFetch = ref([]);

const setp2Quest = ref({
  nameQuestionnaire: {
    title: "TEST",
    description: "TEST",
  },
  createQuestionnaire: [],
});

const setp3Quest = ref({
  nameQuestionnaire: {
    title: "TEST",
    description: "TEST",
  },
  createQuestionnaire: [],
});

const id = route.query.rsp_survey_id;
const name = route.query.name;
const description = route.query.description;
const publicDate = route.query.public_date;

const tempSizeQuestStep2 = ref(0);
const tempSizeQuestStep3 = ref(0);
const tempSizeScore = ref(0);

onMounted(async () => {
  if (id) {
    await getRspSurvey();
    await geteValuationCriteriaBySurvey();
  }
});

const pulisbDate = ref(publicDate);

const handeldateUpdated = (date) => {
  pulisbDate.value = date;
};

const getRspSurvey = async () => {
  try {
    const response = await RspService.getRspSurveyQuestionaire(id);
    if (response.data?.is_success) {
      const questionnaireData = response.data.data;
      const { mySurvayStructureTwo, mySurvayStructureThree } =
        mapperSurvay.MapperSurvay(
          questionnaireData,
          { name, description },
          null,
          null
        );
      setp2Quest.value = mySurvayStructureTwo;
      setp3Quest.value = mySurvayStructureThree;

      tempSizeQuestStep2.value = setp2Quest.value.createQuestionnaire.length;
      tempSizeQuestStep3.value = setp3Quest.value.createQuestionnaire.length;
    }
  } catch (error) {
    setp2Quest.value.nameQuestionnaire.title = name;
    setp2Quest.value.nameQuestionnaire.description = description;
    console.log(error);
    return;
  }
};

const geteValuationCriteriaBySurvey = async () => {
  try {
    const response = await RspService.geteValuationCriteriaBySurvey(id);
    if (response.data.is_success) {
      itemScoreMgmtFetch.value = response.data.data;
      tempSizeScore.value = itemScoreMgmtFetch.value.length;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

watch(
  () => setp2Quest.value.nameQuestionnaire,
  () => {
    setp3Quest.value.nameQuestionnaire = setp2Quest.value.nameQuestionnaire;
  }
);

const handleScoreMgmtUpdated = (dataInput) => {
  itemScoreMgmt.value = dataInput;
};

const handleItemSuevayOhterUpdate = (data) => {
  itemOtherQuest.value = data;
  setp2Quest.value.createQuestionnaire = itemOtherQuest.value;
  // console.log("setp2Quest : ", JSON.stringify(setp2Quest.value));
};

const handleItemSuevayQuestionUpdate = (data) => {
  itemQuestion.value = data;
  setp3Quest.value.createQuestionnaire = itemQuestion.value;
  // console.log("setp3Quest : ", JSON.stringify(setp2Quest.value));
};

let rsp_survey_id = null;
const next = async () => {
  if (stepper.value == 1) {
    const is_valid = await descForm.value.validate();
    if (!is_valid["valid"]) {
      console.warn("Show Warning Alart Desc Form Ivalidation Error");
      return;
    }
    try {
      if (!id) {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() + 1);
        const isoDate = currDate.toISOString();
        const response = await ResService.createRspSuvey(
          setp2Quest.value.nameQuestionnaire.title,
          setp2Quest.value.nameQuestionnaire.description,
          isoDate
        );
        if (response.data.is_success) {
          rsp_survey_id = response.data.data.id;
        } else {
          return;
        }
      } else {
        const dateObject = new Date(publicDate.split(" ")[0]);
        const response = await ResService.updateRspSuvey(
          id,
          setp2Quest.value.nameQuestionnaire.title,
          setp2Quest.value.nameQuestionnaire.description,
          dateObject
        );
        if (response.data.is_success) {
          rsp_survey_id = response.data.data.id;
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  if (stepper.value == 3) {
    const is_valid = await suveyQuestionForm.value.validate();
    if (!is_valid["valid"]) {
      console.warn("Show Warning Alart Suvey Question Form Ivalidation Error");
      return;
    }
    const bodyRequest = {
      rsp_survey_id,
      sections: [],
    };

    bodyRequest.sections.push(
      generateQuestionsBody(
        1,
        0,
        "Additional Question",
        setp2Quest.value.createQuestionnaire,
        setp2Quest.value.id ?? undefined,
        tempSizeQuestStep2.value === 0
      )
    );

    setp3Quest.value.createQuestionnaire.forEach((section, index) => {
      bodyRequest.sections.push(
        generateQuestionsBody(
          2,
          index + 1,
          section.title,
          section.data,
          section.id,
          tempSizeQuestStep3.value === 0
        )
      );
    });

    // console.log(JSON.stringify(bodyRequest));

    try {
      if (tempSizeQuestStep3.value === 0 && tempSizeQuestStep2.value === 0) {
        const response = await ResService.createRspSuveyQusetion(bodyRequest);
        if (!response.data.is_success) return;
      } else {
        const response = await ResService.updateRspSuveyQusetion(
          id,
          bodyRequest
        );
        if (!response.data.is_success) return;
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  if (stepper.value == 4) {
    try {
      const bodyRequest = {
        rsp_survey_id,
        evaluation_criteria: itemScoreMgmt.value.listOfScore.map((item) => {
          const rsp_survey_evaluation_criteria_id = item.id;
          return {
            ...(rsp_survey_evaluation_criteria_id !== undefined && {
              rsp_survey_evaluation_criteria_id,
            }),
            name: item.rank,
            minimum_score_criteria: getScore(item.score),
            description: item.desc,
            image_url: "",
          };
        }),
      };
      if (itemScoreMgmtFetch.value === 0) {
        const response = await ResService.createRspSuveyEvaluationCriteria(
          bodyRequest
        );
        await showAlert("Success", response.data.message);
        if (!response.data.is_success) return;
      } else {
        const response = await ResService.updateRspSuveyEvaluationCriteria(
          bodyRequest
        );
        await showAlert("Success", response.data.message);
        if (!response.data.is_success) return;
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  }

  if (stepper.value < 4) stepper.value++;
};

const back = () => {
  if (stepper.value == 1) {
    router.push("/SDTeamMangement/Survey");
    return;
  }
  if (stepper.value > 1) stepper.value--;
};

const generateQuestionsBody = (
  section_type_id,
  sequence,
  name,
  questionnaire = [],
  rsp_survey_section_id,
  is_create = true
) => {
  const result = {
    section_type_id: section_type_id,
    sequence,
    name,
    score: 0,
    questions: [],
  };

  if (rsp_survey_section_id && !is_create)
    result.rsp_survey_section_id = Number(rsp_survey_section_id);

  result.questions = questionnaire.map((item) => {
    const rsp_survey_question_id = !is_create ? Number(item.id) : undefined;
    // const rsp_survey_question_id = Number(item.id);

    if (item.data.controlType == "Paragraph") {
      return {
        ...(rsp_survey_question_id !== undefined && { rsp_survey_question_id }),
        // rsp_survey_question_id,
        is_alignment_question: isAligned(item.typeQuestionCard),
        question_type_id: 1,
        question: item.data.metaData.question,
        sequence: item.index,
        score: getScore(item.data.metaData?.totalScore),
        is_required: item.data.metaData.isRequired ?? false,
      };
    }
    if (item.data.controlType == "Multichoice") {
      return {
        ...(rsp_survey_question_id !== undefined && { rsp_survey_question_id }),
        // rsp_survey_question_id,
        is_alignment_question: isAligned(item.typeQuestionCard),
        question_type_id: 2,
        question: item.data.metaData.question,
        sequence: item.index,
        score: getScore(item.data.metaData?.totalScore),
        is_required: item.data.metaData.isRequired ?? false,
        choices: item.data.metaData.choices.map((choice, index) => {
          return {
            answer: choice.answer,
            is_aligned: isAligned(choice.isAlign) ?? false,
            is_other_choice: isOtherChoice(choice.title),
            sequence: index + 1,
            score: getScore(choice?.score),
            next_question_sequence: Number(choice?.nextQuestion - 1) ?? 0,
          };
        }),
      };
    }
    if (item.data.controlType == "Checkbox") {
      return {
        ...(rsp_survey_question_id !== undefined && { rsp_survey_question_id }),
        // rsp_survey_question_id,
        is_alignment_question: isAligned(item.typeQuestionCard),
        question_type_id: 3,
        question: item.data.metaData.question,
        sequence: item.index,
        is_required: item.data.metaData.isRequired ?? false,
        choices: item.data.metaData.choices.map((choice, index) => {
          return {
            answer: choice.answer,
            is_aligned: isAligned(choice.isAlign) ?? false,
            is_other_choice: isOtherChoice(choice.title),
            sequence: index + 1,
            score: getScore(choice?.score),
            next_question_sequence: Number(choice?.nextQuestion - 1) ?? 0,
          };
        }),
      };
    }
    if (item.data.controlType == "Uploads") {
      return {
        ...(rsp_survey_question_id !== undefined && { rsp_survey_question_id }),
        // rsp_survey_question_id,
        is_alignment_question: isAligned(item.typeQuestionCard),
        question_type_id: 5,
        question: item.data.metaData.question,
        sequence: item.index,
        score: getScore(item.data.metaData?.totalScore),
        is_required: item.data.metaData.isRequired ?? false,
      };
    }
    if (item.data.controlType == "Dropdown") {
      return {
        ...(rsp_survey_question_id !== undefined && { rsp_survey_question_id }),
        // rsp_survey_question_id,
        is_alignment_question: isAligned(item.typeQuestionCard),
        question_type_id: 3,
        question: item.data.metaData.question,
        sequence: item.index,
        is_required: item.data.metaData.isRequired ?? false,
        choices: item.data.metaData.choices.map((choice, index) => {
          return {
            answer: choice.answer,
            is_aligned: isAligned(choice.isAlign) ?? false,
            is_other_choice: isOtherChoice(choice.title),
            sequence: index + 1,
            score: getScore(choice?.score),
            next_question_sequence: Number(choice?.nextQuestion - 1) ?? 0,
          };
        }),
      };
    }
  });
  return result;
};

// const getNextQuestion = (nextQuestionId, isOtherQuestionnaire) => {
//   if (!isOtherQuestionnaire) {
//     const items = setp3Quest.value.createQuestionnaire
//       .flatMap((questionnaire) =>
//         questionnaire.data.map((item) => ({
//           ...item,
//         }))
//       )
//       .flat();
//     const findSeq = items.find((item) => item.id == nextQuestionId);
//     return findSeq ? findSeq.index : 0;
//   } else {
//     const items = setp2Quest.value.createQuestionnaire;
//     const findSeq = items.find((item) => item.id == nextQuestionId);
//     return findSeq ? findSeq.index : 0;
//   }
// };

const getScore = (elementScore) => {
  if (!elementScore || elementScore == "") return 0;
  return Number(elementScore);
};

const isAligned = (typeQuestionCard) => {
  return typeQuestionCard && typeQuestionCard == "Align";
};

const isOtherChoice = (typeChoice) => {
  return typeChoice && typeChoice == "other";
};

const previewSecond = () => {
  const jsonArray = JSON.stringify(setp2Quest.value);
  sessionStorage.setItem("preview_question_second", jsonArray);
  router.push("/SDTeamMangement/Survey/Preview/QuestionSecond");
};

const previewThird = () => {
  const jsonArray = JSON.stringify(setp3Quest.value);
  sessionStorage.setItem("preview_question_third", jsonArray);
  router.push("/SDTeamMangement/Survey/Preview/QuestionThird");
};
</script>
