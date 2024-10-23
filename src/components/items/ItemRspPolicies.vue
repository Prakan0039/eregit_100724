<template>
  <v-card elevation="2" rounded="0" class="rounded-lg">
    <v-card-item class="ma-0">
      <v-row no-gutters dense justify="space-around">
        <v-col cols="1" align-self="center" class="pa-1">
          <span>{{ dateUtils.parseDdMmYy(item?.created_at) }}</span>
          <v-icon color="secondary" size="20" class="ml-3 mr-3"
            >mdi-text-box-check</v-icon
          >
        </v-col>
        <v-col cols="4" align-self="center" class="pa-1">
          <strong>{{ item?.name }}</strong>
          <strong class="text-grey">(V.{{ item?.version }})</strong>
        </v-col>
        <v-divider vertical class="ma-2"></v-divider>
        <v-col cols="2" align-self="center" class="pa-1">
          <strong>Created by</strong>
          <br />
          <strong class="text-secondary">{{ item?.created_user?.email }}</strong>
        </v-col>
        <v-col cols="3" align-self="center" class="pa-1">
          <v-btn
            class="me-2 text-none"
            color="secondary"
            variant="outlined"
            density="compact"
            rounded
            @click="handlePreview(item?.file_url)"
          >
            Preview
          </v-btn>
          <v-btn
            v-if="props.actionId === 1"
            class="me-2 text-none"
            color="secondary"
            variant="flat"
            density="compact"
            rounded
            :to="`/SDTeamMangement/RspPolicyUpsert?id=${item?.id}&name=${item?.name}`"
          >
            Continue
          </v-btn>

          <v-btn
            v-else
            density="compact"
            class="me-2 text-none"
            color="secondary"
            variant="flat"
            rounded
            @click="handleExportResult(item?.id)"
          >
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
              <v-list-item
                v-for="(menu, index) in ActionMenus"
                :key="index"
                @click="handleAction(item?.id, menu.emit)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="menu.icon" :color="menu.color"></v-icon>
                </template>
                <v-list-item-title :class="`text-${menu.color}`">{{
                  menu.title
                }}</v-list-item-title>
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
import { ref, onBeforeMount, defineProps, computed } from "vue";
import exportService from "@/apis/ExportService";
import RspService from "@/apis/RspService";
import dateUtils from "@/utils/dateUtils";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const emit = defineEmits(["action-menus"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  actionVisible: {
    type: Boolean,
    default: false,
  },
  actionId: {
    type: Number,
    default: 1,
  },
});
const ActionMenus = computed({
  get() {
    switch (props.actionId) {
      case 2:
        return [
          {
            title: "Deactivated policy",
            icon: "mdi-chevron-right",
            color: "red",
            emit: "DEACTIVATED_POLICY",
          },
          {
            title: "Permanently Delete",
            icon: "mdi-chevron-right",
            color: "black",
            emit: "PERMANENTLY_DELETE",
          },
        ];
      default:
        return [
          {
            title: "Delete",
            icon: "mdi-delete",
            color: "black",
            emit: "DELETE",
          },
        ];
    }
  },
});
const handleAction = (rsp_policy_id, action) => {
  emit("action-menus", rsp_policy_id, action);
};
const handlePreview = (url) => {
  window.open(url, "_blank");
};
const handleExportResult = async (rsp_policy_id) => {
  try {
    const response = await RspService.exportRspPolicyResult(rsp_policy_id);
    const file_url = response.data?.data?.file_url;
    // await exportService.exportBase64(`${rsp_policy_name}`, "xlsx", file_url);
    // await exportService.exportBase64
    await exportService.downloadFileV2(file_url);
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};
</script>
