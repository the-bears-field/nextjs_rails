import { signup } from "@/features/authentications/signup";
import {
  generateMockForm,
  generateMockUser,
} from "@/lib/mocks/generateMockData";
import { User } from "@/types/types";
import { cookies } from "next/headers";

// `next/headers` をモック化
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("signup (Server Action)", () => {
  const originalFetch = global.fetch;
  // `cookies().set` をモック化するためのオブジェクト
  const mockCookieStore = { set: jest.fn() };

  beforeEach(() => {
    // すべてのモックをクリア
    jest.clearAllMocks();
    // `fetch` をモック化
    global.fetch = jest.fn();
    // `cookies()` の戻り値をモック化
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("正常系: 新規登録成功", () => {
    it("有効な入力値の時、トークンを保存し、`user_id` のみを含むSuccess型を返すこと", async () => {
      const mockUser = generateMockUser();
      const mockToken = "valid-bearer-token";
      const formData = generateMockForm<User>(mockUser);

      // AuthResultの型定義に基づき、
      // `value` オブジェクトのプロパティは `user_id` のみ
      const expectedValue = { user_id: mockUser.user_id };

      // `fetch` をモック化して期待されるレスポンスを返す
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          Authorization: `Bearer ${mockToken}`,
        }),
        json: async () => ({
          success: true,
          value: expectedValue,
        }),
      });

      const result = await signup(formData);

      // `fetch` の呼び出しが1度だけであるか検証
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // 呼び出し時のURLとオプションの検証
      const [calledUrl, calledInit] = (global.fetch as jest.Mock).mock.calls[0];
      expect(typeof calledUrl).toBe("string");
      expect(calledInit.method).toBe("POST");

      // リクエストの詳細検証
      expect(calledInit.credentials).toBe("include");
      expect(calledInit.headers).toHaveProperty("Content-Type");
      expect(JSON.parse(calledInit.body)).toEqual({
        user: {
          user_id: mockUser.user_id,
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
        },
      });

      // Result型の検証
      expect(result.success).toBe(true);
      if (result.success) {
        // successがtrueなら必ずvalueが存在し、errorsは存在しないことを検証
        expect(result.value).toEqual(expectedValue);
        expect(result).not.toHaveProperty("errors");
      } else {
        fail(
          "Result型の`success`がtrueの場合、`errors`プロパティは存在しません。",
        );
      }

      // 副作用の検証
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "access_token",
        mockToken,
        expect.any(Object),
      );
    });
  });

  describe("異常系: バリデーション・認証エラー", () => {
    it("バリデーション失敗時に、Failure型（errors配列）を返すこと", async () => {
      const formData = generateMockForm<User>(generateMockUser());

      // emailを削除してバリデーションエラーを発生させる
      formData.delete("email");
      const result = await signup(formData);

      // `fetch` が呼び出されていないことを検証
      expect(global.fetch).not.toHaveBeenCalled();
      // Result型の検証
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Array.isArray(result.errors)).toBe(true);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result).not.toHaveProperty("value");
      }
    });

    it("Authorizationヘッダーが欠落している場合、専用のエラーメッセージを返すこと", async () => {
      // fetchのレスポンスにAuthorizationヘッダーがないケースをモック化
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        json: async () => ({ success: true, value: { user_id: "1" } }),
      });

      const formData = generateMockForm<User>(generateMockUser());
      const result = await signup(formData);

      // cookies().set が呼び出されていないことを検証
      expect(mockCookieStore.set).not.toHaveBeenCalled();
      // Result型の検証
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain(
          "Authorizationヘッダーが存在しません。",
        );
      } else {
        fail(
          "Result型の`success`がfalseの場合、`value`プロパティは存在しません。",
        );
      }
    });

    it("HTTPエラー時に、ステータスコードを含むエラーを返すこと", async () => {
      // `fetch` のレスポンスがHTTPエラーとなるケースをモック化
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const formData = generateMockForm<User>(generateMockUser());
      const result = await signup(formData);

      // Result型の検証
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain("HTTP 500");
      }
    });

    it("レスポンスJSONがスキーマに合わない場合、Zodエラーを返すこと", async () => {
      // `fetch` のレスポンスがスキーマに合わないケースをモック化
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          Authorization: "Bearer invalid-token",
        }),
        json: async () => ({
          success: true,
          value: {}, // `user_id`が欠損
        }),
      });

      const formData = generateMockForm<User>(generateMockUser());
      const result = await signup(formData);

      // Result型の検証
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      } else {
        fail(
          "Result型の`success`がfalseの場合、`value`プロパティは存在しません。",
        );
      }
    });
  });
});
