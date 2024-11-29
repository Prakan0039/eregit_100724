  <!-- eslint-disable-next-line no-unused-vars -->

<template>
  <!-- {{ props.checkItemDashboard.taxpayerNumberId }} -->
  <div
    v-if="
    props.checkItemDashboard.do_rsp_activity
    "
  >
    <v-card
    class="mt-3 mx-1"
    :style="{ borderLeft: borderLeft2 }"
    color="white"
    style="border-radius: 10px !important;"
    elevation="1"
    >
      <v-card-item class="ma-0">
        <v-row>
          <v-alert
            color="white"
            elevation="1"
          >
            <div>
              <v-row
                no-gutters
                dense
                justify="space-around"
                class="mb-3 align-center"
              >
                <v-col cols="12" md="4" class="pa-1">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" size="40" class="ml-3 mr-3"
                      >mdi-text-box-check</v-icon
                    >
                    <div>
                      <strong>นโยบายการจัดซื้อจัดจ้างอย่างรับผิดชอบ</strong>
                      <br />
                      <strong class="font-weight-medium text-grey-lighten-1">{{
                        itemsPolicies[0]?.name?? null
                      }}</strong>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
              <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>Progress</strong>
                        <br />
                        <!-- <div v-if="satus[0]?.rsp?.policy?.status ?? null">
                          <strong
                          :class="onColor(satus[0]?.rsp?.policy?.status ?? null)"
                          >{{
                            satus[0]?.rsp?.policy?.status ?? null
                          }}</strong>
                        </div> -->
                        <div v-if="rspPolicyResule && rspPolicyResule.length !== 0">
                          <strong
                          class="text-green"
                          >
                          Completed
                          </strong>
                        </div>
                        <div v-else>
                          <strong
                          class="text-secondary"
                          >
                          Not Completed
                          </strong>
                        </div>

                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong class="text-secondary">{{ completed_email.email_sign ?? '-' }}</strong>
                        <br />

                        <div v-if="successfulTime.rsp_sign">
                          <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          {{
                            dateUtils.parseDdMmYyWithTimeAndSeconds(
                              successfulTime.rsp_sign ?? null
                            ) ?? '-'
                          }}</strong
                        >
                        </div>
                        <div v-else>
                          <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          <br>
                          {{
                                '-'
                          }}</strong
                        >
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>ติดต่อสอบถามd</strong>
                        <br />
                        <!-- <strong class="text-secondary">
                          {{ props.checkItemDashboard?.contactOwner ?? null }}</strong
                        > -->
                        <div v-if="props.checkItemDashboard.contactOwner" >
                        <strong class="text-secondary">
                          {{ props.checkItemDashboard.contactOwner  }}</strong
                        >
                        </div>
                        <div v-else>
                          <strong class="text-secondary">
                            {{ '-' }}</strong
                          >
                        </div>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="pa-1 mt-5"
                      v-if="!rspPolicyResule || rspPolicyResule.length === 0"
                    >
                      <v-btn
                        class="me-2 text-none"
                        color="secondary"
                        variant="flat"
                        style="width: 130px"
                        rounded
                        :to="`/SDTeamMangement/Survey/Document/1?prev_completed=completed&state=created&bp_number=${props?.bpnumber}`"
                      >
                        ทำเลย
                      </v-btn>
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                      class="pa-1 mt-5"
                      v-if="rspPolicyResule && rspPolicyResule.length !== 0"
                    >
                      <v-btn
                        class="me-2 text-none"
                        color="secondary"
                        variant="flat"
                        style="width: 130px"
                        rounded
                        @click="handleDowload"
                      >
                        Download
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-alert>
        </v-row>
      </v-card-item>
    </v-card>
  </div>

  <div
    v-if="
    props.checkItemDashboard.do_rsp_activity
    "
  >
    <v-card
      class="mt-3 mx-1"
      :style="{ borderLeft: borderLeft }"
      color="white"
      style="border-radius: 10px !important;"
      elevation="1"

    >
      <v-card-item class="ma-0">
        <v-row>
          <v-alert
            color="white"
            elevation="1"
          >
            <div>
              <v-row
                no-gutters
                dense
                justify="space-around"
                class="mb-3 align-center"
              >
                <v-col cols="12" md="4" class="pa-1">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" size="40" class="ml-3 mr-3"
                      >mdi-receipt-text-check</v-icon
                    >
                    <div>
                      <!-- <strong>แบบสำรวจด้านความยั่งยืนของคู่ค้า</strong> -->
                      <!-- <b>{{ items[0]?.name?.split('<br>')[0] }}</b> -->
                      <strong>แบบสำรวจด้านความยั่งยืนของคู่ค้า</strong>
                      <br />
                      <strong
                        class="font-weight-medium text-grey-lighten-1"
                        style="font-size: 12px"
                        >{{ items[0]?.name?.split('<br>')[1] }}</strong
                      >
                      <!-- {{ items }} -->
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>Progress</strong>
                        <br />
                        <!-- {{ satus[0]?.rsp?.survey?.status }} -->
                          <!-- <div v-if="satus[0]?.rsp?.survey?.status ?? null">
                        <strong
                         :class="onColor(satus[0]?.rsp?.survey?.status ?? null)"
                          >{{ satus[0]?.rsp?.survey?.status ?? null }}
                        </strong>
                      </div> -->
                      <div v-if="rspActivityStatusId == 3">
                        <strong
                         class="text-green"
                          >
                          Completed
                        </strong>
                      </div>

                        <div v-else>
                          <strong
                          class="text-secondary"
                          >
                          Not Completed
                          </strong>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong class="text-secondary">{{ completed_email.email_survey ?? '-'  }}</strong>
                        <br />
                        <!-- <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          {{
                            dateUtils.parseDdMmYyWithTimeAndSeconds(
                              successfulTime.rsp_survey ?? null
                            )
                          }}</strong
                        > -->

                        <div v-if="successfulTime.rsp_survey">
                          <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          {{
                            dateUtils.parseDdMmYyWithTimeAndSeconds(
                              successfulTime.rsp_survey ?? null
                            )
                          }}</strong
                        >
                        </div>
                        <div v-else>
                          <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          <br>
                          {{
                                '-'
                          }}</strong
                        >
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>ติดต่อสอบถาม</strong>
                        <br />
                        <div v-if="props.checkItemDashboard.contactOwner">
                          <strong class="text-secondary">
                            {{ props.checkItemDashboard.contactOwner ?? null }}</strong
                          >
                        </div>
                        <div v-else>
                          <strong class="text-secondary">
                            {{ '-' }}</strong
                          >
                        </div>
                        <!-- <strong class="text-secondary">
                          {{ props.checkItemDashboard.contactOwner ?? null }}</strong
                        > -->
                      </div>
                    </v-col>
                    <!-- <div > -->
                    <v-col
                      cols="12"
                      md="6"
                      class="pa-1 mt-5"
                      v-if="rspActivityStatusId !== 3"
                    >
                      <v-btn
                        class="me-2 text-none"
                        color="secondary"
                        variant="flat"
                        style="width: 130px"
                        rounded
                        :to="`/SDTeamMangement/Survey/Questionnaire/1?prev_completed=completed&state=created&bp_number=${props?.bpnumber}`"
                      >
                        ทำเลย
                      </v-btn>
                    </v-col>
                    <!-- </div> -->
                    <!-- <div > -->
                    <v-col
                      cols="12"
                      md="6"
                      class="pa-1 mt-5"
                      v-if="rspActivityStatusId == 3"
                    >
                      <v-btn
                        class="me-2 text-none"
                        color="secondary"
                        variant="flat"
                        style="width: 130px"
                        rounded
                        @click="DowloadSurvey"
                      >
                        Download
                      </v-btn>
                    </v-col>
                    <!-- </div> -->
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-alert>
        </v-row>
      </v-card-item>
    </v-card>
  </div>

  <div
  v-if="
  props.checkItemDashboard.do_rsp_activity
  "
