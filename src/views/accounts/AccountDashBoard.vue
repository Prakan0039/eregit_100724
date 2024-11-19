<template>
  <v-container>
    <v-row align="center" dense>
      <h2>Overview</h2>
      <!-- {{ vendorResidential }} -->
      <!-- Spacer pushes FilterAccountDashBoard to the right -->
      <v-spacer></v-spacer>
  
      <v-col cols="12" md="3">
        <FilterAccountDashBoard
          :date_from="filter.date_from"
          :date_to="filter.date_to"
          @date_from="filter.date_from = $event"
          @date_to="filter.date_to = $event"
          @search="onSearch"
        />
      </v-col>
    </v-row>
    <!-- <h2>Overview</h2> -->
    <div class="mt-5">
      <v-row>
        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Vendors
              </v-card-title>
              <v-card-actions>
                <h1 class="text-secondary font-weight-black pl-2" style="font-size: 55px;">{{vendorAmount}}</h1>
                &nbsp;
                &nbsp;
                <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div>
                <v-spacer></v-spacer>
                <!-- <v-chip color="red-lighten-1" class="rounded-pill">
                <v-icon color="error" icon="mdi mdi-account-multiple"  size="3em"></v-icon>
                </v-chip> -->
                <v-avatar color="red-lighten-4" size="50"
                  ><v-icon color="red-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar
                >
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Customer
              </v-card-title>
              <v-card-actions>
                <h1 class="text-orange font-weight-black pl-2" style="font-size: 55px;">{{customerAmount}}</h1>
                &nbsp;
                &nbsp;
                <div>
                  <br />
                  <span class="text-orange font-weight-black">cases</span>
                </div>
                <v-spacer></v-spacer>
                <v-avatar color="orange-lighten-4" size="50"
                  ><v-icon color="orange-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>


        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Extend Role
              </v-card-title>
              <v-card-actions>
                <h1 class="text-green font-weight-black pl-2" style="font-size: 55px;">{{extendRoleAmount}}</h1>
                &nbsp;
                &nbsp;
                <div>
                  <br />
                  <span class="text-green font-weight-black">cases</span>
                </div>
                <v-spacer></v-spacer>
                <v-avatar color="green-lighten-4" size="50"
                  ><v-icon color="green-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Chang Info.
              </v-card-title>
              <v-card-actions>
                <h1 class="font-weight-black text-blue pl-2" style="font-size: 55px;">{{changInfoAmount}}</h1>
                &nbsp;
                &nbsp;
                <div>
                  <br />
                  <span class="font-weight-black text-blue">cases</span>
                </div>
                <v-spacer></v-spacer>
                <!-- <v-chip color="blue-lighten-4"  rounded>
                <v-icon color="blue-darken-1" icon="mdi mdi-account-multiple" mandatory size="x-large"></v-icon>
                </v-chip> -->
            <v-avatar color="blue-lighten-4" size="50"
                  ><v-icon color="blue-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
          </div>
      <v-divider class="mt-5 mb-5"></v-divider>

    <h2>Bu's Vendor</h2>
    <div class="mt-2 pt-9">
      <v-row>
        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Home
              </v-card-title>
              <v-card-actions>
                <h1 class="text-secondary font-weight-black pl-2" style="font-size: 55px;">
                  {{vendorResidential}}

                </h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <!-- <v-chip color="red-lighten-1" class="rounded-pill">
                <v-icon color="error" icon="mdi mdi-account-multiple"  size="3em"></v-icon>
                </v-chip> -->
                <v-avatar color="red-lighten-4" size="50"
                  ><v-icon color="red-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar
                >
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Commercial
              </v-card-title>
              <v-card-actions>
                <h1 class="text-secondary font-weight-black pl-2" style="font-size: 55px;">
                  {{ vendorCommercial }}
                </h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <v-avatar color="red-lighten-4" size="50"
                  ><v-icon color="red-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Industrail
              </v-card-title>
              <v-card-actions>
                <h1 class="text-secondary font-weight-black pl-2" style="font-size: 55px;">{{vendorIndustrial}}</h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <v-avatar color="red-lighten-4" size="50"
                  ><v-icon color="red-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                FPHT
              </v-card-title>
              <v-card-actions>
                <h1 class="text-secondary font-weight-black pl-2" style="font-size: 55px;">{{vendorFpht}}</h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <!-- <v-chip color="blue-lighten-4"  rounded>
                <v-icon color="blue-darken-1" icon="mdi mdi-account-multiple" mandatory size="x-large"></v-icon>
                </v-chip> -->
            <v-avatar color="red-lighten-4" size="50"
                  ><v-icon color="red-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
          </div>
      <v-divider class="mt-5 mb-5"></v-divider>

    <h2>BU's Customer</h2>
    <div class="mt-2 pt-9">
      <v-row>
        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Home
              </v-card-title>
              <v-card-actions>
                <h1 class="text-orange font-weight-black pl-2" style="font-size: 55px;">
                    {{ customerResidential }}
                </h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-secondary font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <!-- <v-chip color="red-lighten-1" class="rounded-pill">
                <v-icon color="error" icon="mdi mdi-account-multiple"  size="3em"></v-icon>
                </v-chip> -->
                <v-avatar color="orange-lighten-4" size="50"
                  ><v-icon color="orange-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar
                >
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Commercial
              </v-card-title>
              <v-card-actions>
                <h1 class="text-orange font-weight-black pl-2" style="font-size: 55px;">{{customerCommercial}}</h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-orange font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <v-avatar color="orange-lighten-4" size="50"
                  ><v-icon color="orange-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>


        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                Industrail
              </v-card-title>
              <v-card-actions>
                <h1 class="text-orange font-weight-black pl-2" style="font-size: 55px;">{{customerIndustrial}}</h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-orange font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <v-avatar color="orange-lighten-4" size="50"
                  ><v-icon color="orange-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card class="mx-auto rounded-lg" elevation="5" height="135">
            <v-card-text>
              <v-card-title class="font-weight-black">
                FPHT
              </v-card-title>
              <v-card-actions>
                <h1 class="text-orange font-weight-black pl-2" style="font-size: 55px;">{{customerFpht}}</h1>
                &nbsp;
                &nbsp;
                <!-- <div>
                  <br />
                  <span class="text-orange font-weight-black">cases</span>
                </div> -->
                <v-spacer></v-spacer>
                <!-- <v-chip color="blue-lighten-4"  rounded>
                <v-icon color="blue-darken-1" icon="mdi mdi-account-multiple" mandatory size="x-large"></v-icon>
                </v-chip> -->
                <v-avatar color="orange-lighten-4" size="50"
                  ><v-icon color="orange-darken-1" icon="mdi mdi-account-multiple"  size="3em"></v-icon></v-avatar>
                &nbsp;
                &nbsp;
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
          </div>
      <v-divider class="mt-5 mb-5"></v-divider>


  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onMounted } from 'vue';
