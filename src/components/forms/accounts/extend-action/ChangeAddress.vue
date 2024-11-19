<template>
  <!-- เปลี่ยนที่อยู่ -->
  <v-container fuild>
    <v-row dense no-gutters>
      <!-- {{ changeAddress }} -->

      <!-- {{ data_input.addressTh }} -->
<!-- {{ propsVar.changeAddress?.province_th?.id }} -->
      <!-- {{ propsVar.changeAddress }} -->

      <v-col cols="12"><h2>เปลี่ยนที่อยู่</h2></v-col>
      <v-col cols="12">
        <v-card class="">
          <v-row dense no-gutters>
            <v-col cols="12">
              <v-card-title>
                <h6>Business Partner Number</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.partner_number"
                dense
                variant="outlined"
                :rules="required"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>ฺBranch Code</h6>
              </v-card-title>
              <!-- <v-select
                class="ml-4 mr-4"
                chips
                v-model="data_input.branch_code"
                :items="itemsBranchCode"
                multiple
                item-value="id"
                item-title="name"
                density="compact"
                variant="outlined"
              ></v-select> -->
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.branch_code"
                dense
                :rules="required"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Branch Description</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.branch_description"
                dense
                variant="outlined"
              ></v-text-field>
              <!-- <v-select
                class="ml-4 mr-4"
                chips
                v-model="data_input.branch_description"
                :items="itemsBranchDesc"
                multiple
                item-value="id"
                item-title="name"
                density="compact"
                variant="outlined"
              ></v-select> -->
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 1 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_1_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 2 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_2_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 3 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_3_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 4 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_4_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 1 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_1_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 2 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_2_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 3 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_3_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Name 4 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_4_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Address 1 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.address_1_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Address 2 (TH)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.address_2_th"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>
            <!-- <AddressInputControlTH
              tag-desc="(TH)"
              key-value="id"
              key-title="name_th"
              :is-disable-address="false"
              :address-item="data_input.addressTh"
              @on-input="handleAddressInputTH"
              class="ml-4 mr-4"
            /> -->

            <v-col cols="12" class="mt-n7">
              <v-card-title class="">
                <h6>จังหวัด</h6>
              </v-card-title>
              <v-autocomplete
                v-model="data_input.addressTh.province"
                :items="store.provinces"
                item-title="name_th"
                item-value="id"
                density="compact"
                class="ml-4 mr-4"
              
                variant="outlined"
              ></v-autocomplete>
            </v-col>
    
            <v-col cols="12" class="mt-n7">
              <v-card-title class="">
                <h6>เขต/อำเภอ</h6>
              </v-card-title>
              <v-autocomplete
                v-model="data_input.addressTh.district"
                :items="itemsDistrict"
                class="ml-4 mr-4"
                item-title="name_th"
                item-value="id"
                density="compact"
                variant="outlined"
              ></v-autocomplete>
            </v-col>
    
            <v-col cols="12" class="mt-n7">
              <v-card-title class="">
                <h6>แขวง/ตำบล</h6>
              </v-card-title>
              <v-autocomplete
                v-model="data_input.addressTh.parish"
                class="ml-4 mr-4"
                :items="itemsSubDistrict"
                item-title="name_th"
                item-value="id"
                density="compact"
                variant="outlined"
              ></v-autocomplete>
            </v-col>
    
            <v-col cols="12" class="mt-n7">
              <v-card-title class="">
                <h6>รหัสไปรษณีย์</h6>
              </v-card-title>
              <v-text-field
                v-model="data_input.addressTh.zip_code"
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

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Address 1 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.address_1_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Address 2 (EN)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.address_2_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>
            <ManaulAddressInputControl
              :address-item="data_input.addressEn"
              tag-desc="(ภาษาอังกฤษ)"
              class="ml-4 mr-4"
              @on-input="handleAddressInputEn"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, watch, onMounted, watchEffect, nextTick } from "vue";
// import { ref } from "vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";

import { useMyAddressStore } from "@/stores/addressDataStore";

const store = useMyAddressStore();

const itemsDistrict = ref([]);
const itemsSubDistrict = ref([]);
const itemsPostCode = ref([]);

const propsVar = defineProps({
  changeAddress: {
    type: Object,
  },
  index: Number,
});

const emit = defineEmits(["on-data-update"]);

const required = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
// Initialize data_input object to hold form data
const data_input = ref({
  partner_number: "",
  name_1_th: "",
  name_2_th: "",
  name_3_th: "",
  name_4_th: "",
  name_1_en: "",
  name_2_en: "",
  name_3_en: "",
  name_4_en: "",
  address_1_th: "",
  address_2_th: "",
  address_3_th: "",
  address_1_en: "",
  address_2_en: "",
  address_3_en: "",
  search_term1_th: "",
  search_term1_en: "",
  addressTh: {
    province: null,
    district: null,
    parish: null,
    zip_code: null,
  },
  addressEn: {
    province: null,
    district: null,
    parish: null,
    zip_code_value: null,
  },
  branch_code: null,
  branch_description: null,
  business_partner_role: null,
});

// Prefill branch description based on branch code
const prefillBranchDesc = (branchCode) => {
  switch (branchCode) {
    case "NVAT":
      return "NVAT";
    case "00000":
      return "สำนักงานใหญ่";
    default:
      return branchCode;
  }
};

