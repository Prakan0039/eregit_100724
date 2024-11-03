<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
    <h2>Mangement > Traning</h2>
    <div class="mt-5">
      <v-row justify="end">
        <v-col cols="2">
          <FilterTraning :roles_id="filter.roleId" :date_from="filter.dateFrom" :date_to="filter.dateTo"
            @roles_id="filter.roleId = $event" @date_from="filter.dateFrom = $event" @date_to="filter.dateTo = $event" @search="onSearch" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" align-self="center">
          <h3> Activate Traning</h3>
        </v-col>
        <v-col cols="2">
          <v-btn class="me-2 text-none"
                 color="secondary"
                 prepend-icon="mdi-plus"
                 variant="flat"
                 rounded
                 block
                 @click="handleTraningCreated"
                 >
            Create new
          </v-btn>
        </v-col>
      </v-row>
      <div class="mt-5">
        <v-skeleton-loader v-if="infoActive.loading" type="list-item-two-line" color="transparent" />
        <ItemRspTraning v-else v-for="(item, index) in infoActive.items" :key="index"
                              class="mt-3"
                              :item="item"
                              :is-draft="false"
                              :action-visible="true"
                              is-action="ACTIVE"
                              @action-menus="handleActionDropdown"
                              />
        <PaginationControl v-if="infoActive.pageSize > 1" class="mt-3" :value="infoActive.page" :length="infoActive.pageSize"
          @value="handlePaginationActiveEvent" />
      </div>
      <v-divider class="mt-3 mb-3"></v-divider>
      <div>
        <v-tabs v-model="menus_index" color="secondary">
          <v-tab v-for="(tabs, index) in menus" :key="index" class="text-capitalize">
            <h3>{{ tabs.title }}</h3>
          </v-tab>
        </v-tabs>
        <v-tabs-items>
          <v-tab-item>
            <v-skeleton-loader v-if="infoMenus.loading" type="list-item-two-line" color="transparent" />
            <ItemRspTraning v-else v-for="(item, index) in infoMenus.items" :key="index"
                   class="mt-3"
                  :item="item"
                  :is-draft="menus[menus_index].continue"
                  :action-visible="true"
                  :is-action="menus[menus_index].dropdown"
                  @action-menus="handleActionDropdown"
                  />
                  <PaginationControl v-if="infoMenus.pageSize > 1"
                   class="mt-3"
                  :value="infoMenus.page"
                  :length="infoMenus.pageSize"
                  @value="handlePaginationInfoMenusEvent" />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </v-container>
</template>
<script setup>
import { ref , watch, onMounted } from 'vue';
// eslint-disable-next-line no-unused-vars
import RspService from '@/apis/RspService';
import ItemRspTraning from '@/components/items/ItemRspTraning.vue'
import FilterTraning from '@/components/dialogs/FilterTraning.vue'
import PaginationControl from '@/components/controls/PaginationControl'
import { useConfirmationDialog } from '@/components/dialogs/ConfirmationDialogService'
import { useErrorHandlingDialog } from '@/components/dialogs/ExceptionHandleDialogService'
import paginationUtils from '@/utils/paginationUtils'
import dateUtils from '@/utils/dateUtils'
// eslint-disable-next-line no-unused-vars
const { handlingErrorsMessage } = useErrorHandlingDialog();
// eslint-disable-next-line no-unused-vars
const { showDialog } = useConfirmationDialog();

import { useRouter } from 'vue-router';
const router = useRouter();

const menus = ref([]);
const menus_index = ref(0);
const filter = ref({
  roleId: null, // defualt Vender admin
  dateFrom: null,
  dateTo: null,
});
const infoActive = ref({
  loading: false,
  items: [],
  state: 'active',
  offset: 0,
  limit: 10,
  page: 1,
  pageSize: 1,
});
const infoMenus = ref({
  loading: false,
  items: [],
  state: 'inactive',
  offset: 0,
  limit: 10,
  page: 1,
  pageSize: 1,
});
onMounted(() => {
  menus.value = [
    {
      title: 'Inactive Traning',
      icon: 'mdi-account-outline',
      continue: false,
      state:'inactive',
      dropdown: 'INACTIVE_TRANING'
    },
    {
      title: 'Draft',
      icon: 'mdi-link-variant',
      continue: true,
      state:'draft',
      dropdown: 'INACTIVE_DRAFT'
    },
    {
      title: 'Recently Delete',
      icon: 'mdi-link-variant',
      continue: false,
      state:'deleted',
      dropdown: 'INACTIVE_RECENTLY'
    },
  ]

    // Init defualt
    const currentYear = new Date().getFullYear();
    const firstCurrentYear = new Date(currentYear, 0, 1);
    const lastCurrentYear = new Date(currentYear, 11, 31);

    filter.value.roleId= 5; // defualt Vender admin
    filter.value.dateFrom =dateUtils.formattedYearMonthDay(firstCurrentYear);
    filter.value.dateTo =dateUtils.formattedYearMonthDay(lastCurrentYear);
    handleGetRspTrainingActive();
    handleGetRspTrainingInfoMenus();
});
watch(menus_index, (newValue) => {
    infoMenus.value.state = menus.value[newValue].state;
    infoMenus.value.offset= 0;
    infoMenus.value.limit= 10;
    infoMenus.value.page= 1;
    infoMenus.value.pageSize= 1;
    handleGetRspTrainingInfoMenus();
});

