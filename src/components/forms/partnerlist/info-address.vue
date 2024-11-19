<template>
  <v-container>
    <!-- <div class="d-flex align-center justify-center">
      <h2 class="py-5">Change Information</h2>
    </div>-->

    <div class="d-flex align-center justify-center">
      <h2 class="pa-5">เปลี่ยนที่อยู่</h2>
    </div>

    <v-row dense class="mb-5">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-card-title>
              <h6>Branch Code</h6>
            </v-card-title>
            <v-row dense no-gutters>
              <!-- {{ item }}
              {{ itemsBranch }}
              {{ data_input.branch_code }}-->
              <v-col cols="12">
                <!-- <v-text-field
                  class="ml-4 mr-4"
                  density="compact"
                  v-model="data_input.branch_code"
                  :rules="rules_valid.branchcodeRule"
                  dense
                  variant="outlined"
                ></v-text-field>-->
                <v-select v-model="data_input.branch_code" :items="itemsBranch"></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-5">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row dense no-gutters>
              <v-col cols="12" class="mt-2">
                <v-card-title>
                  <h6>ที่อยู่ (ภาษาไทย)</h6>
                </v-card-title>
                <v-text-field
                  density="compact"
                  v-model="data_input.address.th.address"
                  :rules="textRequired"
                  dense
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <AddressInputControlTH
                  :rules="textRequired"
                  tag-desc="(ภาษาไทย)"
                  key-value="id"
                  key-title="name_th"
                  :is-disable-address="false"
                  @on-input="handleAddressInputTh"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-5">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row dense no-gutters>
              <v-col cols="12" class="mt-2">
                <v-card-title>
                  <h6>ที่อยู่ (ภาษาอังกฤษ)</h6>
                </v-card-title>
                <v-text-field
                  density="compact"
                  v-model="data_input.address.en.address"
                  :rules="textRequired"
                  dense
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <ManaulAddressInputControl
                  :address-item="data_input.address.en.info"
                  tag-desc="(ภาษาอังกฤษ)"
                  @on-input="handleAddressInputEn"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";

import AddressInputControlTH from "@/components/controls/AddressInputControlComp.vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";

const emit = defineEmits(["on-data-update"]);

const data_input = ref({
  branch_code: "",
  address: {
    en: {
      address: null,
      info: {
        province: null,
        district: null,
        parish: null,
        zip_code: null
      }
    },
    th: {
      address: null,
      info: {
        province: null,
        district: null,
        parish: null,
        zip_code: null
      }
    }
  }
});
const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];

