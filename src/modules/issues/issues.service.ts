import { pool } from "../../db";
import type { IIssue } from "./issues.interface";
//-------start-issue created --------
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
//-------end-issue created--------
// //-------start-get all issue created--------
const getAllIssuesFromDB = async () => {

  // 1. Get all issues
  const issuesResult = await pool.query(`
    SELECT id, reported_id, title, description, status, type, created_at, updated_at
    FROM issues
    ORDER BY id DESC
  `);

  const issues = issuesResult.rows;

  // 2. Extract all reporter ids
  const reporterIds = [
    ...new Set(issues.map(issue => issue.reported_id))
  ];

  // 3. Get users data
  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );

  // 4. Create users map
  const userMap = new Map();

  usersResult.rows.forEach(user => {
    userMap.set(user.id, user);
  });

  // 5. Final formatted response
  const formattedIssues = issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: userMap.get(issue.reported_id),

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return {
    success: true,
    message: "Issues retrived successfully",
    data: formattedIssues
  };
};
//-------end-get all issue created--------
//-------start-get single issue created--------
// const getSingleIssueFromDB = async(reported_id:string)=>{
//     const result = await pool.query(`
//         SELECT * FROM issues WHERE reported_id =$1
//         `, [reported_id])
//     return result.rows[0];
// };

const getSingleIssueFromDB = async (id: number) => {
  const result = await pool.query(
    `
      SELECT issues.*, users.name, users.email
      FROM issues
      JOIN users ON users.id = issues.reported_id
      WHERE issues.id=$1
    `,
    [id]
  );

  return result.rows[0];
};
//-------end-get single issue created--------
export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
}
