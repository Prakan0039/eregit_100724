<template>
  <v-row dense>
    <!-- Title Section -->
    <v-col cols="12" v-if="title != null">
      <h5 style="color: gray;">{{ title }}</h5>
    </v-col>
 
    <!-- Drag and Drop Zone -->
    <v-col cols="6">
      <v-card
        class="mx-auto ma-1"
        variant="outlined"
        style="border: 1px dashed #000000"
        :disabled="disabled"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        :class="{ 'bg-light-green': isDragging }"
      >
        <v-container class="bg-grey-lighten-3">
          <v-row no-gutters style="height: 200px">
            <v-col align-self="center" cols="12" class="text-center">
              <v-icon size="70" color="secondary">{{ icon }}</v-icon>
            </v-col>
            <v-col align-self="center" cols="12" class="text-center">
              <div>
                <h5>Drag & Drop file</h5>
                <h5 class="text-secondary">HERE</h5>
              </div>
            </v-col>
            <v-col align-self="center" cols="12" class="text-center">
              <v-btn
                variant="elevated"
                class="text-capitalize"
                color="secondary"
                rounded
                :disabled="disabled"
                @click="handlePickFile"
              >
                Browse Files
              </v-btn>
              <!-- Hidden File Input -->
              <input
                ref="uploader"
                class="d-none"
                type="file"
                :accept="accept"
                @change="handleFileChanged"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
 
    <!-- File List Section -->
    <v-col cols="6">
      <h5 v-if="listTitle != null">{{ listTitle }}</h5>
      <div v-if="file != null">
        <v-list-item>
          <template v-slot:prepend>
            <v-icon color="secondary">{{ icon }}</v-icon>
          </template>
          <v-list-item-title>{{ fileName }}</v-list-item-title>
          <template v-slot:append>
            <h5>{{ fileSize }}</h5>
            <v-icon color="red" class="ms-2" @click="removeFile">mdi-delete</v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-col>
 
    <!-- Description Section -->
    <v-col cols="12">
      <h5 class="text-secondary">{{ descritption }}</h5>
    </v-col>
  </v-row>
</template>
 
<script>
import convertSize from "convert-size";
 
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "mdi-microsoft-excel",
    },
    isFile: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    listTitle: {
      type: String,
      default: null,
    },
    descritption: {
      type: String,
      default: "อัพโหลดเฉพาะไฟล์ Excel จำนวน 1 ไฟล์เท่านั้น*",
    },
    accept: {
      type: String,
      default:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    },
  },
  data() {
    return {
      file: null,
      fileName: "",
      fileSize: "",
      isDragging: false,
    };
  },
  watch: {
    isFile(val) {
      if (val) {
        this.file = val;
        this.fileName = val.name;
        this.fileSize = convertSize(val.size);
      } else {
        this.resetFileData();
      }
    },
  },
  methods: {
    removeFile() {
      this.$emit("request-remove-file"); // Emit to parent to remove file
      this.resetFileData(); // Reset the file data in the component
    },
    handlePickFile() {
      this.$refs.uploader.click(); // Trigger file input click
    },
    handleFileChanged(e) {
      const file = e.target.files[0];
      if (file) {
        this.$emit("input-file", file); // Emit the file to the parent
        this.file = file;
        this.fileName = file.name;
        this.fileSize = convertSize(file.size);
      }
      this.resetFileInput(); // Reset input to allow re-selection of the same file
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file) {
        this.$emit("input-file", file); // Emit the file to the parent
        this.file = file;
        this.fileName = file.name;
        this.fileSize = convertSize(file.size);
      }
      this.resetFileInput(); // Reset input to allow re-selection of the same file
    },
    resetFileInput() {
      this.$refs.uploader.value = null; // Reset file input so the same file can be selected again
    },
    resetFileData() {
      this.file = null;
      this.fileName = "";
      this.fileSize = "";
    },
  },
};
</script>