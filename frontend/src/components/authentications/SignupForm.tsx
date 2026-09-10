'use client';

import { signup } from "@/features/authentications/actions/signup";
import { userSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { JSX, useActionState } from "react";
import { z } from "zod/v4";
import type { Result } from "@/types/types";

type InputType = 'text' | 'email' | 'password';
type SignupSchemaType = z.infer<typeof userSchema>;
type ValidationError = Partial<Record<keyof SignupSchemaType, string[]>>;
type AuthError = { value?: string[] };
type ActionError = { validation?: ValidationError; authentication?: AuthError };
type SignupState = {
  user_id: string;
  name: string;
  email: string;
  password: string;
  errors: ActionError
}
type FieldConfig = {
  name: keyof SignupSchemaType;
  label: string;
  state: string;
};

const INITIAL_STATE: SignupState = {
  user_id: '',
  name: '',
  email: '',
  password: '',
  errors: {
    validation: {},
    authentication: {},
  }
}

export function SignupForm(): JSX.Element {
  const [state, formAction, isPending] = useActionState(signupUser, INITIAL_STATE)

  // 入力フィールドのタイプを取得する関数
  function fetchInputType(type: string): InputType {
    if (type.includes('email')) return 'email';
    if (type.includes('password')) return 'password';
    return 'text';
  }

  // フォームデータのバリデーションを行う関数
  function validationFormData(formData: FormData): Result<undefined, ActionError> {
    const parsed = userSchema.safeParse({
      user_id: formData.get('user_id'),
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (parsed.success) return { success: true, value: undefined }

    const errors: ActionError = {
      validation: z.flattenError(parsed.error).fieldErrors
    };

    return { success: false, errors: errors };
  }

  /**
 * ユーザー情報のバリデーションを行った後、新規登録を行い結果に応じた状態を更新する関数
 * @param { SignupState } prevState
 * @param { FormData } formData
 * @returns {Promise<SignupState>}
 */
  async function signupUser(
    prevState: SignupState,
    formData: FormData
  ): Promise<SignupState> {
    // フォームデータのバリデーションを行う
    const parsed = validationFormData(formData)

    if (!parsed.success) {
      return {
        user_id: String(formData.get('user_id') ?? ''),
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        errors: parsed.errors
      };
    }

    // バリデーションが成功した場合、新規登録を行う
    const result = await signup(formData);

    if (result.success) {
      redirect(`/${result.value.user_id}`);
    } else {
      for (const [key, value] of Object.entries(result.errors)) {
        console.error(key, value);
      }
    }

    return {
      user_id: String(formData.get('user_id')),
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      errors: {
        authentication: { value: [result.errors.value] }
      }
    }
  }

  const inputFields: FieldConfig[] = [
    { name: "user_id", label: "User ID", state: state.user_id },
    { name: "name", label: "User Name", state: state.name },
    { name: "email", label: "Email", state: state.email },
    { name: "password", label: "Password", state: state.password },
  ];

  return (
    <div className="dark:bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        新規登録
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
                <p id={`${field.name}-errors-${key}`} className="text-red-500 text-sm" key={key}>
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
            {!isPending ? '新規登録' : '処理中...'}
          </button>
        </div>
      </form>
    </div>
  );
}
