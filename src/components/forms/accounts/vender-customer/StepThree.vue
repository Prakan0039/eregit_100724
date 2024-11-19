<template>
  <v-row dense>
    <!-- {{ props.contactItems }} -->
      <!-- {{ props.contactItems }} -->

    <v-col cols="12"><h2>ที่อยู่สาขา</h2></v-col>
    <v-col cols="12">
      <v-card>
        <v-row dense no-gutters>
          <v-col cols="12">
            <v-card-title>
              <h6>Branch code</h6>
            </v-card-title>
            <v-text-field
              class="ml-6 mr-6"
              density="compact"
              v-model="data_input_head_comp_branch.info.branch_code"
              dense
              variant="outlined"
              readonly
              bg-color="#dfdfdf"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-card-title>
              <h6>Branch description</h6>
            </v-card-title>
            <v-text-field
              class="ml-6 mr-6"
              density="compact"
              v-model="data_input_head_comp_branch.info.branch_desc"
              dense
              variant="outlined"
              readonly
              bg-color="rgb(223 223 223 / 30%)"
            ></v-text-field>
          </v-col>

          <!-- <v-col cols="12" v-if="props.typeForm === AccountType.CUSTOMER">
            <v-card-title>
              <h6>Default Branch Code</h6>
            </v-card-title>
            <v-text-field
              class="ml-6 mr-6"
              density="compact"
              v-model="data_input_head_comp_branch.info.default_branch_code"
              dense
              variant="outlined"
            ></v-text-field>
          </v-col> -->

          <v-col cols="12">
            <v-card-title>
              <h6>Search Term 1 (TH Branch)</h6>
            </v-card-title>
            <v-text-field
              class="ml-6 mr-6"
              density="compact"
              v-model="data_input_head_comp_branch.info.serach_team.th"
              dense
              variant="outlined"
              readonly
              bg-color="rgb(223 223 223 / 30%)"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-card-title>
              <h6>Search Term 1 (EN Branch)</h6>
            </v-card-title>
            <v-text-field
              class="ml-6 mr-6"
              density="compact"
              v-model="data_input_head_comp_branch.info.serach_team.en"
              dense
              variant="outlined"
              readonly
              bg-color="rgb(223 223 223 / 30%)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <!--Th/////////////////-->
        <AddressInputTH
          class="pr-6"
          :steptwoFormDetail="props.steptwoFormDetail"
          tag-desc="(TH Branch)"
          :is-not-team="true"
          :isDisableAddress="false"
          :register-form-detail="props.registerFormDetail"
          :name="props.nameTh"
          :register_type="3"
          :address="props.addressTh"
          @on-input="handleAddressTH"
        />

        <v-col cols="12" class="mt-n1">
          <v-card-title class="ml-n5">
            <h6>จังหวัด</h6>
          </v-card-title>
          <v-autocomplete
            v-model="data_input.province"
            :items="store.provinces"
            item-title="name_th"
            item-value="id"
            density="compact"
            :rules="textRequired"
            variant="outlined"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" class="mt-n7">
          <v-card-title class="ml-n5">
            <h6>เขต/อำเภอ</h6>
          </v-card-title>
          <v-autocomplete
            v-model="data_input.district"
            :items="itemsDistrict"
            :rules="textRequired"
            item-title="name_th"
            item-value="id"
            density="compact"
            variant="outlined"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" class="mt-n7">
          <v-card-title class="ml-n5">
            <h6>แขวง/ตำบล</h6>
          </v-card-title>
          <v-autocomplete
            v-model="data_input.parish"
            :rules="textRequired"
            :items="itemsSubDistrict"
            item-title="name_th"
            item-value="id"
            density="compact"
            variant="outlined"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" class="mt-n7">
          <v-card-title class="ml-n5">
            <h6>รหัสไปรษณีย์</h6>
          </v-card-title>
          <v-text-field
            v-model="data_input.zip_code_value"
            item-title="code"
            :rules="textRequired"
            item-value="id"
            density="compact"
            dense
            disabled
            variant="outlined"
            readonly
            bg-color="#dfdfdf"
          ></v-text-field>
        </v-col>
      </v-card>
    </v-col>
    <v-col cols="12">
      <!-- {{ data_input_head_comp_branch.address_en.location }} -->
      <AddressInputEN
        :register_type="2"
        class="pr-6"
        tag-desc="(EN Branch)"
        :is-not-team="true"
        :isDisableAddress="false"
        :address-item="data_input_head_comp_branch.address_en.location"
        :steptwoFormDetail="props.steptwoFormDetail"
        :register-form-detail="props.registerFormDetail"
        :is-address-manual="true"
        key-title="name_en"
        :name="props.nameEn"
        :address="props.addressEn"
        @on-input="handleAddressEN"
      />
    </v-col>
    <v-col cols="12"><CountryInput /></v-col>
    <v-col
      cols="12"
      v-for="(item, index) in data_input_head_comp_branch.contacts"
      :key="index"
      ><ContactInput
        :index="index"
        :name="item.name"
        :email="item.email"
        :phone="item.phone"
        @on-input="handleContact"
    /></v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { watch, watchEffect, toRefs } from "vue";

