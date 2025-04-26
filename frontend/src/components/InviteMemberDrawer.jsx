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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="bg-[#101221] w-96 h-full p-6 shadow-lg">
        <h2 className="text-white text-2xl mb-4">Invite Member</h2>

        <input
          type="email"
          className="w-full p-2 rounded-md mb-4 bg-gray-800 text-white"
          placeholder="Enter user's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleInvite}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {loading ? "Inviting..." : "Invite"}
        </button>

        {message && (
          <p className="text-green-400 mt-4 text-center">{message}</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default InviteMemberDrawer;
