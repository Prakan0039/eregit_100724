<template>
  <!-- <div > -->
  <v-container fluid>
    <div class="d-flex align-center justify-center">
      <h3 class="py-5">Change Information</h3>
    </div>
 
    <div class="d-flex align-center justify-center">
      <h3 class="pa-5">เพิ่มข้อมูลประเภทคู่ค้า และ ประเภทธุรกิจ</h3>
    </div>
    <!-- {{ isVender }} -->
    <v-row dense>
      <!-- <v-col cols="12"><h2>1. ประเภทคู่ค้า</h2></v-col> -->
      <v-col cols="12">
        <v-card class="pa-8 ma-8 mt-7 mb-7">
          <v-row dense>
            <v-radio-group
              :rules="radioRules"
              v-model="dataInput.register.business_partner_type"
            >
              <v-radio
                v-for="(item, index) in itemPartnerType"
                :key="index"
                :label="item.name_th"
                :value="item.id.toString()"
                :disabled="shouldDisable(item.id)"
              ></v-radio>
            </v-radio-group>
          </v-row>
        </v-card>
      </v-col>
 
      <v-col cols="12">
        <v-card class="pa-8 ma-8">
          <v-card-title>
            <h6>ประเภทธุรกิจ</h6>
          </v-card-title>
          <v-row dense>
            <v-col cols="12">
              <v-select
                :items="itemCompanyCatagory"
                item-title="name_th"
                item-value="id"
                v-model="dataInput.register.company_category"
                density="compact"
                variant="outlined"
                placeholder="เลือกคำตอบ"
                :rules="textRequired"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- <v-col cols="12">
        <v-card class="pa-6">
          <v-card-title>
            <h6>ประเภทสินค้าและบริการ</h6>
          </v-card-title>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                density="compact"
                :rules="isVender ? textRequired : [() => true]"
                v-model="dataInput.register.product_category"
                variant="outlined"
                placeholder="เช่น งานสี งานไฟฟ้า งานประปา อื่นๆ"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col> -->
 
      <!-- <v-col cols="6" class="d-flex justify-end mt-5" v-if="!isHideButton">
        <ButtonControl
          color="black"
          style=" height: 35px;
            min-width: 100px;
            background-color: white !important;
            color: #ed1c24 !important;
            border: 1px solid #ed1c24;"
          text="ย้อนกลับ"
          @button-clicked="handleReverse"
        />
      </v-col>
      <v-col cols="6" class="d-flex justify-start mt-5" v-if="!isHideButton">
        <ButtonControl text="ถัดไป"
        style="min-width: 100px; height: 35px; " @button-clicked="handleNext" />
      </v-col> -->
    </v-row>
 
    <!-- </div> -->
  </v-container>
</template>
 
<script setup>
import { ref, watchEffect } from "vue";
// import ButtonControl from "@/components/controls/ButtonControl.vue";
 
import { watch } from "vue";
// import { computed } from "vue";
import CompnayService from "@/apis/CompnayService";
import PartnerServive from "@/apis/PartnerServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { onMounted } from "vue";
const { handlingErrorsMessage } = useErrorHandlingDialog();
 
const props = defineProps({
  isVender: {
    type: Boolean,
    default: false,
  },
  taxPayerIdNumber: {
    type: String,
  },
  isHideButton: {
    type: Boolean,
    default: false,
  },
  businessPartnerType: {
    type: String,
  },
  bp_group: {
    type: String,
  },
});
 
// const rest = ref();
 
watchEffect(async () => {
  if (props.businessPartnerType)
    dataInput.value.register.business_partner_type =
      props.businessPartnerType.toString();
});
 
onMounted(async () => {
  // await getCompaniesCategories();
  await getBusinessPartnerType();
  await getCompaniesCategories();
  // await getTaxBusinessRegisterTypeByTaxPayerId();
});
 
const emit = defineEmits([
  "on-is-natural",
  "on-button-ok-click",
  "on-button-cancel-click",
  "on-input",
]);
 
// const is_natural_person = computed(() => {
//   return dataInput.value.register.business_partner_type == 1;
// });
 
// const is_service_government = computed(() => {
//   return dataInput.value.register.business_partner_type == 3;
// });
 
const is_other_comp_catagory = ref(false);
 
// const is_other_business_partner_type = computed(() => {
//   return dataInput.value.register.business_partner_type == 0;
// });
 
const radioRules = [(v) => !!v || "กรุณาเลือก 1 อัน"];
const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
 
const dataInput = ref({
  register: {
    business_partner_type: "",
    company_category: "",
    product_category: "",
  },
});
 
 
 
const itemPartnerType = ref([]);
const itemCompanyCatagory = ref([]);
const itemPartnerTypeNumber = ref(""); // Modify this value to 1 or 2 based on conditions
// const taxBusinessRegisterType = ref({});
 
watchEffect(() => {
  if (props.bp_group) {
    itemPartnerTypeNumber.value = props.bp_group; // Convert to number if needed
  }
});
watch(
  () => dataInput.value.register.company_category,
  () => {
    if (dataInput.value.register.company_category == 29) {
      //อื่นๆ คือ ID 29 เพื่อให้แสดงช่อง text field
      is_other_comp_catagory.value = true;
    } else {
      is_other_comp_catagory.value = false;
    }
  }
);
 
const shouldDisable = (id) => {
  if (itemPartnerTypeNumber.value === 1) {
    return [2, 3, 4, 5, 6, 7, 8, 16].includes(id);
  } else if (itemPartnerTypeNumber.value === 2) {
    return [1, 3, 4, 16].includes(id);
  } else if (itemPartnerTypeNumber.value ===3) {
    return [1, 2, 4, 5, 6, 7, 8, 16].includes(id);
  } else if (itemPartnerTypeNumber.value ===4) {
    return [1, 2, 3, 5, 6, 7, 8, 16].includes(id);
  }
  return false;
};
const getCompaniesCategories = async () => {
  try {
    const response = await CompnayService.getCompanyCategoriesAll();
    if (response.data?.is_success) {
      const sortedData = response.data.data.sort((a, b) => a.id - b.id);
 
      // Find the index of the "อื่นๆ" (Other) option
      const otherIndex = sortedData.findIndex(
        (item) => item.name_th === "อื่นๆ"
      );
 
      if (otherIndex !== -1) {
        const otherItem = sortedData.splice(otherIndex, 1)[0];
        sortedData.push(otherItem);
      }
 
      itemCompanyCatagory.value = sortedData;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
  }
};
 
 
const getBusinessPartnerType = async () => {
  try {
    const response = await PartnerServive.getPartnerTypeAll();
    if (response.data?.is_success) {
      itemPartnerType.value = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
  }
};
 
watch(dataInput.value, (newValue) => {
  emit("on-input", newValue);
  console.log("on-input", newValue);
});
 
</script>
 
<style scoped>
:deep(.v-text-field .v-field) {
  border-radius: 10px !important;
}
 
:deep(.v-input__details) {
  padding: 0px !important;
  margin-left: 10px !important;
  margin-top: -7px !important;
}
 
.box {
  position: relative;
}
 
.box :deep(.v-text-field .v-field) {
  width: 300px;
  position: absolute;
  left: 100px;
  top: -2px;
  flex-grow: 9;
  max-width: 300px;
}
</style>