import { sql } from "../../db";
import type { IIssue } from "./issues.interface";

const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
    const { title, description, type } = payload;

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