const item = ref({
  form_number: "01728022800000",
  bp_number: "1000010324",
  request_status: {
    id: 2,
    name: "done",
    created_at: "2024-02-17T21:49:34.285+07:00",
    created_user_id: 1,
    updated_at: "2024-02-17T21:49:34.285+07:00",
    updated_user_id: 1
  },
  changed_part: [
    {
      id: 2,
      name_th: "เปลี่ยนข้อมูลชื่อ",
      name_en: "Change name information"
    }
  ],
  change_bank_information: null,
  change_name_information: [
    {
      id: 113,
      form_number: "01728022800000",
      business_partner_number: "01728022800000",
      name_th: "oo",
      name1_th: "oo",
      name2_th: "นน",
      name3_th: "นน",
      name4_th: "นน",
      search_term1_th: "ii",
      name_en: "ii",
      name1_en: "ii",
      name2_en: "ii",
      name3_en: "ii",
      name4_en: "ii",
      search_term1_en: "ii",
      created_at: "2024-10-04T13:20:00.646+07:00",
      created_user_id: 590,
      updated_at: "2024-10-04T16:48:53.451+07:00",
      updated_user_id: 397
    }
  ],
  add_branch_information: [
    {
      id: 113,
      form_number: "01728022800000",
      business_partner_number: "",
      branch_code: "",
      branch_description: "",
      business_partner_role: null,
      name1_th: "",
      name2_th: "",
      name3_th: "",
      name4_th: "",
      search_term1_th: "",
      address_th: "",
      address1_th: "",
      address2_th: "",
      province_th: null,
      district_th: null,
      subdistrict_th: null,
      postal_code_th: null,
      name1_en: "",
      name2_en: "",
      name3_en: "",
      name4_en: "",
      search_term1_en: "",
      address_en: "",
      address1_en: "",
      address2_en: "",
      province_en: "",
      district_en: "",
      subdistrict_en: "",
      postal_code_en: null,
      country: "",
      created_at: "2024-10-04T13:20:00.657+07:00",
      created_user_id: 590,
      updated_at: "2024-10-04T13:20:00.657+07:00",
      updated_user_id: 590
    }
  ],
  change_address_information: [
    {
      id: 113,
      form_number: "01728022800000",
      business_partner_number: "",
      branch_code: "0001",
      branch_description: "",
      name1_th: "",
      name2_th: "",
      name3_th: "",
      name4_th: "",
      search_term1_th: "",
      address_th: "ที่อยู่ 1",
      address1_th: "",
      address2_th: "",
      province_th: null,
      district_th: null,
      subdistrict_th: null,
      postal_code_th: null,
      name1_en: "",
      name2_en: "",
      name3_en: "",
      name4_en: "",
      search_term1_en: "",
      address_en: "",
      address1_en: "",
      address2_en: "",
      province_en: "",
      district_en: "",
      subdistrict_en: "",
      postal_code_en: null,
      country: "",
      created_at: "2024-10-04T13:20:00.665+07:00",
      created_user_id: 590,
      updated_at: "2024-10-04T13:20:00.665+07:00",
      updated_user_id: 590
    },
    {
      id: 113,
      form_number: "01728022800000",
      business_partner_number: "",
      branch_code: "0002",
      branch_description: "",
      name1_th: "",
      name2_th: "",
      name3_th: "",
      name4_th: "",
      search_term1_th: "",
      address_th: "ที่อยู่ 2",
      address1_th: "",
      address2_th: "",
      province_th: null,
      district_th: null,
      subdistrict_th: null,
      postal_code_th: null,
      name1_en: "",
      name2_en: "",
      name3_en: "",
      name4_en: "",
      search_term1_en: "",
      address_en: "",
      address1_en: "",
      address2_en: "",
      province_en: "",
      district_en: "",
      subdistrict_en: "",
      postal_code_en: null,
      country: "",
      created_at: "2024-10-04T13:20:00.665+07:00",
      created_user_id: 590,
      updated_at: "2024-10-04T13:20:00.665+07:00",
      updated_user_id: 590
    }
  ],
  change_contact_information: null,
  created_at: "2024-10-04T13:20:00.637+07:00",
  created_user_id: 590,
  updated_at: "2024-10-04T16:48:53.444+07:00",
  updated_user_id: 397
});
const itemsBranch = ref([]);
onMounted(() => {
  //Get items all
  if (item.value.change_address_information) {
    itemsBranch.value = item.value.change_address_information.map(
      el => el.branch_code
    );
  }
});

watch(
  () => data_input.value.branch_code,
  () => {
    const itemBranchCodeSelection = item.value.change_address_information.find(
      el => el.branch_code == data_input.value.branch_code
    );
    if (itemBranchCodeSelection) {
      data_input.value.address.th.address = itemBranchCodeSelection.address_th;
    }
  },
  { deep: true }
);

const rules_valid = ref({
  email: [
    v => !!v || "กรุณากรอกข้อมูลให้ครบ",
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email format ไม่ถูกต้อง"
  ],
  radioRules: [v => !!v || "กรุณาเลือก 1 อัน"],
  branchcodeRule: [
    v => !!v || "กรุณากรอกข้อมูล Branch Code",
    v => /^\S+(\s\S+)*$/.test(v) || "ข้อความต้องไม่เป็นค่าว่าง"
  ],
  adressthRules: [
    v => !!v || "* กรุณากรอกที่อยู่",
    v =>
      /^[\u0E00-\u0E7F\s]+$/.test(v) ||
      "* กรุณากรอกข้อมูลเป็นอักษรภาษาไทยเท่านั้น",
    v => v.length >= 2 || "* กรุณากรอกที่อยู่อย่างน้อย 2 ตัวอักษร",
    v => /^\S+(\s\S+)*$/.test(v) || "* กรุณากรอกข้อมูลให้ถูกต้อง"
  ],
  adressenRules: [
    v => !!v || "* กรุณากรอกที่อยู่",
    v =>
      /^[a-zA-Z\s]+$/.test(v) || "* กรุณากรอกข้อมูลเป็นอักษรภาษาอังกฤษเท่านั้น",
    v => v.length >= 2 || "* กรุณากรอกที่อยู่อย่างน้อย 2 ตัวอักษร",
    v => /^\S+(\s\S+)*$/.test(v) || "* กรุณากรอกข้อมูลให้ถูกต้อง"
  ]
});

watch(
  data_input.value,
  newValue => {
    emit("on-data-update", newValue);
    // console.log("ddddd", data_input.value )
  },
  { deep: true }
);

const handleAddressInputTh = addressLocation => {
  data_input.value.address.th.info = addressLocation;
  data_input.value.address.en.info.zip_code_value =
    addressLocation.zip_code_value;
};

const handleAddressInputEn = addressLocation => {
  data_input.value.address.en.info = addressLocation;
};

// const router = useRouter();
</script>
