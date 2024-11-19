<template>
  <div>
    <!-- แสดง MemberForm โดยตรง -->
    <component
      :is="currentComponent"
      @is-title="toggleTitleEmit"
      @is-view="toggleViewEmit"
    />
  </div>
</template>

<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onBeforeMount } from "vue";
import MemberForm from "@/components/forms/MemberForm.vue";

const emit = defineEmits(["is-title", "is-view"]);

const currentComponent = ref(null);

onBeforeMount(() => {
  // ตั้งค่าเริ่มต้นให้ currentComponent เป็น MemberForm
  currentComponent.value = MemberForm;
});

const toggleTitleEmit = (title) => {
  emit("is-title", title);
};

const toggleViewEmit = (view) => {
  emit("is-view", view);
};
</script>