>
  <v-card
  class="mt-3 mx-1"
  :style="{ borderLeft: borderLeft2 }"
  color="white"
  style="border-radius: 10px !important;"
  elevation="1"
  >
    <v-card-item class="ma-0">
      <v-row>
        <v-alert
          color="white"
          elevation="1"
        >
          <div>
            <v-row
              no-gutters
              dense
              justify="space-around"
              class="mb-3 align-center"
            >
              <v-col cols="12" md="4" class="pa-1">
                <div class="d-flex align-center">
                  <v-icon color="secondary" size="40" class="ml-3 mr-3"
                    >mdi mdi-laptop-account</v-icon
                  >
                  <div>
                    <strong>รับชมการเรียนรู้ Training</strong>
                    <br />
                    <strong class="font-weight-medium text-grey-lighten-1">
                      ยังไม่ได้เรียนรู้ 
                      <span class="text-secondary">
                        {{ (training.completed_amount || 0) + '/' + (training.total_amount || 0) }}
                      </span>
                    </strong>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="pa-1">
                <v-row no-gutters dense justify="space-around" class="mb-3">
            <v-col cols="12" md="6" class="pa-1">
                    <div>
                      <strong>Progress</strong>
                      <br />
                      <!-- <div v-if="satus[0]?.rsp?.policy?.status ?? null">
                        <strong
                        :class="onColor(satus[0]?.rsp?.policy?.status ?? null)"
                        >{{
                          satus[0]?.rsp?.policy?.status ?? null
                        }}</strong>
                      </div> -->
                      <div v-if="training.status === 'completed'">
                        <strong
                        class="text-green"
                        >
                        Completed
                        </strong>
                      </div>
                      <div v-else>
                        <strong
                        class="text-secondary"
                        >
                        Not Completed
                        </strong>
                      </div>

                    </div>
                  </v-col>
                  <v-col cols="12" md="6" class="pa-1">
                    <div>
                      <strong class="text-secondary">{{ completed_email.email_training ?? '-' }}</strong>
                      <br />

                      <div v-if="successfulTime.rsp_sign">
                        <strong class="font-weight-medium text-grey-lighten-1"
                        >Recently done :
                        {{
                          dateUtils.parseDdMmYyWithTimeAndSeconds(
                            successfulTime.rsp_training ?? null
                          ) ?? '-'
                        }}</strong
                      >
                      </div>
                      <div v-else>
                        <strong class="font-weight-medium text-grey-lighten-1"
                        >Recently done :
                        <br>
                        {{
                              '-'
                        }}</strong
                      >
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4" class="pa-1">
                <v-row no-gutters dense justify="space-around" class="mb-3">
                  <v-col cols="12" md="6" class="pa-1">
                    <div>
                      <strong>ติดต่อสอบถามd</strong>
                      <br />
                      <!-- <strong class="text-secondary">
                        {{ props.checkItemDashboard?.contactOwner ?? null }}</strong
                      > -->
                      <div v-if="props.checkItemDashboard.contactOwner" >
                      <strong class="text-secondary">
                        {{ props.checkItemDashboard.contactOwner  }}</strong
                      >
                      </div>
                      <div v-else>
                        <strong class="text-secondary">
                          {{ '-' }}</strong
                        >
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                    class="pa-1 mt-5"
                   
                  >
                    <v-btn
                      class="me-2 text-none"
                      color="secondary"
                      variant="flat"
                      style="width: 130px"
                      rounded
                      :to="`/SDTeamMangement/Survey/Tranning/1?prev_completed=completed&state=created&bp_number=${props?.bpnumber}`"
                    >
                      ทำเลย
                    </v-btn>
                  </v-col>

                  <!-- <v-col
                    cols="12"
                    md="6"
                    class="pa-1 mt-5"
                    v-if="rspPolicyResule && rspPolicyResule.length !== 0"
                  >
                    <v-btn
                      class="me-2 text-none"
                      color="secondary"
                      variant="flat"
                      style="width: 130px"
                      rounded
                      @click="handleDowload"
                    >
                      Download
                    </v-btn>
                  </v-col> -->
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-alert>
      </v-row>
    </v-card-item>
  </v-card>
