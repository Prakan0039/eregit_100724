<template>
  <!-- เพิ่มสาขา -->
  <v-container>
    <v-row dense no-gutters>
      <!-- {{ propsVar.addBranchInfo }} -->
      <!-- {{ propsVar.addBranchInfo.province_th.id }} -->
      <v-col cols="12"><h2>เพิ่มสาขา</h2></v-col>
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
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Role</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.role"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Branch Code</h6>
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
                <h6>Search Term 1 (TH Branch)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.search_term_1_th"
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
                <h6>Search Term 1 (EN Branch)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.search_term_1_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Address 1 (TH Branch)</h6>
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
                <h6>Address 2 (TH Branch)</h6>
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
            /> --><v-col cols="12" class="mt-n7">
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
                <h6>Address 1 (EN Branch)</h6>
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
                <h6>Address 2 (EN Branch)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.address_2_en"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>
            <!-- <AddressInputControlEN
              tag-desc="(EN)"
              key-value="id"
              key-title="name_en"
              :is-disable-address="true"
              :address-item="data_input.address"
              class="ml-5"
            /> -->
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
    <!-- {{ data_input.addressTh }}
    {{ propsVar.addBranchInfo?.postal_code_th.id }} -->
  </v-container>
</template>
<script setup>
import { ref, watch, onMounted, watchEffect, nextTick } from "vue";
// import AddressInputControlEN from "@/components/controls/AddressInputControl.vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";
import AddressInputControlTH from "@/components/controls/AddressInputControl.vue";
import { useMyAddressStore } from "@/stores/addressDataStore";

const store = useMyAddressStore();

const propsVar = defineProps({
  addBranchInfo: {
    type: Object,
  },
  index: Number,
});

const emit = defineEmits(["on-data-update"]);

// const itemsBranchCode = ref([]);
// const itemsBranchDesc = ref([]);
const itemsDistrict = ref([]);
const itemsSubDistrict = ref([]);
const itemsPostCode = ref([]);

const data_input = ref({
  partner_number: "",
  role: "",
  name_1_th: "",
  name_2_th: "",
  name_3_th: "",
  name_4_th: "",
  search_term_1_th: "",
  name_1_en: "",
  name_2_en: "",
  name_3_en: "",
  name_4_en: "",
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
    zip_code: null,
  },
  search_term_1_en: "",
  address_1_th: "",
  address_2_th: "",
  address_3_th: "",
  address_1_en: "",
  address_2_en: "",
  address_3_en: "",
  branch_code: null,
  branch_description: null,
});

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
/////////
onMounted(async () => {
  if (data_input.value.addressTh.province) {
    await loadDistricts(data_input.value.addressTh.province);
    data_input.value.addressTh.district = propsVar.addBranchInfo?.district_th?.id;

    if (data_input.value.addressTh.district) {
      await loadSubDistricts(data_input.value.addressTh.district);
      data_input.value.addressTh.parish = propsVar.addBranchInfo?.subdistrict_th?.id;

      if (data_input.value.addressTh.parish) {
        await loadPostCodes(data_input.value.addressTh.parish);
        data_input.value.addressTh.zip_code = itemsPostCode.value[0]?.code;
      }
    }
  }
});


// Watch province for changes and update districts accordingly
watch(
  () => data_input.value.addressTh.province,
  async (newProvince, oldProvince) => {
    if (newProvince !== oldProvince && newProvince) {
      // Clear the district, parish, and zip code when a new province is selected
      data_input.value.addressTh.district = null;
      data_input.value.addressTh.parish = null;
      data_input.value.addressTh.zip_code = null;

      itemsDistrict.value = []; // Clear districts
      itemsSubDistrict.value = []; // Clear subdistricts
      itemsPostCode.value = []; // Clear postcodes

      // Load districts for the selected province
      await loadDistricts(newProvince);
    }
  }
);

// Watch district for changes and update subdistricts accordingly
watch(
  () => data_input.value.addressTh.district,
  async (newDistrict, oldDistrict) => {
    if (newDistrict !== oldDistrict && newDistrict) {
      // Clear the parish and zip code when a new district is selected
      data_input.value.addressTh.parish = null;
      data_input.value.addressTh.zip_code = null;

      itemsSubDistrict.value = []; // Clear subdistricts
      itemsPostCode.value = []; // Clear postcodes

      // Load subdistricts for the selected district
      await loadSubDistricts(newDistrict);
    }
  }
);

