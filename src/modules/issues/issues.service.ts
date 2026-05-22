import { sql } from "../../db";
import type { IIssue } from "./issues.interface";

const createIssueIntoDB = async (payload: IIssue) => {
    const { title, description, type } = payload;

    const reporter_id = 1;

    const result = await sql`
      INSERT INTO issues(title, description, type, reporter_id)
      VALUES(${title}, ${description}, ${type}, ${reporter_id})
      RETURNING *
    `;

    return result;
};

export const issuesService = {
    createIssueIntoDB,
}