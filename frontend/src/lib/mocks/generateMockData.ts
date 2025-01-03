import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { commentSchema, postSchema, tagSchema, userSchema } from "../schemas";

type Post = z.infer<typeof postSchema>;
type User = z.infer<typeof userSchema>;
type Tag = z.infer<typeof tagSchema>;
type Comment = z.infer<typeof commentSchema>;

// 複数の投稿データを生成する関数
export function generateMockPosts(count: number): Post[] {
  return Array.from({ length: count }, generateMockPost);
}

// タグのモックを生成する関数
function generateMockTag(): Tag {
  return { name: faker.word.noun() };
}

// ユーザーのモックを生成する関数
function generateMockUser(): User {
  return {
    user_id: faker.word.noun({
      length: { min: 4, max: 15 },
    }),
    name: faker.person.fullName(),
  };
}

// コメントのモックを生成する関数
function generateMockComment(): Comment {
  return {
    uuid: uuidv4(),
    description: faker.lorem.paragraphs(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    users: [generateMockUser()],
  };
}

// 投稿データのモックを生成する関数
function generateMockPost(): Post {
  return {
    uuid: uuidv4(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs({ min: 1, max: 10 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    tags: Array.from({ length: faker.number.int(10) }, generateMockTag),
    comments: Array.from({ length: faker.number.int(5) }, generateMockComment),
    users: [generateMockUser()],
  };
}
