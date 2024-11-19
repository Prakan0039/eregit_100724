<template>
  <!-- ข้อมูลผู้ติดต่อ -->
  <v-container>
    <v-row dense>
      <v-col cols="12"><h2>ข้อมูลผู้ติดต่อ</h2></v-col>
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
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Branch Code</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.branch_code"
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>ชื่อผู้ติดต่อ {{ propVar.index + 1 }}</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.contact_name"
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Telephone {{ propVar.index + 1 }}</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.telephone"
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Email {{ propVar.index + 1 }}</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.email"
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Comments {{ propVar.index + 1 }}</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.comments"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Remark {{ propVar.index + 1 }}</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.remark"
                :rules="required"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, watch, watchEffect } from "vue";

const emit = defineEmits(["on-data-update"]);
const required = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];

const propVar = defineProps({
  contact: {
    type: Object,
    default: () => {
      return {
        id: null,
        form_number: null,
        business_partner_number: null,
        branch_code: null,
        business_partner_name: null,
        name: null,
        mobile_number: null,
        email: null,
        remark: null,
      };
    },
  },
  index: Number,
});

const data_input = ref({
  partner_name: "",
  partner_number: "",
  branch_code: "",
  remark: "",
  contact_name: "",
  telephone: "",
  email: "",
  comments: "",
});

watchEffect(() => {
  data_input.value.contact_name = propVar.contact.name ?? null;
  data_input.value.telephone = propVar.contact.mobile_number ?? null;
  data_input.value.email = propVar.contact.email ?? null;

  data_input.value.branch_code = propVar.contact.branch_code ?? null;
  data_input.value.partner_name = propVar.contact.business_partner_name ?? null;
  data_input.value.partner_number = propVar.contact.business_partner_number ?? null;
  data_input.value.remark = propVar.contact.remark ?? null;
});

watch(
  data_input.value,
  () => {
    emit("on-data-update", {
      index: propVar.index,
      newValue: data_input.value,
    });
  },
  { deep: true, immediate: true }
);
</script>
