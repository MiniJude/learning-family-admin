import apiClient from "../apiClient";

import type { UserInfo, UserToken } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum AuthApi {
	SignIn = "/auth/signin",
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: AuthApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: AuthApi.SignUp, data });
const logout = () => apiClient.get({ url: AuthApi.Logout });

export default {
	signin,
	signup,
	logout,
};
