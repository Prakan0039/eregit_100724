<template>
  <v-container fluid>
    <h2>Mangement > RSP Policy</h2>
    <div class="mt-5">
      <v-card class="elevation-1">
        <v-card-text>
          <div>
            <strong>ชื่อ policy</strong>
            <v-text-field
              v-model="name"
              variant="outlined"
              placeholder="ชื่อ policy"
              density="compact"
            ></v-text-field>
          </div>
          <Choosefile
            @input-file="handleOnChangeFile"
            :is-file="file"
            title="อัพโหลด policy"
            icon="mdi mdi-file-document"
            accept="application/pdf"
            list-title="uploaded Files"
            descritption="อัพโหลดเฉพาะไฟล์ PDF จำนวนไฟล์ เท่านั้น"
          >
          </Choosefile>
        </v-card-text>
        <v-radio-group v-model="selected">
          <template v-slot:label>
            <div><strong>Active กิจกรรมนี้เมื่อใด</strong></div>
          </template>

          <v-radio value="now">
            <template v-slot:label>
              <div class="pa-1">
                <strong class="text-black">Active ตอนนี้</strong>
              </div>
            </template>
          </v-radio>

          <v-radio value="selected" class="pa-0">
            <template v-slot:label>
              <div style="width: 500px">
                <v-row dense align="left">
                  <v-col cols="3" align-self="center">
                    <strong class="text-black">Active วันที่ </strong>
                  </v-col>
                  <v-col cols="9" align-self="center">
                    <DatePickerControl
                      :disabled="selected === 'now'"
                      :date="selectedActiveDate"
                      @date="selectedActiveDate = $event"
                    />
                  </v-col>
                </v-row>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card>
      <div class="text-center mt-5">
        <v-btn
          rounded
          class="ma-2"
          to="/SDTeamMangement/RspPolicies"
          color="black"
          style="width: 100px"
        >
          <strong>ยกเลิก</strong>
        </v-btn>
        <v-btn
          rounded
          class="ma-2"
          color="secondary"
          style="width: 100px"
          @click="handleAcceptConfirmed"
        >
          <strong>ตกลง</strong>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import Choosefile from "@/components/forms/Choosefile.vue";
import DatePickerControl from "@/components/controls/DatePickerControl.vue";
import dateUtils from "@/utils/dateUtils";
import RspService from "@/apis/RspService";

import { useRouter } from "vue-router";
const router = useRouter();

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
const { showDialog } = useConfirmationDialog();

import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
import ExportService from "@/apis/ExportService";
const { showAlert } = useAlertDialogDialog();

const id = ref(null);
const name = ref(null);
const file = ref(null);
const selected = ref("now");
const selectedActiveDate = ref(null);

onBeforeMount(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const mode =  urlParams.get("mode")
  if(mode === "edit"){
    const policie =  JSON.parse(sessionStorage.getItem("rsp-policies-item"));
    id.value = policie.id;
    name.value = policie.name;
    selected.value =  "selected"
    selectedActiveDate.value =  dateUtils.parseDdMmYyyy(policie.published_at)
    handleInitFile(policie.file_url)

  }else{
    selected.value =  "now"
    selectedActiveDate.value =   null

    id.value = null;
    name.value = null;
    file.value = null;
  }

});
const  handleInitFile = async (file_path)=>{
   try {
    const response = await fetch(file_path, {  mode: "cors",});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const mimeTypeMap = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

      const extension = file_path.split('.').pop();
      const fileName = file_path.substr(file_path.lastIndexOf("/") + 1)
      const mimeType = mimeTypeMap[extension.toLowerCase()];
      const blob = new Blob([response.data], { type: mimeType });
      file.value =   new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
const handleOnChangeFile = async (val) => {
  file.value = val;
};
const handleAcceptConfirmed = async () => {
  const confirmed = await showDialog(
    "ยืนยัน Active ตอนนี้",
    'กรุณาตรวจสอบ\nคลิกปุ่ม"ตกลง"เพื่อดำเนินการ'
  );
  if (confirmed) {
    switch (id.value) {
      case null:
        handleConfirmedCreated();
        break;
      default:
        handleConfirmedUpdated();
        break;
    }
  } else {
    window.alert("Cancel");
  }
};
const handleConfirmedCreated = async () => {
  try {
    const v_name = name.value;
    const v_file = file.value ? await ExportService.getBase64(file.value) : "";
    let parts = null;
    if (selected.value != "now") {
      parts = selectedActiveDate.value.split("/");
    }
    const v_active =
      selected.value === "now"
        ? new Date()
        : new Date(parts[2], parts[1] - 1, parts[0]);
    const response = await RspService.createRspPolicy(v_name, v_file, v_active);
    if (response.data?.is_success) {
      handleAlertSuccessfully();
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
const handleConfirmedUpdated = async () => {
  try {
    const v_id = id.value;
    const v_name = name.value;
    const v_file = file.value ? await ExportService.getBase64(file.value) : "";
    let parts = null;
    if (selected.value != "now") {
      parts = selectedActiveDate.value.split("/");
    }
    const v_active =
      selected.value === "now"
        ? new Date()
        : new Date(parts[2], parts[1] - 1, parts[0]);
    const response = await RspService.updateRspPolicy(
      v_id,
      v_name,
      v_file,
      v_active
    );
    if (response.data?.is_success) {
      //activated_items.value = response.data?.data
      handleAlertSuccessfully();
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    //activated_laoding.value = false;
  }
};
const handleAlertSuccessfully = async () => {
  const confirmed = await showAlert(
    "Active เรียบร้อยแล้ว",
    "ดำเนินงานเสร็จแล้ว คู่ค้าสามารถทำกิจกรรมได้เลย"
  );
  if (confirmed) {
    router.push("/SDTeamMangement/RspPolicies");
  }
};
</script>
