<template>
  <v-container fluid>
    <div class="box-froms">
      <v-row dense>
        <v-col cols="12" class="">

          <div class="d-flex align-center justify-center">
            <h3 class="py-5">Change Profile</h3>
          </div>

          <div class="d-flex align-center justify-center">
            <h3 class="pa-5">เพิ่มข้อมูลประเภทคู่ค้า และ ประเภทธุรกิจ</h3>
          </div>
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

          <AttacheDocumentProfile
            :business-partner-type-id="
              dataForm.partnerRegister.register.business_partner_type
            "
            :is-hide-button="isHideButton"
            @on-button-cancel-click="handleReverse"
            @on-button-ok-click="handleNext"
            @on-input-files="handleInputDocuments"
            @remove-file="handleFileRemoved"
          />
        </v-col>

         <v-row>
        <v-col cols="12" class="d-flex justify-center mt-5 mb-5">
          <ButtonControl text="ส่ง" @button-clicked="handleButtonSend" />
        </v-col>
      </v-row>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
// import StepperControl from "@/components/controls/StepperControl.vue";
import AttacheDocumentProfile from "@/components/forms/companies/AttacheProfile.vue";
import CompleteProfileForm from "@/components/forms/companies/CompleteProfileForm.vue";
import { watch } from "vue";

// import AlertSuccessDialog from "@/components/dialogs/AlertSuccessDialog.vue";
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
const { showAlert } = useAlertDialogDialog();

import ButtonControl from "@/components/controls/ButtonControl.vue";
import PartnerServive from "@/apis/PartnerServive";

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
import { useRouter, useRoute } from "vue-router";
// import { useMyAddressStore } from "@/stores/addressDataStore";

// const store = useMyAddressStore();

const router = useRouter();
// const route = useRoute();

// const step = ref(1);
const isHideButton = ref(false);
const company_info = ref({});

const formNumberOnUrl = ref("");
const dataForm = ref({
  partnerRegister: {
    register: {
      bp_number:"",
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

const createDocumentBody = ref([]);

const handlePartnerRegisterInput = (data) => {
  dataForm.value.partnerRegister = data;
};

const encodeFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
};

const handleFileRemoved = async (documents) => {
  createDocumentBody.value = [];
  dataForm.value.partnerDocs = documents;
  for (let index = 0; index < dataForm.value.partnerDocs.length; index++) {
    const el = dataForm.value.partnerDocs[index];
    if (
      !createDocumentBody.value.some((doc) => doc.document_name === el.name)
    ) {
      const base64String = await encodeFile(el);
      createDocumentBody.value.push({
        document_name: el.name,
        data: base64String.split(",")[1],
      });
    }
  }
};

const handleInputDocuments = async (documents) => {
  createDocumentBody.value = [];
  dataForm.value.partnerDocs = documents;
  for (let index = 0; index < dataForm.value.partnerDocs.length; index++) {
    const el = dataForm.value.partnerDocs[index];
    if (
      !createDocumentBody.value.some((doc) => doc.document_name === el.name)
    ) {
      const base64String = await encodeFile(el);
      createDocumentBody.value.push({
        document_name: el.name,
        data: base64String.split(",")[1],
      });
    }
  }
};
// const handleButtonClick = () => {
//   // step.value = 1;
//   isHideButton.value = false;
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
  formNumberOnUrl.value = sessionStorage.getItem("bp_numbers");
  console.log("bp_numberdashboard", formNumberOnUrl.value);

});

watch(
  dataForm.value,
  (newValue) => {

    createBusinessPartnerProfileBody.value.bp_number = formNumberOnUrl.value
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

const onCreatePartnerDocumentUploads = async () => {
  try {
    const response = await PartnerServive.createUploadDocuments(
      formNumberOnUrl.value,
      createDocumentBody.value
    );
    if (response.data.is_success) return true;
    return false;
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return false;
    }
    handlingErrorsMessage("unknown", e.message);
    return false;
  }
};

const onSumbitDataInsert = async () => {
  console.log("onSumbitDataInsert", company_info.value.fill_type.id);
  try {
    // if (
    //   company_info.value.fill_type.id === 1 ||
    //   company_info.value.fill_type.id === 6
    // ) {
    // router.push({
    //   name: "NonDisclosure",
    //   query: { form_number: formNumberOnUrl.value },
    // });
    // }
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
console.log("aaaaa")
      if (createDocumentBody.value.length > 0) {
        if (await onCreatePartnerDocumentUploads()) {
          await onSumbitDataInsert();
        } else {
          await onSumbitDataInsert();
        }
      } else {
        await onSumbitDataInsert();
      }
    }
  } catch (e) {
    if (e.response) {
      console.log("ccccccc")
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};



// const handleItemsContactInput = (newValue) => {
//   for (let i = 0; i < newValue.length; i++) {
//     const el = newValue[i];

//     createBusinessPartnerProfileBody.value[`contact_name_${i + 1}`] =
//       el.contact_name;
//     createBusinessPartnerProfileBody.value[`contact_email_${i + 1}`] =
//       el.contact_email;
//     createBusinessPartnerProfileBody.value[`contact_mobile_number_${i + 1}`] =
//       el.contact_mobile_number;
//   }
// };

const isIsNaturalPerson = ref(false);
const handleIsNaturalPerson = (value) => {
  isIsNaturalPerson.value = value;
};
const handleButtonSend = async () => {
  await onCreateBusinessPartnerProfileForm();
};
</script>

<style scoped>
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
