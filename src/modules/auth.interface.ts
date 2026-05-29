export interface ISignup {
    id?:string;
    name:string;
    email:string;
    password:string;
    role:"maintainer" | "contributor";
};

export interface ILogin {
    email:string;
    password:string;
    role:"maintainer" | "contributor";
};