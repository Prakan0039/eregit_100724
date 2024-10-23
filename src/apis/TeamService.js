import axiosBase from "./AxiosConfig";
const getTeamAll = async (offset = 0, limit = 1000, sort_by = "id:desc") => {
  return await axiosBase({
    method: "get",
    url: "/master/get-teams",
    params: {
      offset: offset,
      limit: limit,
      "sort-by": sort_by,
    },
  });
};
const getTeamById = async (teamId) => {
  return await axiosBase({
    method: "get",
    url: `/master/get-team/${teamId}`,
    data: {},
  });
};

const createdTeam = async (company_id, name_th, name_en) => {
  return await axiosBase({
    method: "post",
    url: "/master/create-team",
    data: {
      company_id: company_id,
      name_th: name_th,
      name_en: name_en,
      created_user_id: Number(sessionStorage.getItem("userId")),
    },
  });
};

const updatedTeamById = async (
  team_id,
  company_id,
  name_th,
  name_en,
  is_active = true
) => {
  return await axiosBase({
    method: "post",
    url: "/master/update-team",
    data: {
      team_id: Number(team_id),
      company_id: company_id,
      name_th,
      name_en,
      is_active,
      updated_user_id: Number(sessionStorage.getItem("userId")),
    },
  });
};

const deleteTeamById = async (team_id) => {
  return await axiosBase({
    method: "delete",
    url: "/master/delete-team/" + team_id,
  });
};
export default {
  getTeamAll,
  getTeamById,
  createdTeam,
  updatedTeamById,
  deleteTeamById,
};
