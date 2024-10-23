
<template>
  <v-card elevation="2" rounded="0" class="rounded-lg">
    <v-card-item class="ma-0">
      <v-row no-gutters dense justify="space-around">
        <v-col cols="1" align-self="center" class="pa-1">
          <strong>{{ dateUtils.parseDdMmYy(props.item?.created_at) }}</strong>
          <v-icon color="secondary" size="40" class="ml-3 mr-3">mdi-laptop-account</v-icon>
        </v-col>
        <v-col cols="3" align-self="center" class="pa-1">
          <strong>{{ props.item?.name }}</strong>
        </v-col>
        <v-divider vertical class="ma-2"></v-divider>
        <v-col cols="2" align-self="center" class="pa-1">
          <strong>Created by</strong>
          <br />
          <strong class="text-secondary">{{ props.item?.created_user?.email }}</strong>
        </v-col>
        <v-divider vertical class="ma-2"></v-divider>
        <v-col cols="2" align-self="center" class="pa-1">
          <strong>Role</strong>
          <br />
          <strong class="text-secondary" v-for="(role, i) in props.item?.roles" :key="i">
            {{ role.name + (i < (props.item?.roles.length - 1) ? '&nbsp;,&nbsp;' : '') }} </strong>
        </v-col>
        <v-col cols="2" align-self="center" class="pa-1">
          <a :href="props.item?.file_url" target="_blank">
            <v-btn class="me-2 text-none" color="secondary" variant="outlined" size="small" rounded>
              Link วีดีโอ
            </v-btn>
          </a>
          <v-btn v-if="props.isDraft" class="me-2 text-none" color="secondary" variant="flat" size="small" rounded @click="handleContinue(props.item)">
            Continue
          </v-btn>
          <v-btn v-else class="me-2 text-none" color="secondary" variant="flat" rounded @click="handleExportResult(props.item?.id,props.item?.name)">
            Export Results
          </v-btn>
        </v-col>
        <v-col cols="1" align-self="center" class="pa-1">
          <v-menu v-if="props.actionVisible" transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn text v-bind="props" variant="text">
                    <v-icon icon=" mdi-dots-horizontal"></v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item v-for="(menu,index) in ActionMenus" :key="index" @click="handleAction(item?.id,menu.emit)">
                    <template v-slot:prepend>
                      <v-icon :icon="menu.icon" :color="menu.color"></v-icon>
                    </template>
                    <v-list-item-title :class="`text-${menu.color}`">{{menu.title}}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
//  eslint-disable no-unused-vars
// eslint-disable-next-line no-unused-vars
import { ref, onBeforeMount, defineProps, computed } from 'vue';
import exportService from '@/apis/ExportService';
import RspService from '@/apis/RspService';
import dateUtils from "@/utils/dateUtils";

import { useRouter } from 'vue-router';
const router = useRouter();

import { useErrorHandlingDialog } from '@/components/dialogs/ExceptionHandleDialogService'
const { handlingErrorsMessage } = useErrorHandlingDialog();

const emit = defineEmits(["action-menus"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => { }
  },
  actionVisible: {
    type: Boolean,
    default: false,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  isAction: {
    type: String,
    default: null,
  }
});
const ActionMenus = computed({
  get() {

    switch (props.isAction) {
      case 'ACTIVE': return [
        { title: 'Deactivated', icon: 'mdi-chevron-right', color: 'black', emit: 'DEACTIVATED' },
      ]
      case 'INACTIVE_TRANING': return [
        { title: 'Activated', icon: 'mdi-chevron-right', color: 'red', emit: 'ACTIVATED' },
        { title: 'Delete', icon: 'mdi-delete', color: 'black', emit: 'DELETE' }
      ]
      case 'INACTIVE_DRAFT': return [
        { title: 'Delete', icon: 'mdi-delete', color: 'black', emit: 'DELETE' }
      ]
      case 'INACTIVE_RECENTLY': return [
        { title: 'Deactivated Traning', icon: 'mdi-chevron-right', color: 'red', emit: 'DEACTIVATED_TRANING' },
        { title: 'Permanently Delete', icon: 'mdi-chevron-right', color: 'black', emit: 'PERMANENTLY_DELETE' },
      ]
      default: return []
    }
  },
});
// eslint-disable-next-line no-unused-vars
const handleContinue = (i)=>{
  const traning = {
    id : i?.id,
    name:i?.name,
    link:i?.file_url,
    roleId:i?.roles[0].id,
  }
  const jsonArray = JSON.stringify(traning);
  sessionStorage.setItem("traning_modifiy", jsonArray);
  router.push('/SDTeamMangement/TraningUpsert');
}
const handleAction = (rsp_traning_id, action) => {
  emit('action-menus', rsp_traning_id, action)
}
const handleExportResult = async (rsp_traning_id,rsp_traning_name) => {
  try {
    const response = await RspService.exportRspTrainingResult(rsp_traning_id)
    const file_url = response.data?.data?.file_url
    await exportService.exportBase64(`${rsp_traning_name}`, 'xlsx', file_url);
  } catch (e) {
    if (e.response) {
      const val = e.response.data
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
}

</script>

