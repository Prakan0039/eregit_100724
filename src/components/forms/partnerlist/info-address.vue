<template>
  <v-container>
    <!-- <div class="d-flex align-center justify-center">
      <h2 class="py-5">Change Information</h2>
    </div>-->

    <!-- {{ itemBranchCodeSelection.postal_code_th }} -->
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
                <v-select
                  v-model="data_input.branch_code"
                  :items="itemsBranch"
                  density="compact"
                  variant="outlined"
                ></v-select>
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
                  class="ml-4 mr-4"

                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <AddressInputControlTH
                  :rules="textRequired"
                  tag-desc="(ภาษาไทย)"
                  key-value="id"
                  key-title="name_th"
                  :is-disable-address="false"
                  @on-input="handleAddressInputTh"
                />
              </v-col>-->
              <v-col cols="12" class="mt-n7">
                <v-card-title class>
                  <h6>จังหวัด</h6>
                </v-card-title>
                <v-autocomplete
                  v-model="data_input.address.th.info.province"
                  :items="store.provinces"
                  item-title="name_th"
                  item-value="id"
                  density="compact"
                  class="ml-4 mr-4"
                  variant="outlined"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" class="mt-n7">
                <v-card-title class>
                  <h6>เขต/อำเภอ</h6>
                </v-card-title>
                <v-autocomplete
                  v-model="data_input.address.th.info.district"
                  :items="itemsDistrict"
                  class="ml-4 mr-4"
                  item-title="name_th"
                  item-value="id"
                  density="compact"
                  variant="outlined"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" class="mt-n7">
                <v-card-title class>
                  <h6>แขวง/ตำบล</h6>
                </v-card-title>
                <v-autocomplete
                  v-model="data_input.address.th.info.parish"
                  class="ml-4 mr-4"
                  :items="itemsSubDistrict"
                  item-title="name_th"
                  item-value="id"
                  density="compact"
                  variant="outlined"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" class="mt-n7">
                <v-card-title class>
                  <h6>รหัสไปรษณีย์</h6>
                </v-card-title>
                <v-text-field
                  v-model="data_input.address.th.info.zip_code"
                  item-title="code"
                  item-value="id"
                  density="compact"
                  dense
                  disabled
                  variant="outlined"
                  class="ml-4 mr-4"
                  readonly
                  bg-color="#dfdfdf"
                ></v-text-field>
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
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import PartnerServive from "@/apis/PartnerServive";

import AddressInputControlTH from "@/components/controls/AddressInputControlComp.vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";
import { useMyAddressStore } from "@/stores/addressDataStore";

const store = useMyAddressStore();

