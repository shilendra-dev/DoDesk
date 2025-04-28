import { useState } from "react";
import axios from "axios";

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
        `http://localhost:5033/api/workspaces/${workspaceId}/invite`,
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
        className={`fixed inset-0 bg-opacity-20 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#101221] border-gray- shadow-2xl p-6 z-50 transform transition-transform duration-300 border-l border-gray-700 ${
          isOpen ? "translate-x-0" : "translate-x-full border-gray-50"
        }`}
      >
        <h2 className="text-white text-2xl mb-6">Invite Member</h2>

        <input
          type="email"
          className="w-full p-3 rounded-md mb-6 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter user's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleInvite}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md text-white font-semibold"
        >
          {loading ? "Inviting..." : "Invite"}
        </button>

        {message && (
          <p className="text-green-400 mt-6 text-center text-sm">{message}</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
        >
          ✖
        </button>
      </div>
    </>
  );
}

export default InviteMemberDrawer;
