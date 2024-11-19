<template>
   <div>
    <v-card class="mx-auto elevation-1" color="secondary">
      <v-card-item>
        <v-row align-center>
          <v-col cols="2">
            <strong>Emailsdd</strong>
          </v-col>
          <v-col cols="2">
            <strong>Status User</strong>
          </v-col>
          <v-col cols="4">
            <strong>Company</strong>
          </v-col>
          <v-col cols="2">
            <strong>Role</strong>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>


    <!-- <v-expansion-panels v-model="panel" class="mt-1">
    <v-progress-linear
        class="rounded-pill"
        :indeterminate="loading"
        bg-color="transparent"
        color="secondary"
      ></v-progress-linear>
      <v-expansion-panel v-for="(i, index) in props.items" :key="index" class="mt-1"
        :style="index === panel ? 'border: 2px solid red;' : ''">
        <v-expansion-panel-title :color="index === panel ? '#FFF1F0' : ''"> -->
          <!-- <template v-slot:actions="{ expanded }">
            <v-icon color="secondary" :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
          </template> -->
          <v-card v-for="(i, index) in props.items" :key="index" class="mt-2 pa-4 ma-0">
          <v-row no-gutters dense justify="space-around" >

            <v-col cols="2" align-self="center">
               <span class="font-weight-bold">{{i.user.email}}</span>
            </v-col>
            <v-col cols="2" align-self="center">
              <Active :value="i.is_active" />
            </v-col>
            <v-col cols="4" align-self="center">
              <span class="font-weight-bold"> {{i.team?.company?.name_th}}</span>
            </v-col>
            <v-col cols="2" align-self="center">
                <Role  :value="i.role?.name" />
            </v-col>
            <v-col cols="2" align-self="center">
              <v-btn class="me-2 text-none font-weight-bold" color="secondary" variant="flat" rounded @click="handleEditEvent(i)">
                แก้ไข
              </v-btn>
            </v-col>
          </v-row>
           </v-card>
<!-- </v-card>
        </v-expansion-panel-title>
      </v-expansion-panel>
    </v-expansion-panels> -->
   </div>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, onMounted } from 'vue';
import { defineProps } from 'vue';
import Active from '@/components/status/Active'
import Role from '@/components/status/Role'
// import dateUtils from "@/utils/dateUtils";

const emit = defineEmits(["action-edit"]);
const props = defineProps({
  items: {
    type: Array,
    default: ()=> []
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 400
  }
});
// const panel= ref([]);

const  handleEditEvent=(item)=> {
      emit("action-edit",item)
}
</script>



