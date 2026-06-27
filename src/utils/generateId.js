// Generate unique user ID: CB + 10 random alphanumeric characters = 12 chars
export const generateUserId = () => {
  const prefix = "CB";
  const randomChars = Math.random().toString(36).substring(2, 12).toUpperCase().padEnd(10, "0");
  return prefix + randomChars;
};
