import apiClient from "../apiClient";

import type { UserInfo } from "#/entity";

export enum UserApi {
	List = "/user/list",
	Remove = "/user/delete",
	Create = "/user/create",
	Update = "/user/update",
}

const getUserList = () => apiClient.get<UserInfo[]>({ url: UserApi.List });
const removeUser = (id: string) => apiClient.delete({ url: `${UserApi.Remove}/${id}` });
const createUser = (data: Partial<UserInfo>) => apiClient.post({ url: UserApi.Create, data });
const updateUser = (id: string, data: Partial<UserInfo>) => apiClient.patch({ url: `${UserApi.Update}/${id}`, data });

export default {
	getUserList,
	removeUser,
	createUser,
	updateUser,
};