const itemsDistrict = ref([]);
const itemsSubDistrict = ref([]);
const itemsPostCode = ref([]);
const emit = defineEmits(["on-data-update"]);
const route = useRoute();
const router = useRouter();
const data_input = ref({
  branch_code: "",
  address: {
    en: {
      address: null,
      info: {
        province: null,
        district: null,
        parish: null,
        zip_code: null,
        zip_code_value: null, // เพิ่ม zip_code_value ตรงนี้

      }
    },
    th: {
      address: null,
      info: {
        province: null,
        district: null,
        parish: null,
        zip_code: null,
        zip_code_value: null, // เพิ่ม zip_code_value ตรงนี้


      }
    }
  }
});
const textRequired = [v => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
const bpNumber = ref(route.query.bp_number);

const item = ref({});
const itemsBranch = ref([]);
onMounted(async () => {
  await getBranchList();
  console.log("Branch Options: ", item.value);
  //Get items all
  if (item.value.branch) {
    itemsBranch.value = item.value.branch.map(el => el.branch_code);
  }
  // if (data_input.value.address.th.info.province) {
  // await loadDistricts(data_input.value.address.th.info.province);
  // data_input.value.address.th.info.district = itemBranchCodeSelection.district_th;

  // await loadSubDistricts(data_input.value.address.th.info.district);
  // data_input.value.address.th.info.parish = itemBranchCodeSelection.subdistrict_th;

  // await loadPostCodes(data_input.value.address.th.info.parish);
  // data_input.value.address.th.info.zip_code = itemBranchCodeSelection.postal_code_th;
  // }

});

// watch(
//   () => data_input.value.address.th.info.zip_code_value,
//   async (newZipCodeValue) => {
//     if (newZipCodeValue) {
//       data_input.value.address.en.info.zip_code_value = newZipCodeValue;
//       await nextTick(); 
//       console.log(
//         "Updated English zip_code_value after nextTick:",
//         data_input.value.address.en.info.zip_code_value
//       );
//     }
//   }
// );
watch(
  () => data_input.value.address.th.info.province,
  async (newProvince, oldProvince) => {
    if (newProvince !== oldProvince && newProvince) {
      data_input.value.address.th.info.district = null;
      data_input.value.address.th.info.parish = null;
      data_input.value.address.th.info.zip_code = null;

      itemsDistrict.value = []; 
      itemsSubDistrict.value = []; 
      itemsPostCode.value = []; // Clear postcodes

      // Load districts for the selected province
      await loadDistricts(newProvince);
    }
  }
);

watch(
  () => data_input.value.address.th.info.district,
  async (newDistrict, oldDistrict) => {
    if (newDistrict !== oldDistrict && newDistrict) {
      // Clear the parish and zip code when a new district is selected
      data_input.value.address.th.info.parish = null;
      data_input.value.address.th.info.zip_code = null;

      itemsSubDistrict.value = []; 
      itemsPostCode.value = []; 

      await loadSubDistricts(newDistrict);
    }
  }
);

watch(
  () => data_input.value.address.th.info.parish,
  async (newParish, oldParish) => {
    if (newParish !== oldParish && newParish) {
      await loadPostCodes(newParish);
      data_input.value.address.th.info.zip_code = itemsPostCode.value[0]?.code;
    }
  }
);




// watch(
//   () => data_input.value.branch_code,
//   () => {
//     const itemBranchCodeSelection = item.value.branch.find(
//       el => el.branch_code == data_input.value.branch_code
//     );
//     console.log("itemBranchCodeSelection", itemBranchCodeSelection);
//     if (itemBranchCodeSelection) {
//       data_input.value.address.th.address = itemBranchCodeSelection.address_th;

//        loadDistricts(data_input.value.address.th.info.province);
//   data_input.value.address.th.info.district = itemBranchCodeSelection.district_th;

//    loadSubDistricts(data_input.value.address.th.info.district);
//   data_input.value.address.th.info.parish = itemBranchCodeSelection.subdistrict_th;

//    loadPostCodes(data_input.value.address.th.info.parish);
//   data_input.value.address.th.info.zip_code = itemBranchCodeSelection.postal_code_th;
//       // data_input.value.address.th.info.province =
//       //   itemBranchCodeSelection.province_th;
//       // data_input.value.address.th.info.district =
//       //   itemBranchCodeSelection.district_th;
//       // data_input.value.address.th.info.parish =
//       //   itemBranchCodeSelection.subdistrict_th;
//       // data_input.value.address.th.info.zip_code =
//       //   itemBranchCodeSelection.postal_code_th;

//       data_input.value.address.en.address = itemBranchCodeSelection.address_en;
//       data_input.value.address.en.info.province =
//         itemBranchCodeSelection.province_en;
//       data_input.value.address.en.info.district =
//         itemBranchCodeSelection.district_en;
//       data_input.value.address.en.info.parish =
//         itemBranchCodeSelection.subdistrict_en;
//       data_input.value.address.en.info.zip_code =
//         itemBranchCodeSelection.postal_code_en;
//     }
//   },
//   { deep: true }
// );

watch(
  () => data_input.value.branch_code,
  async () => { // เพิ่ม async ตรงนี้
    const itemBranchCodeSelection = item.value.branch.find(
      el => el.branch_code == data_input.value.branch_code
    );
    console.log("itemBranchCodeSelection", itemBranchCodeSelection);
    if (itemBranchCodeSelection) {
      // if (data_input.value.address.th.info.province) {
        data_input.value.address.th.info.province =
        itemBranchCodeSelection.province_th;

        await loadDistricts(data_input.value.address.th.info.province);
        data_input.value.address.th.info.district = itemBranchCodeSelection.district_th;

        await loadSubDistricts(data_input.value.address.th.info.district);
        data_input.value.address.th.info.parish = itemBranchCodeSelection.subdistrict_th;

        await loadPostCodes(data_input.value.address.th.info.parish);
        data_input.value.address.th.info.zip_code = itemsPostCode.value[0]?.code;
      // }
      data_input.value.address.th.address = itemBranchCodeSelection.address_th;

      data_input.value.address.en.address = itemBranchCodeSelection.address_en;
      data_input.value.address.en.info.province =
        itemBranchCodeSelection.province_en;
      data_input.value.address.en.info.district =
        itemBranchCodeSelection.district_en;
      data_input.value.address.en.info.parish =
        itemBranchCodeSelection.subdistrict_en;
      data_input.value.address.en.info.zip_code =
        itemBranchCodeSelection.postal_code_en;
    }
  },
  { deep: true }
);

watch(
  () => data_input.value.address.th.info.zip_code,
  async (newZipCode) => {
    if (newZipCode) {
      await nextTick();  
      data_input.value.address.en.info.zip_code = newZipCode;
      console.log("addressEn.zip_code updated after nextTick:qqqqqqq", data_input.value.address.en.info.zip_code);
    }
  }
);

// watch(
//   () => data_input.value.address.th.info.zip_code,
//   async (newZipCode) => {
//     if (newZipCode) {
//       await nextTick();  
//       data_input.value.address.en.info.zip_code = newZipCode;
//       console.log("addressEn.zip_code updated after nextTick:qqqqqqq", data_input.value.address.en.info.zip_code);
//     }
//   }
// );



const loadDistricts = async (provinceId) => {
  try {
    await store.getDistrict(provinceId);
    itemsDistrict.value = store.districts;  
  } catch (error) {
    console.error("Error loading districts:", error);
  }
};

const loadSubDistricts = async (districtId) => {
  try {
    await store.getSubDistrict(districtId);
    itemsSubDistrict.value = store.subDistricts; 
  } catch (error) {
    console.error("Error loading subdistricts:", error);
  }
};

// Load postcodes for a given parish
const loadPostCodes = async (parishId) => {
  try {
    await store.getPostCode(parishId);
    itemsPostCode.value = store.postCodes;  
  } catch (error) {
    console.error("Error loading postcodes:", error);
  }
};

const getBranchList = async () => {
  try {
    const response = await PartnerServive.getBranchListByPbNumber(
      bpNumber.value
    );
    if (response.data?.is_success) {
      item.value = response.data.data;
      // ดึง branch_code ทุกชุดและเก็บใน branchOptions
      // branchOptions.value = response.data.data?.branch.map(el => el.branch_code);
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
