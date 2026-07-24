import React, { useState, useEffect } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaUserShield,
  FaSearch,
  FaFilter,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCommentDots,
  FaUserCheck,
  FaTrashAlt,
  FaPaperPlane,
  FaExclamationTriangle,
  FaSpinner,
  FaEnvelope,
  FaTag
} from "react-icons/fa";
import toast from "react-hot-toast";

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Admin Reply & Agent Form State
  const [replyText, setReplyText] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [statusState, setStatusState] = useState("Open");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/support");
      setTickets(response.data);
      if (selectedTicket) {
        const updatedSelected = response.data.find((t) => t.ticket_number === selectedTicket.ticket_number);
        if (updatedSelected) {
          setSelectedTicket(updatedSelected);
          setReplyText(updatedSelected.admin_reply || "");
          setAssignedAgent(updatedSelected.assigned_to || "");
          setStatusState(updatedSelected.status || "Open");
        }
      }
    } catch (error) {
      console.error("Error fetching admin support tickets:", error);
      toast.error("Failed to load admin support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || "");
    setAssignedAgent(ticket.assigned_to || "");
    setStatusState(ticket.status || "Open");
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      const payload = {
        admin_reply: replyText.trim() || undefined,
        assigned_to: assignedAgent.trim() || undefined,
        status: statusState
      };

      const response = await api.patch(`/support/${selectedTicket.ticket_number}`, payload);
      toast.success(`Ticket #${selectedTicket.ticket_number} updated successfully!`);
      if (payload.status === "Resolved") {
        toast.success("Resolution email notification triggered via Resend API.");
      }
      fetchAllTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async (ticketNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket #${ticketNumber}?`)) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/support/${ticketNumber}`);
      toast.success(`Ticket #${ticketNumber} deleted.`);
      if (selectedTicket?.ticket_number === ticketNumber) {
        setSelectedTicket(null);
      }
      fetchAllTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "All" || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FaClock className="text-[10px]" />
            <span>Open</span>
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <FaTicketAlt className="text-[10px]" />
            <span>In Progress</span>
          </span>
        );
      case "Resolved":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FaCheckCircle className="text-[10px]" />
            <span>Resolved</span>
          </span>
        );
      case "Closed":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-black bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <FaTimesCircle className="text-[10px]" />
            <span>Closed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">Urgent</span>;
      case "High":
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">High</span>;
      case "Medium":
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/20">Medium</span>;
      default:
        return <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20">Low</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Loading support ticket management console..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/20">
            <FaUserShield />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Support Management Console
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Admin ticket management — view, assign, respond, update status & send resolution emails
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Total Tickets: {tickets.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Open: {tickets.filter((t) => t.status === "Open").length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 px-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, ticket #..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Priority & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List Column */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket)}
                  className={`glass-panel p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "border-purple-500 ring-2 ring-purple-500/20 shadow-lg"
                      : "border-slate-200/60 dark:border-slate-800/80 hover:border-purple-500/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-purple-600 dark:text-purple-400 text-sm">{ticket.ticket_number}</span>
                      {getPriorityBadge(ticket.priority)}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {ticket.category}
                      </span>
                    </div>

                    <div>{getStatusBadge(ticket.status)}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 line-clamp-2 mt-1 leading-relaxed">
                      {ticket.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-400 pt-1">
                    <span>
                      User: <strong className="text-slate-700 dark:text-slate-200">{ticket.name}</strong> ({ticket.email})
                    </span>
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-center space-y-2">
              <FaTicketAlt className="text-3xl text-slate-400 mx-auto" />
              <h4 className="text-sm font-black text-slate-800 dark:text-white">No Tickets Match Filters</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try adjusting your search query or filter options.
              </p>
            </div>
          )}
        </div>

        {/* Ticket Management Form Panel */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-5 sticky top-20">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">{selectedTicket.ticket_number}</span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {selectedTicket.subject}
                  </h3>
                </div>

                <button
                  onClick={() => handleDeleteTicket(selectedTicket.ticket_number)}
                  disabled={deleting}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs"
                  title="Delete Ticket"
                >
                  <FaTrashAlt />
                </button>
              </div>

              {/* User Info Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                  <span>{selectedTicket.name}</span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-semibold">{selectedTicket.email}</div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Category: <strong>{selectedTicket.category}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  "{selectedTicket.message}"
                </div>
              </div>

              {/* Management Form */}
              <form onSubmit={handleUpdateTicket} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Update Status
                  </label>
                  <select
                    value={statusState}
                    onChange={(e) => setStatusState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved (Triggers User Email)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Assigned Agent
                  </label>
                  <input
                    type="text"
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    placeholder="e.g. Support Agent Alex"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Administrator Reply / Resolution
                  </label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write detailed response or resolution instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Save Ticket & Send Reply</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-center space-y-3 sticky top-20">
              <FaUserShield className="text-3xl text-purple-400 mx-auto" />
              <h4 className="text-sm font-black text-slate-800 dark:text-white">Admin Management Panel</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any support ticket on the left to assign agents, write replies, update statuses, or delete tickets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
