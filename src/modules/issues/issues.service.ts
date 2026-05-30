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
  const result = await pool.query(`
    SELECT issues.*, users.name, users.role
    FROM issues
    JOIN users ON users.id = issues.reported_id
  `);
    if(result.rows.length ===0){
      throw new Error("Have No Issue Empty")
    }
  return result.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: {
      id: issue.reported_id,
      name: issue.name,
      role: issue.role,
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};
//-------end-get all issue created--------
//-------start-get single issue created--------
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
  if(result.rows.length ===0){
    throw new Error("Issues not found!!")
  }

  return result.rows[0];
};
//-------end-get single issue created--------
//-------end-delete single issue created--------
const deleteIssueFromDB = async (issueId: number) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [issueId]
  );

  return result.rows[0];
};
//-------end-delete single issue created--------
//-------start updated issue single issue created--------
const findIssueById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateIssueFromDB = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    type?: string;
  }
) => {
  const { title, description, type } = data;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [title, description, type, id]
  );

  return result.rows[0];
};
//-------end-updated issue created--------
export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    deleteIssueFromDB,
    findIssueById,
    updateIssueFromDB,
}