</div>

<div
    v-if="
     !props.checkItemDashboard.do_rsp_activity?? null
    ">
    <v-card
      elevation="2"
      rounded="0"
      class="rounded-lg mb-5"
      v-if="itemsPolicies.length > 0"

    >
      <v-card-item class="ma-0">
        <v-row>
          <v-alert
            :style="{ borderLeft: borderLeft }"
            color="white"
            elevation="1"
          >
            <div>
              <v-row
                no-gutters
                dense
                justify="space-around"
                class="mb-3 align-center"
              >
                <v-col cols="12" md="4" class="pa-1">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" size="40" class="ml-3 mr-3"
                      >mdi mdi-office-building</v-icon
                    >
                    <div>
                      <strong>Completed Profile</strong>
                      <br />
                      <strong class="font-weight-medium text-grey-lighten-1">
                        ลงทะเบียนคู่ค้ากับทาง Frasers Property Thailand แล้ว
                      </strong>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>Progress</strong>
                        <br />

                        <strong class="font-weight-medium text-green"
                          >Completed</strong
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong class="text-secondary">{{ props.checkItemDashboard?.userEmail ?? null }}</strong>
                        <br />
                        <strong class="font-weight-medium text-grey-lighten-1"
                          >Recently done :
                          {{
                            dateUtils.parseDdMmYyWithTimeAndSeconds(
                              props.checkItemDashboard?.created?? null
                            )
                          }}</strong>
                        <!-- <span>{{dateUtils.parseDdMmYyWithTimeAndSeconds(props.businessPartnerFormBpNumber.created_at)}}</span> -->
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="4" class="pa-1">
                  <v-row no-gutters dense justify="space-around" class="mb-3">
                    <v-col cols="12" md="6" class="pa-1">
                      <div>
                        <strong>ติดต่อสอบถาม</strong>
                        <br />
                        <div v-if="props.checkItemDashboard.contactOwner">
                          <strong class="text-secondary">
                            {{ props.checkItemDashboard.contactOwner ?? null }}</strong
                          >
                        </div>
                        <div v-else>
                          <strong class="text-secondary">
                            {{ '-' }}</strong
                          >
                        </div>
                        <!-- <strong class="text-secondary">
                          {{ props.checkItemDashboard.contactOwner ?? null }}</strong
                        > -->
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-alert>
        </v-row>
      </v-card-item>
    </v-card>
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watchEffect, watch } from "vue";
import { Base64 } from "js-base64";
import { saveAs } from "file-saver";
// import PDF from "pdf-vue3";
import RspService from "@/apis/RspService";
import convertColorNameToRGB from "@/utils/util.js";
import axios from "axios";
// import exportService from '@/apis/ExportService';
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import UserService from "@/apis/UserService";
import dateUtils from "@/utils/dateUtils";
import ExportService from "@/apis/ExportService";