import AddressInputTH from "../controls/AddressInput.vue";
import AddressInputEN from "../controls/AddressInput.vue";
import CountryInput from "../controls/CountryInput.vue";
import ContactInput from "../controls/ContactInput.vue";
import AccountType from "@/utils/enum.util";
import { onMounted } from "vue";

import { useMyAddressStore } from "@/stores/addressDataStore";
const store = useMyAddressStore();

const props = defineProps({
  nameEn: String,
  nameTh: String,
  addressEn: String,
  addressTh: String,
  typeForm: {
    type: Number,
    default: AccountType.CUSTOMER, //0-Customer 1-Vender
  },
  branchCode: {
    type: String,
  },
  barnchDesc: {
    type: String,
  },
  addressItem: {
    type: Object,
    default: null,
  },
  contactItems: {
    type: Array,
    default: () => [{ index: 0, name: "", email: "", phone: "" }],
  },
  addressItemEn: {
    type: Object,
    default: null,
  },
  registerFormDetail: {
    type: Object,
    default: () => {},
  },

  steptwoFormDetail: {
    type: Object,
    default: () => {},
  },
});

const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
const emit = defineEmits(["on-input"]);

const data_input = ref({
  province: null,
  district: null,
  parish: null,
  zip_code: null,
  zip_code_value: "",
});

const itemsDistrict = ref([]);
const itemsSubDistrict = ref([]);
const itemsPostCode = ref([]);

const data_input_head_comp_branch = ref({
  address_th: {
    location: {
      province: null,
      district: null,
      parish: null,
      zip_code: null,
      zip_code_value: null,
    },
  },
  address_en: {
    location: {
      province: null,
      district: null,
      parish: null,
      zip_code: null,
      zip_code_value: null,
    },
  },
  info: {
    branch_code: props.branchCode,
    branch_desc:
      props.branchCode === "00000"
        ? "สำนักงานใหญ่"
        : props.branchCode === "NVAT"
        ? "NVAT"
        : props.barnchDesc,
    default_branch_code: "",
    serach_team: {
      th:
        props.branchCode === "00000"
          ? "สำนักงานใหญ่"
          : props.branchCode === "NVAT"
          ? "NVAT"
          : props.barnchDesc,
      en:
        props.branchCode === "00000"
          ? "HEAD OFFICE"  
          : props.branchCode === "NVAT"
          ? "NVAT"
          : props.barnchDesc,
    },
  },
  contacts: [],
});

const initail = ref(true);
const initailContect = ref(true);
const initailContact_1 = ref(true);
const initailContact_2 = ref(true);
const initailContact_3 = ref(true);
const initailEnAddress = ref(true);

// watch(
//   () => props.contactItems,
//   (newContactItems) => {
//     if (newContactItems) {
//       data_input_head_comp_branch.value.contacts = newContactItems.map((item, index) => ({
//         index: item.index ?? index,
//         name: item.name,
//         email: item.email,
//         phone: item.phone,
//       }));
//       console.log("props.contactItems updated");
//     }
//   },
//   { deep: true, immediate: true }
// );

const setDataFromFormDetail = async (formDetail) => {
  data_input.value.province = formDetail.branch_province_th_id;
  data_input.value.district = formDetail.branch_distict_th_id;
  data_input.value.parish = formDetail.branch_subdisticte_th_id;
  data_input.value.zip_code = formDetail.branch_postal_code_th_id;

  if (data_input.value.province) {
    await store.getDistrict(data_input.value.province);
    itemsDistrict.value = store.districts;
  }

  if (data_input.value.parish) {
    await store.getPostCode(data_input.value.parish);
    itemsPostCode.value = store.postCodes;
  }

  data_input.value.zip_code_value = itemsPostCode.value[0]?.code;
};

