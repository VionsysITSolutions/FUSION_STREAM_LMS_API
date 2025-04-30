export type IHttpResponse = {
    success: boolean;
    statusCode: number;
    request: {
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
};

export type IHttpError = {
    success: boolean;
    statusCode: number;
    request: {
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
    trace?: object | null;
};

export type JwtPayload = {
    id: number;
    role: string;
    iat: number;
    exp: number;
};
