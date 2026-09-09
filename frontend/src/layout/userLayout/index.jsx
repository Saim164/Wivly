import Navbar from "@/components/navbar";

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
