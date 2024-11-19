<template>
  <v-container>

    <div class="d-flex align-center justify-center">
      <h2 class="pa-5">เปลี่ยนชื่อ</h2>
    </div>

    <v-row dense class="mb-5">
      <v-col cols="12">
        <v-card>
        <v-card-text>
          <v-row dense no-gutters>
            <v-col cols="12">
              <v-card-title>
                <h6>ชื่อ (ภาษาอังไทย)</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_th"
                dense
                :rules="textRequired"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-card-title>
                <h6>ชื่อ (ภาษาอังกฤษ)</h6>
              </v-card-title>
              <v-text-field
              :rules="textRequired"
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.name_en"
                dense
                variant="outlined"
              ></v-text-field>
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
// import { useRouter } from "vue-router";
const emit = defineEmits(["on-data-update"])
const data_input = ref({
  name_th: "",
  name_en: "",
});

const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
const rules_valid = ref({
  namethRules: [
    v => !!v || "* กรุณากรอกชื่อ",
    v => /^[\u0E00-\u0E7F\s]+$/.test(v) || "* กรุณากรอกข้อมูลเป็นอักษรภาษาไทยเท่านั้น",
    v => v.length >= 2 || "* กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร",
    v => /^\S+(\s\S+)*$/.test(v) || "* กรุณากรอกข้อมูลให้ถูกต้อง"
],
  nameenRules: [
    v => !!v || "* กรุณากรอกชื่อ",
    v => /^[a-zA-Z\s]+$/.test(v) || "* กรุณากรอกข้อมูลเป็นอักษรภาษาอังกฤษเท่านั้น",
    v => v.length >= 2 || "* กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร",
    v => /^\S+(\s\S+)*$/.test(v) || "* กรุณากรอกข้อมูลให้ถูกต้อง"
],

});

watch(data_input.value, (newValue) => {
  emit("on-data-update", newValue);
}, { deep: true });
// const router = useRouter();
</script>
