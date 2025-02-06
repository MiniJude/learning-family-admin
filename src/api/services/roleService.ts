import apiClient from "../apiClient";

import type { Role } from "#/entity";

const baseUrl = "/roles";

const getRoleList = () => apiClient.get<Role[]>({ url: baseUrl });
const createRole = (data: Role) => apiClient.post<Role>({ url: baseUrl, data });
const updateRole = (data: Partial<Role> & { id: string }) => apiClient.put<Role>({ url: baseUrl, data });
const deleteRole = (id: string) => apiClient.delete({ url: `${baseUrl}/${id}` });
const getRoleById = (id: string) => apiClient.get<Role>({ url: `${baseUrl}/${id}` });

export default {
	getRoleList,
	createRole,
	updateRole,
	deleteRole,
	getRoleById,
};
