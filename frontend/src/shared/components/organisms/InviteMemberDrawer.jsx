import { useState } from "react";
import axios from "axios";
import { X, Mail, Send } from "lucide-react";

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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[90vw] bg-[#0f172a] z-50 shadow-2xl rounded-xl border border-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur-sm rounded-t-xl">
          <h2 className="text-xl font-semibold text-white truncate flex items-center gap-2">
            <Mail size={20} className="text-blue-400" />
            Invite Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-150 transform hover:scale-110 hover:rotate-90 flex items-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
              <Mail size={16} />
              <label htmlFor="email" className="uppercase tracking-wide font-semibold text-xs select-none">
                Email
              </label>
            </div>
            <input
              id="email"
              type="email"
              className="flex-1 bg-[#1e293b] text-white text-lg font-medium rounded-lg px-4 py-2.5 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-200 ease-in-out border border-gray-700 hover:border-gray-600"
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
        <div className="p-6 border-t border-gray-800 rounded-b-xl">
          <button
            onClick={handleInvite}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium
              transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-lg
              flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {loading ? "Inviting..." : "Send Invite"}
          </button>
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
