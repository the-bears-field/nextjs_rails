import axios from "axios";
import { fetchPosts } from "@/lib/dataFetch";
import { postSchema } from "@/lib/schemas";
import { generateMockPosts } from "@/lib/mocks/generateMockData";

/** axiosをモック化 */
jest.mock("axios");

/** モック版axiosを作成 */
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchPosts", () => {
  it("正しいデータを返す", async () => {
    const mockData = generateMockPosts(3);

    /** 非同期で成功したPromiseを返すモック関数 */
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchPosts("user_1");
    expect(result).toEqual(mockData);
    expect(postSchema.array().safeParse(result).success).toBeTruthy();
  });

  it("不正なデータではエラーを返す", async () => {
    const invalidData = [{}];

    /** 非同期で失敗したPromiseを返すモック関数 */
    mockedAxios.get.mockResolvedValue({ data: invalidData });

    await expect(fetchPosts("user_1")).rejects.toThrow();
  });
});
