export interface IIssue {
    id?:number;
    title:string;
    description:string;
    type:string;
    status:string;
    reported_id?:number;
};