// 登陆接口请求数据类型
export type loginForm = {
    username: string,
    password: string
};

// 登陆接口返回数据类型
type dataType = {
    token: string
};
export type loginResponseData = {
    code: number,
    data: dataType
};

// 用户信息接口返回数据类型
type userType = {
    userId: number,
    username: string,
    avatar: string,
    password: string,
    desc: string,
    roles: string[],
    buttons: string[],
    routers: string[],
    token: string
};
export type userInfoResponseData = {
    code: number,
    data: userType
};