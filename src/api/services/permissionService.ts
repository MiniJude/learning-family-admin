import apiClient from "../apiClient";

import type { Permission } from "#/entity";

export enum PermissionApi {
	List = "/permission/list",
}

const getPermissionList = () => apiClient.get<Permission[]>({ url: PermissionApi.List });

export default {
	getPermissionList,
};
