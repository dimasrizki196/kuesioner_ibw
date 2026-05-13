export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen transition-colors duration-500">
      {children}
    </div>
  );
}