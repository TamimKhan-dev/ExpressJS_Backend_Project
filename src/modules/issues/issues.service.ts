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

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order =
    sort === "oldest" ? `ORDER BY created_at ASC` : `ORDER BY created_at DESC`;

  const issues = await sql.query(`SELECT * FROM issues ${where} ${order}`);

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reporters =
    await sql`SELECT id, name, role FROM users WHERE id = ANY(${reporterIds})`;

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

  const reporter = await sql.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue[0].reporter_id],
  );

  return {
    ...issue[0],
    reporter: reporter[0],
    reporter_id: undefined,
  };
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