const props = defineProps({
  businessPartnerFormBpNumber: {
    type: Object,
    default: () => {},
  },
  businessPartnerProfile: {
    type: Object,
    default: () => {},
  },
  checkItemDashboard: {
    type: Object,
    default: () => {},
  },
  colorCardAlert: {
    type: String,
    default: "success", //success,warming,error
  },
  bpnumber: {
    type: String,
  },
});
const rsp_survey_id = ref(null);
const rspSurvayActive = ref(null);
const rspPolicyResule = ref(null);
const rspActivityStatusId = ref(null);
const inprogressSectionId = ref(null);
const rsp_policies_id = ref(null);
const rsp_url = ref(null);
const survey_url = ref(null);
const fileBase64 = ref(null);
// const created_userId = ref("");


const items = ref([]);
const itemsPolicies = ref([]);
const satus = ref([]);
const id = ref("");
const email = ref("");
// const tax = props.businessPartnerFormBpNumber.taxpayer_id_number
const { handlingErrorsMessage } = useErrorHandlingDialog();
// const getvendor_rsp_status = ref("");
// const user_id = ref("");
const successfulTime = ref({
  rsp_sign: "",
  rsp_survey: "",

  rsp_training: "",
  user_training:"",

  user_sign: "",
  user_survey: ""

});
const completed_email = ref({
  email_sign : null,
  email_survey: null,
  email_training: null

})

