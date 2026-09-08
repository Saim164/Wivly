import DashboardLayout from "@/layout/dashboardLayout";
import Userlayout from "@/layout/userLayout";
import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getUserByUsername,
  getAboutUser,
  sendConnectionRequest,
  cancelConnectionRequest,
  getConnectionStatus,
  respondConnectionRequest,
  updateProfileData,
  downloadResume,
} from "@/config/redux/action/authaction";

const EMPTY_WORK = { company: "", position: "", years: "" };
const EMPTY_EDUCATION = { school: "", degree: "", fieldOfStudy: "" };

function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const viewedUser = authState.viewedUser;
  const viewedProfile = authState.viewedProfile;
  const currentUserId = authState.user?.userId?._id;
  const isOwnProfile = viewedUser && viewedUser._id === currentUserId;
  const connectionStatus = authState.connectionStatus;

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (username) {
      dispatch(getUserByUsername(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (viewedUser && !isOwnProfile) {
      dispatch(getConnectionStatus(viewedUser._id));
    }
  }, [dispatch, viewedUser, isOwnProfile]);

  const refreshStatus = () => {
    if (viewedUser) {
      dispatch(getConnectionStatus(viewedUser._id));
    }
  };

  const handleConnect = async () => {
    await dispatch(sendConnectionRequest(viewedUser._id));
    refreshStatus();
  };

  const handleCancel = async () => {
    await dispatch(cancelConnectionRequest(viewedUser._id));
    refreshStatus();
  };

  const handleRespond = async (action_type) => {
    await dispatch(
      respondConnectionRequest({
        requestId: connectionStatus.requestId,
        action_type,
      }),
    );
    refreshStatus();
  };

  const openEdit = () => {
    setForm({
      bio: viewedProfile?.bio || "",
      currentPost: viewedProfile?.currentPost || "",
      pastWork: (viewedProfile?.pastWork || []).map((work) => ({
        ...EMPTY_WORK,
        ...work,
      })),
      education: (viewedProfile?.education || []).map((edu) => ({
        ...EMPTY_EDUCATION,
        ...edu,
      })),
    });
  };

  const closeEdit = () => setForm(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setRow = (key, index, field, value) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }));

  const addRow = (key, empty) =>
    setForm((f) => ({ ...f, [key]: [...f[key], { ...empty }] }));

  const removeRow = (key, index) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));

  const handleDownloadResume = async () => {
    const result = await dispatch(downloadResume(viewedUser._id));
    if (downloadResume.fulfilled.match(result)) {
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${result.payload.message}`,
        "_blank",
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfileData(form));
    if (updateProfileData.fulfilled.match(result)) {
      closeEdit();
      dispatch(getUserByUsername(username));
      dispatch(getAboutUser());
    }
  };

  const userPosts = viewedUser
    ? postState.post.filter((post) => post.userId?._id === viewedUser._id)
    : [];

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          {authState.viewedUserFetched && !viewedUser && (
            <div className={styles.emptyState}>User not found.</div>
          )}

          {viewedUser && (
            <>
              <div className={styles.header}>
                <img
                  className={styles.avatar}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                    viewedUser.profilePicture || "default.png"
                  }`}
                  alt={viewedUser.name}
                />
                <div className={styles.headerInfo}>
                  <p className={styles.name}>{viewedUser.name}</p>
                  <p className={styles.username}>@{viewedUser.username}</p>
                  {viewedProfile?.currentPost && (
                    <p className={styles.currentPost}>
                      {viewedProfile.currentPost}
                    </p>
                  )}
                </div>

                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={handleDownloadResume}
                    aria-label="Download resume"
                    title="Download resume"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </button>

                  {isOwnProfile ? (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={openEdit}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    connectionStatus && (
                      <div className={styles.connectActions}>
                        {connectionStatus.status === "none" && (
                          <button
                            type="button"
                            className={styles.connectButton}
                            onClick={handleConnect}
                          >
                            Connect
                          </button>
                        )}

                        {connectionStatus.status === "pending_sent" && (
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={handleCancel}
                          >
                            Cancel Request
                          </button>
                        )}

                        {connectionStatus.status === "pending_received" && (
                          <>
                            <button
                              type="button"
                              className={styles.connectButton}
                              onClick={() => handleRespond("accept")}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              onClick={() => handleRespond("decline")}
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {connectionStatus.status === "connected" && (
                          <span className={styles.connectedBadge}>
                            Connected
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {viewedProfile?.bio && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>About</h2>
                  <p className={styles.bioText}>{viewedProfile.bio}</p>
                </div>
              )}

              {viewedProfile?.pastWork?.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  {viewedProfile.pastWork.map((work, i) => (
                    <div key={i} className={styles.entry}>
                      <p className={styles.entryTitle}>
                        {work.position}
                        {work.company && ` · ${work.company}`}
                      </p>
                      {work.years && (
                        <p className={styles.entrySub}>{work.years}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {viewedProfile?.education?.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  {viewedProfile.education.map((edu, i) => (
                    <div key={i} className={styles.entry}>
                      <p className={styles.entryTitle}>{edu.school}</p>
                      {(edu.degree || edu.fieldOfStudy) && (
                        <p className={styles.entrySub}>
                          {[edu.degree, edu.fieldOfStudy]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.feed}>
                {userPosts.length === 0 && (
                  <div className={styles.emptyState}>No posts yet.</div>
                )}

                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <img
                        className={styles.postAvatar}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                          post.userId?.profilePicture || "default.png"
                        }`}
                        alt={post.userId?.name}
                      />
                      <div>
                        <p className={styles.postAuthor}>{post.userId?.name}</p>
                        <p className={styles.postUsername}>
                          @{post.userId?.username}
                        </p>
                      </div>
                    </div>

                    <p className={styles.postBody}>{post.body}</p>

                    {post.media &&
                      (["mp4", "webm", "quicktime", "mov"].includes(
                        post.fileType,
                      ) ? (
                        <video
                          className={styles.postMedia}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${post.media}`}
                          controls
                        />
                      ) : (
                        <img
                          className={styles.postMedia}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${post.media}`}
                          alt="Post attachment"
                        />
                      ))}

                    <p className={styles.postFooter}>
                      {Array.isArray(post.likes) ? post.likes.length : 0} likes
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {form && (
          <div className={styles.modalOverlay} onClick={closeEdit}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Edit Profile</h3>
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={closeEdit}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form className={styles.modalBody} onSubmit={handleSave}>
                <label className={styles.field}>
                  <span className={styles.label}>Headline</span>
                  <input
                    className={styles.input}
                    value={form.currentPost}
                    onChange={(e) => setField("currentPost", e.target.value)}
                    placeholder="e.g. Frontend Developer at Wivly"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Bio</span>
                  <textarea
                    className={styles.textarea}
                    value={form.bio}
                    onChange={(e) => setField("bio", e.target.value)}
                    placeholder="Tell people about yourself"
                  />
                </label>

                <div className={styles.field}>
                  <span className={styles.label}>Experience</span>
                  {form.pastWork.map((work, i) => (
                    <div key={i} className={styles.rowItem}>
                      <input
                        className={styles.input}
                        value={work.position}
                        onChange={(e) =>
                          setRow("pastWork", i, "position", e.target.value)
                        }
                        placeholder="Position"
                      />
                      <input
                        className={styles.input}
                        value={work.company}
                        onChange={(e) =>
                          setRow("pastWork", i, "company", e.target.value)
                        }
                        placeholder="Company"
                      />
                      <input
                        className={styles.input}
                        value={work.years}
                        onChange={(e) =>
                          setRow("pastWork", i, "years", e.target.value)
                        }
                        placeholder="Years (e.g. 2021 - 2023)"
                      />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeRow("pastWork", i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => addRow("pastWork", EMPTY_WORK)}
                  >
                    + Add experience
                  </button>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Education</span>
                  {form.education.map((edu, i) => (
                    <div key={i} className={styles.rowItem}>
                      <input
                        className={styles.input}
                        value={edu.school}
                        onChange={(e) =>
                          setRow("education", i, "school", e.target.value)
                        }
                        placeholder="School"
                      />
                      <input
                        className={styles.input}
                        value={edu.degree}
                        onChange={(e) =>
                          setRow("education", i, "degree", e.target.value)
                        }
                        placeholder="Degree"
                      />
                      <input
                        className={styles.input}
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          setRow("education", i, "fieldOfStudy", e.target.value)
                        }
                        placeholder="Field of study"
                      />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeRow("education", i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => addRow("education", EMPTY_EDUCATION)}
                  >
                    + Add education
                  </button>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closeEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Userlayout>
  );
}

export default Profile;
