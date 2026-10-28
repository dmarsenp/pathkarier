// Template dirender ulang di tiap perpindahan halaman, jadi konten selalu masuk dengan lembut.
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">{children}</div>;
}
