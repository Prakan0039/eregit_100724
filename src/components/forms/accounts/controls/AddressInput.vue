<template>
  <v-card>
    <v-row dense>
      <v-col cols="12"  v-if="business_partner_type==1 && isGender==1">
        <v-card-title>
          <h6>คำนำหน้าชื่อ (ภาษาอังกฤษ)</h6>
        </v-card-title>
        <v-col cols="12">
          <v-radio-group
            
            bg-color="#dfdfdf"
            v-model="data_input.name.gender"
            inline
           class="mt-0"
          >
          <v-radio label="Mr." value="Mr."></v-radio>
          <v-radio label="Mrs." value="Mrs."></v-radio>
          <v-radio label="Miss" value="Miss"></v-radio>
          </v-radio-group>
        </v-col>
      </v-col>

      <v-col cols="12" class="mb-4">
        <v-card-title>
          <h6>Name 1 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          :rules="rules_valid.namerequire"
          dense
          v-model="data_input.name.one"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Name 2 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          :rules="rules_valid.name"
          density="compact"
          dense
          v-model="data_input.name.two"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Name 3 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          dense
          :rules="rules_valid.name"
          v-model="data_input.name.three"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Name 4 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          :rules="rules_valid.name"
          density="compact"
          dense
          v-model="data_input.name.four"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7" v-if="!props.isNotTeam">
        <v-card-title>
          <h6>Search Term 1 (ชื่อย่อ)</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          dense
          v-model="data_input.search.one"
          variant="outlined"
          :rules="rules_valid.searchtermone"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7" v-if="!props.isNotTeam">
        <v-card-title>
          <h6>Search Term 2 (เลข 13 หลัก)</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          dense
          v-model="data_input.search.two"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Address 1 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          :rules="rules_valid.addressrequire"
          dense
          v-model="data_input.address.one"
          variant="outlined"
        ></v-text-field>
      </v-col>
 
      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Address 2 {{ props.tagDesc }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-0"
          density="compact"
          :rules="rules_valid.address2"
          dense
          v-model="data_input.address.two"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <!-- {{ props.steptwoFormDetail?.address_th.name.one }} -->
      <v-col cols="12" v-if="!props.isAddressManual">
        <!-- <AddressInputControl
          :tag-desc="props.tagDesc"
          :key-value="props.keyValue"
          :key-title="props.keyTitle"
          :is-disable-address="props.isDisableAddress"
          :addressItem="props.addressItem"
          @on-input="handleAddressInput"
          class="ml-5 mt-n5"
        /> -->
      </v-col>
      <v-col cols="12" v-if="props.isAddressManual">
        <ManaulAddressInputControl
          class="ml-5 mt-n5"
          :address-item="data_input.location"
          tag-desc="(EN)"
          @on-input="handleAddressInput"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
 
<script setup>
import { ref, defineProps, watch, onMounted, watchEffect } from "vue";
// import AddressInputControl from "@/components/controls/AddressInputControl.vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";
// import { isStringEmpty } from "@/utils/util.issue";
const emit = defineEmits(["on-input"]);
 
const props = defineProps({
  name: String,
  address: String,
  taxPayerIdNumber: {
    type: String,
    default: "",
  },
  registerFormDetail: {
    type: Object,
    default: () => {},
  },
  tagDesc: {
    type: String,
    default: "(TH)",
  },
  keyValue: {
    type: String,
    default: "id",
  },
  keyTitle: {
    type: String,
    default: "name_th",
  },
  register_type: {
    type: Number,
  },
  isNotTeam: {
    type: Boolean,
    default: false,
  },
  isDisableAddress: {
    type: Boolean,
    default: false,
  },
  isGender: {
    type: String,
    // default: false,
  },
  steptwoFormDetail: {
    type: Object,
    default: () => {},
  },
  addressItem: {
    type: Object,
    default: () => {
      return {
        province: null,
        district: null,
        parish: null,
        zip_code: null,
      };
    },
  },
  isAddressManual: {
    type: Boolean,
    default: false,
  },
});
const fname = ref("");
 
const company_en = ref(props.name);
const address_en = ref(props.address);
const business_partner_type = props?.registerFormDetail?.business_partner_profile_form?.business_partner_type?.id;

const rules_valid = ref({
  searchtermone: [
    (v) => (v != null && v.length <= 20) || "*กรุณากรอกชื่อไม่เกิน 20 ตัวอักษร",
 
    (v) =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง",
  ],
  companyData: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [
    () =>
      data_input.value.employee_data.data.some(Boolean) ||
      "กรุณากรอกข้อมูลให้ครบ",
  ],
  namerequire: [
    (v) => (v != null && v.length <= 35) || "*กรุณากรอกชื่อไม่เกิน 35 ตัวอักษร",
 
    (v) =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง",
  ],
  name: [(v) => !v || v.length <= 35 || "*กรุณากรอกชื่อไม่เกิน 35 ตัวอักษร"],
  addressrequire: [
    (v) => (v != null && v.length <= 60) || "*กรุณากรอกชื่อไม่เกิน 60 ตัวอักษร",
 
    (v) =>
      (v != null &&
        v.trim().length > 0 &&
        /^[^\s](.*[^\s])?$/.test(v.trim())) ||
      "* กรุณากรอกข้อมูลให้ถูกต้อง",
  ],
  address2: [
    (v) => v == null || v.length <= 40 || "*กรุณากรอกชื่อไม่เกิน 40 ตัวอักษร",
  ],
});
const data_input = ref({
  name: {
    gender:"",
    one: "",
    two: "",
    three: "",
    four: "",
  },
  search: {
    one: "",
    two: "",
  },
  address: {
    one: "",
    two: "",
  },
  location: {
    province: null,
    district: null,
    parish: null,
    zip_code: null,
  },
});
 
function splitText(text) {
  const partLength = 35;
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
 
  // console.log("111", part1);
  // console.log("2222", part2);
  // console.log("3333", part3);
  // console.log("4444", part4);
 
  return {
    part1: part1,
    part2: part2,
    part3: part3,
    part4: part4,
  };
}
 
function splitTextAddress(text) {
  const partLength1 = 60;
  const partLength2 = 40;
 
  let part1 = null;
  let part2 = null;
 
  if (text) {
    part1 = text.length > 0 ? text.substring(0, partLength1) : "";
    part2 =
      text.length > partLength1
        ? text.substring(partLength1, partLength1 + partLength2)
        : "";
    // console.log("111", part1);
    // console.log("2222", part2);
  }
 
  return {
    part1: part1,
    part2: part2,
  };
}
 
// function extractPrefix(name) {
//   const prefixMatch = name.match(/^(Mr.|Mrs.|Miss.)/);
//   return prefixMatch ? prefixMatch[0].trim() : ""; 
// }

// const initValueOne = ref(true);
// const initValueTwo = ref(true);
// const initValueThree = ref(true);
 
// watchEffect(() => {
//   //EN Branch step3
//   if (props.register_type === 2 && initValueTwo.value) {
//     if (
//       props.registerFormDetail?.account_information_form?.branch_name1_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.name.one))
//         data_input.value.name.one =
//           props.registerFormDetail?.account_information_form?.branch_name1_en ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.one))
//         data_input.value.name.one =
//           props.steptwoFormDetail?.address_en?.name?.one ?? null;
//     }
 
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_name2_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.name.two))
//         data_input.value.name.two =
//           props.registerFormDetail?.account_information_form?.branch_name2_en ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.two))
//         data_input.value.name.two =
//           props.steptwoFormDetail?.address_en?.name?.two ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_name3_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.name.three))
//         data_input.value.name.three =
//           props.registerFormDetail?.account_information_form?.branch_name3_en ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.three))
//         data_input.value.name.three =
//           props.steptwoFormDetail?.address_en?.name?.three ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_name4_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.name.four))
//         data_input.value.name.four =
//           props.registerFormDetail?.account_information_form?.branch_name4_en ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.four))
//         data_input.value.name.four =
//           props.steptwoFormDetail?.address_en?.name?.four ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_address1_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.address.one))
//         data_input.value.address.one =
//           props.registerFormDetail?.account_information_form
//             ?.branch_address1_en ?? null;
//     } else {
//       if (isStringEmpty(data_input.value.address.one))
//         data_input.value.address.one =
//           props.steptwoFormDetail?.address_en?.address?.one ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_address2_en ??
//       null
//     ) {
//       if (isStringEmpty(data_input.value.address.two))
//         data_input.value.address.two =
//           props.registerFormDetail?.account_information_form
//             ?.branch_address2_en ?? null;
//     } else {
//       if (isStringEmpty(data_input.value.address.two))
//         data_input.value.address.two =
//           props.steptwoFormDetail?.address_en?.address?.two ?? null;
//     }
 
