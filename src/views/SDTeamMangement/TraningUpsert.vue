<template>
  <v-container>
    <h2>Mangement > Traning</h2>
    <div class="mt-5">
      <v-card class="elevation-1">
        <v-card-text>
          <div>
            <strong>ชื่อเรื่อง</strong>
            <v-text-field v-model="name" variant="outlined" placeholder="ชื่อกรอกชื่อเรื่อง" density="compact"></v-text-field>
          </div>
          <div>
            <strong>Link SCORM</strong>
            <v-text-field v-model="link" variant="outlined" placeholder="กรอก Link SCORM" density="compact"></v-text-field>
          </div>
          <div>
            <strong>Role</strong>
              <v-select
                  v-model="roleId"
                  density="compact"
                  variant="outlined"
                  placeholder="Role"
                  item-title="name"
                  :items="selected_roles"
                  item-value="id" />
          </div>
          <v-radio-group v-model="selected">
          <template v-slot:label>
            <div><strong>Active กิจกรรมนี้เมื่อใด</strong></div>
          </template>

          <v-radio value="now">
            <template v-slot:label>
              <div  class="pa-0"><strong class="text-black">Active ตอนนี้</strong></div>
            </template>
          </v-radio>

          <v-radio value="selected" class="pa-0">
            <template v-slot:label>
              <div style="width: 500px;">
              <v-row dense align="left">
              <v-col cols="3" align-self="center">
                <strong class="text-black">Active วันที่ </strong>
              </v-col>
              <v-col cols="9" align-self="center">
                <DatePickerControl
                :disabled="selected === 'now'"
                :date="selectedActiveDate"
                @date="selectedActiveDate = $event" />
              </v-col>
              </v-row>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
        </v-card-text>
      </v-card>
      <div class="text-center mt-5">
        <v-btn rounded
               class="ma-2"
               to="/SDTeamMangement/Traning"
               color="black"
               style="width: 100px;">
          <strong>ยกเลิก</strong>
        </v-btn>
        <v-btn rounded
               class="ma-2"
               color="secondary"
               style="width: 100px;"
               @click="handleAcceptConfirmed">
          <strong>ตกลง</strong>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { ref,onBeforeMount,computed,onMounted } from "vue";
import roleService from '@/apis/RoleService';
import DatePickerControl from '@/components/controls/DatePickerControl.vue'
import dateUtils from "@/utils/dateUtils";
import RspService from '@/apis/RspService';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useErrorHandlingDialog } from '@/components/dialogs/ExceptionHandleDialogService'
const { handlingErrorsMessage } = useErrorHandlingDialog();

import { useConfirmationDialog } from '@/components/dialogs/ConfirmationDialogService'
const { showDialog } = useConfirmationDialog();

import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
const { showAlert } = useAlertDialogDialog();


const selected_roles = ref([]);
const id = ref(null);
const name = ref(null);
const link = ref(null);
const roleId = ref(null);
const selected = ref('now');
const selectedActiveDate = ref(null);

onBeforeMount(() => {

});
onMounted(async () => {
  const session_traning = sessionStorage.getItem("traning_modifiy");
  if(session_traning){
    const traning = JSON.parse(session_traning);
    id.value = traning?.id;
    name.value =  traning?.name;
    link.value =  traning?.link;
    roleId.value =  traning?.roleId;
    selected.value =  "selected"
    selectedActiveDate.value =  dateUtils.parseDdMmYyyy(new Date(traning.published_at))

  }
  getRoles();

});

const getRoles = async () => {
  try {
    const response = await roleService.getRoleAll();
    if (response.data?.is_success) {
      selected_roles.value = response.data.data
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
}
const handleAcceptConfirmed = async () =>{
  const confirmed = await showDialog("ยืนยัน Active ตอนนี้",'กรุณาตรวจสอบ\nคลิกปุ่ม"ตกลง"เพื่อดำเนินการ');
  if (confirmed) {
    switch(id.value){
      case null : handleConfirmedCreated(); break;
      default : handleConfirmedUpdated(); break;
    }
  }
}
const  handleConfirmedCreated = async () =>{
  try {
      const v_name = name.value;
      const v_link = link.value;
      const v_role_id = roleId.value;
      const v_active = (selected.value ==='now') ? dateUtils.parseDdMmYyyy(new Date()) : selectedActiveDate.value;
      const response = await RspService.createRspTraining(v_name,v_link,v_role_id,dateUtils.convertToISOFormat(v_active));
      if (response.data?.is_success) {
        handleAlertSuccessfully();
      }
    } catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
       handlingErrorsMessage("unknown", e.message);
    }
}
const  handleConfirmedUpdated = async () =>{
  try {
      const v_id = id.value;
      const v_name = name.value;
      const v_link = link.value;
      const v_role_id = roleId.value;
      const v_active = (selected.value ==='now') ? dateUtils.parseDdMmYyyy(new Date()) : selectedActiveDate.value;
      const response = await RspService.updateRspTraining(v_id,v_name,v_link,v_role_id , dateUtils.convertToISOFormat(v_active));
      if (response.data?.is_success) {
        handleAlertSuccessfully();
      }
    } catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
       handlingErrorsMessage("unknown", e.message);
    }
}
const handleAlertSuccessfully = async () => {
  const confirmed = await showAlert(
    "Active เรียบร้อยแล้ว",
    "ดำเนินงานเสร็จแล้ว คู่ค้าสามารถทำกิจกรรมได้เลย"
  );
  if (confirmed) {
    router.push('/SDTeamMangement/Traning');
  }
};

</script>

