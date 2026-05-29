import { pool } from "../../db";
import type { IIssue } from "./issues.interface";

const createIssueIntoDB = async (payLoad: IIssue) => {
    const {id, title, description, status, type, reported_id } = payLoad;

    // check user exists
    const user = await pool.query(
        `SELECT * FROM users WHERE id=$1`,
        [reported_id]
    );

    if (user.rows.length === 0) {
        throw new Error("User Not Found invalid credentials");
    }

    // insert issue
    const result = await pool.query(
        `
        INSERT INTO issues
        (id, title, description, status, type, reported_id)
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [id, title, description, status, type, reported_id]
    );

    return result.rows[0];
};

export const issueService = {
    createIssueIntoDB,
}

// import { pool } from "../../db";
// import type { IIssue } from "./issues.interface";


// //-----start create issueIntoDB---
// const createIssueIntoDB = async(payLoad:IIssue)=>{
//     const {id, title, description, status, type, reported_id} = payLoad;

//     const user = await pool.query(`
//         SELECT * FROM users WHERE id=$1
//         `,[id]);
        
//         if(user.rows.length === 0){
//             throw new Error("User Not Found invalid credintials")
//         };
//         console.log("have a user you can create issues");
//     const result = await pool.query(`
//         INSERT INTO issues(id, title, description, status, type, reported_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING*
//         `, [id, title, description, status, type, reported_id])
    
//         return result;

// }
// //-----end create issueIntoDB---

// export const issueService = {
//     createIssueIntoDB,
// }