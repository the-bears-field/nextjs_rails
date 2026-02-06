import { cookies } from "next/headers";
import { signin } from "@/features/authentications/signin";
import { authSuccessSchema } from "@/features/authentications/schemas/authentication";
import { generateContainerUrl } from "@/lib/generateParsedData";
import { userSchema } from "@/lib/schemas";

// 元の `fetch` を保存
const originalFetch = global.fetch;

// 外部モジュールをモック化
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/schemas", () => ({
  userSchema: {
    pick: jest.fn(),
  },
}));

jest.mock("@/lib/generateParsedData", () => ({
  generateContainerUrl: jest.fn(),
}));

jest.mock("@/features/authentications/schemas/authentication", () => ({
  authSuccessSchema: {
    safeParse: jest.fn(),
  },
}));

describe("signin サーバーアクションのテスト", () => {
  // `cookies().set` をモック化
  const mockCookieStore = { set: jest.fn() };
  (cookies as jest.Mock).mockReturnValue(mockCookieStore);

  // デフォルトURL生成処理をモック化
  (generateContainerUrl as jest.Mock).mockReturnValue(
    "http://localhost/v1/users/signin",
  );

  beforeEach(() => {
    // すべてのモックをクリア
    jest.clearAllMocks();
    // `fetch` をモック化
    global.fetch = jest.fn();
  });

  afterEach(() => {
    // `fetch` を元の状態に戻す
    global.fetch = originalFetch;
  });

  describe("正常系: サインイン成功", () => {
    it("正しい資格情報でサインインし、クッキーにトークンを保存して成功データを返すこと", async () => {
      /// ユーザー情報のバリデーションに成功した結果をモック化
      (userSchema.pick as jest.Mock).mockReturnValue({
        safeParse: jest.fn().mockReturnValue({
          success: true,
          data: { email: "test@example.com", password: "Password123!" },
        }),
      });

      // `fetch` をモック化して期待されるレスポンスを返す
      const mockUserResponse = { id: 1, email: "test@example.com" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers({ Authorization: "Bearer mock-token" }),
        json: jest.fn().mockResolvedValue(mockUserResponse),
      });

      // レスポンススキーマ検証成功のモック
      (authSuccessSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockUserResponse,
      });

      // フォームデータの作成
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const result = await signin(formData);

      // 検証
      expect(result).toEqual(mockUserResponse);
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "access_token",
        "mock-token",
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("異常系: サインイン失敗", () => {
    it("入力のバリデーションに失敗した場合、エラーを返す", async () => {
      // ユーザー情報のバリデーションに失敗した結果をモック化
      (userSchema.pick as jest.Mock).mockReturnValue({
        safeParse: jest.fn().mockReturnValue({
          success: false,
          error: { issues: [{ message: "無効なメールアドレスです" }] },
        }),
      });

      const result = await signin(new FormData());

      expect(result).toEqual({
        success: false,
        errors: ["無効なメールアドレスです"],
      });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("APIが401エラーを返した場合、HTTPエラーメッセージを返す", async () => {
      // ユーザー情報のバリデーションに成功した結果をモック化
      (userSchema.pick as jest.Mock).mockReturnValue({
        safeParse: jest.fn().mockReturnValue({ success: true, data: {} }),
      });

      // `fetch` の処理に失敗した結果をモック化
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      const result = await signin(new FormData());

      expect(result).toEqual({
        success: false,
        errors: ["HTTPエラー: 401: Unauthorized"],
      });
    });

    it("レスポンスにAuthorizationヘッダーがない場合、エラーを返す", async () => {
      /// ユーザー情報のバリデーションに成功した結果をモック化
      (userSchema.pick as jest.Mock).mockReturnValue({
        safeParse: jest.fn().mockReturnValue({ success: true, data: {} }),
      });

      // `fetch` の処理に成功しているが、
      // ヘッダーが空である結果をモック化
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: jest.fn().mockResolvedValue({}),
      });

      const result = await signin(new FormData());

      expect(result.success).toBe(false);

      if (result.success === false) {
        expect(result.errors).toContain(
          "Authorizationヘッダーが存在しません。",
        );
      } else {
        // success が true だった場合にテストを失敗させる（堅牢性の向上）
        throw new Error(
          "Authorizationヘッダーが存在しないにもかかわらず、サインインに成功しています。",
        );
      }
    });
  });
});