import PartnerService from "@/apis/PartnerServive";
import FilterAccountDashBoard from "@/components/forms/accounts/controls/FilterAccountDashBoard.vue";
// import PaginationControl from '@/components/controls/PaginationControl'
const filter = ref({
  date_from: null,
  date_to: null,
});
const loading = ref(false);
const extendRoleAmount = ref({});
const changInfoAmount = ref({});
const vendorAmount = ref({});
const customerAmount = ref({});

const customerCommercial = ref({});
const customerResidential = ref({});
const customerIndustrial = ref({});
const customerFpht = ref({});

const vendorCommercial = ref({});
const vendorResidential = ref({});
const vendorIndustrial = ref({});
const vendorFpht = ref({});

const onSearch = async () => {
  await getExtendRoleAmount();
  await getChangeInfoAmount();
  await getVendorAmount();
  await getCustomerAmount();
}


// const fav = ref(true)
// const menu = ref(false)
// const message = ref(false)
// const hints = ref(true)
// onMounted(() => {
//   getExtendRoleAmount();
//   getChangeInfoAmount();
//   getVendorAmount();
//   getCustomerAmount();

// });
onMounted(async () => {
  // loading.value = true;
  await getExtendRoleAmount();
   await getChangeInfoAmount();
   await getVendorAmount();
   await getCustomerAmount();
  // Promise.all([promise1, promise2, promise3, promise4]);
  // loading.value = false;
});

const getExtendRoleAmount = async () => {
  try {
    // loading.value = true;
    const response = await PartnerService.getExtendRoleAmount(
      filter.value.date_from,
      filter.value.date_to,

    );
    if (response.data?.is_success) {
      extendRoleAmount.value = response.data.data.extend_role_amount
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      return;
    }
  } finally {
    // loading.value = false;
  }
};

const getChangeInfoAmount = async () => {
  try {
    // loading.value = true;
    const response = await PartnerService.getChangeInfoAmount(
      filter.value.date_from,
      filter.value.date_to,

    );
    if (response.data?.is_success) {
      changInfoAmount.value = response.data.data.change_information_amount

    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      return;
    }
  } finally {
    // loading.value = false;
  }
};

const getVendorAmount = async () => {
  try {
    // loading.value = true;
    const response = await PartnerService.getVendorAmount(
      filter.value.date_from,
      filter.value.date_to,

    );
    if (response.data?.is_success) {
      vendorAmount.value = response.data.data.vendor_amount

      const commercialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 1);
      vendorCommercial.value = commercialUnit ? commercialUnit.bu_vendor_amount : 0;

      const residentialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 2);
      vendorResidential.value = residentialUnit ? residentialUnit.bu_vendor_amount : 0;

      const industrialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 3);
      vendorIndustrial.value = industrialUnit ? industrialUnit.bu_vendor_amount : 0;

      const fphtUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 4);
      vendorFpht.value = fphtUnit ? fphtUnit.bu_vendor_amount : 0;

    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      return;
    }
  } finally {
    // loading.value = false;
  }
};

const getCustomerAmount = async () => {
  try {
    // loading.value = true;
    const response = await PartnerService.getCustomerAmount(
      filter.value.date_from,
      filter.value.date_to,

    );
    if (response.data?.is_success) {
      customerAmount.value = response.data.data.customer_amount

      const commercialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 1);
      customerCommercial.value = commercialUnit ? commercialUnit.bu_customer_amount : 0;

      const residentialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 2);
      customerResidential.value = residentialUnit ? residentialUnit.bu_customer_amount : 0;

      const industrialUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 3);
      customerIndustrial.value = industrialUnit ? industrialUnit.bu_customer_amount : 0;

      const fphtUnit = response.data.data.business_unit.find(bu => bu.business_unit_id === 4);
      customerFpht.value = fphtUnit ? fphtUnit.bu_customer_amount : 0;

      
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      return;
    }
  } finally {
    loading.value = false;
  }
};
</script>

