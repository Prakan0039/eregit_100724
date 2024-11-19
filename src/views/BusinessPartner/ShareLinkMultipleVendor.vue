<template>
  <v-container fuild>
    <!-- <div v-if="errorDescription">
      <strong class="text-danger">เกิดข้อผิดพลาด:</strong>
      <ul>
        <li v-for="(error, index) in errorDescription" :key="index" class="text-secondary">
          {{ error }}
        </li>
      </ul>
      v-if="is_id_form === FORM_ID.Choose_File"
    </div> -->
    <div class="text-center mt-5 pa-5 ma-6 ">
      <h1>Vendor's email list for sending SD activities</h1>
    </div>
    <!-- {{ sharelink_url }} -->
 
    <div v-if="is_id_form === FORM_ID.Choose_File">
      <v-row justify="end" class="mt-10 mb-6">
 
        <v-col cols="2">
          <v-btn
            variant="elevated"
            class="text-capitalize"
            color="secondary"
            :disabled="loading"
            block
            @click="download"
          >
            <v-icon left>mdi-microsoft-excel</v-icon>
            Download template
          </v-btn>
        </v-col>
      </v-row>
 
      <Choosefile
      class="elevation-1 pa-7 mt-10"
      @input-file="handleOnChangeFile"
      @request-remove-file="handleFileRemoved"
      :is-file="file"
    ></Choosefile>
    </div>
 
    <ImportActiveUserTable
      v-if="is_id_form === FORM_ID.Data_Table"
      class="mt-5 mb-5"
      :items="datatableItem"
    />
 
    <div v-if="isValid.length > 0" class="pa-0">
      <strong class="text-secondary mt-10 d-block">
        ไฟล์ที่ที่อัพไม่ตรงกับ template กรุณาตรวจสอบและอัพใหม่อีกครั้ง*
      </strong>
 
      <!-- <div style="max-height: 200px; overflow-y: auto;">
        <v-virtual-scroll
          :items="isValid"
          item-height="30"
        >
          <template v-slot:default="{ item: message }">
            <div :key="message">
              <strong class="text-secondary">{{ message }}</strong>
            </div>
          </template>
        </v-virtual-scroll>
      </div> -->
    </div>
 
    <div v-if="processedErrors.length > 0">
      <v-spacer class=" mt-8"></v-spacer>
 
      <strong class="text-danger">เกิดข้อผิดพลาด:</strong>
      <div style="max-height: 200px; overflow-y: auto">
        <v-virtual-scroll :items="processedErrors" item-height="30">
          <template v-slot:default="{ item: error, index }">
            <div :key="index" class="text-secondary">
              {{ error }}
            </div>
          </template>
        </v-virtual-scroll>
      </div>
    </div>
 
 
    <v-divider class="mt-10 mb-5"></v-divider>
    <v-spacer class="mb-10"></v-spacer>
    <div
    v-if="is_id_form === FORM_ID.Choose_File"
    class="text-center"  >
      <v-btn
        rounded
        class="ma-2"
        color="black"
        style="width: 100px"
        to="/SDTeamDashboard/TrackingSDActivite"
      >
        <strong>ยกเลิก</strong>
      </v-btn>
      <v-btn
        rounded
        class="ma-2"
        color="secondary"
        style="width: 100px"
        @Click="submit"
      >
        <strong>ตกลง</strong>
      </v-btn>
    </div>
 
    <div
    v-if="is_id_form === FORM_ID.Data_Table"
    class="text-center"  >
      <v-btn
        rounded
        class="ma-2"
        color="black"
        style="width: 100px"
        to="/SDTeamDashboard/TrackingSDActivite"
      >
        <strong>ยกเลิก</strong>
      </v-btn>
      <v-btn
        rounded
        class="ma-2"
        color="secondary"
        style="width: 100px"
        @Click="createImportVendors"
      >
        <strong>ตกลง</strong>
      </v-btn>
    </div>
  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
// import readXlsxFile from 'read-excel-file'
// import { Base64 } from 'js-base64'
// import { saveAs } from 'file-saver'
import Choosefile from "@/components/forms/Choosefile";
// import compnayService from '@/apis/CompnayService';
import ImportActiveUserTable from "@/components/tables/ImportMultiTable.vue";
import validate from "@/utils/validateUtils";
import PartnerService from "@/apis/PartnerServive";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { useValidDialog } from "@/components/dialogs/TemplateDialogService";
import ExportService from "@/apis/ExportService";
import { ref, reactive, onMounted, computed } from "vue";
import { useAlerDisclosuretDialogDialog } from "@/components/dialogs/AlertDisclosureDialogService";
const { showAlertDisclosure } = useAlerDisclosuretDialogDialog();
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
const { showAlert } = useAlertDialogDialog();
 
const emit = defineEmits(["is-title", "is-view"]);
const { showValidDialog } = useValidDialog();
const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();
 
const file = ref(null);
const items = ref([]);
// const loading = ref({
//   companies_code :false
// });
const FORM_ID = {
  Choose_File: 0,
  Data_Table: 1,
  Error_Message: 2,
};
const is_id_form = ref(FORM_ID.Choose_File);
const binaryData = ref(null);
const errorDescription = ref([]);
const loading = ref(false);
const comapnies_code = ref([]);
const isValid = ref([]);
// const file = ref(null); // existing ref for file
 
