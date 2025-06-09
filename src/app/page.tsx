import { WebArchiveClient } from "@/components/web-archive/WebArchiveClient";

export default function HomePage() {
  return (
    <main className="min-h-screen py-8 bg-background">
      <WebArchiveClient />
    </main>
  );
}
