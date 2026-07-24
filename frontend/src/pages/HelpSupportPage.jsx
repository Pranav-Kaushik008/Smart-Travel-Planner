import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  FaQuestionCircle,
  FaSearch,
  FaHeadset,
  FaBook,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaPlane,
  FaCloudSun,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaHistory,
  FaUserShield,
  FaCopy,
  FaTimes,
  FaSpinner
} from "react-icons/fa";
import toast from "react-hot-toast";

const FAQ_ITEMS = [
  {
    category: "AI Planner & Itineraries",
    question: "How does the AI Travel Planner generate my recommendation?",
    answer: "Our machine learning engine analyzes 24 unique combinations of Travel Styles (Beach, Adventure, Historical, Nature, Spiritual, Wildlife) and Seasons (Summer, Winter, Monsoon, All). It factors in your budget, trip duration, and real-time weather to calculate the optimal Indian destination alongside day-by-day itineraries."
  },
  {
    category: "AI Planner & Itineraries",
    question: "Can I customize or export my Day-by-Day travel itinerary?",
    answer: "Yes! Every day-wise travel plan provides color-coded morning, afternoon, evening, dining, and tip blocks. You can view saved trips anytime in your 'Trip History' tab."
  },
  {
    category: "Transport & Bookings",
    question: "How do train and flight booking links work?",
    answer: "When a destination is selected, our system checks nearest airport codes (e.g. Cochin for Munnar, Dehradun for Rishikesh, Netaji Subhash Chandra Bose CCU for Sundarbans). You get direct 1-click links to MakeMyTrip, Skyscanner, Cleartrip, IRCTC, and RedBus."
  },
  {
    category: "Transport & Bookings",
    question: "What if a destination has no direct airport or railway station?",
    answer: "Destinations like Kedarnath, Munnar, Coorg, Kolad, Nagarhole, and Sundarbans feature special Nearest Airport banners and Train/Bus Transit Guidance notes, instructing you on the nearest railhead or ferry terminal."
  },
  {
    category: "Weather & Directions",
    question: "Where does live weather forecast data come from?",
    answer: "We connect directly with OpenWeatherMap API to retrieve real-time temperature, weather condition descriptions, humidity, and wind speed for all destinations."
  },
  {
    category: "Account & Security",
    question: "How is my personal profile data stored?",
    answer: "Your profile details are secured using JWT (JSON Web Tokens) and stored in our backend database. You can manage your preferences anytime under Settings & Profile."
  }
];

const HelpSupportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General Inquiry",
    priority: "Medium",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || user.full_name || user.username || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const filteredFaqs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/support", contactForm);
      setSubmittedTicket(response.data);
      toast.success("Support ticket created successfully!");
      setContactForm({
        name: user?.full_name || user?.username || "",
        email: user?.email || "",
        subject: "",
        category: "General Inquiry",
        priority: "Medium",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      toast.error(error.response?.data?.detail || "Failed to submit support ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyTicketNumber = () => {
    if (submittedTicket?.ticket_number) {
      navigator.clipboard.writeText(submittedTicket.ticket_number);
      toast.success(`Copied ${submittedTicket.ticket_number} to clipboard!`);
    }
  };

  const isAdmin = user?.is_admin === true;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 px-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <FaQuestionCircle className="text-sky-500 text-sm" />
          <span>Need help with your travel plans? We're here 24/7</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/support-history"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 font-extrabold text-xs transition-all border border-sky-500/20"
          >
            <FaHistory />
            <span>My Support Tickets</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/support"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-600 dark:text-purple-400 font-extrabold text-xs transition-all border border-purple-500/20"
            >
              <FaUserShield />
              <span>Admin Support Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-purple-500/15 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-sky-500/30">
          <FaQuestionCircle />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How can we help you plan your journey?
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Search our knowledge base, explore frequently asked questions, or submit a support ticket to our team.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-2">
          <FaSearch className="absolute left-4 top-6 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, bookings, weather, or travel tips..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-md"
          />
        </div>
      </div>

      {/* Category Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FaPlane className="text-sky-500" />, title: "Flight & Transit Support", desc: "Airports, train stations & bus routes" },
          { icon: <FaCloudSun className="text-amber-500" />, title: "Weather & Forecasts", desc: "Live OpenWeather updates & climate" },
          { icon: <FaMapMarkedAlt className="text-emerald-500" />, title: "Itinerary Guidance", desc: "AI matching algorithm & sights" },
          { icon: <FaShieldAlt className="text-purple-500" />, title: "Account & Safety", desc: "Passwords, security & profile data" }
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:border-sky-500/30 transition-all shadow-xs space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: FAQ Accordions */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2.5">
              <FaBook className="text-sky-500 text-lg" />
              <span>Frequently Asked Questions</span>
            </h2>
            <span className="text-xs font-extrabold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/20">
              {filteredFaqs.length} Articles
            </span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/40 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-extrabold text-xs sm:text-sm text-slate-850 dark:text-white hover:text-sky-500 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {isOpen ? (
                        <FaChevronUp className="text-sky-500 shrink-0 text-xs" />
                      ) : (
                        <FaChevronDown className="text-slate-400 shrink-0 text-xs" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-350 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-500/5">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-sky-500 mb-1">
                          {faq.category}
                        </span>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                No matching FAQ questions found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Direct Contact Form & Channels */}
        <div className="space-y-6">
          {/* Contact Support Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <FaHeadset className="text-sky-500" />
              <span>Contact Support Team</span>
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Pranav Kaushik"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Summary of issue..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="AI Planner & Itineraries">AI Planner</option>
                    <option value="Transport & Bookings">Transport</option>
                    <option value="Weather & Forecasts">Weather</option>
                    <option value="Account & Security">Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your issue or feedback..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-extrabold text-xs hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Contact Cards */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-3">
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <FaEnvelope className="text-sky-500 text-sm shrink-0" />
              <span>pranavkaushikyr@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <FaPhoneAlt className="text-emerald-500 text-sm shrink-0" />
              <span>+91 9980254247</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Avg Response Time:</span>
              <span className="text-emerald-500 font-extrabold">&lt; 2 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* ELEGANT TICKET SUBMISSION SUCCESS MODAL */}
      {submittedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setSubmittedTicket(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Success Icon Badge */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Ticket Submitted Successfully!
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Your support request has been logged into PostgreSQL and notified to our support team.
              </p>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                <span className="font-extrabold text-slate-500 dark:text-slate-400">Ticket Number</span>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sky-500 text-sm">{submittedTicket.ticket_number}</span>
                  <button
                    onClick={copyTicketNumber}
                    className="p-1 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all"
                    title="Copy Ticket Number"
                  >
                    <FaCopy className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                <span className="font-extrabold text-slate-500 dark:text-slate-400">Current Status</span>
                <span className="font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {submittedTicket.status || "Open"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                <span className="font-extrabold text-slate-500 dark:text-slate-400">Expected Response Time</span>
                <span className="font-bold text-slate-800 dark:text-white">&lt; 2 Hours</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-500 dark:text-slate-400">Submission Date</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {new Date(submittedTicket.created_at || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setSubmittedTicket(null)}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  navigate("/support-history");
                }}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <FaHistory />
                <span>View Support History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupportPage;
