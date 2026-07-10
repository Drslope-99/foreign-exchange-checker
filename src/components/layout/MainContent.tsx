import type { ReactNode } from "react";

type MainContentProps = {
  children: ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="w-full max-w-7xl mx-auto my-16 px-4">{children}</main>
  );
}
