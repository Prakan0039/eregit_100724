<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-app>
    <ExceptionHandleDialog />
    <confirm-dialog />
    <AlertDisclosureDialog />
    <v-app-bar :elevation="2" rounded>
      {{ is_disclosure }}
      {{ member_type }}
      {{ is_completed_profile }}
      <v-app-bar-title class="d-flex justify-center">
        <v-img
          :width="100"
          aspect-ratio="16/9"
          cover
          src="/frasers.png"
        ></v-img>
      </v-app-bar-title>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center">
      <v-container fluid>
        <!-- <div class="d-flex align-center justify-center">
          <h3 class="mb-9">Change Information</h3>
        </div> -->

        <div v-if="term_condition_id !== current_term_condition_id">
          <v-card-text>
            <div class="d-flex align-center pdf-container">
              <PDF :src="fileBase64" class="pdf-viewer"></PDF>
            </div>
          </v-card-text>
          <v-row align="center" dense class="mt-5" justify="center">
            <v-col cols="auto" class="d-flex align-center mt-n5">
              <input
                type="checkbox"
                id="agree"
                v-model="agreed"
                class="custom-checkbox mr-2"
              />
              <h3 for="agree">ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไข</h3>
            </v-col>
          </v-row>
          <v-row align="center" dense class="mt-5" justify="center">
            <v-col cols="auto" class="d-flex align-center mt-n5">
              <v-btn
                class="text-capitalize"
                :disabled="!agreed"
                @click="handleConfirm"
                rounded
                density="compact"
                style="background-color: #ed1c24"
                height="30"
              >
                <span class="text-white text-subtitle-1">รับทราบ</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="privacy_policy_id !== current_privacy_id">
          <v-card-text>
            <!-- <h6>Policy</h6> -->
            <div class="d-flex align-center pdf-container">
              <PDF :src="fileBase64Policy" class="pdf-viewer"></PDF>
            </div>
          </v-card-text>
          <v-row align="center" dense class="mt-5" justify="center">
            <v-col cols="auto" class="d-flex align-center mt-n5">
              <input
                type="checkbox"
                id="agree"
                v-model="agreed2"
                class="custom-checkbox mr-2"
              />
              <h3 for="agree">ข้าพเจ้าได้อ่านและยอมรับข้อกำหนดและเงื่อนไข</h3>
            </v-col>
          </v-row>
          <v-row align="center" dense class="mt-5" justify="center">
            <v-col cols="auto" class="d-flex align-center mt-n5">
              <v-btn
                class="text-capitalize"
                :disabled="!agreed2"
                @click="handleConfirmPolicy"
                rounded
                density="compact"
                style="background-color: #ed1c24"
                height="30"
              >
                <span class="text-white text-subtitle-1">รับทราบ</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <div
          v-else-if="
            !is_completed_profile
          "
        >
          <v-row dense>
            <v-col cols="12" class="">
              <v-form ref="formOne">
                <!-- <div class="d-flex align-center justify-center">
                <h3 class="py-5">Change Information</h3>
              </div>

              <div class="d-flex align-center justify-center">
                <h3 class="pa-5">เพิ่มข้อมูลประเภทคู่ค้า และ ประเภทธุรกิจ</h3>
              </div> -->
                <CompleteProfileForm
                  :business-partner-type="
                    company_info.business_partner_role?.id.toString()
                  "
                  class=""
                  @on-is-natural="handleIsNaturalPerson"
                  @on-button-cancel-click="handleReverse"
                  @on-button-ok-click="handleNext"
                  @on-input="handlePartnerRegisterInput"
                />
              </v-form>
            </v-col>

            <v-row>
              <v-col cols="12" class="d-flex justify-center mt-5 mb-5">
                <ButtonControl
                  style="min-width: 100px; height: 35px"
                  text="ส่ง"
                  @button-clicked="handleButtonSend"
                />
              </v-col>
            </v-row>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import PDF from "pdf-vue3";
import { ref, onMounted, onBeforeMount, watch } from "vue";
import axios from "axios";
import RspService from "@/apis/RspService";
import TermService from "@/apis/TermCondition";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { useSessionInfoStore } from "@/stores/papdStore";
import PartnerServive from "@/apis/PartnerServive";
import { useRouter } from "vue-router";

