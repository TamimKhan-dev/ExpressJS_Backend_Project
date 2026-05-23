import config from "../../config";
import { sql } from "../../db";
import type { IIssue, IIssuesQuery, IIssueUpdate } from "./issues.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";

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

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order =
    sort === "oldest" ? `ORDER BY created_at ASC` : `ORDER BY created_at DESC`;

  const issues = await sql.query(`SELECT * FROM issues ${where} ${order}`);

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reporters = await sql`SELECT id, name, role FROM users WHERE id = ANY(${reporterIds})`;

  const reporterMap = reporters.reduce((acc, reporter) => {
    acc[reporter.id] = reporter;
    return acc;
  }, {});

  const data = issues.map((issue) => ({
    ...issue,
    reporter: reporterMap[issue.reporter_id],
    reporter_id: undefined,
  }));
  
  return data;
};

const getSingleIssueFromDB = async (id: number) => {
  const issue = await sql`SELECT * FROM issues WHERE id = ${id}`;

  if (!issue[0]) {
    throw new Error("User Not Found");
  }

  const reporter =
    await sql`SELECT id, name, role FROM users WHERE id = ${issue[0].reporter_id}`;

  return {
    ...issue[0],
    reporter: reporter[0],
    reporter_id: undefined,
  };
};

const updateSingleIssueIntoDB = async (
  id: number,
  token: string,
  payload: IIssueUpdate,
) => {
  const issue = await sql`SELECT * FROM issues WHERE id=${id}`;

  if (!issue[0]) {
    throw new Error("Issues not Found!");
  }

  const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

  if (decoded.role !== "maintainer") {
    if (issue[0].reporter_id !== decoded.id) {
      throw new Error("You don't have access to update this issue!");
    }
    if (issue[0].status !== "open") {
      throw new Error("You can only update issues with open status!");
    }
  }

  const { title, description, type } = payload;

  const updates: string[] = [];
  const values: unknown[] = [];

  if (title) {
    updates.push(`title = $${values.length + 1}`);
    values.push(title);
  }
  if (description) {
    updates.push(`description = $${values.length + 1}`);
    values.push(description);
  }
  if (type) {
    updates.push(`type = $${values.length + 1}`);
    values.push(type);
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const result = await sql.query(
    `UPDATE issues SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );

  return result;
};

const deleteIssueFromDB = async (id: number) => {
   const result = await sql`DELETE FROM issues WHERE id=${id} RETURNING *`;

   return result;
};

export const issuesService = {
  createIssueIntoDB,
  deleteIssueFromDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateSingleIssueIntoDB,
};
