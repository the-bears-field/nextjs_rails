import { signup } from "@/features/authentications/signup";
import {
  generateMockForm,
  generateMockUser,
} from "@/lib/mocks/generateMockData";
import { Failure, Success, User } from "@/types/types";

let formData: FormData;

describe("signup", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("新規登録", () => {
    it("成功", async () => {
      const mockSuccess: Success<User> = {
        success: true,
        value: generateMockUser(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        json: async () => mockSuccess,
      });

      formData = generateMockForm<User>(generateMockUser());
      const result = await signup(formData);

      console.log(result);

      expect(result).toHaveProperty("value");
      expect(result).not.toHaveProperty("errors");
      expect(result.success).toBe(true);
    });

    describe("失敗", () => {
      it.each([
        { deleteKey: "user_id" },
        { deleteKey: "name" },
        { deleteKey: "email" },
        { deleteKey: "password" },
      ])("バリデーションエラー - ${deleteKey}", async ({ deleteKey }) => {
        const mockFailure: Failure<string[]> = {
          success: false,
          errors: [`${deleteKey} is required`],
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 422,
          json: async () => mockFailure,
        });

        formData = generateMockForm<User>(generateMockUser());
        formData.delete(deleteKey);

        const result = await signup(formData);

        expect(result).not.toHaveProperty("value");
        expect(result).toHaveProperty("errors");
        expect(result.success).toBe(false);
      });
    });
  });
});
