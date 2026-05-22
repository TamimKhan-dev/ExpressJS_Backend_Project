import { sql } from "../../db";
import type { IIssue, IIssuesQuery } from "./issues.interface";

const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
  const { title, description, type } = payload;

  const result = await sql`
      INSERT INTO issues(title, description, type, reporter_id)
      VALUES(${title}, ${description}, ${type}, ${reporter_id})
      RETURNING *
    `;

  return result;
};

const getAllIssuesFromDB = async (query: IIssuesQuery) => {
  const { sort, status, type } = query;

  const conditions = [];
  if (type) conditions.push(`type = '${type}'`);
  if (status) conditions.push(`status = '${status}'`);

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const order =
    sort === "oldest" ? `ORDER BY created_at ASC` : `ORDER BY created_at DESC`;

  const result = await sql.query(`SELECT * FROM issues ${where} ${order}`);
  return result;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