//     initValueTwo.value = false;
//   }
// });
 
// watchEffect(() => {
//   //TH Branch step3 /true//
//   if (props.register_type === 3 && initValueTwo.value) {
//     // data_input.value.name.one =
//     //   props.registerFormDetail?.account_information_form?.branch_name1_th ??
//     //   null;
 
//     if (props.registerFormDetail?.account_information_form?.branch_name1_th) {
//       if (isStringEmpty(data_input.value.name.one))
//         data_input.value.name.one =
//           props.registerFormDetail?.account_information_form?.branch_name1_th ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.one))
//         data_input.value.name.one =
//           props.steptwoFormDetail?.address_th?.name?.one ?? null;
//     }
//     //
//     if (props.registerFormDetail?.account_information_form?.branch_name2_th) {
//       if (isStringEmpty(data_input.value.name.two))
//         data_input.value.name.two =
//           props.registerFormDetail?.account_information_form?.branch_name2_th ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.two))
//         data_input.value.name.two =
//           props.steptwoFormDetail?.address_th?.name?.two ?? null;
//     }
//     //
//     if (props.registerFormDetail?.account_information_form?.branch_name3_th) {
//       if (isStringEmpty(data_input.value.name.three))
//         data_input.value.name.three =
//           props.registerFormDetail?.account_information_form?.branch_name3_th ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.three))
//         data_input.value.name.three =
//           props.steptwoFormDetail?.address_th?.name?.three ?? null;
//     }
//     //
//     if (props.registerFormDetail?.account_information_form?.branch_name4_th) {
//       if (isStringEmpty(data_input.value.name.four))
//         data_input.value.name.four =
//           props.registerFormDetail?.account_information_form?.branch_name4_th ??
//           null;
//     } else {
//       if (isStringEmpty(data_input.value.name.four))
//         data_input.value.name.four =
//           props.steptwoFormDetail?.address_th?.name?.four ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_address1_th
//     ) {
//       if (isStringEmpty(data_input.value.address.one))
//         data_input.value.address.one =
//           props.registerFormDetail?.account_information_form
//             ?.branch_address1_th ?? null;
//     } else {
//       if (isStringEmpty(data_input.value.address.one))
//         data_input.value.address.one =
//           props.steptwoFormDetail?.address_th?.address?.one ?? null;
//     }
//     //
//     if (
//       props.registerFormDetail?.account_information_form?.branch_address2_th
//     ) {
//       if (isStringEmpty(data_input.value.address.two))
//         data_input.value.address.two =
//           props.registerFormDetail?.account_information_form
//             ?.branch_address2_th ?? null;
//     } else {
//       if (isStringEmpty(data_input.value.address.two))
//         data_input.value.address.two =
//           props.steptwoFormDetail?.address_th?.address?.two ?? null;
//     }
 
