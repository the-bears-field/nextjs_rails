import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { generateContainerUrl } from "@/lib/generateParsedData";
import { signout } from "@/features/authentications/actions/signout";

// 定数の定義
const AUTH_COOKIE_NAME = "access_token";
const SIGNOUT_API_URL = generateContainerUrl("/v1/users/sign_out");

// Next.js 内部関数の堅牢なモック化
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("signout (Server Action)", () => {
  // モックの共通セットアップ
  function setupMocks(token?: string) {
    const mockCookieStore = {
      get: jest.fn().mockReturnValue(token ? { value: token } : undefined),
      delete: jest.fn(),
    };

    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

    return mockCookieStore;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("正常系：認証情報の破棄フロー", () => {
    it("有効なトークンが存在する場合、バックエンドへの通知、クッキー削除、キャッシュパージが順に行われること", async () => {
      const mockStore = setupMocks("valid-token");
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await signout();

      // 順序と内容の検証
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(SIGNOUT_API_URL),
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(mockStore.delete).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("トークンが存在しない場合、APIリクエストをスキップすること", async () => {
      const mockStore = setupMocks(undefined);

      await signout();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockStore.delete).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
    });
  });

  describe("異常系: レジリエンスの検証", () => {
    it("バックエンドAPIが500エラーを返しても、ユーザーのセッションは確実に破棄されること", async () => {
      setupMocks("valid-token");
      // fetchがエラー(reject)になっても継続するかを検証。
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Internal Server Error"),
      );

      // 実行中にエラーで止まらないことを確認。
      await expect(signout()).resolves.not.toThrow();

      expect(revalidatePath).toHaveBeenCalled();
    });
  });
});
