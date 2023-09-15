export const verifyUsername = (usernameOfDatabase: string, usernameOfData: string) => {
  return usernameOfDatabase.localeCompare(usernameOfData) === 0;
}