//     initValueThree.value = false;
//   }
// });
 
// watchEffect(() => {
//   // console.log("propStep2", props.registerFormDetail.value.account_information_form)
//   // data_input.value.name.one = props.name;
//   // data_input.value.search.two = props.taxPayerIdNumber;
//   // data_input.value.location = props.addressItem;
//   // data_input.value.address.one = props.address;
 
//   //steptwo
//   if (props.register_type == 1 && initValueOne.value) {
//     // data_input.value.name.one = props.name;
//     if (props.registerFormDetail?.account_information_form?.search_term2_en) {
//       data_input.value.search.two =
//         props.registerFormDetail?.account_information_form?.search_term2_en;
//     } else {
//       data_input.value.search.two = props.taxPayerIdNumber ?? null;
//     }
//     // data_input.value.location = props.addressItem ?? null;
//     if (props.addressItem) {
//       data_input.value.location.province = props.addressItem?.province;
//       data_input.value.location.district = props.addressItem?.district;
//       data_input.value.location.parish = props.addressItem?.parish;
//       data_input.value.location.zip_code = props.addressItem?.zip_code;
//     }
//     // data_input.value.address.one = props.address;
 
//     const txtSprict = splitText(company_en.value);
//     const txtSprictAdress = splitTextAddress(address_en.value);
 