import ButtonControl from "@/components/controls/ButtonControl.vue";
import AttacheDocumentProfile from "@/components/forms/companies/AttacheProfile.vue";
import CompleteProfileForm from "@/components/forms/companies/CompleteProfileForm.vue";
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
import VerifyService from "@/apis/VerifyService";
const { showAlert } = useAlertDialogDialog();
const store = useSessionInfoStore();
const router = useRouter();
const { handlingErrorsMessage } = useErrorHandlingDialog();
const user_id = ref("");
// const url_song = ref("");
const agreed = ref(false);
// const song = ref(false);

const agreed2 = ref(false);
const fileBase64 = ref(null);
const fileBase64Policy = ref(null);
const pdf_url = ref(null);
let current_view = ref(1);

//1
const term_condition_id = ref(null);
const term_is_accepted = ref(null);
//2
const current_term_condition_id = ref(null);
const current_term_condition_url = ref(null);
//3
const privacy_policy_id = ref(null);
const privacy_is_accepted = ref(null);
//4
const current_privacy_id = ref(null);
const current_privacy_url = ref(null);
// const is_term_condition = ref(false);
const bp_number = ref("");
const is_completed_profile = ref("");
const is_disclosure = ref("");
const formOne = ref(null);
const member_type = ref("");
// const FORM_ID = {
//   Term_Condition: 0,
//   Complete_Profile: 1,

// };
// const is_id_form = ref(FORM_ID.Term_Condition);
onBeforeMount(async () => {
  //   let user_id = sessionStorage.getItem("userId");
  member_type.value = sessionStorage.getItem("member_type");
  console.log("member_type", member_type.value);

  user_id.value = sessionStorage.getItem("userId");
  console.log("Userrrrr", user_id.value);

  bp_number.value = sessionStorage.getItem("bp_numbers");
  console.log("bp_number", bp_number.value);
  //   console.log(auth_email);
});
onMounted(async () => {
  await getRspPolicyState();
  await getTermbyId(user_id.value);
  await getCurrentTermsAll();
  await getPrivacyPolicybyId(user_id.value);
  await getCurrentPrivacyPolicyAll();
  await getBusinessPartnerByBpNumber(bp_number.value);
  // current_view.value ++
  store.getsessionlinkstore();
  console.log("ommount", store.sessionInfo);
  // }
  if (
    term_condition_id.value == current_term_condition_id.value &&
    privacy_policy_id.value == current_privacy_id.value &&
    is_completed_profile.value &&
    is_disclosure.value &&
    member_type.value == 2
  ) {
    // console.log("coditionTerm");
    switch (store.sessionInfo.actions) {
      case 1:
        router.push({ name: store.sessionInfo.link_to });
        break;
      case 2:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 3:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 4:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 5:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
    }
  }

  if (
    term_condition_id.value == current_term_condition_id.value &&
    privacy_policy_id.value == current_privacy_id.value &&
    is_completed_profile.value &&
    !is_disclosure.value &&
    member_type.value == 2

  ) {
    router.push({
      name: "NonDisclosure",
      query: { form_number: formNumberOnUrl.value },
    });
  }

  if (
    term_condition_id.value == current_term_condition_id.value &&
    privacy_policy_id.value == current_privacy_id.value &&
    member_type.value !== 2
  ) {
    // console.log("coditionTerm");
    switch (store.sessionInfo.actions) {
      case 1:
        router.push({ name: store.sessionInfo.link_to });
        break;
      case 2:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 3:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 4:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
      case 5:
        router.push({
          name: store.sessionInfo.link_to,
          query: { form_number: store.sessionInfo.data },
        });
        break;
    }
  }
  // if (term_condition_id.value !== current_term_condition_id.value) {

  // }

  //   await getCurrentTerms();
  getUrlArraybuffer();
  getUrlArraybufferpolicy();
});

