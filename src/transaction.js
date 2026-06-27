import { connection } from "./connection.js";

export const executeWithTransaction = async (queries) => {
  try {
    // Start transaction
    await connection.query("BEGIN");
    console.log("Transaction started");

    // Execute all queries
    const results = [];
    for (const { query, params } of queries) {
      const result = await connection.query(query, params);
      results.push(result);
      console.log("Query executed successfully:", query.substring(0, 50) + "...");
    }

    // Commit if all queries succeed
    await connection.query("COMMIT");
    console.log("Transaction committed successfully");
    return { success: true, results };

  } catch (err) {
    // Rollback on any error
    try {
      await connection.query("ROLLBACK");
      console.error("Transaction rolled back due to error:", err.message);
    } catch (rollbackErr) {
      console.error("Error during rollback:", rollbackErr);
    }
    return { success: false, error: err.message };
  }
};