//     if (
//       props.registerFormDetail?.account_information_form?.name1_en &&
//       props.registerFormDetail?.account_information_form?.name1_en != ""
//     ) {
//       data_input.value.name.one =
//         props.registerFormDetail?.account_information_form?.name1_en ?? null;
//     } else {
//       data_input.value.name.one = txtSprict.part1 ?? null;
//     }
 
//     if (
//       props.registerFormDetail?.account_information_form?.name2_en &&
//       props.registerFormDetail?.account_information_form?.name2_en != ""
//     ) {
//       data_input.value.name.two =
//         props.registerFormDetail?.account_information_form?.name2_en ?? null;
//     } else {
//       data_input.value.name.two = txtSprict.part2 ?? null;
//     }
 
//     if (
//       props.registerFormDetail?.account_information_form?.name3_en &&
//       props.registerFormDetail?.account_information_form?.name3_en != ""
//     ) {
//       data_input.value.name.three =
//         props.registerFormDetail?.account_information_form?.name3_en ?? null;
//     } else {
//       data_input.value.name.three = txtSprict.part3 ?? null;
//     }
 
//     if (
//       props.registerFormDetail?.account_information_form?.name4_en &&
//       props.registerFormDetail?.account_information_form?.name4_en != ""
//     ) {
//       data_input.value.name.four =
//         props.registerFormDetail?.account_information_form?.name4_en ?? null;
//     } else {
//       data_input.value.name.four = txtSprict.part4 ?? null;
//     }
 
//     data_input.value.search.one =
//       props.registerFormDetail?.account_information_form?.search_term1_en ??
//       null;
 
//     if (
//       props.registerFormDetail?.account_information_form?.address1_en &&
//       props.registerFormDetail?.account_information_form?.address1_en != ""
//     ) {
//       data_input.value.address.one =
//         props.registerFormDetail?.account_information_form?.address1_en ?? null;
//     } else {
//       data_input.value.address.one = txtSprictAdress.part1 ?? null;
//     }
//     if (
//       props.registerFormDetail?.account_information_form?.address2_en &&
//       props.registerFormDetail?.account_information_form?.address2_en != ""
//     ) {
//       data_input.value.address.two =
//         props.registerFormDetail?.account_information_form?.address2_en ?? null;
//     } else {
//       data_input.value.address.two = txtSprictAdress.part2 ?? null;
//     }
//     initValueOne.value = false;
//   }
// });
 
 
const initValue = ref(true);
 
