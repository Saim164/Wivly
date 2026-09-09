import { useState } from "react";
import styles from "./styles.module.css";

const EMPTY_WORK = { company: "", position: "", years: "" };
const EMPTY_EDUCATION = { school: "", degree: "", fieldOfStudy: "" };

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    bio: profile?.bio || "",
    currentPost: profile?.currentPost || "",
    pastWork: (profile?.pastWork || []).map((w) => ({ ...EMPTY_WORK, ...w })),
    education: (profile?.education || []).map((e) => ({
      ...EMPTY_EDUCATION,
      ...e,
    })),
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Edit Profile</h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
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

        <form className={styles.body} onSubmit={handleSubmit}>
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

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
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
  );
}
