<template>
  <v-container>
    <!-- <div class="d-flex align-center justify-center">
      <h2 class="pa-5">Change Information</h2>
    </div>-->

    <div class="d-flex align-center justify-center">
      <h2 class="pa-5">เพิ่มสาขา</h2>
    </div>

    <v-row dense class="mb-5">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row dense no-gutters>
              <v-col cols="12">
                <v-card-title>
                  <h6>Branch Code</h6>
                </v-card-title>
                <v-text-field
                  class="ml-4 mr-4"
                  density="compact"
                  :rules="rules_valid.insertRule"
                  v-model="data_input.branch_code"
                  dense
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-card-title>
                  <h5>ต้องการลงทะเบียนแบบใด</h5>
                </v-card-title>
                <v-radio-group
                  v-model="data_input.radio_1"
                  color="red"
                  :rules="[() => !!data_input.radio_1 || 'กรุณาเลือกข้อมูล']"
                >
                  <v-radio class="ml-2" label="Vendor" :value="1"></v-radio>
                  <!-- <v-radio class="ml-2" label="Customer" :value='2'></v-radio> -->
                  <v-radio class="ml-2" label="Vendor & Customer" :value="3"></v-radio>
                </v-radio-group>
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
                  dense
                  :rules="textRequired"
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
                  :rules="textRequired"
                  density="compact"
                  v-model="data_input.address.en.address"
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
import { ref, watch } from "vue";
import AddressInputControlTH from "@/components/controls/AddressInputControlComp.vue";
import ManaulAddressInputControl from "@/components/controls/ManaulAddressInputControl.vue";
// import { useRouter } from "vue-router";

const emit = defineEmits(["on-data-update"]);
const data_input = ref({
  branch_code: "",
  name_en: "",
  radio_1: null,
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

const textRequired = [v => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
const rules_valid = ref({
  email: [
    v => !!v || "กรุณากรอกข้อมูลให้ครบ",
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email format ไม่ถูกต้อง"
  ],
  radioRules: [v => !!v || "กรุณาเลือก 1 อัน"],
  insertRule: [
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
  },
  { deep: true }
);
// const router = useRouter();

const handleAddressInputTh = addressLocation => {
  data_input.value.address.th.info = addressLocation;
  data_input.value.address.en.info.zip_code_value =
    addressLocation.zip_code_value;
};

const handleAddressInputEn = addressLocation => {
  data_input.value.address.en.info = addressLocation;
};
</script>
