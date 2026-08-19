import Navbar from "../../components/navbar/index";

export default function Userlayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
