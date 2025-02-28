import apiClient from "../apiClient";

import type { UserInfo } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}

export enum UserApi {
	List = "/user/list",
	Remove = "/user/delete",
	Logout = "/user/logout",
	Refresh = "/user/refresh",
	User = "/user",
}

const getUserList = () => apiClient.get<UserInfo[]>({ url: UserApi.List });
const removeUser = (id: string) => apiClient.delete({ url: `${UserApi.Remove}/${id}` });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	getUserList,
	removeUser,
	findById,
	logout,
};
