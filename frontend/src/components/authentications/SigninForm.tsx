'use client'

import { signin } from "@/features/authentications/actions/signin";
import { userSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { JSX, useActionState } from "react";
import { z } from "zod/v4";
import type { Result } from "@/types/types";

type InputType = 'text' | 'email' | 'password';
type SigninSchemaType = z.infer<typeof signinSchema>;
type ValidationError = Partial<Record<keyof SigninSchemaType, string[]>>;
type AuthError = { value?: string[] };
type ActionError = { validation?: ValidationError; authentication?: AuthError };
type SigninState = {
  email: string;
  password: string;
  errors: ActionError
}

type FieldConfig = {
  name: keyof SigninSchemaType;
  label: string;
  state: string;
};

const signinSchema = userSchema.pick({ email: true, password: true });
const INITIAL_STATE: SigninState = {
  email: '',
  password: '',
  errors: {
    validation: {},
    authentication: {},
  }
}

export function SigninForm(): JSX.Element {
  const [state, formAction, isPending] = useActionState(signinUser, INITIAL_STATE)

  // 入力フィールドのタイプを取得する関数
  function fetchInputType(type: string): InputType {
    if (type.includes('email')) return 'email';
    if (type.includes('password')) return 'password';
    return 'text';
  }

  // フォームデータのバリデーションを行う関数
  function validationFormData(formData: FormData): Result<undefined, ActionError> {
    const parsed = signinSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (parsed.success) return { success: true, value: undefined }

    const errors: ActionError = {
      validation: z.flattenError(parsed.error).fieldErrors
    };

    return { success: false, errors: errors };
  }

  /**
   * ユーザー情報のバリデーションを行った後、
   * サインインを行い結果に応じた状態を更新する関数
   * @param { SigninState } prevState
   * @param { FormData } formData
   * @returns {Promise<SigninState>}
   */
  async function signinUser(
    prevState: SigninState,
    formData: FormData
  ): Promise<SigninState> {
    // フォームデータのバリデーションを行う
    const parsed = validationFormData(formData)

    if (!parsed.success) {
      return {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        errors: parsed.errors
      };
    }

    // バリデーションが成功した場合、サインインを行う
    const result = await signin(formData);

    if (result.success) {
      redirect(`/${result.value.user_id}`);
    } else {
      for (const [key, value] of Object.entries(result.errors)) {
        console.error(key, value);
      }
    }

    return {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      errors: {
        authentication: { value: [result.errors.value] }
      }
    }
  }

  const inputFields: FieldConfig[] = [
    { name: "email", label: "Email", state: state.email },
    { name: "password", label: "Password", state: state.password },
  ];

  return (
    <div className="dark:bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        サインイン
      </h1>
      <form action={formAction}>
        {/* Input Fields */}
        {inputFields.map((field, key) => (
          <div className="mt-4" key={key}>
            <label
              htmlFor={field.name}
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              {field.label}
            </label>
            <input
              type={fetchInputType(field.name)}
              id={field.name}
              name={field.name}
              defaultValue={field.state}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
            />
            <div className="mt-2 ml-2 h-8">
              {state.errors.validation?.[field.name]?.map((error, key) => (
                <p id={`${field.name}-errors-${key}`} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="text-red-500 text-left whitespace-pre-line">
            {state.errors.authentication?.value && `${state.errors.authentication?.value}\nメールアドレスまたはパスワードが\n正しくありません。`}
          </p>
        </div>
        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {!isPending ? 'サインイン' : '処理中...'}
          </button>
        </div>
      </form>
    </div>
  );
}
