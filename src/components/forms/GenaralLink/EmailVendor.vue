<template>
  <v-form ref="formGmail">
    <v-row dense>
      <v-col cols="12" class="pa-2">
        <v-card>
          <v-card-title>
            <h5>สำหรับบริษัท</h5>
          </v-card-title>
          <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-autocomplete
                  class=""
                  chips
                  v-model="data_input.company_data.data"
                  :items="displayItemsCompany"
                  item-value="id"
                  multiple
                  closable-chips
                  :rules="textRequired"
                  item-title="displayName"
                  density="compact"
                  variant="outlined"
                  placeholder="เลือกคำตอบ"
              ></v-autocomplete>
            </v-col>
          </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="pa-2">
        <v-card>
          <v-card-title>
            <h5>Payment Terms</h5>
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="6">
                <v-radio-group
                  color="red"
                  class="ml-6 d-flex"
                  :rules="rules_valid.team"
                  v-model="data_input.term_data.data"
                >
                  <v-radio
                    v-for="(item, index) in selected_items.items_payment_terms"
                    :label="item.description"
                    :key="index"
                    :value="item.id"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="6" class="ml-6">
                <v-radio-group style="width: auto" color="red" v-model="data_input.term_data.data">
                  <v-row align="center">
                    <v-col cols="auto">
                      <v-radio label="อื่นๆ" value="other"></v-radio>
                    </v-col>
                    <v-col cols="auto">
                      <v-text-field
                      style="min-width: 500px"
                        v-if="data_input.term_data.data === 'other'"
                        density="compact"
                        dense
                        variant="outlined"
                        v-model="data_input.term_data.other"
                         :rules="[otherFieldRequired]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>


      <v-col cols="12" class="pa-2">
        <v-card class="mb-4">
          <v-card-title>
            <h5>Email ของ Vendor ที่ส่งให้ลงทะเบียน</h5>
          </v-card-title>
          <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                v-model="data_input.email"
                class=""
                placeholder="กรอก Email"
                :rules="rules_valid.email"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div cols="12" class="d-flex justify-center" >
      <ButtonControl style="min-width: 100px; height: 35px;" text="ต่อไป" @button-clicked="handleNext" />
    </div>
  </v-form>
</template>
<script setup>
import { ref, watch, onMounted, defineProps, computed } from "vue";
import ButtonControl from "@/components/controls/ButtonLink.vue";
import compnayService from "@/apis/CompnayService";
import PaymentTermService from "@/apis/PaymentTermService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
// const item_input = reactive({
//   email: "",
// });
const formGmail = ref(null);
const emit = defineEmits(["form-update", "on-to-company-profile"]);
const props = defineProps({
  businessPartnerRoleId: {
    type: Number,
  },
});
const data_input = ref({
  company_data: {
    is_other: false,
    data: null,
    other: null,
  },
  email: "",
  term_data: {
    data: "",
    other: "",
  },
});

const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
const rules_valid = ref({
  email: [
    (v) => !!v || "กรุณากรอกข้อมูลให้ครบ",
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email format ไม่ถูกต้อง",
  ],
  companyData: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  team: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  radioRules: [(v) => !!v || "กรุณาเลือก 1 อัน"],
});

const selected_items = ref({
  items_company_data: [],
  items_payment_terms: [],
});

const displayItemsCompany = computed(() => {
  return selected_items.value.items_company_data.map((item) => ({
    ...item,
    displayName: `${item.company_code} - ${item.name_th}`,
    customValue: { id: item.id, code: item.company_code },
  }));
});
// ];
watch(data_input.value, (newValue) => {
  // console.log("song", newValue);
  emit("form-update", newValue);
});

watch(
  () => props.businessPartnerRoleId,
  async () => {
    if (props.businessPartnerRoleId) {
      await getPaymentTerm();
    }
  },
  { deep: true }
);

watch(data_input.value.company_data, (newValue) => {
  if (!newValue.data || newValue.data.length === 0) {
    data_input.value.company_data.data = null;
  }
});

const otherFieldRequired = value => {
  if (data_input.value.term_data.data === 'other' && !value) {
    return 'กรุณากรอกข้อมูลให้ครบ';
  }
  return true;
};

onMounted(async () => {
  const promise1 = await getCompanies();
  const promise2 = await getPaymentTerm();

  Promise.all([promise1, promise2]);
});

const handleNext = async () => {
  const is_valid = await formGmail.value.validate();
  if (is_valid && is_valid["valid"]) {
    emit('on-to-company-profile');
  } else {
    console.log("Partner Register Invalid!!!");
  }
};
const getCompanies = async () => {
  try {
    // loading.value.roles = true;
    const response = await compnayService.getCompanyAll();
    if (response.data?.is_success) {
      selected_items.value.items_company_data = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    // loading.value.roles = false;
  }
};

const getPaymentTerm = async () => {
  try {
    // loading.value.roles = true;
    const response = await PaymentTermService.getPaymentTermAll(props.businessPartnerRoleId);
    if (response.data?.is_success) {
      selected_items.value.items_payment_terms = response.data.data;
      // console.log("termmmmmmmm", selected_items.value.items_payment_terms);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    // loading.value.roles = false;
  }
};
</script>


<style scoped>
:deep(.v-text-field .v-field) {
  border-radius: 10px !important;

}

:deep(.v-chip--variant-tonal .v-chip__underlay) {
  background-color: #ed1c24 !important;

}

:deep(.v-chip.v-chip--density-default) {
  border: 1px solid #ed1c24 !important;
}
</style>
