<template>
  <v-row justify="center">
    <v-dialog persistent v-model="isVisible" width="400" height="320">
      <v-card width="430" height="320">
        <v-card-text class="ma-1">
          <v-row justify="center" class="pt-5">
            <v-icon size="100" color="secondary"
              >mdi mdi-alert-circle-outline</v-icon
            >
          </v-row>
          <v-row justify="center">
            <v-col cols="12" align-self="center">
              <h3 class="new-line">{{ title }}</h3>
            </v-col>
          </v-row>
          <v-row justify="center" no-gutters>
            <v-col cols="12" align-self="center">
              <p class="new-line sub-title-text">
                {{ message }}
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">
              <button-control
                text="ย้อนกลับ"
                width="100"
                color="black"
                @button-clicked="cancelDialog"
              />
            </v-col>
            <v-col cols="auto">
              <button-control
                color="secondary"
                text="ตกลง"
                width="100"
                @button-clicked="confirmDialog"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup>
import ButtonControl from "../controls/ButtonControl.vue";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";

const { isVisible, title, message, confirmDialog, cancelDialog } =
  useConfirmationDialog();
</script>

<style>
.new-line {
  white-space: pre-line;
  text-align: center;
}
.sub-title-text {
  color: gray;
  font-size: 90%;
}
</style>
