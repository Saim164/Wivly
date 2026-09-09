import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getConnectionRequests,
  getMyConnections,
  respondConnectionRequest,
} from "@/config/redux/action/authaction";
import { mediaUrl } from "@/config/mediaUrl";

function MyConnections() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  const pendingRequests = authState.connectionRequests.filter(
    (request) => request.status_accepted === null,
  );

  useEffect(() => {
    dispatch(getConnectionRequests());
    dispatch(getMyConnections());
  }, [dispatch]);

  const handleRespond = async (requestId, action_type) => {
    await dispatch(respondConnectionRequest({ requestId, action_type }));
    dispatch(getConnectionRequests());
    dispatch(getMyConnections());
  };

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          <section>
            <h2 className={styles.heading}>Connection Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className={styles.emptyState}>No pending requests.</div>
            ) : (
              <div className={styles.list}>
                {pendingRequests.map((request) => (
                  <div key={request._id} className={styles.row}>
                    <img
                      className={styles.avatar}
                      src={mediaUrl(request.userId?.profilePicture)}
                      alt={request.userId?.name}
                      onClick={() =>
                        router.push(`/profile/${request.userId?.username}`)
                      }
                    />
                    <div className={styles.info}>
                      <p className={styles.name}>{request.userId?.name}</p>
                      <p className={styles.username}>
                        @{request.userId?.username}
                      </p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => handleRespond(request._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => handleRespond(request._id, "decline")}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className={styles.heading}>My Connections</h2>
            {authState.connections.length === 0 ? (
              <div className={styles.emptyState}>No connections yet.</div>
            ) : (
              <div className={styles.list}>
                {authState.connections.map((person) => (
                  <div
                    key={person._id}
                    className={styles.row}
                    onClick={() => router.push(`/profile/${person.username}`)}
                  >
                    <img
                      className={styles.avatar}
                      src={mediaUrl(person.profilePicture)}
                      alt={person.name}
                    />
                    <div className={styles.info}>
                      <p className={styles.name}>{person.name}</p>
                      <p className={styles.username}>@{person.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export default MyConnections;
