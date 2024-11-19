<template>
  <!-- บัญชีธนาคาร -->
  <v-container>
    <v-row dense no-gutters>
      <v-col cols="12"><h2>บัญชีธนาคาร</h2></v-col>
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
                :rules="required"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Business Partner Neme</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.partner_name"
                dense
                variant="outlined"
                :rules="required"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Bank Key</h6>
              </v-card-title>
              <v-select
                class="ml-4 mr-4"
                chips
                v-model="data_input.bank_key"
                :items="itemBanks"
                item-value="bank_key"
                item-title="display"
                density="compact"
                variant="outlined"
                :rules="required"
              ></v-select>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Bank Account</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.bank_account"
                dense
                variant="outlined"
                :rules="required"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Account Holder</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.account_holder"
                dense
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Account Name</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.account_name"
                dense
                variant="outlined"
                :rules="required"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-card-title>
                <h6>Remark</h6>
              </v-card-title>
              <v-text-field
                class="ml-4 mr-4"
                density="compact"
                v-model="data_input.remark"
                dense
                variant="outlined"
                :rules="required"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import OtherService from "@/apis/OtherService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { onMounted, ref, watch } from "vue";
const { handlingErrorsMessage } = useErrorHandlingDialog();

const emit = defineEmits(["on-update"]);

const itemBanks = ref([]);

const propsVar = defineProps({
  partnerName: String,
  partnerNumber: String,
  accountName: String,
  accountHolder: String,
  bankKey: String,
  reMark: String,
  index: Number,
  bankBranch: String,
  bankId: Number,
  bankAccoutNumber: String,
});

const required = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];

watch(
  () => propsVar,
  (newValue) => {
    data_input.value.partner_number = newValue.partnerNumber ?? null;
    data_input.value.partner_name = newValue.partnerName ?? null;
    data_input.value.bank_account = newValue.accountName ?? null;
    data_input.value.account_holder = newValue.accountHolder ?? null;
    data_input.value.account_name = newValue.acc ?? null;
    data_input.value.bank_key = newValue.bankKey ?? null;
    data_input.value.remark = newValue.reMark ?? null;
    data_input.value.bank_branch = newValue.bankBranch ?? null;
    data_input.value.bank_id = newValue.bankId ?? null;
    data_input.value.bankAccoutNumber = newValue.bankAccoutNumber ?? null;
  },
  { deep: true, immediate: false }
);

const data_input = ref({
  partner_number: propsVar.partnerNumber,
  partner_name: propsVar.partnerName,
  bank_account: propsVar.accountName,
  account_holder: propsVar.accountHolder,
  account_name: propsVar.acc,
  bank_key: propsVar.bankKey,
  remark: propsVar.reMark,
  bank_branch: propsVar.bankBranch,
  bank_id: propsVar.bankId,
  bankAccoutNumber: propsVar.bankAccoutNumber,
});

onMounted(async () => {
  await getBanks();
});

const getBanks = async () => {
  try {
    const response = await OtherService.getBanksAll();
    if (response.data?.is_success) {
      itemBanks.value = response.data.data.map((item) => ({
        ...item,
        display: `${item.bank_key} - ${item.name_th}`,
        id: item.id.toString(),
      }));
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

watch(
  data_input.value,
  () => {
    const bankSearch = itemBanks.value.find(
      (el) => el.bank_key === data_input.value.bank_key
    );
    if (bankSearch) data_input.value.bank_id = bankSearch.id;
    emit("on-update", { index: propsVar.index, newValue: data_input.value });
  },
  { deep: true, immediate: true }
);
</script>
