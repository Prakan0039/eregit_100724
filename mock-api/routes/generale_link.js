/* eslint-disable no-undef */

module.exports = (app) => {
  app.post(
    "/partner/create-business-partner-register-form",
    async (req, res) => {
      res.json({
        is_success: true,
        code: "201",
        message: "Ok",
        data: {
          id: 6,
          form_number: "{valid_form_number}",
          taxpayer_number_id: "30001",
          name_th: "ลม",
          name_en: "LM",
          form_status_id: 1,
          form_status: "{valid form_status object}",
          business_partner_role: "{valid business_partner_role object}",
          fill_type: "{valid fill_type object}",
          company: "{valid company object}",
          employee_type: "{valid employee_type object}",
          payment_term: "{valid payment_term object}",
          registered_user_email: "co1@co.co",
          created_at: "2023-11-28T15:41:15.572Z",
          created_user_id: 1,
          updated_at: "2023-11-28T15:43:15.907Z",
          updated_user_id: 1,
        },
      });
    }
  );
};
