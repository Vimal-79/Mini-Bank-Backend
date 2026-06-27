export const insert_query_users = `
    INSERT INTO users (id, first_name, last_name, email, mobile, date_of_birth, nationality, account_type, initial_deposit, address, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  `;

export const insert_query_credentials = `
    INSERT INTO credentials (id, email, password, created_at) VALUES ($1, $2, $3, $4)
  `;

export const select_user_by_email = `
  SELECT * FROM users WHERE email = $1
`;

export const select_credentials_by_email = `
  SELECT * FROM credentials WHERE email = $1
`;

  // export const insert_query_credentials = `
  //   INSERT INTO credentials (email, password, created_at) VALUES ($1, $2, $3)
  // `;

  // export const insert_query_credentials = `
  //   INSERT INTO credentials (user_id, password, created_at) VALUES ($1, $2, $3)
  // `;