const training = ref({
  total_amount : null,
  completed_amount: null,
  status:null

})
onMounted(async () => {
  // props.businessPartnerFormBpNumber()
  // console.log("user_id", user_id.value);
  // user_id.value = sessionStorage.getItem("userId");
  // console.log("user_id", user_id.value);

});

watch(rsp_survey_id, async (newVal) => {
  if (newVal) {
    await getRspSurveyResults();
  }
});

watch(rsp_policies_id, async (newVal) => {
  if (newVal) {
    await getRspPolicyResults();
  }
});

const getUrlArraybuffer = async () => {
  console.log("rsp_url.value", rsp_url.value);
  try {
    const response = await axios({
      method: "get",
      responseType: "arraybuffer",
      url: rsp_url.value,
    });
    var base64 = arrayBufferToBase64(response.data);
    fileBase64.value = base64;
  } catch (error) {
    console.error("Error fetching URL:", error);
  }
};

const arrayBufferToBase64 = (buffer) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  bytes.forEach((item) => {
    binary += String.fromCharCode(item);
  });
  return window.btoa(binary);
};

const handleDowload = async () => {
  // const { value } = fileBase64;
  // const decode = Base64.toUint8Array(value);
  // const blob = new Blob([decode], { type: "application/pdf" });
  // saveAs(blob, props.bpnumber + ".pdf");
  if (!rsp_url.value || typeof rsp_url.value !== "string") {
    console.error("Invalid URL provided:", survey_url);
    return;
  }
  await ExportService.downloadFileV2(rsp_url.value);
};

const DowloadSurvey = async () => {
  if (!survey_url.value || typeof survey_url.value !== "string") {
    console.error("Invalid URL provided:", survey_url);
    return;
  }

  await ExportService.downloadFileV2(survey_url.value)

  // const fetchAndSaveSurvey = async () => {
  //   try {
  //     const response = await axios({
  //       method: "get",
  //       responseType: "arraybuffer",
  //       url: survey_url.value,
  //     });
  //     const base64 = arrayBufferToBase64(response.data);
  //     fileBase64.value = base64;
  //     handleDowload();
  //   } catch (error) {
  //     console.error("Error downloading survey:", error);
  //   }
  // };

  // fetchAndSaveSurvey();
};

