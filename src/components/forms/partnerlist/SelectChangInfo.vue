<template>
  <v-container>
    <h1 class="py-5">Change Information</h1>

    <v-card class="pa-5 mb-3">
      <div class="mb-1">ต้องการแก้ไขข้อมูลแบบใด</div>
      <v-radio-group v-model="input_data.selectedValue" color="red">
        <v-radio label="ต้องการแก้ไขข้อมูลเอง" :value="1"></v-radio>
        <v-radio label="ส่งให้ Vendor แก้ไขข้อมูล" :value="2"></v-radio>
      </v-radio-group>

      <v-text-field
        v-if="input_data.selectedValue === 2"
        class="ml-4 mr-4"
        density="compact"
        placeholder="กรอกรายละเอียดที่ต้องการส่งให้ Vendor"
        v-model="input_data.vendorDetails"
        dense
        variant="outlined"
      ></v-text-field>
    </v-card>

    <!-- Checkbox options -->
    <v-card class="pa-5 mt-3 box-checkbox" v-if="input_data.selectedValue==1">
      <div class="mb-1">คุณต้องการแก้ไขข้อมูลแบบใดบ้าง</div>
      <v-checkbox color="red" v-model="input_data.selectedBank" label="บัญชีธนาคาร" value="1"></v-checkbox>
      <v-checkbox color="red" v-model="input_data.selectedChangeName" label="เปลียนชื่อ" value="2"></v-checkbox>
      <v-checkbox color="red" v-model="input_data.selectedBranch" label="เพิ่มสาขา" value="3"></v-checkbox>
      <v-checkbox color="red" v-model="input_data.selectedAddress" label="เปลี่ยนที่อยู่" value="4"></v-checkbox>
      <v-checkbox color="red" v-model="input_data.selectedContact" label="ข้อมูลผู้ติดต่อ" value="5"></v-checkbox>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </v-card>

    <div class="ma-5 pa-5">
      <v-row justify="center" align="center">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            color="black"
            @click="handleCancel"
            :loading="isCancelLoading"
            class="ma-0 pa-0 mr-7"
            style="min-width: 100px; height: 35px; border-radius: 15px;"
          >ยกเลิก</v-btn>

          <v-btn
            color="red"
            @click="handleConfirm"
            class="ma-0 pa-0 mr-7"
            style="min-width: 100px; height: 35px; border-radius: 15px;"
            :disabled="isSubmitDisabled"
          >ตกลง</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import { ref, computed, defineProps, watch } from "vue";
import PartnerService from "@/apis/PartnerServive";
const { showAlertDisclosure } = useAlerDisclosuretDialogDialog();
import AlertDisclosureDialog from "@/components/dialogs/AlertDisclosureDialog.vue";
import { useAlerDisclosuretDialogDialog } from "@/components/dialogs/AlertDisclosureDialogService";
import ShowDialog from "@/components/dialogs/ConfirmDialog.vue";
import { useRoute, useRouter } from "vue-router";

const { showDialog } = useConfirmationDialog();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["on-next"]);

const input_data = ref({
  selectedValue: 0,
  selectedBank: false,
  selectedChangeName: false,
  selectedBranch: false,
  selectedAddress: false,
  selectedContact: false,
  vendorDetails: ""
});
const errorMessage = ref("");

// ตรวจสอบว่ามี Checkbox ที่ถูกเลือกหรือไม่
const isCheckboxSelected = computed(() => {
  return (
    input_data.value.selectedBank ||
    input_data.value.selectedChangeName ||
    input_data.value.selectedBranch ||
    input_data.value.selectedAddress ||
    input_data.value.selectedContact
  );
});
const isCancelLoading = ref(false); // สร้างสถานะ loading
// ตรวจสอบสถานะการ disable ของปุ่มตกลง
const isSubmitDisabled = computed(() => {
  // ถ้าไม่เลือก radio group (selectedValue === 0) ให้ disable ปุ่ม
  if (input_data.value.selectedValue === 0) {
    return true;
  }

  if (input_data.value.selectedValue === 1 && !isCheckboxSelected.value) {
    return true;
  }

  return false;
});


watch(
  () => input_data.value.selectedValue,
  (newValue, oldValue) => {
    if (oldValue === 1 && newValue === 2) {
      input_data.value.selectedBank = false;
      input_data.value.selectedChangeName = false;
      input_data.value.selectedBranch = false;
      input_data.value.selectedAddress = false;
      input_data.value.selectedContact = false;
    }
  }
);

const handleCancel = async () => {
  isCancelLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push({
      path: "/BusinessPartner/BusinessPartnerList"
    });
  } finally {
    isCancelLoading.value = false;
  }
};

const rules_valid = ref({
  data: [
    v =>
      Object.values(v).some(value => value) ||  
      "กรุณาเลือกข้อมูลอย่างใดอย่างหนึ่ง"
  ]
});

const props = defineProps({
  DataInfo: {
    type: Object
  }
});

const handleConfirm = async () => {
  const isValid = rules_valid.value.data[0](input_data.value);
  if (isValid !== true) {
    errorMessage.value = isValid; // แสดง error message
  } else {
    // Build the selected options (scope)
    const selectedOptions = [];
    if (input_data.value.selectedBank) selectedOptions.push("1");
    if (input_data.value.selectedChangeName) selectedOptions.push("2");
    if (input_data.value.selectedBranch) selectedOptions.push("3");
    if (input_data.value.selectedAddress) selectedOptions.push("4");
    if (input_data.value.selectedContact) selectedOptions.push("5");

    const scope = selectedOptions.join(","); // Join selected values with commas

    // Build the payload after collecting scope
    const payload = {
      form_number: props.DataInfo.bp_number,
      accessible_email: input_data.value.vendorDetails,
      scope: "1,2,3,4,5"
    };

    console.log("Payload to be sent:", payload);

    // Confirmation and API Call
    const confirmed = await showDialog(
      "ยืนยันการแก้ไขข้อมูล ?",
      "กรุณาตรวจสอบการส่งเรื่อง คุณไม่สามารถกลับมาแก้ไขได้อีก\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
    );

    if (!confirmed) return;

    if (input_data.value.selectedValue === 2) {
      try {
        const response = await PartnerService.createShareChangeInfo(payload);
        if (response.data.is_success) {
          router.push({
            path: "/BusinessPartner/BusinessPartnerList"
          });
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      emit("on-next", {
        ...input_data.value,
        scope: scope,
        vendorDetails: input_data.value.vendorDetails
      });
    }
  }
};
</script>




<style scoped>
.box-checkbox :deep(.v-input__control) {
  height: 25px !important;
}
.error-message {
  color: red; /* สีแดง */
  font-size: 0.8rem; /* ขนาดเล็กลง */
}
</style>
