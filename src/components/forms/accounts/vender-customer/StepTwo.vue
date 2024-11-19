<template>
  <v-row dense>
    <!-- {{ props.registerFormDetail.business_partner_register_form.name_en }} -->


    <v-col cols="12">
      <h2>ที่อยู่</h2>
    </v-col>

    <v-col cols="12">
      <!-- <AddressInputTH
        tag-desc="(TH)"
        :is-not-team="false"
        :isDisableAddress="false"
        class="pr-5"
        :tax-payer-id-number="props.taxPayerIdNumber"
        :address-item="data_input_head_comp.address_th.location"
        :name="props.nameTh"
        :address="props.addressTh"
        @on-input="handleAddressTH"
      />-->
      <v-card class="pl-5 pr-5">
        <v-row dense>

          <v-col cols="12" v-if="business_partner_type==1"  >
            <v-card-title>
              <h6>คำนำหน้าชื่อ (ภาษาไทย)</h6>
            </v-card-title>
            <v-col cols="12">
              <v-radio-group
                bg-color="#dfdfdf"
                v-model="data_input_head_comp.address_th.name.gender"
                inline
               class="mt-0"
              >
                <v-radio label="นาย" value="นาย"></v-radio>
                <v-radio label="นาง" value="นาง"></v-radio>
                <v-radio label="นางสาว" value="นางสาว"></v-radio>
              </v-radio-group>
            </v-col>
          </v-col>

          <v-col cols="12" class="">
            <v-card-title>
              <h6>Name 1 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              density="compact"
              :rules="rules_valid.namerequire"
              dense
              v-model="data_input_head_comp.address_th.name.one"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7">
            <v-card-title>
              <h6>Name 2 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              density="compact"
              :rules="rules_valid.name"
              dense
              v-model="data_input_head_comp.address_th.name.two"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7">
            <v-card-title>
              <h6>Name 3 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              :rules="rules_valid.name"
              density="compact"
              dense
              v-model="data_input_head_comp.address_th.name.three"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7">
            <v-card-title>
              <h6>Name 4 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              :rules="rules_valid.name"
              density="compact"
              dense
              v-model="data_input_head_comp.address_th.name.four"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7" v-if="!props.isNotTeam">
            <v-card-title>
              <h6>Search Term 1 (ชื่อย่อ)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              :rules="rules_valid.searchtermone"
              density="compact"
              dense
              v-model="data_input_head_comp.address_th.search.one"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7" v-if="!props.isNotTeam">
            <v-card-title>
              <h6>Search Term 2 (เลข 13 หลัก)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              density="compact"
              :rules="textRequired"
              dense
              v-model="data_input_head_comp.address_th.search.two"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7">
            <v-card-title>
              <h6>Address 1 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              density="compact"
              dense
              v-model="data_input_head_comp.address_th.address.one"
              variant="outlined"
              :rules="rules_valid.addressrequire"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="mt-n7">
            <v-card-title>
              <h6>Address 2 (TH)</h6>
            </v-card-title>
            <v-text-field
              class="ml-0 mr-0"
              density="compact"
              :rules="rules_valid.address2"
              dense
              v-model="data_input_head_comp.address_th.address.two"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <!-- <AddressInputControl
            tag-desc="(ภาษาไทย)"
            key-value="id"
            key-title="name_th"
            :is-disable-address="false"
            :address-item="data_input_head_comp.address_th.location"
            @on-input="handleAddressInput"
            class="ml-5 mt-n5"
            />-->
            <v-row dense>
              <v-col cols="12" class="mt-n1">
                {{ data_input.value }}
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
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <AddressInputEN
        tag-desc="(EN)"
        :is-not-team="false"
        :is-address="true"
        :isGender="1"
        :register_type="props.register_type"
        :isDisableAddress="false"
        key-title="name_en"
        class="pr-5"
        :is-address-manual="true"
        :register-form-detail="props.registerFormDetail"
        :tax-payer-id-number="props.taxPayerIdNumber"
        :address-item="data_input_head_comp.address_en.location"
        :name="props.nameEn"
        :address="props.addressEn"
        @on-input="handleAddressEN"
      />

      <!-- <v-card>
        <ManaulAddressInputControl
          class="ma-5"
          :address-item="data_input_head_comp.address_en.location"
          tag-desc="(EN Branch)"
          @on-input="handleAddressEN"
        />
      </v-card>-->
    </v-col>
    <v-col cols="12">
      <CountryInput @on-input="handleCountry" />
    </v-col>

    <v-col cols="12" v-for="(item, index) in props.contactItems" :key="index">
      <ContactInput
        :index="index"
        :name="item.name"
        :email="item.email"
        :phone="item.phone"
        @on-input="handleContact"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";

