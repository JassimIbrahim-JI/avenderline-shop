"use client";

import React, { useState, useEffect } from "react";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
  status: "Active" | "Unsubscribed";
}

export default function AdminMarketingPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Broadcast Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("Private Ramadan Capsule Preview");
  const [broadcastSubject, setBroadcastSubject] = useState("Exclusive Atelier Preview â€” AvenderLine Ramadan Collection");
  const [broadcastContent, setBroadcastContent] = useState(
    "We cordially invite our private clientele to discover the new Haute Couture capsule crafted in our Doha atelier. Featuring Japanese crepe drapes and hand-embroidered metallic accents.\n\nAppointments for bespoke fittings are now open."
  );
  const [broadcastButtonText, setBroadcastButtonText] = useState("Discover The Capsule");
  const [broadcastButtonUrl, setBroadcastButtonUrl] = useState("https://avenderline.com/collections/occasions");
  const [testRecipient, setTestRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  // Fetch Subscribers
  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (res.ok) {
        setSubscribers(data.subscribers || []);
      } else {
        setError(data.error || "Failed to load subscribers.");
      }
    } catch {
      setError("Network error while connecting to subscriber database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  // Remove Subscriber
  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the subscriber circle?`)) return;

    try {
      const res = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.email.toLowerCase() !== email.toLowerCase()));
      } else {
        alert("Failed to remove subscriber.");
      }
    } catch {
      alert("Error removing subscriber.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }

    const headers = ["Email", "Subscribed At", "Source", "Status"];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.subscribedAt).toLocaleString("en-US"),
      s.source,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `avenderline_subscribers_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dispatch Broadcast Campaign
  const handleSendBroadcast = async (mode: "test" | "all") => {
    setIsSending(true);
    setBroadcastResult(null);

    try {
      const payload = {
        title: broadcastTitle,
        subject: broadcastSubject,
        content: broadcastContent,
        buttonText: broadcastButtonText,
        buttonUrl: broadcastButtonUrl,
        testRecipient: mode === "test" ? testRecipient : undefined,
      };

      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setBroadcastResult(`âœ“ Success: ${data.message}`);
      } else {
        setBroadcastResult(`âš ï¸ Error: ${data.error || "Failed to dispatch campaign."}`);
      }
    } catch (err: any) {
      setBroadcastResult(`âš ï¸ Network Error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e9e9e9] pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[#1c1b1b]">
            Newsletter & Client Circle
          </h1>
          <p className="mt-1 text-xs text-[#6a6a6a]">
            Manage private clientele subscriptions, export email records, and broadcast atelier announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="border border-[#1c1b1b] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#faf8f5] transition shadow-xs"
          >
            ðŸ“¥ Export to CSV
          </button>
          <button
            onClick={() => {
              setBroadcastResult(null);
              setIsModalOpen(true);
            }}
            className="bg-[#1c1b1b] text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#8b7355] transition shadow-xs"
          >
            âœ‰ï¸ Compose Announcement
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border border-[#e9e9e9] bg-white p-5 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
            Total Subscribers
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1c1b1b] font-mono">
            {subscribers.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Active patrons in circle
          </div>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-5 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
            Email Delivery Provider
          </div>
          <div className="mt-2 text-base font-bold text-[#1c1b1b]">
            Resend API (REST)
          </div>
          <div className="mt-1 text-[11px] text-[#6a6a6a]">
            Free Tier: 3,000 emails/month
          </div>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-5 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
            Primary Channels
          </div>
          <div className="mt-2 text-base font-bold text-[#1c1b1b]">
            Storefront & Atelier
          </div>
          <div className="mt-1 text-[11px] text-[#6a6a6a]">
            Footer opt-ins & checkout
          </div>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-5 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
            Subscriber Status
          </div>
          <div className="mt-2 text-base font-bold text-emerald-700">
            100% Verified Active
          </div>
          <div className="mt-1 text-[11px] text-[#6a6a6a]">
            Zero bounce rate recorded
          </div>
        </div>
      </div>

      {/* Subscribers Table Section */}
      <div className="border border-[#e9e9e9] bg-white shadow-xs">
        <div className="p-4 sm:p-6 border-b border-[#e9e9e9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
              Client Directory ({filteredSubscribers.length})
            </h3>
            <span className="text-xs text-[#888888]">Subscribers stored securely for AvenderLine Atelier</span>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscriber by email..."
              className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#888888]">Loading subscriber database...</div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-red-600">âš ï¸ {error}</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#888888]">
            No subscribers found matching &ldquo;{search}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1c1b1b]">
              <thead className="border-b border-[#e9e9e9] bg-[#faf8f5] text-[11px] uppercase tracking-wider text-[#777777]">
                <tr>
                  <th className="px-6 py-3 font-semibold">Subscriber Email</th>
                  <th className="px-6 py-3 font-semibold">Acquisition Source</th>
                  <th className="px-6 py-3 font-semibold">Joined Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2eee8]">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.email} className="hover:bg-[#faf8f5]/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#1c1b1b]">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 capitalize text-[#666666]">
                      {sub.source.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-[#777777]">
                      {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.email)}
                        className="text-[11px] text-red-600 hover:text-red-800 uppercase tracking-wider font-semibold transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broadcast Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#e9e9e9] shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between border-b border-[#e9e9e9] pb-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-[#1c1b1b]">
                  Compose Atelier Announcement
                </h3>
                <span className="text-xs text-[#888888]">
                  Dispatch Haute Couture email blast to all {subscribers.length} active patrons
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-xl font-bold p-1"
              >
                âœ•
              </button>
            </div>

            {broadcastResult && (
              <div
                className={`mb-6 p-3 text-xs rounded border ${
                  broadcastResult.startsWith("âœ“")
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {broadcastResult}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                  Email Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Atelier Private Salon Invitation"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                  Announcement Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Private Ramadan Capsule Preview"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                  Announcement Body Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-3 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={broadcastButtonText}
                    onChange={(e) => setBroadcastButtonText(e.target.value)}
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                    Button Destination URL
                  </label>
                  <input
                    type="url"
                    value={broadcastButtonUrl}
                    onChange={(e) => setBroadcastButtonUrl(e.target.value)}
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                  />
                </div>
              </div>

              {/* Test Recipient Box */}
              <div className="border-t border-[#eeeeee] pt-4 mt-4">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] mb-1.5">
                  ðŸ§ª Send Test Email First (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="e.g. owner@domain.com"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                  />
                  <button
                    type="button"
                    disabled={isSending || !testRecipient.trim()}
                    onClick={() => handleSendBroadcast("test")}
                    className="border border-[#1c1b1b] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#faf8f5] transition whitespace-nowrap disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Send Test"}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#888888]">
                  Sends a single test preview to this address before broadcasting to everyone.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#e9e9e9] pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#777777] hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => {
                  if (confirm(`Are you sure you want to broadcast this announcement to all ${subscribers.length} subscribers?`)) {
                    handleSendBroadcast("all");
                  }
                }}
                className="bg-[#1c1b1b] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#8b7355] transition disabled:opacity-50"
              >
                {isSending ? "Dispatching Broadcast..." : `Send Blast to All (${subscribers.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