// Prefill form data on first mount
onMounted(async () => {
  if (data_input.value.addressTh.province) {
    await loadDistricts(data_input.value.addressTh.province);
    data_input.value.addressTh.district = propsVar.changeAddress?.district_th?.id;

    if (data_input.value.addressTh.district) {
      await loadSubDistricts(data_input.value.addressTh.district);
      data_input.value.addressTh.parish = propsVar.changeAddress?.subdistrict_th?.id;

      if (data_input.value.addressTh.parish) {
        await loadPostCodes(data_input.value.addressTh.parish);
        data_input.value.addressTh.zip_code = itemsPostCode.value[0]?.code;
      }
    }
  }
});

watch(
  () => data_input.value.addressTh.zip_code,
  async (newZipCode) => {
    if (newZipCode) {
      await nextTick();  
      data_input.value.addressEn.zip_code_value = newZipCode;
      console.log("addressEn.zip_code updated after nextTick:qqqqqqq", data_input.value.addressEn.zip_code_value);
    }
  }
);


// Watch province for changes and update districts accordingly
watch(
  () => data_input.value.addressTh.province,
  async (newProvince, oldProvince) => {
    if (newProvince !== oldProvince && newProvince) {
      data_input.value.addressTh.district = null;
      data_input.value.addressTh.parish = null;
      data_input.value.addressTh.zip_code = null;

      itemsDistrict.value = []; 
      itemsSubDistrict.value = []; 
      itemsPostCode.value = []; // Clear postcodes

      // Load districts for the selected province
      await loadDistricts(newProvince);
    }
  }
);

watch(
  () => data_input.value.addressTh.district,
  async (newDistrict, oldDistrict) => {
    if (newDistrict !== oldDistrict && newDistrict) {
      // Clear the parish and zip code when a new district is selected
      data_input.value.addressTh.parish = null;
      data_input.value.addressTh.zip_code = null;

      itemsSubDistrict.value = []; 
      itemsPostCode.value = []; 

      await loadSubDistricts(newDistrict);
    }
  }
);

watch(
  () => data_input.value.addressTh.parish,
  async (newParish, oldParish) => {
    if (newParish !== oldParish && newParish) {
      await loadPostCodes(newParish);
      data_input.value.addressTh.zip_code = itemsPostCode.value[0]?.code;
    }
  }
);

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

watch(
  data_input.value,
  () => {
    emit("on-data-update", {
      index: propsVar.index,
      newValue: data_input.value,
    });
  },
  { deep: true }
);

// watch(
//   () => data_input.value.addressTh.zip_code,
//   (newZipCode) => {
//     if (newZipCode) {
//       // Set addressEn.zip_code to match addressTh.zip_code
//       data_input.value.addressEn.zip_code = newZipCode;
//     }
//   },
//   { deep: true }
// );



// Prefill address and other data from propsVar.changeAddress
watchEffect(() => {
  data_input.value.partner_number =
    propsVar.changeAddress?.business_partner_number ?? null;

  data_input.value.name_1_th = propsVar.changeAddress?.name1_th ?? null;
  data_input.value.name_2_th = propsVar.changeAddress?.name2_th ?? null;
  data_input.value.name_3_th = propsVar.changeAddress?.name3_th ?? null;
  data_input.value.name_4_th = propsVar.changeAddress?.name4_th ?? null;

  data_input.value.name_1_en = propsVar.changeAddress?.name1_en ?? null;
  data_input.value.name_2_en = propsVar.changeAddress?.name2_en ?? null;
  data_input.value.name_3_en = propsVar.changeAddress?.name3_en ?? null;
  data_input.value.name_4_en = propsVar.changeAddress?.name4_en ?? null;

  data_input.value.search_term1_th = propsVar.changeAddress?.search_term1_th ?? null;
  data_input.value.search_term1_en = propsVar.changeAddress?.search_term1_th ?? null;

  data_input.value.address_1_th = propsVar.changeAddress?.address_th ?? null;
  data_input.value.address_2_th = propsVar.changeAddress?.address1_th ?? null;
  data_input.value.address_3_th = propsVar.changeAddress?.address2_th ?? null;

  data_input.value.address_1_en = propsVar.changeAddress?.address_en ?? null;
  data_input.value.address_2_en = propsVar.changeAddress?.address1_en ?? null;
  data_input.value.address_3_en = propsVar.changeAddress?.address2_en ?? null;

  data_input.value.business_partner_role =
    propsVar.changeAddress.business_partner_role?.id ?? null;

  data_input.value.addressTh = {
    province: propsVar.changeAddress?.province_th?.id ?? null,
    district: propsVar.changeAddress?.district_th?.id ?? null,
    parish: propsVar.changeAddress?.subdistrict_th?.id ?? null,
    zip_code: propsVar.changeAddress?.postal_code_th?.id ?? null,
  };

  data_input.value.addressEn = {
    province: propsVar.changeAddress?.province_en ?? null,
    district: propsVar.changeAddress?.district_en ?? null,
    parish: propsVar.changeAddress?.subdistrict_en ?? null,
    zip_code_value: propsVar.changeAddress?.postal_code_th?.id ?? null,
  };

  data_input.value.branch_code = propsVar.changeAddress?.branch_code ?? null;
  data_input.value.branch_description = prefillBranchDesc(
    propsVar.changeAddress?.branch_code ?? null
  );
});

const handleAddressInputTH = (address) => {
  data_input.value.addressTh = address;
};

const handleAddressInputEn = (address) => {
  data_input.value.addressEn = address;
};
</script>