const getRspSurveysActive = async () => {
  try {
    const response = await RspService.getRspSurveysActive();
    if (response.data?.is_success) {
      if (response.data?.data && response.data.data.length > 0) {
        rspSurvayActive.value = response.data.data[0];
        rsp_survey_id.value = response.data.data[0].id;
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const getRspPolicies = async () => {
  try {
    const response = await RspService.getRspPolicies();
    itemsPolicies.value = response.data.data;

    rsp_policies_id.value = response.data.data[0].id;
    rsp_url.value = response.data.data[0].file_url;

    id.value = response.data.data[0].created_user.created_user_id;
    // console.log("policie...", response.data.data[0].file_url);
    // getUrlArraybuffer();
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const downloadRspSurvey = async () => {
  try {
    const response = await RspService.downloadSurveyResult(
      props.bpnumber,
      rsp_survey_id.value
    );
    if (response.data?.is_success) {
      console.log("downloadRspSurvey:", response.data?.is_success)
      survey_url.value = response.data.data.file_url;
      console.log("getRspPolicyResults", survey_url.value);
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

const getRspPolicyResults = async () => {
  try {
    const response = await RspService.getRspPolicyResults(
      props.bpnumber,
      rsp_policies_id.value
    );
    if (response.data?.is_success) {
      rspPolicyResule.value = response.data.data[0];

      console.log("getRspPolicyResults", rspPolicyResule.value);
      // if (response.data.data && response.data.data.length > 0) {
      //   now(true);
      //   return;
      // }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const getRspSurveyResults = async () => {
  try {
    const response = await RspService.getRspSurveyResults(
      props.bpnumber,
      rsp_survey_id.value
    );
    console.log("response.data?.data", response.data?.data)
    // console.log("rsp_survey_id....", rsp_survey_id.value);
    if (response.data?.is_success) {
      // console.log("rsp_survey_id.value", rsp_survey_id.value)
      if (response.data?.data && response.data.data.length > 0) {

        rspActivityStatusId.value =
          response.data.data[0].rsp_activity_status.id;
          console.log("rspActivityStatusId.value", rspActivityStatusId.value)
        inprogressSectionId.value = response.data.data[0].inprogress_section_id;


        // console.log(
        //   "response.data.data[0].rsp_activity_status.id",
        //   response.data.data[0].rsp_activity_status.id
        // );
        // if (response.data.data[0].rsp_activity_status.id != 3) {
        // Got to Question
        // }
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};
// const getusers = async () => {
//   try {
//     const response = await UserService.getUserById(user_id.value);
//     email.value = response.data.data.email;
//     // console.log(email.value);RspService.getRspVendorSatus
//   } catch (e) {
//     if (e.response) {
//       const val = e.response.data;
//       handlingErrorsMessage(val.message, val?.data.error);
//       return;
//     }
//     handlingErrorsMessage("unknown", e.message);
//   }
// };

const getRspVendorSatus = async () => {
  try {
    const response = await RspService.getRspVendorSatus("tax_id",props.checkItemDashboard.taxpayerNumberId);
    if (response.data?.is_success) {
      satus.value = response.data.data;
      // console.log("stat0000000000",response.data.data);
      const rspData = satus.value[0].rsp;

      if (satus.value && satus.value.length > 0 && satus.value[0].rsp) {
        successfulTime.value.rsp_survey = rspData?.survey?.completed_at ?? null;
        successfulTime.value.rsp_sign = rspData?.policy?.completed_at ?? null;

        successfulTime.value.rsp_training = rspData?.training?.completed_at ?? null;
        // console.log("Userid.SERVEY",successfulTime.value.rsp_survey)
        // console.log("Userid.SERVEY",successfulTime.value.rsp_sign)
        training.value.completed_amount = rspData?.training?.completed_amount ?? 0;
        training.value.total_amount = rspData?.training?.total_amount ?? 0;
        training.value.status = rspData?.training?.status ?? null;



        if(rspData.survey.completed_user_id){
          successfulTime.value.user_survey = rspData?.survey?.completed_user_id?.id ?? null;
        }

        if(rspData.policy.completed_user_id){
          successfulTime.value.user_sign = rspData?.policy?.completed_user_id.id ?? null;
        }

        if(rspData.training.completed_user_id){
          successfulTime.value.user_training = rspData?.training?.completed_user_id.id ?? null;
        }
        // console.log("Userid.Sign",successfulTime.value.user_sign)
        // console.log("Userid.user_survey",successfulTime.value.user_survey)
      } else {
        successfulTime.value.rsp_survey = null;
        successfulTime.value.rsp_sign = null;
        successfulTime.value.rsp_training = null;
        
      }
    // console.log("RSP_SIGn", successfulTime.value.rsp_sign)
    // console.log("successfulTime.value.user_sign", successfulTime.value.user_sign)


      if(successfulTime.value.user_survey) {
        // console.log("server--<survey")
        const userrespone = await UserService.getUserById(
          successfulTime.value.user_survey
        );
        if(userrespone.data?.is_success ) {
          completed_email.value.email_survey = userrespone.data?.data?.email ?? null;
          console.log("completedEmail-->emailSurvey:",completed_email.value.email_survey)
        } else {
          return null;
        }
      }

      if(successfulTime.value.user_sign) {
        const signrespone = await UserService.getUserById(
          successfulTime.value.user_sign
        );
        console.log("aaaa",successfulTime.value.user_sign)
        if(signrespone.data?.is_success) {
          completed_email.value.email_sign = signrespone.data?.data?.email ?? null;
          console.log("completed_email.value.email_sign ", completed_email.value.email_sign )
        } else {
          return null;
        }

      }

      if(successfulTime.value.user_training) {
        const trainingrespone = await UserService.getUserById(
          successfulTime.value.user_training
        );
        console.log("aaaa",successfulTime.value.user_training)
        if(trainingrespone.data?.is_success) {
          completed_email.value.email_training = trainingrespone.data?.data?.email ?? null;
          // console.log("completed_email.value_user_training ", completed_email.value.email_sign )
        } else {
          return null;
        }

      }


      // console.log("success_rsp_sueiokfkoaslfk", successfulTime?.value?.rsp_sign);
    }

  } catch (e) {
    if (e.response) {
      // const val = e.response.data;
      // handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    // handlingErrorsMessage("unknown", e.message);
  }
};

// const getRspPolicyState = async () => {
//   try {
//     // activated_laoding.value = true;

//     const response = await RspService.getRspPolicyState('active');
//     if (response.data?.is_success) {
//       activated_items.value = response.data?.data
//     }
//   } catch (e) {
//     if (e.response) {
//       const val = e.response.data
//       handlingErrorsMessage(val.message, val?.data.error);
//       return;
//     }
//     handlingErrorsMessage("unknown", e.message);
//   } finally {
//     // activated_laoding.value = false;
//   }
// }
const getRspSurveys = async () => {
  try {
    const response = await RspService.getRspSurveysAll();
    items.value = response.data.data;
    console.log( " items.value",items.value);
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};


// eslint-disable-next-line vue/return-in-computed-property
const borderLeft = computed(() => {

  if (rspActivityStatusId.value !== 3) {
    const rgb = convertColorNameToRGB(props.colorCardAlert);
    return `rgba(${rgb}, 1) 8px solid`;
  }

});
// eslint-disable-next-line vue/return-in-computed-property
const borderLeft2 = computed(() => {

if (!rspPolicyResule.value) {
  const rgb = convertColorNameToRGB(props.colorCardAlert);
  return `rgba(${rgb}, 1) 8px solid`;
}

});

// const statusClass = computed(() => {
//   const status = satus.value[0]?.rsp?.survey?.status;
//   switch (status) {
//     case "completed":
//       return "text-green";
//     case "progress":
//       return "text-yellow";
//     case "initial":
//     default:
//       return "text-red";
//   }
// });
// const onColor = (type) => {
//   console.log("type", type)
//   if(type){
//   switch (type?.toString()?.toLowerCase()?? null) {
//     case "completed":
//       return "text-green";

//     case "not completed":
//       return "text-red";

//     case "progress":
//       return "text-yellow";

//     case "initial":
//       return "text-red";

//   }
// }else {
//   return "text-red";
// }
// };
const onColor = (type) => {
  console.log("type", type);

  if (type && type.length >= 0) {
    switch (type.toString().toLowerCase()) {
      case "completed":
        return "text-green";

      case "not completed":
        return "text-red";

      case "progress":
        return "text-yellow";

      case "initial":
        return "text-red";

      default:
        return "not completed";
    }
  } else {
    return "not completed";
  }
};

// const search_key = computed(() => {

//   return { search_key: "taxpayer_id_number",
//    value: props.businessPartnerFormBpNumber.taxpayer_id_number };

// });
watchEffect(async () => {
  const tax = props.checkItemDashboard.taxpayerNumberId;
  console.log("tax", tax);
  // const do_rsp =
  //   props.businessPartnerFormBpNumber?.business_partner_type?.do_rsp_activity ??
  //   null;
  const contact_id = props.checkItemDashboard.created_userId
  console.log("contact_id", contact_id);
  if (props.checkItemDashboard.taxpayerNumberId ) {
    await getRspVendorSatus();
    await getRspPolicies();

    // await getVendorRspStatus();
    // await getusers(user_id.value);
    await getRspSurveys();
    await getRspSurveysActive();
    await getRspSurveyResults();
    if(rspActivityStatusId.value == 3){
      await downloadRspSurvey();
    }
  }
});
</script>

<style scoped>

.text-green {
  color: green;
}

.text-red {
  color: red;
}

.text-yellow {
  color: yellow;
}

.text-default {
  color: black;
}

</style>
