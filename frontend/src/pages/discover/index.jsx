import { getAllUsers } from "@/config/redux/action/authaction";
import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers())
    }
  });
  return (
    <Userlayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export default Discover;