const getBusinessPartnerByBpNumber = async () => {
  try {
    const response = await PartnerServive.getBusinessPartnerByBpNumber(
      bp_number.value
    );

    if (response.data?.is_success) {
      // is_successfully.value = response.data?.is_success;
      is_completed_profile.value = response?.data?.data.is_completed_profile;
      // do_rsp_activity.value = response.data?.data?.business_partner_type?.do_rsp_activity ?? null;
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

const getUrlArraybuffer = async () => {
  try {
    const response = await axios({
      method: "get",
      responseType: "arraybuffer",
      url: current_term_condition_url.value,
    });
    const base64 = arrayBufferToBase64(response.data);
    fileBase64.value = base64;
  } catch (e) {
    handlingErrorsMessage("Failed to load PDF", e.message);
  }
};

const getUrlArraybufferpolicy = async () => {
  try {
    const response = await axios({
      method: "get",
      responseType: "arraybuffer",
      url: current_privacy_url.value,
    });
    const base64 = arrayBufferToBase64(response.data);
    fileBase64Policy.value = base64;
  } catch (e) {
    handlingErrorsMessage("Failed to load PDF", e.message);
  }
};
//api1
const getTermbyId = async () => {
  try {
    const response = await TermService.getTermsConditionsbyId(user_id.value);
    if (response.data?.is_success) {
      if (response.data.data) {
        // console.log("termm1111");
        const termData = response.data.data[0];
        // console.log("t", termData);
        term_condition_id.value = termData?.terms_and_conditions?.id ?? null;
        // console.log("term_condition_id.value", term_condition_id.value);
        term_is_accepted.value = termData?.is_accepted ?? null;
        // term_condition_id.value = response.data.data
        // term_is_accepted.value = response.data.data.is_accepted;

        return;
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    // is_progress.value = true;
  }
};
//api2
const getCurrentTermsAll = async () => {
  try {
    const response = await TermService.getCurrentTermsAll();
    if (response.data?.is_success) {
      //   if (response.data?.data && response.data.data.length > 0) {
      // console.log("ifffffffff");
      // pdf_url.value = response.data.data[0]?.file_url;
      current_term_condition_id.value = response?.data?.data?.id ?? null;
      // console.log("current_term_condition_id", current_term_condition_id.value);
      current_term_condition_url.value = response?.data?.data?.data ?? null;
      //   }
    } else {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
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
//api3
const getPrivacyPolicybyId = async () => {
  try {
    const response = await TermService.getPrivacyPolicybyId(user_id.value);
    if (response.data?.is_success) {
      if (response.data.data) {
        const policyData = response.data.data[0];
        privacy_policy_id.value = policyData?.privacy_policy?.id ?? null;
        // console.log("policyData", policyData.privacy_policy.id);
        privacy_is_accepted.value = policyData?.is_accepted ?? null;
        // is_can_do_next_step.value = true;
        // is_progress.value = true;
        return;
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    // is_progress.value = true;
  }
};
//4
const getCurrentPrivacyPolicyAll = async () => {
  try {
    const response = await TermService.getCurrentPrivacyPolicyAll();
    if (response.data?.is_success) {
      if (response.data.data) {
        // pdf_url.value = response.data.data[0]?.file_url;
        current_privacy_id.value = response.data.data.id;
        current_privacy_url.value = response.data.data.data;
      }
    } else {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
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

//testPDF
const getRspPolicyState = async () => {
  try {
    const response = await RspService.getRspPolicyState("active");
    if (response.data?.is_success) {
      if (response.data?.data && response.data.data.length > 0) {
        pdf_url.value = response.data.data[0]?.file_url;
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

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((item) => {
    binary += String.fromCharCode(item);
  });
  return window.btoa(binary);
};

const handleConfirm = async () => {
  console.log("coditionTermbrfor", store.sessionInfo);
  // alert("Proceeding to the next step");
  // console.log("term_condition_id.value",term_condition_id.value)
  // console.log("current_term_condition_id.value", current_term_condition_id.value)
  if (term_condition_id.value !== current_term_condition_id.value) {
    console.log("term_condition_id.value", term_condition_id.value);
    console.log(
      "current_term_condition_id.value",
      current_term_condition_id.value
    );
    try {
      const response = await TermService.createTermandConditionAcceptance(
        current_term_condition_id.value
      );
      if (response.data?.is_success) {
        // location.reload();
        // current_view.value++;
        // console.log("ooooooooooo", store.sessionInfo);
        // console.log("term_condition_id.value", term_condition_id.value)
        // console.log("current_term_condition_id.value", current_term_condition_id.value)
        if (
          privacy_policy_id.value == current_privacy_id.value &&
          is_completed_profile.value &&
          is_disclosure.value
        ) {
          store.getsessionlinkstore();
          console.log("coditionTerm", store.sessionInfo);
          switch (store.sessionInfo.actions) {
            case 1:
              router.push({ name: store.sessionInfo.link_to });
              break;
            case 2:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 3:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 4:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 5:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
          }
        } else {
          console.log("else=term1")
          location.reload();
          store.getsessionlinkstore();
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        // current_view.value == 2;
        // console.log("oooooooocathooo");
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data?.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
  }
};

const handleConfirmPolicy = async () => {
  // console.log("term_condition_id.value", term_condition_id.value);
  // console.log(
  //   "current_term_condition_id.value",
  //   current_term_condition_id.value
  // );
  if (privacy_policy_id?.value !== current_privacy_id.value) {
    try {
      const response = await TermService.createPrivacyPolicyAcceptance(
        current_privacy_id.value
      );
      if (response.data?.is_success) {
        if (
          member_type.value == 2 &&
          term_condition_id.value == current_term_condition_id.value &&
          is_completed_profile.value &&
          is_disclosure.value

        ) {
          store.getsessionlinkstore();
          console.log("coditionTerm==2", store.sessionInfo);
          console.log("member_type.value", member_type.value)
          switch (store.sessionInfo.actions) {
            case 1:
              router.push({ name: store.sessionInfo.link_to });
              break;
            case 2:
              // if(condition)
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 3:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 4:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 5:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
          }
        } else if (
          member_type.value !== 2 &&
          term_condition_id.value == current_term_condition_id.value

        ) {
          store.getsessionlinkstore();
          console.log("coditionTerm!22", store.sessionInfo);
          switch (store.sessionInfo.actions) {
            case 1:
              router.push({ name: store.sessionInfo.link_to });
              break;
            case 2:
              // if(condition)
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 3:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 4:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
            case 5:
              router.push({
                name: store.sessionInfo.link_to,
                query: { form_number: store.sessionInfo.data },
              });
              break;
          }
        } else
        {
          console.log("Error_swiftcase")
          location.reload();
          store.getsessionlinkstore();
        }


      }
    } catch (e) {
      if (e.response && e.response.data) {
        // current_view.value == 2;
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data?.error);
        console.log("else=catch=policy error")

        return;
      }
      // handlingErrorsMessage("unknown", e.message);
    }
  } else {
    current_view.value++;
  }
};
// complete_profile
const isHideButton = ref(false);
const company_info = ref({});

const formNumberOnUrl = ref("");
const dataForm = ref({
  partnerRegister: {
    register: {
      bp_number: "",
      business_partner_type: "",
      company_category: "",
      product_category: "",
    },
  },

  partnerDocs: {},
});

const createBusinessPartnerProfileBody = ref({
  bp_number: formNumberOnUrl.value,
  business_partner_type_id: "",
  company_category_id: "",
  product_category: "",
});

// const createDocumentBody = ref([]);

const handlePartnerRegisterInput = (data) => {
  dataForm.value.partnerRegister = data;
};
// const encodeFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       resolve(e.target.result);
//     };
//     reader.onerror = (e) => {
//       reject(e);
//     };
//     reader.readAsDataURL(file);
//   });
// };

// const handleFileRemoved = async (documents) => {
//   createDocumentBody.value = [];
//   dataForm.value.partnerDocs = documents;
//   for (let index = 0; index < dataForm.value.partnerDocs.length; index++) {
//     const el = dataForm.value.partnerDocs[index];
//     if (
//       !createDocumentBody.value.some((doc) => doc.document_name === el.name)
//     ) {
//       const base64String = await encodeFile(el);
//       createDocumentBody.value.push({
//         document_name: el.name,
//         data: base64String.split(",")[1],
//       });
//     }
//   }
// };
// const handleInputDocuments = async (documents) => {
//   createDocumentBody.value = [];
//   dataForm.value.partnerDocs = documents;
//   for (let index = 0; index < dataForm.value.partnerDocs.length; index++) {
//     const el = dataForm.value.partnerDocs[index];
//     if (
//       !createDocumentBody.value.some((doc) => doc.document_name === el.name)
//     ) {
//       const base64String = await encodeFile(el);
//       createDocumentBody.value.push({
//         document_name: el.name,
//         data: base64String.split(",")[1],
//       });
//     }
//   }
// };
const handleNext = async () => {
  if (
    await showAlert(
      "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      "ตรวจสอบข้อมูลของท่าน\nเป็นครั้งสุดท้ายก่อนกดส่งข้อมูล"
    )
  ) {
    isHideButton.value = true;
  }
  // }
};
onBeforeMount(async () => {
  let auth_email = sessionStorage.getItem("auth_email");
  console.log(auth_email);
  handleAuthorization(auth_email);

  formNumberOnUrl.value = sessionStorage.getItem("bp_numbers");
  console.log("bp_numberdashboard", formNumberOnUrl.value);
});

const handleAuthorization = async (email) => {
  try {
    const response = await VerifyService.getAuthenInfo(email);
    if (response.data?.is_success) {
      is_disclosure.value = response.data.data[0].is_disclosure;
      // console.log("response.data?.is_success", response.data?.is_success)
      console.log(
        "response.data?.is_disclosure",
        response.data.data[0].is_disclosure
      );
      // console.log("response.data?.bp_number", (response.data?.data[0]?.bp_number))
      if (response.data.data[0].is_disclosure) return;
      //  router.push("/Error?err=NOT_FOUND1111");/
    }
    // router.push("/Error?err=NOT_FOUND");
  } catch (e) {
    // router.push("/Error?err=NOT_FOUND");
  }
};
watch(
  dataForm.value,
  (newValue) => {
    createBusinessPartnerProfileBody.value.bp_number = formNumberOnUrl.value;
    createBusinessPartnerProfileBody.value.business_partner_type_id = Number(
      newValue.partnerRegister.register.business_partner_type
    );

    createBusinessPartnerProfileBody.value.company_category_id =
      newValue.partnerRegister.register.company_category;

    // if (createBusinessPartnerProfileBody.value.company_category_id == "")
    //   createBusinessPartnerProfileBody.value.company_category_id = 0;

    createBusinessPartnerProfileBody.value.product_category =
      newValue.partnerRegister.register.product_category;
  },
  { deep: true }
);
// const onCreatePartnerDocumentUploads = async () => {
//   try {
//     const response = await PartnerServive.createUploadDocuments(
//       formNumberOnUrl.value,
//       createDocumentBody.value
//     );
//     if (response.data.is_success) return true;
//     return false;
//   } catch (e) {
//     if (e.response) {
//       const val = e.response.data;
//       handlingErrorsMessage(val.message, val?.data.error);
//       return false;
//     }
//     handlingErrorsMessage("unknown", e.message);
//     return false;
//   }
// };
const onSumbitDataInsert = async () => {
  console.log("xxxxxxxxx");
  try {
    if (!is_disclosure.value) {
      router.push({
        name: "NonDisclosure",
        query: { form_number: formNumberOnUrl.value },
      });
    } else {
      store.getsessionlinkstore();
      console.log("coditionTerm", store.sessionInfo);
      switch (store.sessionInfo.actions) {
        case 1:
          router.push({ name: store.sessionInfo.link_to });
          break;
        case 2:
          router.push({
            name: store.sessionInfo.link_to,
            query: { form_number: store.sessionInfo.data },
          });
          break;
        case 3:
          router.push({
            name: store.sessionInfo.link_to,
            query: { form_number: store.sessionInfo.data },
          });
          break;
        case 4:
          router.push({
            name: store.sessionInfo.link_to,
            query: { form_number: store.sessionInfo.data },
          });
          break;
        case 5:
          router.push({
            name: store.sessionInfo.link_to,
            query: { form_number: store.sessionInfo.data },
          });
          break;
      }
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
    }
    handlingErrorsMessage("unknown", e.message);
  }
};
const onCreateBusinessPartnerProfileForm = async () => {
  try {
    const response = await PartnerServive.createBusinessPartnerCompleteProfile(
      createBusinessPartnerProfileBody.value
    );
    if (response.data.is_success) {
      // console.log("aaaaa")
      await onSumbitDataInsert();
      // if (createDocumentBody.value.length > 0) {
      //  if (await onCreatePartnerDocumentUploads()) {
      // await onSumbitDataInsert();
    } else {
      await onSumbitDataInsert();
      console.log("onSumbitDataInsert1");
    }
  } catch (e) {
    if (e.response) {
      console.log("ccccccc");
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};
const isIsNaturalPerson = ref(false);
const handleIsNaturalPerson = (value) => {
  isIsNaturalPerson.value = value;
};
const handleButtonSend = async () => {
  const is_valid = await formOne.value.validate();
  if (is_valid && is_valid["valid"]) {
    await onCreateBusinessPartnerProfileForm();
  }
};
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
}

.pdf-card-text {
  margin-top: 0;
}
.pdf-viewer {
  width: 70%;
  height: 100%;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.btn-active {
  background-color: rgb(var(--v-theme-secondary), 0.1);
  color: rgb(var(--v-theme-secondary)) !important;
  border-bottom-color: red;
  border-bottom-width: 2px;
}

@media (min-width: 992px) {
  .box-froms {
    margin-left: 150px;
    margin-right: 150px;
  }
}

.v-main {
  background-color: #f7f7f6 !important;
}
</style>
