<template>
  <v-container>
    <!-- {{ companyCodesPartner }} -->
    <v-app-bar class="custom-app-bar" v-if="itemsFileDocument.length > 0">
      <AttachedMenat
        :items="itemsFileDocument"
        class="mb-9"
        @on-attach-file="handleAttchFiles"
        app
      />
    </v-app-bar>

    <div>
      <v-row class="pa-10" justify="center" align="center">
        <v-col class="d-flex justify-center" cols="12">
          <h2>Extend Company</h2>
        </v-col>
      </v-row>

      <v-card class="pa-5" v-if="stepper === 0">
        <div class="mb-1">ต้องการ Extend Company Role ใด</div>
        <v-skeleton-loader :loading="isLoading" type="list-item-two-line">
          <v-radio-group v-model="typePartner" color="red">
            <v-radio label="Vendor" :value="1"></v-radio>
            <!-- <v-radio label="Customer" :value="0"></v-radio> -->
          </v-radio-group>
        </v-skeleton-loader>
      </v-card>

      <v-card v-if="stepper === 1">
        <v-card-title>
          <h5>สำหรับบริษัท</h5>
        </v-card-title>
        <v-row dense>
          <v-col cols="12">
            <v-autocomplete
              v-model="companiesSelection"
              :items="displayItemsCompany"
              item-value="customValue"
              item-title="displayName"
              multiple
              closable-chips
              density="compact"
              variant="outlined"
            >
              <template #selection="{ item }">
                <v-chip
                  style="color: black"
                  variant="outlined"
                  :color="getItemColor(item.value)"
                >{{ item.title }}</v-chip>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card>
      <v-row v-if="isAlowAction" justify="center" class="mt-10" align="center">
        <ButtonControl @click="handleOnClick()" :text="buttonName" />
      </v-row>
    </div>
  </v-container>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import PartnerServive from "@/apis/PartnerServive";
import CompnayService from "@/apis/CompnayService";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import AttachedMenat from "@/components/forms/accounts/AttachedMenat.vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const stepper = ref(0);
const typePartner = ref("");
const itemsCompanyData = ref([]);
const companiesSelection = ref([]);
const dataExtendCompanyReq = ref({});
const businessPartnerDetail = ref({});
const attachFiles = ref([]);
const isLoading = ref(true);
const itemsFileDocument = ref([]);

const isAlowAction = ref(false);
const buttonName = ref("ต่อไป");

const router = useRouter();
const route = useRoute();

const form_number = route.query.form_number;

const displayItemsCompany = computed(() => {
  return itemsCompanyData.value.map(item => ({
    ...item,
    displayName: `${item.company_code} - ${item.name_th}`,
    customValue: { id: item.id, code: item.company_code }
  }));
});

onMounted(async () => {
  await onLoadEntendCompanyByFormNumner();
  await getCompanies();
  await getBusinessPartnerDetail(dataExtendCompanyReq.value.bp_number);
  isAlowAction.value = true;
  isLoading.value = false;
  await getUploadDocumentByFormNumber();
});

const getUploadDocumentByFormNumber = async () => {
  try {
    const response = await PartnerServive.getUploadDocumentByFormNumber(
      form_number
    );
    if (response.data?.is_success) {
      itemsFileDocument.value = response.data.data.map(el => {
        return {
          file: null,
          file_name: el.document_name,
          file_size: "no available"
        };
      });
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      console.log(val.message, val?.data.error);
      return;
    }
    console.log("unknown", e.message);
  }
};

