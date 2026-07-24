import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaHistory,
  FaSearch,
  FaFilter,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCommentDots,
  FaUndo,
  FaLock,
  FaUser,
  FaPlus,
  FaTag
} from "react-icons/fa";
import toast from "react-hot-toast";

const SupportHistoryPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/support");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load your support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketNumber, newStatus) => {
    setActionLoading(true);
    try {
      const response = await api.patch(`/support/${ticketNumber}`, {
        status: newStatus
      });
      toast.success(`Ticket #${ticketNumber} updated to ${newStatus}`);
      fetchTickets();
      if (selectedTicket && selectedTicket.ticket_number === ticketNumber) {
        setSelectedTicket(response.data);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
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
            <FaLock className="text-[10px]" />
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
        <LoadingSpinner message="Loading support ticket history..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg shadow-sky-500/20">
            <FaHistory />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              My Support History
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Track submitted support tickets, view administrator replies, close or reopen tickets
            </p>
          </div>
        </div>

        <Link
          to="/help"
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-sky-500/20 transition-all w-fit"
        >
          <FaPlus />
          <span>New Support Ticket</span>
        </Link>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 px-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket #, subject, message..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <FaFilter className="text-slate-400 text-xs mr-1 hidden sm:inline" />
          {["All", "Open", "In Progress", "Resolved", "Closed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List / Empty State */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "border-sky-500 ring-2 ring-sky-500/20 shadow-lg"
                      : "border-slate-200/60 dark:border-slate-800/80 hover:border-sky-500/40"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-black text-sky-500 text-sm">{ticket.ticket_number}</span>
                      {getPriorityBadge(ticket.priority)}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {ticket.category}
                      </span>
                    </div>

                    <div>{getStatusBadge(ticket.status)}</div>
                  </div>

                  {/* Subject & Message Preview */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 line-clamp-2 mt-1 leading-relaxed">
                      {ticket.message}
                    </p>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
                    <span>Submitted: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    {ticket.admin_reply ? (
                      <span className="text-emerald-500 font-extrabold flex items-center space-x-1">
                        <FaCommentDots />
                        <span>Admin Replied</span>
                      </span>
                    ) : (
                      <span className="text-amber-500 font-extrabold">Awaiting Reply</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Detail Drawer */}
          <div className="lg:col-span-1">
            {selectedTicket ? (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-5 sticky top-20">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-sky-500">{selectedTicket.ticket_number}</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <div>{getStatusBadge(selectedTicket.status)}</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category & Priority</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTicket.category}</span>
                      <span>•</span>
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">User Message</span>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedTicket.message}
                    </div>
                  </div>

                  {/* Admin Reply Section */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Team Response</span>
                    {selectedTicket.admin_reply ? (
                      <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-950 dark:text-sky-200 leading-relaxed font-semibold">
                        {selectedTicket.admin_reply}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold italic text-center">
                        Our support team is reviewing your ticket. You will receive an update shortly.
                      </div>
                    )}
                  </div>

                  {selectedTicket.assigned_to && (
                    <div className="text-[11px] font-bold text-slate-400">
                      Assigned Agent: <span className="text-slate-700 dark:text-slate-300">{selectedTicket.assigned_to}</span>
                    </div>
                  )}
                </div>

                {/* Ticket User Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {/* Update Status Label */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Status</span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Mark as In Progress — show when Open or Closed */}
                    {(selectedTicket.status === "Open" || selectedTicket.status === "Closed" || selectedTicket.status === "Resolved") && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedTicket.ticket_number, "In Progress")}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 font-extrabold text-xs transition-all border border-sky-500/20 disabled:opacity-50"
                      >
                        <FaTicketAlt className="text-[10px]" />
                        <span>{selectedTicket.status === "Resolved" || selectedTicket.status === "Closed" ? "Reopen" : "In Progress"}</span>
                      </button>
                    )}

                    {/* Mark as Resolved — show when Open or In Progress */}
                    {(selectedTicket.status === "Open" || selectedTicket.status === "In Progress") && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedTicket.ticket_number, "Resolved")}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 font-extrabold text-xs transition-all border border-emerald-500/20 disabled:opacity-50"
                      >
                        <FaCheckCircle className="text-[10px]" />
                        <span>Resolved</span>
                      </button>
                    )}

                    {/* Close Ticket — show when not already Closed */}
                    {selectedTicket.status !== "Closed" && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedTicket.ticket_number, "Closed")}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 font-extrabold text-xs transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                      >
                        <FaTimesCircle className="text-[10px]" />
                        <span>Close</span>
                      </button>
                    )}

                    {/* Reopen to Open — show when Closed */}
                    {selectedTicket.status === "Closed" && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedTicket.ticket_number, "Open")}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 font-extrabold text-xs transition-all border border-amber-500/20 disabled:opacity-50"
                      >
                        <FaUndo className="text-[10px]" />
                        <span>Open</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-center space-y-3 sticky top-20">
                <FaTicketAlt className="text-3xl text-slate-400 mx-auto" />
                <h4 className="text-sm font-black text-slate-800 dark:text-white">Select a Ticket</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any ticket on the left to view response details, admin replies, and manage status.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-3xl mx-auto">
            <FaTicketAlt />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No Support Tickets Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {search || statusFilter !== "All"
              ? "No tickets matched your current search and filter criteria."
              : "You haven't submitted any support tickets yet. Need help with a travel itinerary or booking?"}
          </p>
          <Link
            to="/help"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold text-xs shadow-md"
          >
            <FaPlus />
            <span>Create New Ticket</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SupportHistoryPage;
