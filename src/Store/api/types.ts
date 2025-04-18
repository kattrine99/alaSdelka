export interface RegistrationUserPayload {
    name: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export interface RegistrationUserResponse {
    message: string;
    user: {
        id: number;
        name: string;
        phone: string;
    };
}

export interface LoginUserPayload {
    phone: string;
    password: string;
}

export interface LoginUserResponse {
    message: string;
    access_token: string;
    expires_in: number;
    user: {
        id: number;
        name: string;
        phone: string;
    };
}

export interface GetUserByIdResponse {
    id: number;
    name: string;
    phone: string;
}

export interface SendCodeResponse {
    message: string;
}

export interface VerifyCodePayload {
    phone: string;
    code: string;
}

export interface VerifyCodeResponse {
    message: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: number;
        name: string;
        phone: string;
        email: string;
        photo: string;
    };
}
export interface GetUserInfoResponse {
    city_id: number;
    id: number;
    name: string;
    phone: string;
    email: string;
    photo: string;
}

export interface UpdateUserInfoResponse {

    id: number;
    name: string;
    phone: string;
    email: string;
    photo: string | File;
    city_id: number;

}