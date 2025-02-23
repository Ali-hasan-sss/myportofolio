import DashboardNav from "./components/navbar.tsx";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex justify-between min-h-screen">
      <DashboardNav />
      <div
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 4rem)" }}
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
}