const textRequired = [v => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];

// import AddressInputTH from "../controls/AddressInput.vue";
import AddressInputEN from "../controls/AddressInput.vue";
// import AddressInputControl from "@/components/controls/AddressInputControl.vue";
// import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";
import CountryInput from "../controls/CountryInput.vue";
import ContactInput from "../controls/ContactInput.vue";

import { useMyAddressStore } from "@/stores/addressDataStore";

const store = useMyAddressStore();

const props = defineProps({
  nameEn: String,
  nameTh: String,
  addressEn: String,
  addressTh: String,
  taxPayerIdNumber: {
    type: String
  },

  register_type: {
    type: Number
  },
  addressItem: {
    type: Object,
    default: null
  },
  addressItemEn: {
    type: Object,
    default: null
  },
  contactItems: {
    type: Array,
    default: () => [{ index: 0, name: "", email: "", phone: "" }]
  },
  registerFormDetail: {
    type: Object,
    default: () => {}
  }
});

const rules_valid = ref({
  companyData: [v => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [
    () =>
      data_input.value.employee_data.data.some(Boolean) ||
      "กรุณากรอกข้อมูลให้ครบ"
  ],
  namerequire: [
    v => (v != null && v.length <= 35) || "*กรุณากรอกชื่อไม่เกิน 35 ตัวอักษร",

    v =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง"
  ],

  searchtermone: [
    v => (v != null && v.length <= 20) || "*กรุณากรอกชื่อไม่เกิน 20 ตัวอักษร",

    v =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง"
  ],
  //   namerequire: [
  //   (v) => (v != null && v.trim().length <= 35) || "*กรุณากรอกชื่อไม่เกิน 35 ตัวอักษร",
  //   (v) => (v != null && v.trim().length > 0) || "* กรุณากรอกข้อมูลให้ถูกต้อง",
  // ],
  name: [v => !v || v.length <= 35 || "*กรุณากรอกชื่อไม่เกิน 35 ตัวอักษร"],
  addressrequire: [
    v => (v != null && v.length <= 60) || "*กรุณากรอกชื่อไม่เกิน 60 ตัวอักษร",

    v =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง"
  ],
  address2: [
    v => v == null || v.length <= 40 || "*กรุณากรอกชื่อไม่เกิน 40 ตัวอักษร"
  ]

  // radioRules: [(v) => !!v || "กรุณาเลือก 1 อัน"],
});

const emit = defineEmits(["on-input"]);

const data_input = ref({
  province: null,
  district: null,
  parish: null,
  zip_code: null,
  zip_code_value: ""
});
const fname = ref("");

const itemsDistrict = ref([]);
const itemsSubDistrict = ref([]);
const itemsPostCode = ref([]);

const data_input_head_comp = ref({
  address_th: {
    name: {
      gender:"",
      one: "",
      two: "",
      three: "",
      four: ""
    },
    search: {
      one: "",
      two: ""
    },
    address: {
      one: "",
      two: ""
    },
    location: {
      province: null,
      district: null,
      parish: null,
      zip_code: null,
      zip_code_value: ""
    }
  },
  address_en: {
    location: {
      province: null,
      district: null,
      parish: null,
      zip_code: null,
      zip_code_value: ""
    }
  },
  country_info: {},
  contacts: []
  //  props.contactItems.map((el) => {
  //   return {
  //     index: el.index,
  //     name: el.name,
  //     phone: el.phone,
  //     email: el.email,
  //   };
  // }),
});

const initail = ref(true);
const business_partner_type = props?.registerFormDetail?.business_partner_profile_form?.business_partner_type?.id;

function splitText(text) {
  // กำหนดความยาวแต่ละส่วน
  const partLength = 35;

  // ตรวจสอบและตัดข้อความตามความยาวที่กำหนด
  let part1 = "";
  let part2 = "";
  let part3 = "";
  let part4 = "";

  if (text) {
    part1 = text.length > 0 ? text.substring(0, partLength) : "";
    part2 =
      text.length > partLength
        ? text.substring(partLength, partLength * 2)
        : "";
    part3 =
      text.length > partLength * 2
        ? text.substring(partLength * 2, partLength * 3)
        : "";
    part4 =
      text.length > partLength * 3
        ? text.substring(partLength * 3, partLength * 4)
        : "";
  }

  console.log("111", part1);
  console.log("2222", part2);
  console.log("3333", part3);
  console.log("4444", part4);

  // คืนค่า
  return {
    part1: part1,
    part2: part2,
    part3: part3,
    part4: part4
  };
}

function splitTextAddress(text) {
  const partLength1 = 60;
  const partLength2 = 40;

  let part1 = "";
  let part2 = "";

  if (text) {
    if (text.length >= partLength1) {
      part1 = text.substring(0, partLength1);
      part2 =
        text.length > partLength1
          ? text.substring(partLength1, partLength1 + partLength2)
          : "";
    } else {
      part1 = text.substring(0, text.length);
    }
  }

  return {
    part1: part1,
    part2: part2
  };
}

const company_th = ref(props.nameTh);
const address_th = ref(props.addressTh);

// function extractPrefix(name) {
//   const prefixMatch = name.match(/^(นาย|นางสาว|นาง)/);
//   return prefixMatch ? prefixMatch[0] : "";
// }
watchEffect(async () => {
  if (initail.value && props.registerFormDetail) {
    const txtSprict = splitText(company_th.value);
    const txtSprictAdress = splitTextAddress(address_th.value);

    let regexTh = /^(นาย|นางสาว|นาง)/;
      let matchTh = regexTh.exec(
        props.registerFormDetail.business_partner_register_form.name_th
      );
      if (matchTh) {
        switch (matchTh[0]) {
          case "นาย":
            props.registerFormDetail.business_partner_register_form.name_th =
              props.registerFormDetail.business_partner_register_form.name_th.replace("นาย", "");
            data_input_head_comp.value.address_th.name.gender = "นาย";
            break;
          case "นางสาว":
            props.registerFormDetail.business_partner_register_form.name_th =
              props.registerFormDetail.business_partner_register_form.name_th.replace(
                "นางสาว",
                ""
              );
            data_input_head_comp.value.address_th.name.gender = "นางสาว";
            break;
          case "นาง":
            props.registerFormDetail.business_partner_register_form.name_th =
              props.registerFormDetail.business_partner_register_form.name_th.replace("นาง", "");
            data_input_head_comp.value.address_th.name.gender = "นาง";
            break;
        }
      }


    if (
      props.registerFormDetail?.account_information_form?.name1_th &&
      props.registerFormDetail?.account_information_form?.name1_th != ""
    ) {
      data_input_head_comp.value.address_th.name.one =
        props.registerFormDetail?.account_information_form?.name1_th;
    } else {
      data_input_head_comp.value.address_th.name.one = txtSprict.part1;
    }

    if (
      props.registerFormDetail?.account_information_form?.name2_th &&
      props.registerFormDetail?.account_information_form?.name2_th != ""
    ) {
      data_input_head_comp.value.address_th.name.two =
        props.registerFormDetail?.account_information_form?.name2_th;
    } else {
      data_input_head_comp.value.address_th.name.two = txtSprict.part2;
    }

    if (
      props.registerFormDetail?.account_information_form?.name3_th &&
      props.registerFormDetail?.account_information_form?.name3_th != ""
    ) {
      data_input_head_comp.value.address_th.name.three =
        props.registerFormDetail?.account_information_form?.name3_th;
    } else {
      data_input_head_comp.value.address_th.name.three = txtSprict.part3;
    }

    if (
      props.registerFormDetail?.account_information_form?.name4_th &&
      props.registerFormDetail?.account_information_form?.name4_th != ""
    ) {
      data_input_head_comp.value.address_th.name.four =
        props.registerFormDetail?.account_information_form?.name4_th;
    } else {
      data_input_head_comp.value.address_th.name.four = txtSprict.part4;
    }

    if (
      props.registerFormDetail?.account_information_form?.address1_th &&
      props.registerFormDetail?.account_information_form?.address1_th != ""
    ) {
      data_input_head_comp.value.address_th.address.one =
        props.registerFormDetail?.account_information_form?.address1_th;
    } else {
      data_input_head_comp.value.address_th.address.one = txtSprictAdress.part1;
    }

    if (
      props.registerFormDetail?.account_information_form?.address2_th &&
      props.registerFormDetail?.account_information_form?.address2_th != ""
    ) {
      data_input_head_comp.value.address_th.address.two =
        props.registerFormDetail?.account_information_form?.address2_th;
    } else {
      data_input_head_comp.value.address_th.address.two = txtSprictAdress.part2;
    }

    if (
      props.registerFormDetail?.account_information_form?.search_term1_th ??
      null
    )
      data_input_head_comp.value.address_th.search.one =
        props.registerFormDetail?.account_information_form?.search_term1_th;

    if (
      props.registerFormDetail?.account_information_form?.search_term2_th &&
      props.registerFormDetail?.account_information_form?.search_term2_th != ""
    ) {
      data_input_head_comp.value.address_th.search.two =
        props.registerFormDetail?.account_information_form?.search_term2_th;
    } else {
      data_input_head_comp.value.address_th.search.two =
        props.taxPayerIdNumber ?? null;
    }

    data_input_head_comp.value.contact_info = props.contactItems;

    data_input_head_comp.value.address_en.location.province =
      props.addressItemEn?.province;
    data_input_head_comp.value.address_en.location.district =
      props.addressItemEn?.district;
    data_input_head_comp.value.address_en.location.parish =
      props.addressItemEn?.parish;
    data_input_head_comp.value.address_en.location.zip_code =
      props.addressItemEn?.zip_code;
    data_input_head_comp.value.address_en.location.zip_code_value =
      props.addressItemEn?.zip_code_value;

    data_input.value.province = props.addressItem.province;
    data_input.value.district = props.addressItem.district;
    data_input.value.parish = props.addressItem.parish;
    data_input.value.zip_code = props.addressItem.zip_code;

    if (data_input.value.province)
      await store.getDistrict(data_input.value.province);
    itemsDistrict.value = store.districts;
    if (data_input.value.parish)
      await store.getPostCode(data_input.value.parish);
    itemsPostCode.value = store.postCodes;
    data_input.value.zip_code_value = itemsPostCode.value[0]?.code;

    data_input_head_comp.value.address_th.location = data_input.value;

    initail.value = false;
  }
});

const handleAddressEN = data_obj => {
  data_input_head_comp.value.address_en = data_obj;
};

const handleCountry = data_obj => {
  data_input_head_comp.value.country_info = data_obj;
};

const handleContact = data_obj => {
  data_input_head_comp.value.contact_info[data_obj.index] = {
    index: data_obj.index,
    name: data_obj.name,
    phone: data_obj.phone,
    email: data_obj.email
  };
};

watch(
  () => data_input.value.province,
  async () => {
    if (data_input.value.province) {
      data_input.value.district = null;
      data_input.value.parish = null;
      if (data_input.value.province)
        await store.getDistrict(data_input.value.province);
      itemsDistrict.value = store.districts;
      itemsSubDistrict.value = [];

      data_input_head_comp.value.address_th.location = data_input.value;
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
      data_input_head_comp.value.address_th.location = data_input.value;
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
      data_input_head_comp.value.address_th.location = data_input.value;

      data_input_head_comp.value.address_en.location.zip_code_value =
        itemsPostCode.value[0]?.code;
    }
  },
  { deep: true, immediate: true }
);

watch(
  data_input_head_comp.value,
  newValue => {
    emit("on-input", newValue);
  },
  { deep: true }
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
