import { useState } from "react";
import axios from "axios";
import { X, Mail, Send } from "lucide-react";
import HeadlessInput from "../atoms/headlessUI/HeadlessInput";
import HeadlessButton from "../atoms/headlessUI/HeadlessButton";

function InviteMemberDrawer({ isOpen, onClose, workspaceId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    if (!email) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5033/api/workspace/${workspaceId}/invite`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      console.error("Error inviting member:", error);
      setMessage(error.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[var(--color-overlay)] backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[90vw] bg-[var(--color-bg)] z-50 shadow-2xl rounded-xl border border-[var(--color-border)] transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b  bg-[var(--color-bg)]/90 backdrop-blur-sm rounded-t-xl">
          <h2 className="text-xl font-semibold text-[var(--color-text)] truncate flex items-center gap-2">
            <Mail size={20} className="text-[var(--color-text)]" />
            Invite Member
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text)]  flex items-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[var(--color-text)] w-[140px] flex-shrink-0">
              <Mail size={16} />
              <label htmlFor="email" className="uppercase tracking-wide font-semibold text-xs select-none">
                Email
              </label>
            </div>
            <HeadlessInput
              id="email"
              variant="secondary"
              type="email"
              placeholder="Enter user's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 rounded-b-xl">
          <HeadlessButton
            onClick={handleInvite}
            disabled={loading}
            size="md"
            className="w-full flex items-center justify-center"
          >
            <Send size={18} />
            {loading ? "Inviting..." : "Send Invite"}
          </HeadlessButton>
        </div>

        <style>{`
          @keyframes modalIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          .modal-enter {
            animation: modalIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}

export default InviteMemberDrawer;
