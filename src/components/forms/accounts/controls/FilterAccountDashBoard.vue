<template>

        <v-col cols="auto" class="d-flex align-center ">
          <datePickerRangeControl
            class="custom-width"
            :from="DateFrom"
            :to="DateTo"
            @from="DateFrom = $event"
            :placeholder="ccc"
            @to="DateTo = $event"
          />
          <v-btn class="text-none ml-2" variant="text" @click="clearAll">
            <p class="text-decoration-underline">Clear all</p>
          </v-btn>
          <v-col cols="2">
            <v-btn class="text-none" variant="text" @click="search">
              <p class="text-decoration-underline">Search</p>
            </v-btn>
          </v-col>
        </v-col>

</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import datePickerRangeControl from "@/components/controls/DatePickerRangeControl.vue";

const emit = defineEmits(["date_from", "date_to", "search"]);
const props = defineProps({
  date_from: { type: String, default: null },
  date_to: { type: String, default: null },
});

const DateFrom = computed({
  get() { return props.date_from; },
  set(value) { emit("date_from", value); },
});
const DateTo = computed({
  get() { return props.date_to; },
  set(value) { emit("date_to", value); },
});
const search = () => {
  emit("search");
};
const clearAll = () => {
  DateFrom.value = null;
  DateTo.value = null;
};
</script>

<style scoped>
.custom-width {
  min-width: 200px;
  max-width: 500px;
  width: 100%;
}

button {
  border-radius: 10px !important;
}

:deep(.v-field) {
  box-shadow: rgba(99, 99, 99, 0.2) 1px 4px 10px 0px !important;
  border: 1px solid #ededed !important;
  border-radius: 10px !important;
}
</style>
