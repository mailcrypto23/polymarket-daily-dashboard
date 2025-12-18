import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
