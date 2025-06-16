import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import type { Comment, Post, PostUser, Tag, User } from "../types";

// 複数の投稿データを生成する関数
export function generateMockPosts(count: number): Post[] {
  return Array.from({ length: count }, generateMockPost);
}

// タグのモックを生成する関数
function generateMockTag(): Tag {
  return { name: faker.word.noun() };
}

// ユーザーのモックを生成する関数
export function generateMockUser(): User {
  return {
    user_id: faker.string.alphanumeric({ length: { min: 4, max: 15 } }),
    name: faker.person.fullName(),
    email: faker.internet.exampleEmail(),
    password: generatePassword(),
  };
}

// 投稿に関わるユーザーのモックを生成する関数
export function generateMockPostUser(): PostUser {
  return {
    user_id: faker.string.alphanumeric({ length: { min: 4, max: 15 } }),
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
    users: [generateMockPostUser()],
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
    users: [generateMockPostUser()],
  };
}

/**
 * 8〜100文字の範囲で
 * - 小文字1文字以上
 * - 大文字1文字以上
 * - 数字1文字以上
 * - 記号1文字以上
 * を必ず含む文字列を生成する関数
 */
function generatePassword(): string {
  const { randomInt } = require("node:crypto");

  // すべての候補文字を明示的に定義(英小文字、英大文字、数字、記号)
  const LOWERCASE: string = "abcdefghijklmnopqrstuvwxyz";
  const UPPERCASE: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGISTS: string = "0123456789";
  const SYMBOLS: string = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
  const ALL_CHARS: string = LOWERCASE + UPPERCASE + DIGISTS + SYMBOLS;
  const length: number = randomInt(8, 100);

  // 結果を格納する配列を定義し、必須文字を確実に追加
  const result: string[] = [];
  result.push(LOWERCASE.charAt(randomInt(0, LOWERCASE.length)));
  result.push(UPPERCASE.charAt(randomInt(0, UPPERCASE.length)));
  result.push(DIGISTS.charAt(randomInt(0, DIGISTS.length)));
  result.push(SYMBOLS.charAt(randomInt(0, SYMBOLS.length)));

  // 残りの文字を`ALL_CHARS`からランダムに抽出
  for (let i = result.length; i <= length; i++) {
    result.push(ALL_CHARS.charAt(randomInt(0, ALL_CHARS.length)));
  }

  // Fisher-Yatesアルゴリズムを用いて、順序をランダムに並び替え
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
}