const setDataFromAddressItem = async (addressItem) => {
  if (addressItem) {
    data_input.value.province = addressItem.province;

    if (data_input.value.province) {
      await store.getDistrict(data_input.value.province);
      itemsDistrict.value = store.districts;
      data_input.value.district = addressItem.district;

      if (data_input.value.district) {
        await store.getSubDistrict(data_input.value.district);
        itemsSubDistrict.value = store.subDistricts;
        data_input.value.parish = addressItem.parish;

        if (data_input.value.parish) {
          await store.getPostCode(data_input.value.parish);
          itemsPostCode.value = store.postCodes;
          data_input.value.zip_code = addressItem.zip_code;
          data_input.value.zip_code_value = itemsPostCode.value[0]?.code;
        }
      }
    }
  }
};
const setEnglishDataFromFormDetail = (formDetail) => {
  data_input_head_comp_branch.value.address_en.location.province =
    formDetail.branch_province_en;
  data_input_head_comp_branch.value.address_en.location.district =
    formDetail.branch_distict_en;
  data_input_head_comp_branch.value.address_en.location.parish =
    formDetail.branch_subdisticte_en;
  data_input_head_comp_branch.value.address_en.location.zip_code =
    formDetail.branch_postal_code_en_id;
  data_input_head_comp_branch.value.address_en.location.zip_code_value =
    formDetail.branch_postal_code_en_id;
};

const setEnglishDataFromAddressItem = async (addressItemEn) => {
  if (addressItemEn) {
    data_input_head_comp_branch.value.address_en.location.province =
      addressItemEn.province;
    data_input_head_comp_branch.value.address_en.location.district =
      addressItemEn.district;
    data_input_head_comp_branch.value.address_en.location.parish =
      addressItemEn.parish;
    data_input_head_comp_branch.value.address_en.location.zip_code =
      addressItemEn.zip_code;
    data_input_head_comp_branch.value.address_en.location.zip_code_value =
      addressItemEn.zip_code_value;
  }
};

watchEffect(async () => {
  if (props.registerFormDetail.account_information_form && initail.value) {
    await setDataFromFormDetail(
      props.registerFormDetail.account_information_form
    );
    initail.value = false;
  } else if (props.addressItem && initail.value) {
    await setDataFromAddressItem(props.addressItem);
    if (
      data_input.value.province &&
      data_input.value.district &&
      data_input.value.parish &&
      data_input.value.zip_code
    ) {
      initail.value = false;
    }
  }

  if (props.registerFormDetail.account_information_form) {
    if (
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_1 &&
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_1 != "" &&
      initailContact_1.value
    ) {
      data_input_head_comp_branch.value.contacts[0] = {
        index: 0,
        name: props.registerFormDetail.account_information_form
          ?.branch_contact_name_1,
        phone:
          props.registerFormDetail.account_information_form
            ?.branch_contact_mobile_number_1,
        email:
          props.registerFormDetail.account_information_form
            ?.branch_contact_email_1,
      };
      console.error("initailContact_1.value");
      initailContact_1.value = false;
    }

    if (
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_2 &&
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_2 != "" &&
      initailContact_2.value
    ) {
      data_input_head_comp_branch.value.contacts[1] = {
        index: 1,
        name: props.registerFormDetail.account_information_form
          ?.branch_contact_name_2,
        phone:
          props.registerFormDetail.account_information_form
            ?.branch_contact_mobile_number_2,
        email:
          props.registerFormDetail.account_information_form
            ?.branch_contact_email_2,
      };
      initailContact_2.value = false;
    }

    if (
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_3 &&
      props.registerFormDetail.account_information_form
        ?.branch_contact_name_3 != "" &&
      initailContact_3.value
    ) {
      data_input_head_comp_branch.value.contacts[2] = {
        index: 2,
        name: props.registerFormDetail.account_information_form
          ?.branch_contact_name_3,
        phone:
          props.registerFormDetail.account_information_form
            ?.branch_contact_mobile_number_3,
        email:
          props.registerFormDetail.account_information_form
            ?.branch_contact_email_3,
      };
      initailContact_3.value = false;
    }
    // initailContect.value = false;
  } else if (initailContect.value) {
    data_input_head_comp_branch.value.contacts = props.contactItems.map(
      (el) => {
        return {
          index: el.index,
          name: el.name,
          phone: el.phone,
          email: el.email,
        };
      }
    );
    initailContect.value = false;
  }

  if (
    props.registerFormDetail.account_information_form?.branch_province_en &&
    initailEnAddress.value
  ) {
    setEnglishDataFromFormDetail(
      props.registerFormDetail.account_information_form
    );
    initailEnAddress.value = false;
  } else if (
    props.addressItemEn &&
    !data_input_head_comp_branch.value.address_en.location.province &&
    initailEnAddress.value
  ) {
    setEnglishDataFromAddressItem(props.addressItemEn);
    initailEnAddress.value = false;
  }
});

// watch(
//   () => props.addressItem,
//   async (newAddressItem) => {
//     console.error("props.addressItem updated");
//     if (!initail.value) {
//       await setDataFromAddressItem(newAddressItem);
//     }
//   },
//   { deep: true, immediate: false }
// );

// watch(
//   () => props.addressItemEn,
//   (newAddressItemEn) => {
//     setEnglishDataFromAddressItem(newAddressItemEn);
//   },
//   { deep: true }
// );

