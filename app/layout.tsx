import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Трекер подписок",
  description: "Локальный трекер подписок",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Трекер подписок
            </Link>
            <nav className="flex gap-1 text-sm">
              <Link href="/" className="btn-ghost">
                Дашборд
              </Link>
              <Link href="/subscriptions" className="btn-ghost">
                Подписки
              </Link>
              <Link href="/categories" className="btn-ghost">
                Категории
              </Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
