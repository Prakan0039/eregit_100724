<template>
  <v-card elevation="2" rounded="0" class="rounded-lg mt-3">
    <v-card-item class="ma-0">
      <v-row no-gutters dense justify="space-around">
        <v-col cols="1" align-self="center" class="pa-1">
          <span style="font-weight: bold">{{
            dateUtils.parseDdMmYy(item?.created_at)
          }}</span>
          <v-icon color="secondary" size="30" class="ml-3 mr-3"
            >mdi-equal-box</v-icon
          >
        </v-col>
        <v-col cols="3" align-self="center" class="pa-1">
          <strong>{{ item?.name.split('<br />')[0] }}</strong>
          <strong class="text-grey">(V.{{ item?.version }})</strong>
        </v-col>
        <v-divider vertical class="ma-2"></v-divider>
        <v-col cols="3" align-self="center" class="pa-1">
          <strong>Created by</strong>
          <br />
          <strong class="text-secondary">{{ item?.created_user_id }}</strong>
        </v-col>
        <v-col cols="3" align-self="center" class="pa-1">
          <v-btn
            class="me-2 text-none"
            color="secondary"
            variant="outlined"
            rounded
            @click="handlePreview(item?.id)"
          >
            Preview
          </v-btn>
          <v-btn
            v-if="props.actionId === 1"
            class="me-2 text-none"
            color="secondary"
            variant="flat"
            rounded
            @click="handleContinune(item?.id)"
          >
            Continue
          </v-btn>

          <v-btn
            v-else
            class="me-2 text-none"
            color="secondary"
            variant="flat"
            rounded
            @click="handleExportResult(item?.id, item?.name)"
          >
            Export Results
          </v-btn>
        </v-col>
        <v-col cols="1" align-self="center" class="pa-1">
          <v-menu v-if="props.actionVisible" transition="scale-transition">
            <template v-slot:activator="{ props }">
              <v-btn text v-bind="props" variant="text">
                <v-icon icon=" mdi-dots-horizontal"></v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item
                v-for="(menu, index) in ActionMenus"
                :key="index"
                @click="handleAction(item?.id, menu.emit)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="menu.icon" :color="menu.color"></v-icon>
                </template>
                <v-list-item-title :class="`text-${menu.color}`">{{
                  menu.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onBeforeMount, defineProps, computed, watch } from "vue";
import exportService from "@/apis/ExportService";
import RspService from "@/apis/RspService";
import dateUtils from "@/utils/dateUtils";
import { useRouter } from "vue-router";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
import mapperSurvay from "@/utils/mapperSurvay";
const router = useRouter();

// import { useConfirmationDialog } from '@/components/dialogs/ConfirmationDialogService'
// const { showDialog } = useConfirmationDialog();
// const tab = ref(null);
// const items = ref([]);

const emit = defineEmits(["action-menus"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  actionVisible: {
    type: Boolean,
    default: false,
  },
  actionId: {
    type: Number,
    default: 1,
  },
});

const ActionMenus = computed({
  get() {
    switch (props.actionId) {
      case 2:
        return [
          {
            title: "Deactivated Survey",
            icon: "mdi-chevron-right",
            color: "red",
            emit: "DEACTIVATED_SURVEY",
          },
          {
            title: "Permanently Delete",
            icon: "mdi-chevron-right",
            color: "black",
            emit: "PERMANENTLY_DELETE",
          },
        ];
      default:
        return [
          {
            title: "Delete",
            icon: "mdi-delete",
            color: "black",
            emit: "DELETE",
          },
        ];
    }
  },
});

const handleAction = (rspSurveyId, action) => {
  emit("action-menus", rspSurveyId, action);
};

const handleContinune = async (rspSurveyId) => {
  router.push(
    `/SDTeamMangement/Survey/Created?rsp_survey_id=${rspSurveyId}&name=${props.item.name}&description=${props.item.description}`
  );
};

const handlePreview = async (rspSurveyId) => {
  await getRspSurvey(rspSurveyId);
  // router.push(
  //   `/SDTeamMangement/Survey/Created?rsp_survey_id=${rspSurveyId}&name=${props.item.name}&description=${props.item.description}`
  // );
};

const setp2Quest = ref({
  nameQuestionnaire: {
    title: "",
    description: "",
  },
  createQuestionnaire: [],
});

const setp3Quest = ref({
  nameQuestionnaire: {
    title: "",
    description: "",
  },
  createQuestionnaire: [],
});

const getRspSurvey = async (id) => {
  try {
    const response = await RspService.getRspSurveyQuestionaire(id);
    if (response.data.is_success) {
      if (response.data?.is_success) {
        const questionnaireData = response.data.data;
        const { mySurvayStructureTwo, mySurvayStructureThree } =
          mapperSurvay.MapperSurvay(
            questionnaireData,
            { name: props.item.name, description: props.item.description },
            null,
            null
          );
        setp2Quest.value = mySurvayStructureTwo;
        setp3Quest.value = mySurvayStructureThree;

        setp3Quest.value.nameQuestionnaire = setp2Quest.value.nameQuestionnaire;

        const json2Array = JSON.stringify(setp2Quest.value);
        sessionStorage.setItem("preview_question_second", json2Array);

        const json3Array = JSON.stringify(setp3Quest.value);
        sessionStorage.setItem("preview_question_third", json3Array);

        router.push("/SDTeamMangement/Survey/Preview/QuestionSecond");
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
    return;
  }
};

const handleExportResult = async (rspSurveyId) => {
  try {
    const response = await RspService.exportRspSurveyResult(rspSurveyId);
    const file_url = response.data?.data?.file_url;
    if (file_url) {
      await exportService.downloadFileV2(file_url);
    } else {
      handlingErrorsMessage("Not found", "Url is null");
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
</script>
