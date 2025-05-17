// This file contains test users for development environment only
// Do not use in production

export const testUsers = [
  {
    id: "test-admin-id",
    email: "admin@g.nagaoka.ac.jp",
    name: "テスト管理者",
    role: "ADMIN",
  },
  {
    id: "test-student1-id",
    email: "student1@g.nagaoka.ac.jp",
    name: "テスト学生1",
    role: "USER",
  },
  {
    id: "test-student2-id",
    email: "student2@g.nagaoka.ac.jp",
    name: "テスト学生2",
    role: "USER",
  },
  {
    id: "test-teacher-id",
    email: "teacher@g.nagaoka.ac.jp",
    name: "テスト教員",
    role: "USER",
  },
];

// Check if a user exists in our test database
export const findTestUser = (email: string) => {
  return testUsers.find((user) => user.email === email);
};
