import { fetchPosts } from "@/lib/dataFetch";
import { postSchema } from "@/lib/schemas";
import { generateMockPosts } from "@/lib/mocks/generateMockData";

describe("fetchPosts", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("正しいデータを返す", async () => {
    const mockData = generateMockPosts(3);

    //** 非同期で成功したPromiseを返すモック関数 */
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockData,
    });

    const result = await fetchPosts("user_1");
    expect(result).toEqual(mockData);
    expect(postSchema.array().safeParse(result).success).toBeTruthy();
  });

  it("不正なデータではエラーを返す", async () => {
    const invalidData = [{}];

    /** 非同期で失敗したPromiseを返すモック関数 */
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => invalidData,
    });

    await expect(fetchPosts("user_1")).rejects.toThrow();
  });
});
