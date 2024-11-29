<template>
  <v-container>
    <!-- <h1 class="text-center">Change Information</h1> -->
     <!-- {{ bpNumber }} -->
    <h2 class="text-center">ข้อมูลผู้ติดต่อ</h2>

    <v-card class="pa-5 mb-5">
      <v-select
        v-model="branchCode"
        :items="branchOptions"
        label="Branch Code"
        required
        variant="outlined"
        density="compact"
        item-title="name"
        item-value="id"
      ></v-select>
    </v-card>

    <v-card class="pa-4 mb-5">
      <h3 class="py-3">เพิ่มผู้ติดต่อ</h3>

      <div v-for="(contact, index) in addContacts" :key="index" class="mb-3">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="contact.name"
              placeholder="ชื่อผู้ติดต่อ (ภาษาอังกฤษ)"
              required
              variant="outlined"
              density="compact"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="contact.mobile_number"
              placeholder="เบอร์โทรศัพท์"
              required
              variant="outlined"
              density="compact"
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="contact.email"
              placeholder="Email เพื่อแจ้งการชำระเงิน"
              required
              variant="outlined"
              density="compact"
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </div>


      <ButtonControl icon="mdi mdi-plus" text="เพิ่ม" @button-clicked="addNewContact('เพิ่ม')" />
    </v-card>

    <v-card class="pa-4 mb-5">
      <h3 class="py-3">ยกเลิกผู้ติดต่อ</h3>

      <div v-for="(contact, index) in removeContacts" :key="index" class="mb-3">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="contact.name"
              placeholder="ชื่อผู้ติดต่อ (ภาษาอังกฤษ)"
              required
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="contact.mobile_number"
              placeholder="เบอร์โทรศัพท์"
              required
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="contact.email"
              placeholder="Email เพื่อแจ้งการชำระเงิน"
              required
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>


      <ButtonControl icon="mdi mdi-plus" text="เพิ่ม" @button-clicked="addNewContact('ยกเลิก')" />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import PartnerServive from "@/apis/PartnerServive";
import { useRoute, useRouter } from "vue-router";

import ButtonControl from "@/components/controls/ButtonControl.vue";

const emit = defineEmits(["on-data-update"]);
const route = useRoute();
const router = useRouter();
const bpNumber = ref(route.query.bp_number);

// const branchOptions = ["NVAT", "00000"];
const branchOptions = ref([]);


const branchCode = ref(null);

const addContacts = ref([
  {
    name: "",
    mobile_number: "",
    email: ""
  }
]);

// ข้อมูลผู้ติดต่อสำหรับ "ยกเลิกผู้ติดต่อ"
const removeContacts = ref([
  {
    name: "",
    mobile_number: "",
    email: ""
  }
]);

onMounted(async () => {
  await getBranchList();
  console.log("Branch Options: ", branchOptions.value); // ตรวจสอบ branchOptions

});

const getBranchList = async () => {
  try {
    const response = await PartnerServive.getBranchListByPbNumber(bpNumber.value);
    if (response.data?.is_success) {
      // ดึง branch_code ทุกชุดและเก็บใน branchOptions
      branchOptions.value = response.data.data?.branch.map(el => el.branch_code);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error); 
    } else {
      handlingErrorsMessage("unknown", e.message);
    }
  }
};



const addNewContact = type => {
  if (type === "เพิ่ม") {
    addContacts.value.push({
      name: "",
      mobile_number: "",
      email: ""
    });
  } else if (type === "ยกเลิก") {
    removeContacts.value.push({
      name: "",
      mobile_number: "",
      email: ""
    });
  }
};

// ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล
const updateData = () => {
  const data = {
    change_contact_information: [
      ...addContacts.value.map(contact => ({
        branch_code: branchCode.value || "",
        business_partner_name: "",
        name: contact.name,
        mobile_number: contact.mobile_number,
        email: contact.email,
        remark: "เพิ่ม"
      })),
      ...removeContacts.value.map(contact => ({
        branch_code: branchCode.value || "",
        business_partner_name: "",
        name: contact.name,
        mobile_number: contact.mobile_number,
        email: contact.email,
        remark: "ลบ"
      }))
    ]
  };

  emit("on-data-update", data);
  console.log("UAAAAAAAAAAAAAAAAAAAAAAA:", data);
};

watch(
  [addContacts, removeContacts, branchCode],
  () => {
    updateData();
  },
  { deep: true }
);
</script>

<style scoped>
h1 {
  font-size: 2rem;
  color: #000;
}

h2 {
  font-size: 1.5rem;
  color: #333;
}

h3 {
  font-size: 1.25rem;
  color: #333;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>
