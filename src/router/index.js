/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/Error/:err?",
    name: "ErrorPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/Error.vue"),
  },
  {
    path: "/disclosure-form-non",
    name: "NonDisclosure",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Disclosure/NonDisclosure.vue"),
  },

  // {
  //   path: "/CompleteProfilePage",
  //   name: "CompleteProfilePage",
  //   meta: {
  //     requiresAuth: false,
  //     module_id: null,
  //   },
  //   component: () =>
  //     import("@/views/company-managements/CompleteProfilePage.vue"),
  // },

  // {
  //   path: "/SDTeamMangement/Survey/NonDocument/1",
  //   name: "SurveyDocumentFirstPage",
  //   meta: {
  //     requiresAuth: false,
  //     module_id: null,
  //   },
  //   component: () =>
  //     import("@/views/SDTeamMangement/SurveyQuestion/DocumentFirst.vue"),
  // },
  // {
  //   path: "/ShareMultiVandor",
  //   name: "ShareMultiVandor",
  //   meta: {
  //     requiresAuth: false,
  //     module_id: null,
  //   },
  //   component: () => import("@/views/BusinessPartner/shareLinkMultipleVendor.vue"),
  // },

  {
    path: "/term-condition",
    name: "TermCondition",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/TermCondition/Termandodition.vue"),
  },
  {
    path: "/bp-number",
    name: "BpnumberLogIn",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/BpDashBoard/BpnumberLogIn.vue"),
  },

  {
    path: "/log-out",
    name: "Logout",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/Logout.vue"),
  },
  {
    path: "/register-form",
    name: "CompanyMgmtLogIn",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/CompanyMgmt/CompanyMgmtLogIn.vue"),
  },
  {
    path: "/register-form-otp",
    name: "CompanyMgmtOTP",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/CompanyMgmt/CompanyMgmtOTP.vue"),
  },
  {
    path: "/register-form-non",
    name: "CompanyManagementNon",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/company-managements/CompanyManagementNon.vue"),
  },
  {
    path: "/disclosure-form",
    name: "DisclosuresLogIn",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/Disclosures/DisclosuresLogIn.vue"),
  },
  {
    path: "/disclosure-form-otp",
    name: "DisclosuresOTP",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/Disclosures/DisclosuresOTP.vue"),
  },

  {
    path: "/bp-number-form-otp",
    name: "BpnumberOTP",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () =>
      import("@/views/Login/Sub-Login/BpDashBoard/BpnumberOTP.vue"),
  },

  {
    path: "/SignIn",
    name: "SignInPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/LoginPage.vue"),
  },
  {
    path: "/SignUp",
    name: "SignUpPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/SignUpPage.vue"),
  },
  {
    path: "/SignUpOTP",
    name: "SignUpOtpPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/SignUpOtpPage.vue"),
  },
  {
    path: "/LoginOtpPage",
    name: "LoginOtpPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/LoginOtpPage.vue"),
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPasswordPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/ForgetPasswordPage.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPasswordPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/NewPassword.vue"),
  },
  {
    path: "/Authorization",
    name: "AuthorizationPage",
    meta: {
      requiresAuth: false,
      module_id: null,
    },
    component: () => import("@/views/Login/Authorization.vue"),
  },
  {
    path: "/",
    component: () => import("@/layouts/AppDefault.vue"),
    children: [
      {
        path: "/",
        name: "HomePage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "/ListRolesPage",
        name: "ListRolesPage",
        meta: {
          requiresAuth: true,
          module_id: 16,
        },
        component: () => import("@/views/rules/ListRolesPage.vue"),
      },
      {
        path: "/UserManagement",
        name: "UserManagement",
        meta: {
          requiresAuth: true,
          module_id: 10,
        },
        component: () => import("@/views/UserMangement/UserMangementPage.vue"),
      },

      {
        path: "/ShareMultiVandor",
        name: "ShareMultiVandor",
        meta: {
          requiresAuth: false,
          module_id: null,
        },
        component: () =>
          import("@/views/BusinessPartner/ShareLinkMultipleVendor.vue"),
      },

      // {
      //   path: "/HistoryUserPage",
      //   name: "HistoryUserPage",
      //   meta: {
      //     requiresAuth: true,
      //     module_id: null,D
      //   },
      //   component: () => import("@/views/HistoryLog/HistoryUserPage.vue"),
      // },
      {
        path: "/CreateRolePage/:role_id?",
        name: "CreateRolePage",
        meta: {
          requiresAuth: true,
          module_id: 16,
        },
        component: () => import("@/views/rules/CreateRolePage.vue"),
      },
      {
        path: "/HistoryTable",
        name: "HistoryTable",
        meta: {
          requiresAuth: true,
          module_id: 16,
        },
        component: () => import("@/components/tables/HistoryTable.vue"),
      },
      {
        path: "/MasterTable",
        name: "MasterTable",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/components/tables/MasterTable.vue"),
      },
      {
        path: "/HistoryRolePage",
        name: "HistoryRolePage",
        meta: {
          requiresAuth: true,
          module_id: 16,
        },
        component: () => import("@/views/historyLog/HistoryRolePage.vue"),
      },
      {
        path: "/MasterDataManagement",
        name: "MasterDataManagement",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/master-data/MasterDataManagement.vue"),
      },
      {
        path: "/CorparationDetail/:id?",
        name: "CorparationDetail",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () =>
          import("@/views/master-data/details/CorparationDetail.vue"),
      },
      {
        path: "/BusinessUnitDetail/:id?",
        name: "BusinessUnitDetail",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () =>
          import("@/views/master-data/details/BusinessUnitDetail.vue"),
      },
      {
        path: "/CompanyDetail/:id?",
        name: "CompanyDetail",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () =>
          import("@/views/master-data/details/CompanyDetail.vue"),
      },
      {
        path: "/MasterDataManagement/TeamManagement/:id?",
        name: "TeamManagement",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/master-data/TeamManagement.vue"),
      },
      {
        path: "/HistoryTeamPage",
        name: "HistoryTeamPage",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/historyLog/HistoryTeamPage.vue"),
      },
      {
        path: "/HistoryCompanyPage",
        name: "HistoryCompanyPage",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/historyLog/HistoryCompanyPage.vue"),
      },
      {
        path: "/HistoryBusinessPage",
        name: "HistoryBusinessPage",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/historyLog/HistoryBusinessPage.vue"),
      },

      {
        path: "/HistoryCoparationPage",
        name: "HistoryCoparationPage",
        meta: {
          requiresAuth: true,
          module_id: 11,
        },
        component: () => import("@/views/historyLog/HistoryCoparationPage.vue"),
      },

      {
        path: "/SDTeamMangement/SDActiveMangement",
        name: "SDActiveMangementPage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () =>
          import("@/views/SDTeamMangement/SDActiveMangement.vue"),
      },
      {
        path: "/SDTeamMangement/RspPolicies",
        name: "RspPolicyPage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () => import("@/views/SDTeamMangement/RspPolicies.vue"),
      },

      {
        path: "/SDTeamMangement/RspPolicyUpsert",
        name: "RspPolicyUpsertPage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () => import("@/views/SDTeamMangement/RspPolicyUpsert.vue"),
      },

      // {
      //   path: "/SDTeamMangement/RspPolicyUploaded",
      //   name: "RspPolicyUploadedPage",
      //   meta: {
      //     requiresAuth: true,
      //     module_id: null,
      //   },
      //   component: () =>
      //     import("@/views/SDTeamMangement/RspPolicyUploaded.vue"),
      // },
      {
        path: "/SDTeamMangement/Survey",
        name: "SurveyPage",
        meta: {
          requiresAuth: true,
          module_id: 16,
        },
        component: () => import("@/views/SDTeamMangement/Survey.vue"),
      },

      {
        path: "/SDTeamMangement/Survey/Created",
        name: "SurveyCreatePage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () => import("@/views/SDTeamMangement/SurveyCreate.vue"),
      },
      ////////
      {
        path: "/SDTeamMangement/Survey/Preview/QuestionSecond",
        name: "SurveyPreviewSecondPage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyPreview/QuestionSecond.vue"),
      },

      {
        path: "/SDTeamMangement/Survey/Preview/QuestionThird",
        name: "SurveyPreviewThirdPage",
        meta: {
          requiresAuth: true,
          module_id: 19,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyPreview/QuestionThird.vue"),
      },

      ///////////////////
      {
        path: "/SDTeamMangement/Traning",
        name: "TraningPage",
        meta: {
          requiresAuth: true,
          module_id: 18,
        },
        component: () => import("@/views/SDTeamMangement/Traning.vue"),
      },

      {
        path: "/SDTeamMangement/TraningUpsert",
        name: "TraningUpsertPage",
        meta: {
          requiresAuth: true,
          module_id: 18,
        },
        component: () => import("@/views/SDTeamMangement/TraningUpsert.vue"),
      },

      // {
      //   path: "/SDTeamMangement/TraningCreated",
      //   name: "TraningCreatedPage",
      //   meta: {
      //     requiresAuth: true,
      //     module_id: null,
      //   },
      //   component: () => import("@/views/SDTeamMangement/TraningCreated.vue"),
      // },

      //AdminDashBoard
      {
        path: "/AdminDashboard/AdminDashboardPage",
        name: "AdminDashboardPage",
        meta: {
          requiresAuth: true,
          module_id: 2,
        },
        component: () =>
          import("@/views/AdminDashboard/AdminDashboardPage.vue"),
      },

      //SD_DashBoardPage
      {
        path: "/SDTeamDashboard/TrackingSDActivite",
        name: "TrackingSDActivitePage",
        meta: {
          requiresAuth: true,
          module_id: 18,
        },
        component: () =>
          import("@/views/SDTeamDashboard/TrackingSDActivite.vue"),
      },
      {
        path: "/SDTeamDashboard/FollowUp/:owner?/:vendor?",
        name: "FollowUpPage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/SDTeamDashboard/FollowUp.vue"),
      },

      {
        path: "/Admin/FollowUp/:owner?/:vendor?",
        name: "AdminFollowUpPage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/SDTeamDashboard/AdminFollowUp.vue"),
      },

      {
        path: "/SDTeamDashboard/Documents",
        name: "DocumentsPage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/SDTeamDashboard/Documents.vue"),
      },
      {
        path: "/SDTeamDashboard/AttachFileSurvey",
        name: "AttachFileSurveyPage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/SDTeamDashboard/AttachFileSurvey.vue"),
      },

      {
        path: "/SDTeamDashboard/Documents/:bp_number?",
        name: "DocumentsPage",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/SDTeamDashboard/Documents.vue"),
      },

      {
        path: "/Account/AccountTask",
        name: "AccountManagement",
        meta: {
          requiresAuth: true,
          module_id: 4,
        },
        component: () => import("@/views/accounts/AccountManagement.vue"),
      },
      //Account
      {
        path: "/Account/AccountDetail/:id?",
        name: "AccountDetail",
        meta: {
          requiresAuth: true,
          module_id: 4,
        },
        component: () => import("@/views/accounts/AccountDetail.vue"),
      },
      //business
      {
        path: "/BusinessPartner/BusinessPartnerList",
        name: "BusinessPartnerList",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () =>
          import("@/views/BusinessPartner/BusinessPartnerList.vue"),
      },
      {
        path: "/BusinessPartner/SearchBusinessPartner",
        name: "SearchBusinessPartner",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () =>
          import("@/views/BusinessPartner/SearchBusinessPartner.vue"),
      },
      {
        path: "/BusinessPartner/CreateBusinessPartner",
        name: "CreateBusinessPartner",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () =>
          import("@/views/BusinessPartner/CreateBusinessPartner.vue"),
      },
      {
        path: "/BusinessPartner/ChangInfo",
        name: "ChangInfo",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/BusinessPartner/ChangInfo.vue"),
      },
      ///ExtendCompany
      {
        path: "/BusinessPartner/ExtendCompany",
        name: "ExtendCompany",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/BusinessPartner/ExtendCompany.vue"),
      },

      {
        path: "/BusinessPartner/CustomerVendor",
        name: "CustomerVendor",
        meta: {
          requiresAuth: true,
          module_id: null,
        },
        component: () => import("@/views/BusinessPartner/CustomerVendor.vue"),
      },
      {
        path: "/BusinessPartner/VandorCustomer",
        name: "VandorCustomer",
        meta: {
          requiresAuth: true,
          module_id: null,
        },
        component: () => import("@/views/BusinessPartner/VandorCustomer.vue"),
      },
      ////

      {
        path: "/BusinessPartner/ExtendRole",
        name: "ExtendRole",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/BusinessPartner/ExtendRole.vue"),
      },
      {
        path: "/BusinessPartner/AttachedDocument/:id?",
        name: "AttachedDocument",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/BusinessPartner/AttachedDocument.vue"),
      },

      {
        path: "/accounts/AccountDashBoard",
        name: "AccountDashBoard",
        meta: {
          requiresAuth: true,
          module_id: 3,
        },
        component: () => import("@/views/accounts/AccountDashBoard.vue"),
      },

      {
        path: "/accounts/extendcompany",
        name: "AccountExtendCompany",
        meta: {
          requiresAuth: true,
          module_id: 4,
        },
        component: () =>
          import("@/views/accounts/type-account/AccountExtendCompany.vue"),
      },

      {
        path: "/accounts/AccountChangeInfo",
        name: "AccountChangeInfo",
        meta: {
          requiresAuth: true,
          module_id: 4,
        },
        component: () =>
          import("@/views/accounts/type-account/AccountChangeInfor.vue"),
      },

      {
        path: "/accounts/extendrole",
        name: "AccountExtendRole",
        meta: {
          requiresAuth: true,
          module_id: 4,
        },
        component: () =>
          import("@/views/accounts/type-account/AccountExtendRole.vue"),
      },

      {
        path: "/MemberManagementPage",
        name: "MemberManagementPage",
        meta: {
          requiresAuth: true,
          module_id: 9,
        },
        component: () =>
          import("@/views/MemberManagement/MemberManagementPage.vue"),
      },
      {
        path: "/GenerateLinkPage",
        name: "GenerateLinkPage",
        meta: {
          requiresAuth: false,
          module_id: 1,
        },
        component: () => import("@/views/GenerateLink/GenerateLinkPage.vue"),
      },

      {
        path: "/VendorDashBoard",
        name: "VandorDashboardPage",
        meta: {
          requiresAuth: true,
          module_id: 5,
        },
        component: () =>
          import("@/views/VandorDashboard/VandorDashboardPage.vue"),
      },

      {
        path: "/CompanyManagement",
        name: "CompanyManagement",
        meta: {
          requiresAuth: false,
          module_id: 1,
        },
        component: () =>
          import("@/views/company-managements/CompanyManagement.vue"),
      },

      {
        path: "/CompleteProfilePage",
        name: "CompleteProfilePage",
        meta: {
          requiresAuth: false,
          module_id: 1,
        },
        component: () =>
          import("@/views/company-managements/CompleteProfilePage.vue"),
      },

      {
        path: "/DisclosureManagement",
        name: "DisclosureManagement",
        meta: {
          requiresAuth: true,
          module_id: 1,
        },
        component: () => import("@/views/Disclosure/DisclosurePage.vue"),
      },

      // Question
      {
        path: "/SDTeamMangement/Survey/Document/1",
        name: "SurveyDocumentFirstPage",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/DocumentFirst.vue"),
      },

      {
        path: "/SDTeamMangement/Survey/Document/2",
        name: "SurveyDocumentSecondPage",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/DocumentSecond.vue"),
      },
      {
        path: "/SDTeamMangement/Survey/Questionnaire/1",
        name: "SurveyQuestionnaire1Page",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/QuestionFirst.vue"),
      },
      {
        path: "/SDTeamMangement/Survey/Questionnaire/2",
        name: "SurveyQuestionnaire2Page",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/QuestionSecond.vue"),
      },
      {
        path: "/SDTeamMangement/TraningSecord",
        name: "TraningSecord",
        meta: {
          requiresAuth: false,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/TraningSecord.vue"),
      },
      {
        path: "/SDTeamMangement/Survey/Questionnaire/3",
        name: "SurveyQuestionnaire3Page",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/QuestionThird.vue"),
      },
      {
        path: "/SDTeamMangement/Survey/Tranning/:bp_number?",
        name: "TranningFirstPage",
        meta: {
          requiresAuth: false,
          module_id: 7,
        },
        component: () =>
          import("@/views/SDTeamMangement/SurveyQuestion/TranningFirst.vue"),
      },
      {
        path: "/CreditScorePage",
        name: "CreditScorePage",
        meta: {
          requiresAuth: true,
          module_id: 7,
        },
        component: () =>
          import("@/views/sd-team-credit-score/CreditScorePage.vue"),
      },

      {
        path: "/TestWork",
        name: "TestWork",
        component: () => import("@/views/Disclosure/TestWork.vue"),
      },
      {
        path: "/LogOut",
        name: "LogOut",
        component: () => import("@/views/Disclosure/LogOut.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const routeExists = (routes, path) => {
  return routes.some((route) => {
    if (route.path === path) {
      return true;
    }
    if (route.children) {
      return routeExists(route.children, path);
    }
    return false;
  });
};

router.beforeEach((to, from, next) => {
  // const fullPath = to.fullPath;
  // console.log(!routeExists(routes, fullPath));
  // if (!routeExists(routes, fullPath)) {
  //   // next("/Error?err=NOT_FOUND");
  //   return;
  // }
  if (to.meta.requiresAuth) {
    let module = sessionStorage.getItem("auth_modules");
    console.log("moduleeeeeee", module);
    if (module === null || module === undefined || module === "") {
      next("/SignIn");
    }
    if (module !== null || module !== undefined || module !== "") {
      const modules = JSON.parse(module);
      const toModuleId = to.meta.module_id;
      console.log("toModuleIdooo", toModuleId);
      console.log("modulespppp", modules);
      const allowed = modules.includes(toModuleId);
      if (!allowed) {
        next("/Error?err=NOT_FOUNDsss");
      }
    }
  }
  next();
});

export default router;
