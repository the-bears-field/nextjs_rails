import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-max">
      <h1 className="text-4xl font-bold">
        <Link
          href="https://github.com/the-bears-field/nextjs_rails"
          className="text-blue-400 hover:underline"
        >
          Rails API、Next.js を使用したブログアプリ
        </Link>
      </h1>
      <article className="mt-16 ml-8">
        <h2 className="text-2xl font-bold">使用技術</h2>
        <article className="mt-8">
          <h3 className="text-xl font-bold">フロントエンド</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Node.js v24.15.0</li>
            <li>react@19.1.1</li>
            <li>typescript@6.0.3</li>
            <li>next@15.5.2</li>
            <li>zod@4.1.5</li>
            <li>tailwindcss@4.1.13</li>
            <li>jest@29.7.0</li>
          </ul>
        </article>

        <article className="mt-8">
          <h3 className="text-xl font-bold">バックエンド</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Ruby 4.0.2</li>
            <li>Rails 8.0.5</li>
            <li>RSpec 3.13.6</li>
          </ul>
        </article>

        <article className="mt-8">
          <h3 className="text-xl font-bold">データベース</h3>
          <ul className="list-disc list-inside ml-4">
            <li>PostgreSQL 17.5</li>
          </ul>
        </article>

        <article className="mt-8">
          <h3 className="text-xl font-bold">Web サーバー</h3>
          <ul className="list-disc list-inside ml-4">
            <li>nginx/1.28.0</li>
          </ul>
        </article>
      </article>
      <article className="mt-16 ml-8">
        <h2 className="text-2xl font-bold">必要要件</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Git</li>
          <li>Docker</li>
          <li>Docker Compose</li>
        </ul>
      </article>
      <article className="mt-16 ml-8">
        <h2 className="text-2xl font-bold">インストール</h2>
        <section className="mt-8">
          <p>
            必要要件に記載している環境を整えた上で、ターミナルで下記コマンドを順番に実行してください。
          </p>
          <div className="mt-4">
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>
                git clone https://github.com/the-bears-field/nextjs_rails.git
              </code>
            </pre>
          </div>
          <div className="mt-4">
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>cd nextjs_rails</code>
            </pre>
          </div>
          <div className="mt-4">
            <pre className="p-4 rounded-2xl bg-gray-600 dark:bg-gray-600 select-all overflow-x-auto">
              <code>sh initialization.sh</code>
            </pre>
          </div>
          <div className="mt-4">
            <p>
              以上の過程を経てブラウザで
              <Link
                href="http://localhost"
                className="text-blue-400 hover:underline"
              >
                http://localhost
              </Link>
              を開くと、ポートフォリオの閲覧が可能となります。
            </p>
          </div>
        </section>
      </article>
      <article className="mt-16 ml-8">
        <h2 className="text-2xl font-bold">既定のユーザー情報</h2>
        <article className="mt-4">
          <h3 className="text-xl font-bold">
            <Link href="/user_1" className="text-blue-400 hover:underline">
              User1
            </Link>
          </h3>
          <div className="mt-4 ml-4">
            <h4 className="font-bold">mail</h4>
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>user1@example.com</code>
            </pre>
          </div>
          <div className="mt-4 ml-4">
            <h4 className="font-bold">password</h4>
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>Password@1234</code>
            </pre>
          </div>
        </article>
        <article className="mt-8">
          <h3 className="text-xl font-bold">
            <Link href="/user_2" className="text-blue-400 hover:underline">
              User2
            </Link>
          </h3>
          <div className="mt-4 ml-4">
            <h4 className="font-bold">mail</h4>
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>user2@example.com</code>
            </pre>
          </div>
          <div className="mt-4 ml-4">
            <h4 className="font-bold">password</h4>
            <pre className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-600 select-all overflow-x-auto">
              <code>Password@1234</code>
            </pre>
          </div>
        </article>
      </article>
    </section>
  );
}