onMounted(() => {
  emit("on-input", data_input_head_comp_branch.value);
});

const handleAddressEN = (data_obj) => {
  data_input_head_comp_branch.value.address_en = data_obj;
};

const handleAddressTH = (data_obj) => {
  data_input_head_comp_branch.value.address_th = data_obj;
};

const handleContact = (data_obj) => {
  data_input_head_comp_branch.value.contacts[data_obj.index] = {
    index: data_obj.index,
    name: data_obj.name,
    phone: data_obj.phone,
    email: data_obj.email,
  };
};

watch(
  () => data_input.value.province,
  async () => {
    if (data_input.value.province) {
      data_input.value.district = null;
      data_input.value.parish = null;
      await store.getDistrict(data_input.value.province);
      itemsDistrict.value = store.districts;
      itemsSubDistrict.value = [];

      data_input_head_comp_branch.value.address_th.location = data_input.value;
    }
  },
  { deep: true, immediate: false }
);

watch(
  () => data_input.value.district,
  async (newdata, oledata) => {
    if (data_input.value.district) {
      await store.getSubDistrict(data_input.value.district);
      itemsSubDistrict.value = store.subDistricts;
      data_input_head_comp_branch.value.address_th.location = data_input.value;
    }
    if (oledata) {
      data_input.value.parish = null;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => data_input.value.parish,
  async () => {
    if (data_input.value.parish) {
      await store.getPostCode(data_input.value.parish);
      itemsPostCode.value = store.postCodes;
      data_input.value.zip_code = itemsPostCode.value[0]?.id;
      data_input.value.zip_code_value = itemsPostCode.value[0]?.code;
      data_input_head_comp_branch.value.address_th.location = data_input.value;

      data_input_head_comp_branch.value.address_en.location.zip_code_value =
        itemsPostCode.value[0]?.code;
    }
  },
  { deep: true, immediate: true }
);




watch(data_input_head_comp_branch.value, (newValue) => {
  emit("on-input", newValue);
});

// watch(
//   () => props.contactItems, 
//   (newContactItems) => {
//     if (newContactItems && Array.isArray(newContactItems)) {
//       data_input_head_comp_branch.value.contacts = newContactItems.map((item, index) => ({
//         index: item.index ?? index,
//         name: item.name,
//         email: item.email,
//         phone: item.phone,
//       }));
//       console.log("props.contactItems updated", data_input_head_comp_branch.value.contacts);
//     }
//   },
//   { deep: true,  }
// );
watch(
  () => (props.contactItems ? JSON.stringify(props.contactItems) : null), // ตรวจสอบว่า contactItems ไม่ใช่ undefined
  (newContactItems, oldContactItems) => {
    if (!newContactItems) {
      // ถ้า newContactItems เป็น null แสดงว่า props.contactItems เป็น undefined หรือ null
      data_input_head_comp_branch.value.contacts = [];
      console.log("Contact items are undefined or null, cleared contacts.");
      return;
    }

    // แปลง newContactItems กลับเป็น array หลังจาก JSON.stringify
    const parsedNewContactItems = JSON.parse(newContactItems);

    console.log("Old contact items:", oldContactItems ? JSON.parse(oldContactItems) : []);
    console.log("New contact items:", parsedNewContactItems);

    const updatedItems = Array.isArray(parsedNewContactItems) 
      ? [...parsedNewContactItems] 
      : [];

    if (updatedItems.length > 0) {
      data_input_head_comp_branch.value.contacts = updatedItems.map((item, index) => ({
        index: item.index ?? index,
        name: item.name || '/',
        email: item.email || '/',
        phone: item.phone || '/'
      }));
      console.log("Updated contacts:", data_input_head_comp_branch.value.contacts);
    } else {
      data_input_head_comp_branch.value.contacts = [];
      console.log("No valid contact items, cleared contacts.");
    }
  },
  { immediate: true }
);



watch(
  () => props.addressItem,
  async (newAddressItem) => {
    if (newAddressItem) {
      console.error("props.addressItem updated");
      await setDataFromAddressItem(newAddressItem);
    }
  },
  { deep: true, immediate: true }
);



watch(
  () => props.addressItemEn, 
  async (newAddressItemEn) => {
    if (newAddressItemEn) {
      // console.error("props.addressItemEn updated");
      await setEnglishDataFromAddressItem(newAddressItemEn);
    }
  },
  { deep: true, immediate: true }
);


</script>

<style scoped>
:deep(.v-field) {
  border-radius: 10px !important;
  border: 1px solid #ededed !important;
  -webkit-border-radius: 10px !important;
  -moz-border-radius: 10px !important;
  -ms-border-radius: 10px !important;
  -o-border-radius: 10px !important;
}
</style>
