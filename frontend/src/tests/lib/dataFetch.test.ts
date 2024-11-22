import axios from "axios";
import { fetchPosts } from "@/lib/dataFetch";
import { postSchema } from "@/lib/schemas";
import { v4 as uuidv4 } from "uuid";

// axiosをモック化
jest.mock("axios");

// モック版axiosを作成
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchPosts", () => {
  it("正しいデータを返す", async () => {
    const mockData = [
      {
        uuid: uuidv4(),
        title: "post title",
        description: "Post Description",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        tags: [{ name: "example" }],
        comments: [
          {
            uuid: uuidv4(),
            description: "Commnet Description",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            users: [{ user_id: "user_2", name: "user_2" }],
          },
        ],
        users: [{ user_id: "user_1", name: "user_1" }],
      },
    ];

    // 非同期で成功したPromiseを返すモック関数
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchPosts("user_1");
    expect(result).toEqual(mockData);
    expect(postSchema.array().safeParse(result).success).toBeTruthy();
  });

  it("不正なデータではエラーを返す", async () => {
    const invalidData = [{}];

    // 非同期で失敗したPromiseを返すモック関数
    mockedAxios.get.mockResolvedValue({ data: invalidData });

    await expect(fetchPosts("user_1")).rejects.toThrow();
  });
});
