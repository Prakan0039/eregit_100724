<template>
  <v-form ref="formFillin">
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
                  chips
                  v-model="data_input.company_data.data"
                  :items="displayItemsCompany"
                  item-value="id"
                  multiple
                  closable-chips
                 :rules="rules_valid.companyData"
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

      <v-row dense no-gutters >
        <v-col cols="12">
          <v-card-text>
              <strong
                >เนื่องจากนโยบายของบริษัท
                คู่ค้าทุกเจ้าจะต้องทำแบบรายงานและเปิดเผยความขัดแย้งทางผลประโยชน์
                (สำหรับบุคคลหรือนิติบุคคลที่เข้ามาก่อนิติสัมพันธ์ Conflict of
                Interest Disclosure Form for vendor) <u>ด้วยตนเอง</u>
                หากไม่ทำแบบรายงานนี้ <u>จะไม่สามารถลงทะเบียนคู่ค้าใหม่ได้</u></strong
              >
              <h4 style="color: red" class="mt-3">
                กรุณากรอกอีเมลของคู่ค้าที่คุณต้องการให้ลงทะเบียน
                ทางระบบส่งแบบฟอร์มให้คู่ค้าทางอีเมล
              </h4>
          </v-card-text>
        </v-col>
      </v-row>
      <v-col cols="12" class="pa-2">
        <v-card class="mb-4">
          <v-card-title>
            <h5>Email ของ Vendor ที่ส่งให้ทำแบบรายงาน</h5>
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  :rules="rules_valid.email"
                  v-model="data_input.email"

                  placeholder="Email"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="d-flex justify-center mt-2 mb-4">
      <ButtonControl
      style="min-width: 100px; height: 35px;"
        text="ต่อไป"
        @button-clicked="handleNext"
      />
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
const formFillin = ref(null);
const emit = defineEmits(["form-update", "on-to-company-profile"]);
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
const props = defineProps({
  businessPartnerRoleId: {
    type: Number,
  },
});
const displayItemsCompany = computed(() => {
  return selected_items.value.items_company_data.map((item) => ({
    ...item,
    displayName: `${item.company_code} - ${item.name_th}`,
    customValue: { id: item.id, code: item.company_code },
  }));
});
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

watch(data_input.value, (newValue) => {
  // console.log("oo", newValue);
  emit("form-update", newValue);
});
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
const handleNext = async () => {
  const is_valid = await formFillin.value.validate();
  if (is_valid && is_valid["valid"]) {
    emit('on-to-company-profile');
  } else {
    console.log("Partner Register Invalid!!!");
  }
};
watch(
  () => props.businessPartnerRoleId,
  async () => {
    if (props.businessPartnerRoleId) {
      await getPaymentTerm();
    }
  },
  { deep: true }
);
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