watchEffect(() => {
  // console.log("propStep2", props.registerFormDetail.value.account_information_form)
  // data_input.value.name.one = props.name;
  // data_input.value.search.two = props.taxPayerIdNumber;
  // data_input.value.location = props.addressItem;
  // data_input.value.address.one = props.address;
 
  //steptwo
  if (props.register_type == 1 && initValue.value) {
    // data_input.value.name.one = props.name;
    if (props.registerFormDetail?.account_information_form?.search_term2_en) {
      data_input.value.search.two =
        props.registerFormDetail?.account_information_form?.search_term2_en;
    } else {
      data_input.value.search.two = props.taxPayerIdNumber ?? null;
    }
    // data_input.value.location = props.addressItem ?? null;
    if (props.addressItem) {
      data_input.value.location.province = props.addressItem?.province;
      data_input.value.location.district = props.addressItem?.district;
      data_input.value.location.parish = props.addressItem?.parish;
      data_input.value.location.zip_code = props.addressItem?.zip_code;
    }
 
    const txtSprict = splitText(company_en.value);
    const txtSprictAdress = splitTextAddress(address_en.value);
    /////////

    let regexEn = /^(Mr\.|Mrs\.|Miss)/;
      let matchEn = regexEn.exec(
        props.registerFormDetail.business_partner_register_form.name_en
      );
      if (matchEn) {
        switch (matchEn[0]) {
          case "Mr.":
            props.registerFormDetail.business_partner_register_form.name_en =
              props.registerFormDetail.business_partner_register_form.name_en.replace("Mr.", "");
            data_input.value.name.gender = "Mr.";
            break;
          case "Mrs.":
            props.registerFormDetail.business_partner_register_form.name_en =
              props.registerFormDetail.business_partner_register_form.name_en.replace(
                "Mrs.",
                ""
              );
            data_input.value.name.gender = "Mrs.";
            break;
          case "Miss":
            props.registerFormDetail.business_partner_register_form.name_en =
              props.registerFormDetail.business_partner_register_form.name_en.replace(
                "Miss",
                ""
              );
            data_input.value.name.gender = "Miss";
            break;
        }
      }


/////////
if (
      props.registerFormDetail?.account_information_form?.name1_en &&
      props.registerFormDetail?.account_information_form?.name1_en != ""
    ) {
      data_input.value.name.one =
        props.registerFormDetail?.account_information_form?.name1_en ?? null;
    } else {
      data_input.value.name.one = txtSprict.part1 ?? null;
    }
///////
    if (
      props.registerFormDetail?.account_information_form?.name2_en &&
      props.registerFormDetail?.account_information_form?.name2_en != ""
    ) {
      data_input.value.name.two =
        props.registerFormDetail?.account_information_form?.name2_en ?? null;
    } else {
      data_input.value.name.two = txtSprict.part2 ?? null;
    }
 
    if (
      props.registerFormDetail?.account_information_form?.name3_en &&
      props.registerFormDetail?.account_information_form?.name3_en != ""
    ) {
      data_input.value.name.three =
        props.registerFormDetail?.account_information_form?.name3_en ?? null;
    } else {
      data_input.value.name.three = txtSprict.part3 ?? null;
    }
 
    if (
      props.registerFormDetail?.account_information_form?.name4_en &&
      props.registerFormDetail?.account_information_form?.name4_en != ""
    ) {
      data_input.value.name.four =
        props.registerFormDetail?.account_information_form?.name4_en ?? null;
    } else {
      data_input.value.name.four = txtSprict.part4 ?? null;
    }
 
    data_input.value.search.one =
      props.registerFormDetail?.account_information_form?.search_term1_en ??
      null;
 
    if (
      props.registerFormDetail?.account_information_form?.address1_en &&
      props.registerFormDetail?.account_information_form?.address1_en != ""
    ) {
      data_input.value.address.one =
        props.registerFormDetail?.account_information_form?.address1_en ?? null;
    } else {
      data_input.value.address.one = txtSprictAdress.part1 ?? null;
    }
    if (
      props.registerFormDetail?.account_information_form?.address2_en &&
      props.registerFormDetail?.account_information_form?.address2_en != ""
    ) {
      data_input.value.address.two =
        props.registerFormDetail?.account_information_form?.address2_en ?? null;
    } else {
      data_input.value.address.two = txtSprictAdress.part2 ?? null;
    }
    initValue.value = false;
  }
 
    //TH Branch step3 /true//
    if (props.register_type === 3) {
    // data_input.value.name.one =
    //   props.registerFormDetail?.account_information_form?.branch_name1_th ??
    //   null;
 
    if (props.registerFormDetail?.account_information_form?.branch_name1_th) {
      data_input.value.name.one =
        props.registerFormDetail?.account_information_form?.branch_name1_th ??
        null;
    } else {
      data_input.value.name.one =
        props.steptwoFormDetail?.address_th?.name?.one ?? null;
    }
    //
    if (props.registerFormDetail?.account_information_form?.branch_name2_th) {
      data_input.value.name.two =
        props.registerFormDetail?.account_information_form?.branch_name2_th ??
        null;
    } else {
      data_input.value.name.two =
        props.steptwoFormDetail?.address_th?.name?.two ?? null;
    }
    //
    if (props.registerFormDetail?.account_information_form?.branch_name3_th) {
      data_input.value.name.three =
        props.registerFormDetail?.account_information_form?.branch_name3_th ??
        null;
    } else {
      data_input.value.name.three =
        props.steptwoFormDetail?.address_th?.name?.three ?? null;
    }
    //
    if (props.registerFormDetail?.account_information_form?.branch_name4_th) {
      data_input.value.name.four =
        props.registerFormDetail?.account_information_form?.branch_name4_th ??
        null;
    } else {
      data_input.value.name.four =
        props.steptwoFormDetail?.address_th?.name?.four ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_address1_th
    ) {
      data_input.value.address.one =
        props.registerFormDetail?.account_information_form
          ?.branch_address1_th ?? null;
    } else {
      data_input.value.address.one =
        props.steptwoFormDetail?.address_th?.address?.one ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_address2_th
    ) {
      data_input.value.address.two =
        props.registerFormDetail?.account_information_form
          ?.branch_address2_th ?? null;
    } else {
      data_input.value.address.two =
        props.steptwoFormDetail?.address_th?.address?.two ?? null;
    }
 
    initValue.value = false;
  }
 
  //EN Branch step3
  if (props.register_type === 2) {
    if (
      props.registerFormDetail?.account_information_form?.branch_name1_en ??
      null
    ) {
      data_input.value.name.one =
        props.registerFormDetail?.account_information_form?.branch_name1_en ??
        null;
    } else {
      data_input.value.name.one =
        props.steptwoFormDetail?.address_en?.name?.one ?? null;
    }
 
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_name2_en ??
      null
    ) {
      data_input.value.name.two =
        props.registerFormDetail?.account_information_form?.branch_name2_en ??
        null;
    } else {
      data_input.value.name.two =
        props.steptwoFormDetail?.address_en?.name?.two ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_name3_en ??
      null
    ) {
      data_input.value.name.three =
        props.registerFormDetail?.account_information_form?.branch_name3_en ??
        null;
    } else {
      data_input.value.name.three =
        props.steptwoFormDetail?.address_en?.name?.three ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_name4_en ??
      null
    ) {
      data_input.value.name.four =
        props.registerFormDetail?.account_information_form?.branch_name4_en ??
        null;
    } else {
      data_input.value.name.four =
        props.steptwoFormDetail?.address_en?.name?.four ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_address1_en ??
      null
    ) {
      data_input.value.address.one =
        props.registerFormDetail?.account_information_form
          ?.branch_address1_en ?? null;
    } else {
      data_input.value.address.one =
        props.steptwoFormDetail?.address_en?.address?.one ?? null;
    }
    //
    if (
      props.registerFormDetail?.account_information_form?.branch_address2_en ??
      null
    ) {
      data_input.value.address.two =
        props.registerFormDetail?.account_information_form
          ?.branch_address2_en ?? null;
    } else {
      data_input.value.address.two =
        props.steptwoFormDetail?.address_en?.address?.two ?? null;
    }
  }
});
 
onMounted(() => {
  emit("on-input", data_input.value);
});
 
watch(
  () => data_input.value,
  () => {
    emit("on-input", data_input.value);
  },
  { deep: true }
);
 
const handleAddressInput = (newValue) => {
  data_input.value.location = newValue;
};
</script>