import { defineStore } from "pinia";
import OtherService from "@/apis/OtherService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

export const useMyAddressStore = defineStore("ADDRESS_STORE", {
  state: () => ({
    provinces: [],
    districts: [],
    subDistricts: [],
    postCodes: [],
  }),
  actions: {
    async getProvince() {
      try {
        this.provinces = [];
        const response = await OtherService.getProviceAll();
        if (response.data?.is_success) {
          this.provinces = response.data.data;
        } else {
          this.provinces = [];
        }
      } catch (e) {
        if (e.response) {
          this.provinces = [];
          const val = e.response.data;
          handlingErrorsMessage(val.message, val?.data.error);
          return;
        }
        this.provinces = [];
        handlingErrorsMessage("unknown", e.message);
      }
    },

    async getDistrict(provice_id) {
      try {
        this.districts = [];
        const response = await OtherService.getDistrictAll(provice_id);
        if (response.data?.is_success) {
          this.districts = response.data.data;
        } else {
          this.districts = [];
        }
      } catch (e) {
        if (e.response) {
          this.districts = [];
          const val = e.response.data;
          handlingErrorsMessage(val.message, val?.data.error);
          return;
        }
        this.districts = [];
        handlingErrorsMessage("unknown", e.message);
      }
    },

    async getSubDistrict(district_id) {
      try {
        this.subDistricts = [];
        const response = await OtherService.getSubDistrictAll(district_id);
        if (response.data?.is_success) {
          this.subDistricts = response.data.data;
        } else {
          this.subDistricts = [];
        }
      } catch (e) {
        if (e.response) {
          this.subDistricts = [];
          const val = e.response.data;
          handlingErrorsMessage(val.message, val?.data.error);
          return;
        }
        this.subDistricts = [];
        handlingErrorsMessage("unknown", e.message);
      }
    },

    async getPostCode(subdistrict_id) {
      try {
        this.postCodes = [];
        const response = await OtherService.getPostalCodeAll(subdistrict_id);
        if (response.data?.is_success) {
          this.postCodes = response.data.data;
        } else {
          this.postCodes = [];
        }
      } catch (e) {
        if (e.response) {
          this.postCodes = [];
          const val = e.response.data;
          handlingErrorsMessage(val.message, val?.data.error);
          return;
        }
        this.postCodes = [];
        handlingErrorsMessage("unknown", e.message);
      }
    },

    // async getProvince() {
    //   try {
    //     const response = await OtherService.getProviceAll();
    //     if (response.data?.is_success) {
    //       this.provinces = response.data.data;
    //     }
    //   } catch (e) {
    //     if (e.response) {
    //       const val = e.response.data;
    //       handlingErrorsMessage(val.message, val?.data.error);
    //       return;
    //     }
    //     handlingErrorsMessage("unknown", e.message);
    //   }
    // },

    // async getDistrict() {
    //   try {
    //     this.districts = []; // Ensure districts is empty before starting.
    //     const limit = 100; // Number of items per query.
    //     const queries = 9; // Number of times to query.

    //     for (let i = 0; i < queries; i++) {
    //       const offset = i * limit;
    //       // Assuming OtherService.getDistrictAll can accept parameters for pagination.
    //       const response = await OtherService.getDistrictAll(limit, offset);

    //       if (response.data?.is_success) {
    //         this.districts = this.districts.concat(response.data.data);
    //       } else {
    //         // Handle case where is_success is false.
    //         handlingErrorsMessage(
    //           "Failed to fetch data",
    //           response.data?.message
    //         );
    //         return; // Exit if there's an error or consider how you want to handle partial data.
    //       }
    //     }
    //   } catch (e) {
    //     if (e.response) {
    //       const val = e.response.data;
    //       handlingErrorsMessage(val.message, val?.data.error);
    //       return;
    //     }
    //     handlingErrorsMessage("Unknown error", e.message);
    //   }
    // },

    // async getSubDistrict() {
    //   try {
    //     this.subDistricts = []; // Ensure subDistricts is empty before starting.
    //     const limit = 2000; // Number of items per query.
    //     const queries = 4; // Number of times to query.

    //     for (let i = 0; i < queries; i++) {
    //       const offset = i * limit;
    //       // Assuming OtherService.getDistrictAll can accept parameters for pagination.
    //       const response = await OtherService.getSubDistrictAll(limit, offset);

    //       if (response.data?.is_success) {
    //         this.subDistricts = this.subDistricts.concat(response.data.data);
    //       } else {
    //         // Handle case where is_success is false.
    //         handlingErrorsMessage(
    //           "Failed to fetch data",
    //           response.data?.message
    //         );
    //         return; // Exit if there's an error or consider how you want to handle partial data.
    //       }
    //     }
    //   } catch (e) {
    //     if (e.response) {
    //       const val = e.response.data;
    //       handlingErrorsMessage(val.message, val?.data.error);
    //       return;
    //     }
    //     handlingErrorsMessage("Unknown error", e.message);
    //   }
    // },

    // async getPostCode() {
    //   try {
    //     this.postCodes = []; // Ensure postCodes is empty before starting.
    //     const limit = 2000; // Number of items per query.
    //     const queries = 5; // Number of times to query.

    //     for (let i = 0; i < queries; i++) {
    //       const offset = i * limit;
    //       // Assuming OtherService.getDistrictAll can accept parameters for pagination.
    //       const response = await OtherService.getPostalCodeAll(limit, offset);

    //       if (response.data?.is_success) {
    //         this.postCodes = this.postCodes.concat(response.data.data);
    //       } else {
    //         // Handle case where is_success is false.
    //         handlingErrorsMessage(
    //           "Failed to fetch data",
    //           response.data?.message
    //         );
    //         return; // Exit if there's an error or consider how you want to handle partial data.
    //       }
    //     }
    //   } catch (e) {
    //     if (e.response) {
    //       const val = e.response.data;
    //       handlingErrorsMessage(val.message, val?.data.error);
    //       return;
    //     }
    //     handlingErrorsMessage("Unknown error", e.message);
    //   }
    // },
  },
});
