import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import styles from "./index.module.css";
import {
  getReceivedRequests,
  getMyConnections,
  respondConnectionRequest,
} from "@/config/redux/authSlice";
import { mediaUrl } from "@/config/mediaUrl";

export default function MyConnections() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { connectionRequests, connections } = useSelector(
    (state) => state.auth,
  );

  const loadConnections = useCallback(() => {
    dispatch(getReceivedRequests());
    dispatch(getMyConnections());
  }, [dispatch]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const respond = async (requestId, action_type) => {
    await dispatch(respondConnectionRequest({ requestId, action_type }));
    loadConnections();
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <section>
            <h2 className={styles.heading}>Connection Requests</h2>
            {connectionRequests.length === 0 ? (
              <div className={styles.emptyState}>No pending requests.</div>
            ) : (
              <div className={styles.list}>
                {connectionRequests.map((request) => (
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
                        onClick={() => respond(request._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => respond(request._id, "decline")}
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
            {connections.length === 0 ? (
              <div className={styles.emptyState}>No connections yet.</div>
            ) : (
              <div className={styles.list}>
                {connections.map((person) => (
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
    </UserLayout>
  );
}
