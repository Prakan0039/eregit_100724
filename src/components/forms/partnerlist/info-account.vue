<template>
  <div>
    <!-- ฟอร์มเพิ่มบัญชีธนาคาร -->
    <div class="d-flex align-center justify-center">
      <h2 class="pa-5">บัญชีธนาคาร</h2>
    </div>
    <h2 class="py-3">เพิ่มบัญชีธนาคาร</h2>
    <div
      v-for="(info, index) in changeBankInformation.filter(info => info.remark === 'เพิ่ม')"
      :key="index"
      class="mb-5"
    >
      <v-card class="pa-4">
        <v-card-title>
          <h6>ชื่อบัญชี (ภาษาอังไทย)</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_account_name"
          placeholder="ชื่อบัญชี (ภาษาอังกฤษ)"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-card-title>
          <h6>ธนาคาร</h6>
        </v-card-title>
        <v-select
          v-model="info.bank_id"
          :items="itemBanks"
          item-value="id"
          item-title="display"
          density="compact"
          variant="outlined"
          placeholder="ธนาคาร"
        ></v-select>

        <v-card-title>
          <h6>สาขาธนาคาร</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_branch"
          placeholder="สาขาธนาคาร"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-card-title>
          <h6>เลขที่บัญชี</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_account_number"
          placeholder="เลขที่บัญชี"
          :rules="bankAccountRules"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-card>
    </div>
    <!-- ปุ่มเพิ่มฟิลด์ใหม่ -->
    <ButtonControl icon="mdi mdi-plus" text="เพิ่ม" @button-clicked="addNewField('เพิ่ม')" />

    <!-- ฟอร์มยกเลิกบัญชีธนาคาร -->
    <h2 class="py-3">ยกเลิกบัญชีธนาคาร</h2>
    <div
      v-for="(info, index) in changeBankInformation.filter(info => info.remark === 'ลบ')"
      :key="index"
      class="mb-5"
    >
      <v-card class="pa-4">
        <v-card-title>
          <h6>ชื่อบัญชี (ภาษาอังไทย)</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_account_name"
          placeholder="ชื่อบัญชี (ภาษาอังกฤษ)"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-card-title>
          <h6>ธนาคาร</h6>
        </v-card-title>
        <v-select
          v-model="info.bank_id"
          :items="itemBanks"
          item-value="id"
          item-title="display"
          density="compact"
          variant="outlined"
          placeholder="ธนาคาร"
        ></v-select>

        <v-card-title>
          <h6>สาขาธนาคาร</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_branch"
          placeholder="สาขาธนาคาร"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-card-title>
          <h6>เลขที่บัญชี</h6>
        </v-card-title>
        <v-text-field
          v-model="info.bank_account_number"
          placeholder="เลขที่บัญชี"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-card>
    </div>
    <!-- ปุ่มเพิ่มฟิลด์ใหม่สำหรับการยกเลิก -->
    <ButtonControl icon="mdi mdi-plus" text="เพิ่ม" @button-clicked="addNewField('ลบ')" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import OtherService from "@/apis/OtherService";
import ButtonControl from "@/components/controls/ButtonControl.vue";

const emit = defineEmits(["on-data-update"]);

// ข้อมูลธนาคารที่สามารถเลือกได้
const itemBanks = ref([]);

// ข้อมูลเริ่มต้น (จาก API หรือข้อมูลที่ได้)
const changeBankInformation = ref([
  {
    bank_account_name: "",
    bank_id: null,
    bank_branch: "",
    bank_account_number: "",
    remark: "เพิ่ม"
  },
  {
    bank_account_name: "",
    bank_id: null,
    bank_branch: "",
    bank_account_number: "",
    remark: "ลบ"
  }
]);

onMounted(async () => {
  await getBanks();
});

// สังเกตการเปลี่ยนแปลงของข้อมูลแล้วส่งข้อมูลออกไปยัง parent
watch(
  changeBankInformation.value,
  newValue => {
    emit("on-data-update", newValue);
  },
  { deep: true }
);

// Validation rule สำหรับเลขที่บัญชีธนาคาร
const bankAccountRules = [
  v => !!v || "กรุณากรอกเลขที่บัญชี",
  v => /^[A-Z0-9]+$/.test(v) || "เลขและตัวอักษรภาษาอังกฤษพิมพ์ใหญ่เท่านั้น"
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลธนาคารใหม่
const addNewField = remark => {
  if (remark === "เพิ่ม") {
    // ใช้ unshift เพื่อเพิ่มข้อมูลไปที่จุดเริ่มต้น
    changeBankInformation.value.unshift({
      bank_account_name: "",
      bank_id: null,
      bank_branch: "",
      bank_account_number: "",
      remark: "เพิ่ม"
    });
  } else {
    // ใช้ push สำหรับ remark 'ลบ'
    changeBankInformation.value.push({
      bank_account_name: "",
      bank_id: null,
      bank_branch: "",
      bank_account_number: "",
      remark: "ลบ"
    });
  }
};

// ฟังก์ชันดึงข้อมูลธนาคารจาก API
const getBanks = async () => {
  try {
    const response = await OtherService.getBanksAll();
    if (response.data?.is_success) {
      itemBanks.value = response.data.data.map(item => ({
        ...item,
        display: `${item.bank_key} - ${item.name_th}`,
        id: item.id.toString()
      }));
    }
  } catch (e) {
    if (e.response) {
      return;
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  color: #333;
}
</style>
