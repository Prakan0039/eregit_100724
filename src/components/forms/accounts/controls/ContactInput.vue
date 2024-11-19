<template>
  <v-card>
    <v-row dense>
      <v-col cols="12">
        <v-card-title>
          <h6>ชื่อผู้ติดต่อ {{ props.index + 1 }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-6"
          density="compact"
          dense
          v-model="data_input.name"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Telephone {{ props.index + 1 }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-6"
          density="compact"
          dense
          v-model="data_input.phone"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="mt-n7">
        <v-card-title>
          <h6>Email {{ props.index + 1 }}</h6>
        </v-card-title>
        <v-text-field
          class="ml-6 mr-6"
          density="compact"
          dense
          v-model="data_input.email"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";

const emit = defineEmits(["on-input"]);

const props = defineProps({
  index: Number,
  name: String,
  phone: String,
  email: String,
});

const { index, name, phone, email } = toRefs(props);

const data_input = ref({
  index: index.value,
  name: name.value,
  phone: phone.value,
  email: email.value,
});

// Watch props to update data_input when props change
watch([name, phone, email], ([newName, newPhone, newEmail]) => {
  data_input.value = {
    index: index.value,
    name: newName,
    phone: newPhone,
    email: newEmail,
  };
});

// Emit updated data_input when it changes
watch(
  data_input,
  (newValue) => {
    emit("on-input", newValue);
  },
  { deep: true }
);
</script>
