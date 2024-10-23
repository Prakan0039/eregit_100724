import axiosBase from "./AxiosConfig";

const getUserSearch = async (offset = 0, limit = 1000, sort_by = "id:desc") => {
  return await axiosBase({
    method: "get",
    url: "/users/get-users", //?offset=0&limit=10&sort-by=id:desc
    params: {
      offset: offset,
      limit: limit,
      "sort-by": sort_by,
    },
  });
};

const getUserById = async (userId) => {
  return await axiosBase({
    method: "get",
    url: "/user/get-user/" + userId,
  });
};

const createdUser = async (
  p_email,
  p_memberTypeId,
  p_roleId,
  p_teamId,
  firstname = "",
  lastname
) => {
  return await axiosBase({
    method: "post",
    url: "/users/create-user",
    data: {
      email: p_email,
      member_type_id: p_memberTypeId,
      role_id: p_roleId,
      team_id: p_teamId,
      created_user_id: Number(sessionStorage.getItem("userId")),
      firstname,
      lastname,
      is_register: true,
    },
  });
};
const updatedUser = async (
  p_email,
  p_memberTypeId,
  p_roleId,
  p_teamId,
  _p_status
) => {
  return await axiosBase({
    method: "post",
    url: "/users/create-user",
    data: {
      email: p_email,
      firstname: null,
      lastname: null,
      is_register: true,
      is_active: _p_status,
      member_type_id: p_memberTypeId,
      role_id: p_roleId,
      team_id: p_teamId,
      updated_user_id: Number(sessionStorage.getItem("userId")),
    },
  });
};

const createMultipleUser = async (data = []) => {
  return await axiosBase({
    method: "post",
    url: "/user/create-multiple-user",
    data: {
      user: Array.from(data, (i) => {
        return {
          email: i.email,
          member_type: i.member_type,
          role: i.role,
          company_code: i.company_code.toString(),
          team: i.team,
        };
      }),
      created_user_id: Number(sessionStorage.getItem("userId")), //  mock id_user
    },
  });
};
const deactivateUser = async (data = []) => {
  return await axiosBase({
    method: "post",
    url: "/user/deactivate-user",
    data: {
      user: Array.from(data, (i) => {
        return {
          email: i.email,
        };
      }),
      updated_user_id: 16, //  mock
    },
  });
};

const downloadCreateMultipleUserTemplate = async () => {
  return await axiosBase({
    method: "get",
    url: "/user/download-create-multiple-user-template",
    data: {},
  });
};

const downloadDeactivateUserTemplate = async () => {
  return await axiosBase({
    method: "get",
    url: "/user/download-deactivate-user-template",
    data: {},
  });
};

export default {
  getUserSearch,
  downloadCreateMultipleUserTemplate,
  downloadDeactivateUserTemplate,
  createdUser,
  updatedUser,
  createMultipleUser,
  deactivateUser,
  getUserById,
};