const handleTraningCreated = () =>{
  sessionStorage.setItem("traning_modifiy", []);
  router.push('/SDTeamMangement/TraningUpsert');
}
const handlePaginationActiveEvent = (page) => {
  infoActive.value.page = page;
  infoActive.value.offset = paginationUtils.pageOffset(page, infoActive.value.limit);
  handleGetRspTrainingActive();
}
const handlePaginationInfoMenusEvent = (page) => {
  infoMenus.value.page = page;
  infoMenus.value.offset = paginationUtils.pageOffset(page, infoActive.value.limit);
  handleGetRspTrainingInfoMenus();
}

const onSearch = () => {
  handleGetRspTrainingActive();
  handleGetRspTrainingInfoMenus();
}
const handleGetRspTrainingActive = async () => {
  try {
    infoActive.value.loading = true;
    infoActive.value.items = [];
    const response = await RspService.getRspTraining(
                            infoActive.value.state,
                            infoActive.value.offset,
                            infoActive.value.limit,
                            filter.value.roleId,
                            filter.value.dateFrom,
                            filter.value.dateTo);

    const headers = response.headers;
    const itemsOffset = Number(headers['items-offset']);
    const itemsLimit = Number(headers['items-limit']);
    const itemsTotal = Number(headers['items-total']);

    infoActive.value.offset = itemsOffset;
    infoActive.value.limit = itemsLimit;
    infoActive.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal)

    if (response.data?.is_success) {
      infoActive.value.items = response.data.data
    }
    return []
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    infoActive.value.loading = false;
  }
}
const handleGetRspTrainingInfoMenus = async () => {
  try {
    infoMenus.value.loading = true;
    infoMenus.value.items = [];
    const response = await RspService.getRspTraining(
                          infoMenus.value.state,
                          infoMenus.value.offset,
                          infoMenus.value.limit,
                          filter.value.roleId,
                          filter.value.dateFrom,
                          filter.value.dateTo);
    const headers = response.headers;
    const itemsOffset = Number(headers['items-offset']);
    const itemsLimit = Number(headers['items-limit']);
    const itemsTotal = Number(headers['items-total']);
    infoMenus.value.offset = itemsOffset;
    infoMenus.value.limit = itemsLimit;
    infoMenus.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal)

    if (response.data?.is_success) {
      infoMenus.value.items = response.data.data
    }
    return []
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    infoMenus.value.loading = false;
  }
}

const handleActionDropdown = (rspTraningId,action)=>{
  console.log(action)
   switch(action){
    case 'DEACTIVATED':
      handleDeactived(rspTraningId);
      break;
    case 'DELETE':
      handleDeleted(rspTraningId);
      break;
    case 'ACTIVATED':
      handleActivated(rspTraningId);
      break;
    case 'DEACTIVATED_TRANING':
      handleDeactivatedTraning(rspTraningId);
      break;
    case 'PERMANENTLY_DELETE':
      handlePermanentlyDeleted(rspTraningId);
      break;

    }
}
const handleDeactived = async (rspTraningId) => {
  try {
    const confirmed = await showDialog('ยืนยันการ Deactived', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.deactivateRspTraining(rspTraningId);
        if (response) {
          handleGetRspTrainingActive()
          handleGetRspTrainingInfoMenus()
        }
    }
  }
  catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
};

const handleActivated = async (rspTraningId) => {
  try {
    const confirmed = await showDialog('ยืนยันการ Adctivated', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.activateRspTraining(rspTraningId);
        if (response) {
          handleGetRspTrainingActive()
          handleGetRspTrainingInfoMenus()
        }
    }
  }
  catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
};
const handleDeleted = async (rspTraningId) => {
  try {
    const confirmed = await showDialog('ยืนยันการลบ', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.deleteRspTraining(rspTraningId);
        if (response) {
          handleGetRspTrainingInfoMenus()
        }
    }
  }
  catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
};
const handlePermanentlyDeleted = async (rspTraningId) => {
  try {
    const confirmed = await showDialog('ยืนยันการ Permanently delete', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.permanentlyDeleteRspTraining(rspTraningId);
        if (response) {
          handleGetRspTrainingInfoMenus()
        }
    }
  }
  catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
};
const handleDeactivatedTraning = async (rspTraningId) => {
  try {
    const confirmed = await showDialog('ยืนยัน Deactivated policy', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.undeleteRspTraining(rspTraningId);
        if (response) {
          handleGetRspTrainingInfoMenus()
        }
    }
  }
  catch (e) {
      if (e.response) {
        const val = e.response.data
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
};

</script>