// Watch parish for changes and update postal code accordingly
watch(
  () => data_input.value.addressTh.parish,
  async (newParish, oldParish) => {
    if (newParish !== oldParish && newParish) {
      // Load postal code for the selected parish
      await loadPostCodes(newParish);
      data_input.value.addressTh.zip_code = itemsPostCode.value[0]?.code;
    }
  }
);

// Load districts for a given province
const loadDistricts = async (provinceId) => {
  try {
    await store.getDistrict(provinceId);
    itemsDistrict.value = store.districts;  // Update districts list
  } catch (error) {
    console.error("Error loading districts:", error);
  }
};

// Load subdistricts for a given district
const loadSubDistricts = async (districtId) => {
  try {
    await store.getSubDistrict(districtId);
    itemsSubDistrict.value = store.subDistricts;  // Update subdistricts list
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
  () => data_input.value.addressTh.zip_code,
  async (newZipCode) => {
    if (newZipCode) {
      await nextTick();  // รอให้ Vue อัปเดต Reactive state ก่อน
      data_input.value.addressEn.zip_code_value = newZipCode;
      console.log("addressEn.zip_code updated after nextTick:qqqqqqq", data_input.value.addressEn.zip_code_value);
    }
  }
);


watchEffect(() => {
  data_input.value.addressTh = {
    province: propsVar.addBranchInfo?.province_th?.id ?? null,
    district: propsVar.addBranchInfo?.district_th?.id ?? null,
    parish: propsVar.addBranchInfo?.subdistrict_th?.id ?? null,
    zip_code: propsVar.addBranchInfo?.postal_code_th?.id ?? null,
  };

  data_input.value.partner_number =
    propsVar.addBranchInfo?.business_partner_number ?? null;

  data_input.value.name_1_th = propsVar.addBranchInfo?.name1_th ?? null;
  data_input.value.name_2_th = propsVar.addBranchInfo?.name2_th ?? null;
  data_input.value.name_3_th = propsVar.addBranchInfo?.name3_th ?? null;
  // data_input.value.name_4_th = propsVar.addBranchInfo?.name3_th;

  data_input.value.search_term_1_th = propsVar.addBranchInfo?.search_term1_th ?? null;

  data_input.value.name_1_en = propsVar.addBranchInfo?.name1_en ?? null;
  data_input.value.name_2_en = propsVar.addBranchInfo?.name2_en ?? null;
  data_input.value.name_3_en = propsVar.addBranchInfo?.name3_en ?? null;
  // data_input.value.name_4_en = propsVar.addBranchInfo?.name3_en;

  data_input.value.search_term_1_en = propsVar.addBranchInfo?.search_term1_en ?? null;

  data_input.value.address_1_th = propsVar.addBranchInfo?.address_th ?? null;
  data_input.value.address_2_th = propsVar.addBranchInfo?.address1_th ?? null;
  data_input.value.address_3_th = propsVar.addBranchInfo?.address2_th ?? null;

  data_input.value.address_1_en = propsVar.addBranchInfo?.address_en ?? null;
  data_input.value.address_2_en = propsVar.addBranchInfo?.address1_en ?? null; 
  data_input.value.address_3_en = propsVar.addBranchInfo?.address2_en ?? null;

  data_input.value.branch_code = propsVar.addBranchInfo?.branch_code ?? null;
  data_input.value.branch_description = prefillBranchDesc(
    propsVar.addBranchInfo?.branch_code ?? null
  );

  data_input.value.role = propsVar.addBranchInfo?.business_partner_role?.name ?? null;

  data_input.value.addressEn = {
    province: propsVar.addBranchInfo?.province_en ?? null,
    district: propsVar.addBranchInfo?.district_en ?? null,
    parish: propsVar.addBranchInfo?.subdistrict_en ?? null,
    zip_code: propsVar.addBranchInfo?.postal_code_th?.id ?? null,
  };
});


const handleAddressInputTH = (address) => {
  data_input.value.addressTh = address;
};

const handleAddressInputEn = (address) => {
  data_input.value.addressEn = address;
};

watch(data_input.value, () => {
  emit("on-data-update", { index: propsVar.index, newValue: data_input.value });
});
</script>