const onLoadEntendCompanyByFormNumner = async () => {
  try {
    const response = await PartnerServive.getExtendCompanyRequestByFormNumber(
      form_number
    );
    if (response.data?.is_success) {
      dataExtendCompanyReq.value = response.data?.data;
      typePartner.value = dataExtendCompanyReq.value.business_partner_role.id;
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

const getCompanies = async () => {
  try {
    const response = await CompnayService.getCompanyAll();
    if (response.data?.is_success) {
      itemsCompanyData.value = response.data.data;
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

const getBusinessPartnerDetail = async bp_number => {
  try {
    const response = await PartnerServive.getBusinessPartnerDetail(bp_number);
    if (response.data?.is_success) {
      businessPartnerDetail.value = response.data.data;
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

const onSaveExtenCompany = async dataBodySave => {
  try {
    const response = await PartnerServive.createExtendCompany(dataBodySave);
    if (response.data?.is_success) {
      router.push({
        name: "AccountManagement",
        query: { path: "ArchiveTask" }
      });
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

const companyCodesExits = ref({});
const companyCodesPartner = ref({});

const handleAttchFiles = item_files => {
  attachFiles.value = item_files;
};

const getItemColor = item => {
  console.log;
  return companyCodesPartner.value.some(checkItem => checkItem.id === item.id)
    ? "green"
    : "red";
};

const handleOnClick = async () => {
  if (stepper.value === 1) {
    if (
      await showDialog(
        "ยืยยันการแก้ไขข้อมูล ?",
        "กรุณาตรวจสอบข้อมูล คุณไม่สามารถแก้ไขได้แล้ว\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
      )
    ) {
      const companyIds = companiesSelection.value.map(el => el.id);

      const dataBodySave = {
        form_number: form_number,
        company_id: companyIds.join(","),
        business_partner_role_id: 1
      };
      await onSaveExtenCompany(dataBodySave);
    }
  }

  if (stepper.value === 0) {
    const compIds = dataExtendCompanyReq.value.company_id.split(",");

    console.log("Company Ids : ", JSON.stringify(compIds));

    companyCodesExits.value = itemsCompanyData.value
      .filter(company => compIds.includes(company.id.toString()))
      .map(company => {
        return { id: company.id, code: company.company_code };
      });

    console.log("Company Exits : ", JSON.stringify(companyCodesExits.value));
    companiesSelection.value = companyCodesExits.value;

    if (typePartner.value == "1") {
      const partnerDetailCode = businessPartnerDetail.value.company_information.company_code_of_vendor
        .toString()
        .trim()
        .split(",")
        .map(code => code.trim());

      companyCodesPartner.value = itemsCompanyData.value
        .filter(company => partnerDetailCode.includes(company.company_code))
        .map(company => {
          return { id: company.id, code: company.company_code };
        });

      // const result = itemsCompanyData.value.filter(company => {
      //   console.log("partnerDetailCode: " + partnerDetailCode + "  || company.company_code : " + company.company_code + " || " + partnerDetailCode.includes(company.company_code.toString()))
      //   if (partnerDetailCode.includes(company.company_code)) {
      //     return { id: company.id, code: company.company_code };
      //   }
      // });

      // console.log("itemsCompanyData" , JSON.stringify(itemsCompanyData.value))
      // console.log("partnerDetailCode : ", JSON.stringify(partnerDetailCode));

      console.log(
        "Business Partner Detail : ",
        JSON.stringify(
          businessPartnerDetail.value.company_information.company_code_of_vendor
        )
      );
      console.log("Partner Detail Code : ", JSON.stringify(partnerDetailCode));
      console.log("Company Code : ", JSON.stringify(companyCodesPartner.value));
    } else {
      const partnerDetailCode = businessPartnerDetail.value.company_information.company_code_of_customer.split(
        ","
      );
      companyCodesPartner.value = itemsCompanyData.value
        .filter(company =>
          partnerDetailCode.includes(company.company_code.toString())
        )
        .map(company => {
          return { id: company.id, code: company.company_code };
        });

      console.log(
        "Business Partner Detail : ",
        JSON.stringify(
          businessPartnerDetail.value.company_information
            .company_code_of_customer
        )
      );
      console.log("Partner Detail Code : ", JSON.stringify(partnerDetailCode));
      console.log("Company Code : ", JSON.stringify(companyCodesPartner.value));
    }
    stepper.value++;
    buttonName.value = "เสร็จ";
  }
};
</script>

<style scoped>
.custom-app-bar {
  height: 79px !important;
}
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

