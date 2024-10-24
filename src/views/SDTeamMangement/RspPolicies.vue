<template>
  <v-container fluid>
    <h2>Mangement > RSP Policy</h2>
    <div class="mt-5">
      <v-row>
        <v-col cols="10" align-self="center">
          <h3> Activate Policy</h3>
        </v-col>
        <v-col cols="2">
          <v-btn class="me-2 text-none" color="secondary" density="compact" prepend-icon="mdi-plus" variant="flat" rounded
            to="/SDTeamMangement/RspPolicyUpsert?mode=create">
            Create new
          </v-btn>
        </v-col>
      </v-row>
      <div class="mt-5">
        <v-skeleton-loader v-if="activated_laoding" type="list-item-two-line" color="transparent" />
        <ItemRspPolicies v-else  v-for="(item,index) in activated_items" :key="index"
          class="mt-3"
          :item="item"
          :action-visible ="false"
          :actionId="0"
          />
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
            <v-skeleton-loader v-if="list_laoding" type="list-item-two-line" color="transparent" />
            <ItemRspPolicies v-else  v-for="(item,index) in list_item" :key="index"
              class="mt-3"
              :item="item"
              :action-visible ="true"
              :actionId="menus_index"
              @action-menus="actionMenus"
             />
          </v-tab-item>
        </v-tabs-items>
        <PaginationControl class="mt-3"
        :value="list_filter.page"
        :length="list_filter.pageSize"
        @value="handlePaginationEvent" />
      </div>
    </div>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount,onMounted ,watch} from 'vue';
import { useErrorHandlingDialog } from '@/components/dialogs/ExceptionHandleDialogService'
import { useConfirmationDialog } from '@/components/dialogs/ConfirmationDialogService'
import ItemRspPolicies from '@/components/items/ItemRspPolicies.vue'
import RspService from '@/apis/RspService';
import PaginationControl from '@/components/controls/PaginationControl'
import paginationUtils from '@/utils/paginationUtils'

const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const menus_index = ref(null);
const menus= ref(null);

const activated_laoding = ref(false);
const activated_items = ref([]);

const list_laoding = ref(false);
const list_item = ref([]);
const list_filter = ref({
  state :'deactivated',
  offset: 0,
  limit: 10,
  page : 1,
  pageSize: 1,
});

watch(menus_index, (newValue) => {
    list_filter.value.state = menus.value[newValue].state
    list_filter.value.offset= 0;
    list_filter.value.limit= 10;
    list_filter.value.page= 1;
    list_filter.value.pageSize= 1;
    getRspPolicyPagination();
});
onBeforeMount(() => {
  menus.value = [
    {
      id: 1,
      title: 'Inactive Policy',
      icon: 'mdi-account-outline',
      state :'inactive'
    },
    {
      id: 2,
      title: 'Draft',
      icon: 'mdi-link-variant',
      state :'draft'
    },
    {
      id: 3,
      title: 'Recently Delete',
      icon: 'mdi-link-variant',
      state :'deleted'
    },
  ]
});
onMounted(() => {
  getRspPolicyState()
  getRspPolicyPagination();
});

// eslint-disable-next-line no-unused-vars
const getRspPolicyState = async () => {
  try {
    activated_laoding.value = true;
    const response = await RspService.getRspPolicyState('active');
    if (response.data?.is_success) {
      activated_items.value = response.data?.data
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    activated_laoding.value = false;
  }
}
const getRspPolicyPagination = async () => {
  try {
    list_laoding.value = true;
    list_item.value = [];
    const response = await RspService.getRspPolicyPagination(
    list_filter.value.state,
    list_filter.value.offset,
    list_filter.value.limit
    );
    const headers = response.headers;
    const itemsOffset = Number(headers['items-offset']);
    const itemsLimit = Number(headers['items-limit']);
    const itemsTotal = Number(headers['items-total']);

    // console.error(itemsTotal)

    list_filter.value.offset = itemsOffset;
    list_filter.value.limit = itemsLimit;
    list_filter.value.pageSize = paginationUtils.pageSize(itemsLimit,itemsTotal)

    if (response.data?.is_success) {
      list_item.value = response.data?.data
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    list_laoding.value = false;
  }
}

const handlePaginationEvent = (page) => {
  list_filter.value.page = page;
  list_filter.value.offset = paginationUtils.pageOffset(page,list_filter.value.limit);
  getRspPolicyPagination();
}
const actionMenus = (rspPolicyId,action)=>{
   switch(action){
    case 'DELETE':
      handleDelete(rspPolicyId);
      break;
    case 'PERMANENTLY_DELETE':
      handlePermanentlyDelete(rspPolicyId);
      break;
    case 'DEACTIVATED_POLICY':
      handleDeactivatedPolicy(rspPolicyId);
      break;
    }
}
const handleDelete = async (rspPolicyId) => {
  try {
    const confirmed = await showDialog('ยืนยันการลบ', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.PermanentlyDeleteRspRolicy(rspPolicyId);
        if (response) {
          getRspPolicyPagination()
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
const handlePermanentlyDelete = async (rspPolicyId) => {
  try {
    const confirmed = await showDialog('ยืนยันการ Permanently delete', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.PermanentlyDeleteRspRolicy(rspPolicyId);
        if (response) {
          getRspPolicyPagination()
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
const handleDeactivatedPolicy = async (rspPolicyId) => {
  try {
    const confirmed = await showDialog('ยืนยัน Deactivated policy', 'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ');
    if (confirmed) {
        const response = await RspService.UndeleteRspPolicy(rspPolicyId);
        if (response) {
          getRspPolicyPagination()
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

