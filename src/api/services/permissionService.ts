import apiClient from "../apiClient";

import type { Permission } from "#/entity";

export enum PermissionApi {
	List = "/permission/list",
	Create = "/permission/create",
	Update = "/permission/update",
	Delete = "/permission/delete",
}

const getPermissionList = () => apiClient.get<Permission[]>({ url: PermissionApi.List });
const createPermission = (data: Permission) => apiClient.post<Permission>({ url: PermissionApi.Create, data });
const updatePermission = (data: Partial<Permission> & { id: string }) =>
	apiClient.put<Permission>({ url: PermissionApi.Update, data });
const deletePermission = (id: string) => apiClient.delete({ url: PermissionApi.Delete, data: { id } });

export default {
	getPermissionList,
	createPermission,
	updatePermission,
	deletePermission,
};