const datatableItem = ref([]);
const bp_file_id = ref("");
const sharelink_url = ref(null);
 
onMounted(async () => {
  emit("is-title", "");
 
  await downloadMultipleLink();
});
 
const processedErrors = computed(() =>
  errorDescription.value.map(error => {
    const row = error.row !== undefined ? `row: ${error.row}, ` : '';
    return `${row}description: ${error.description}`;
  })
);
// const handleFileRemoved = () => {
//   file.value = null; // Reset the file
//   binaryData.value = null; // Clear the binary data as well
//   items.value = []; // Reset any file-related data
//   isValid.value = [];
//   errorDescription.value = [];
//   console.log("File removed successfully");
// };
 
// const handleOnChangeFile = async (_file) => {
//   file.value = _file;
//   items.value = [];
//   isValid.value = [];
//   errorDescription.value = [];
 
//   const reader = new FileReader();
 
//   reader.onload = (e) => {
//     binaryData.value = e.target.result;
//   };
 
//   reader.readAsArrayBuffer(_file);
// };
// Function to handle file input
const handleOnChangeFile = (_file) => {
  file.value = _file; // Set the new file
  binaryData.value = null;
  isValid.value = [];
  errorDescription.value = [];
 
  const reader = new FileReader();
  reader.onload = (e) => {
    binaryData.value = e.target.result;
  };
  reader.readAsArrayBuffer(_file);
 
  console.log("File selected:", _file.name);
};
 
const handleFileRemoved = () => {
  file.value = null; // Reset the file when removed
  binaryData.value = null;
  isValid.value = [];
  errorDescription.value = [];
  console.log("File removed successfully");
};
 
const download = async () => {
 
  await ExportService.downloadFileV3(sharelink_url.value);
  console.log("download");
};
const downloadMultipleLink = async () => {
  try {
    const response =
      await PartnerService.downloadCreateMultipleVendoeTemplate();
    if (response.data?.is_success) {
      // console.log("downloadRspSurvey:", response.data?.is_success)
      sharelink_url.value = response.data.data.file_url;
      // console.log("getRspPolicyResults", survey_url.value);
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
 
const submit = async (e) => {
  e.preventDefault();
 
  // Validate that a file is selected
  if (!file.value) {
    await showValidDialog(
      "ไม่พบไฟล์",
      "กรุณาตรวจสอบไฟล์และอัพโหลดใหม่อีกครั้ง"
    );
    return;
  }
 
  const fileName = file.value.name;
  const fileExtension = fileName.split(".").pop();
  const fileSizeMB = file.value.size / (1024 * 1024); // Convert size to MB
 
  if (fileSizeMB > 10) {
    await showValidDialog(
      "ไฟล์มีขนาดใหญ่เกินไป",
      "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB"
    );
    return;
  }
 
  if (!validate.isValidExcel(fileExtension)) {
    await showValidDialog(
      "ไฟล์ที่อัพโหลดไม่ใช่ไฟล์ Excel",
      "กรุณาตรวจสอบไฟล์และอัพโหลดใหม่อีกครั้ง"
    );
    return;
  }
 
  if (isValid.value.length > 0) {
    await showValidDialog(
      "ไฟล์ที่อัพโหลดไม่ตรงกับ template",
      "กรุณาตรวจสอบไฟล์และอัพโหลดใหม่อีกครั้ง"
    );
    return;
  }
 

  const confirmed = true;
  if (confirmed) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append("data", file.value);
 
      const userId = sessionStorage.getItem("userId");
      formData.append("created_user_id", Number(userId));
 
      const response = await PartnerService.createValidateImportVendors(
        formData
      );
 
      console.log(response);
 
      if (response.data?.is_success) {
        datatableItem.value = response.data?.data.email_receivers;
        bp_file_id.value = response.data?.data.import_bp_file_id;
        is_id_form.value = FORM_ID.Data_Table;
      } else {
        errorDescription.value = response.data.error_description || [];
        await showValidDialog("เกิดข้อผิดพลาด", "ตรวจสอบข้อความด้านล่าง");
      }
    } catch (e) {
      // Handle errors
      if (e.response) {
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data.error);
        errorDescription.value = val.data.error_description || [];
      } else {
        handlingErrorsMessage("unknown", e.message);
      }
    } finally {
      loading.value = false;
    }
  } else {
    console.log("Action cancelled.");
  }
};
 
const createImportVendors = async (e) => {
  e.preventDefault();
  const confirmed = await showDialog(
    "ยืนยันการส่ง Email",
    'ระบบจะทำการส่ง Email ให้ Vendor \nและ Contact owner'
  );
 
  if (confirmed) {
  try {
    const response = await PartnerService.createImportVendors(bp_file_id.value);
    if (response.data?.is_success){
      // console.log("nfkd")
      await showAlert(
      "ทำการส่ง Email แล้ว",
      "ระบบทำการส่ง Email ติดตามการทำ SD activities \nให้ Vendor และ Contact owner แล้ว"
    )
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
} else {
    console.log("Action cancelled.");
  }
};
</script>