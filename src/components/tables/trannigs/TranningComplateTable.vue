<template>
  <!-- <h1>fekf</h1> -->
  <!-- {{ props.menusIndex }} -->
    <!-- {{ props.item }} -->

  <v-alert
    class="mt-3 mx-1 pointer-card"
    color="white"
    :style="{ borderLeft: borderLeft }"
    style="border-radius: 10px !important"
    elevation="1"
  >

  <!-- {{ props.item }} -->
  <h1></h1>
    <v-row dense>
      <v-col cols="2" align-self="center" v-if="props.menusIndex==0">
        <div class="d-flex justify-center align-center">
          <!-- <h4>ffffffff</h4> -->
          <strong>{{ dateUtils.formattedYearMonthDay(props.item?.updated_at?? null) }}</strong>
        </div>
      </v-col>

      <v-col cols="2" align-self="center" v-if="props.menusIndex!==0">
        <div class="d-flex justify-center align-center">
          <!-- <h4>ffffffff</h4> -->
          <strong>{{ dateUtils.formattedYearMonthDay(props.item?.completion_date?? null) }}</strong>
        </div>
      </v-col>



      <v-col cols="8" align-self="center">
        <v-icon size="60" color="red">mdi mdi-laptop</v-icon
        ><span class="ml-5" style="font-weight: bold">
          {{ props.item.training_name }}
        </span>
      </v-col>
      <v-spacer />
      <v-col cols="1" align-self="center">
        <v-btn block rounded @click="buttonClick" color="red"> เรียน </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script setup>
import { computed, watch } from "vue";
import convertColorNameToRGB from "@/utils/util.js";
import dateUtils from "@/utils/dateUtils";

const props = defineProps({
  colorCardAlert: {
    type: String,
    default: "error",
  },
  menusIndex: { // แยกออกจาก item
    type: Number,
    required: true, // กำหนดเป็น required เพื่อให้ชัดเจนว่าจำเป็นต้องส่ง
  },
  item: {
    type: Object,
    default: () => {
      // return {
      //   id: 1,
      //   training_name: "Supplier Sustainability Training",
      //   training_url: "url test",
      //   completion_status: "Incomplete",
      //   completion_date: null,
      // };
    },
  },
});

const emit = defineEmits(["handle-item-click"]);

const buttonClick = () => {
  emit("handle-item-click", props.item);
};

// const getDateString = (dateString) => {
//   const date = new Date(dateString);
//   let day = String(date.getDate()).padStart(2, "0");
//   let month = String(date.getMonth() + 1).padStart(2, "0");
//   let year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

watch(
  () => props.menusIndex,
  (newVal, oldVal) => {
    // console.log("menusIndex changed");
    // console.log("New Value:", newVal);
    // console.log("Old Value:", oldVal);
    if (newVal === 0) {
      console.log("Switching to Incomplete view");
    } else {
      console.log("Switching to Complete view");
    }
  }
);

const borderLeft = computed(() => {
  const rgb = convertColorNameToRGB("error");
  return `rgba(${rgb}, 1) 8px solid`;
});
</script>

<style scoped>
.pointer-card {
  cursor: pointer;
}

.pointer-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.pointer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.truncate {
  white-space: normal;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
