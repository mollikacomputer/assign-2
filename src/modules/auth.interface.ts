export interface ISignup {
    id?:string;
    name:string;
    email:string;
    password:string;
    role:"maintainer" | "contributor";
}