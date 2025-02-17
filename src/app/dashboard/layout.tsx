import DashboardNav from "./components/navbar.tsx";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black min-h-screen">
      <DashboardNav />
      {children}
    </div>
  );
}
