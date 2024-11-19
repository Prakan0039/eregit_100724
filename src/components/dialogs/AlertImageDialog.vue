<template>
  <v-row justify="center">
    <v-dialog persistent v-model="isVisible" width="320" height="280">
      <v-card width="350" height="320">
        <v-card-text class="ma-1">
          <v-row justify="center" class="pt-5">
            <img
              src="../../../public/frasers.png"
              alt="Example Image"
              style="width: 100px; height: 100px; color: green"
            />
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
                color="secondary"
                text="ตกลง"
                width="100"
                @button-clicked="confirmImageDialog"
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
import { useAlertImageDialog } from "@/components/dialogs/AlertImageDialogService.js";

const { isVisible, title, message, confirmImageDialog } = useAlertImageDialog();
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
