import { useRouter } from "next/router";
import { useEffect } from "react";

function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      router.push("login");
    }
  });

  return <div>Dashboard</div>;
}

export default Dashboard;
