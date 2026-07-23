import React, { useState } from "react";
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
  FaPhoneAlt
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
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    priority: "Medium",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const filteredFaqs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.message.trim()) {
      toast.error("Please enter your support message.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Support ticket created! Our team will get back to you within 2 hours.");
      setContactForm({
        name: "",
        email: "",
        subject: "General Inquiry",
        priority: "Medium",
        message: ""
      });
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-200/60 dark:border-slate-800/80 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-purple-500/15 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-sky-500/30">
          <FaQuestionCircle />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How can we help you plan your journey?
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Search our knowledge base, explore frequently asked questions, or reach out to our dedicated support team 24/7.
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
                  Your Name
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
                  Email Address
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
                  Priority
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Medium">Medium - Feature Issue</option>
                  <option value="High">High - Urgent Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Message
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
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold text-xs hover:shadow-lg hover:shadow-sky-500/25 transition-all"
              >
                <FaPaperPlane />
                <span>{submitting ? "Submitting..." : "Send Ticket"}</span>
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
              <span className="text-emerald-500">&lt; 15 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
