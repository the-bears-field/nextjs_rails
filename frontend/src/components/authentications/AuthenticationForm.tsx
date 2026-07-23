import { JSX } from "react";

type AuthenticationFormType = {
  action: (formData: FormData) => Promise<void>;
  inputFields: { name: string; label: string }[];
  buttonText: string;
};

type InputType = "text" | "password" | "email";

export function AuthenticationForm(props: AuthenticationFormType): JSX.Element {
  const { action, inputFields, buttonText } = props;

  // nameの値に応じてinputのtype属性の値を返す関数
  function fetchInputType(name: string): InputType {
    if (name.includes("password")) return "password";
    if (name.includes("email")) return "email";
    return "text";
  }

  return (
    <form action={action}>
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
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
          />
          <div className="mt-2 ml-2 h-8">
            <p id={`${field.name}-error`} className="text-red-500 text-s">
              {/* Error message will be displayed here */}
            </p>
          </div>
        </div>
      ))}
      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
