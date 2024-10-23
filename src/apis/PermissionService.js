import axiosBase from "./AxiosConfig";
const getPermissionAll = async () => {
  return await axiosBase({
    method: "get",
    url: `/master/get-role-permissions`,
  });
};

const getPermissionByRoleId = async (roleId) => {
  return await axiosBase({
    method: "get",
    url: `/master/get-role-permissions/${roleId}`,
  });
};

const transformData = (originalData) => {
  return {
    module: originalData.map((mod) => ({
      id: mod.module_id, // Set id dynamically to module_id
      action: mod.action.map((act) => ({
        id: act.action_id, // Set id dynamically to action_id
      })),
    })),
  };
};
const updatedPermissionById = async (role_id, modules = []) => {
  return await axiosBase({
    method: "post",
    url: "/master/update-role-permission",
    data: {
      role_id: role_id ? Number(role_id) : null,
      module: transformData(modules).module,
      updated_user_id: Number(sessionStorage.getItem("userId")),
    },
  });
};

export default {
  getPermissionAll,
  getPermissionByRoleId,
  updatedPermissionById,
};
