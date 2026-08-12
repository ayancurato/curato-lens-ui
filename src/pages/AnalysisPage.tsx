import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Loader2, 
  Circle, 
  AlertCircle, 
  ArrowLeft,
  Globe,
  Radio,
  Search,
  Users,
  FileText,
  Shield,
  BarChart,
  FileCheck,
  Lock,
  Sparkles
} from "lucide-react";
import { useJobStatus } from "@/hooks/useApi";
import { Navbar } from "@/components/layout/Navbar";

/* ── Pipeline Steps ──────────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  { 
    title: "Crawling Website", 
    subtitle: "Discovering and scanning all pages on your website",
    icon: Globe 
  },
  { 
    title: "Extracting Brand Signals", 
    subtitle: "Identifying key brand mentions and digital footprint",
    icon: Radio 
  },
  { 
    title: "SEO Analysis", 
    subtitle: "Analyzing on-page, technical SEO and performance",
    icon: Search 
  },
  { 
    title: "Social Media Analysis", 
    subtitle: "Scanning social platforms and engagement metrics",
    icon: Users 
  },
  { 
    title: "Content Evaluation", 
    subtitle: "Assessing content quality, relevance and structure",
    icon: FileText 
  },
  { 
    title: "Authority Analysis", 
    subtitle: "Evaluating domain authority and trust signals",
    icon: Shield 
  },
  { 
    title: "Competitor Benchmarking", 
    subtitle: "Comparing performance against key competitors",
    icon: BarChart 
  },
  { 
    title: "Generating AI Report", 
    subtitle: "Compiling insights and recommendations",
    icon: FileCheck 
  },
];

/* ── Thinking Messages ───────────────────────────────────────────────── */

const THINKING_MESSAGES = [
  "Researching website architecture...",
  "Discovering brand positioning...",
  "Evaluating search visibility...",
  "Reviewing technical performance...",
  "Analyzing domain authority...",
  "Understanding content strategy...",
  "Reviewing social presence...",
  "Benchmarking against competitors...",
  "Calculating brand health scores...",
  "Generating executive recommendations...",
  "Compiling intelligence report...",
];

/* ── Decorative Pattern ──────────────────────────────────────────────── */
const DotPattern = ({ className }: { className?: string }) => (
  <svg className={`absolute pointer-events-none opacity-50 ${className}`} width="140" height="140" fill="none" viewBox="0 0 100 100">
    <pattern id="dots-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="var(--color-teal)" opacity="0.3" />
    </pattern>
    <rect x="0" y="0" width="100" height="100" fill="url(#dots-pattern)" />
  </svg>
);

/* ── Page Component ──────────────────────────────────────────────────── */

export function AnalysisPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: job, isError } = useJobStatus(jobId ?? null);

  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  // Rotate thinking messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const message = THINKING_MESSAGES[messageIndex];
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i <= message.length) {
        setDisplayedText(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [messageIndex]);

  // Auto-navigate to report on completion
  useEffect(() => {
    if (job?.status === "completed") {
      const timer = setTimeout(() => {
        navigate(`/report/${job.job_id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [job?.status, job?.job_id, navigate]);

  // Derive which steps are complete based on progress
  const progress = job?.progress_pct ?? 0;
  const completedSteps = Math.floor((progress / 100) * PIPELINE_STEPS.length);
  const isCompleted = job?.status === "completed";
  const isFailed = job?.status === "failed";
  
  // Safe step counter for display (1 to 8)
  const currentDisplayStep = Math.min(completedSteps + 1, PIPELINE_STEPS.length);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      {/* Decorative Dots */}
      <DotPattern className="top-32 left-12 hidden xl:block" />
      <DotPattern className="top-32 right-12 hidden xl:block" />

      <div className="container-premium relative z-10" style={{ paddingTop: "180px", paddingBottom: "100px" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center mt-6 md:mt-0 mb-10 md:mb-14"
          >
            <h1
              className="w-full text-center text-[38px] leading-[1.1] md:text-5xl md:leading-tight font-bold mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}
            >
              {isCompleted
                ? "Analysis Complete"
                : isFailed
                  ? "Analysis Failed"
                  : "Our AI agents are working on your report."}
            </h1>
            <p className="w-full text-center text-lg md:text-xl leading-relaxed max-w-3xl font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {isCompleted
                ? "Your intelligence report is ready."
                : isFailed
                  ? job?.error_message || "Something went wrong. Please try again."
                  : "Sit tight! We're analyzing your digital presence to deliver actionable intelligence."}
            </p>
          </motion.div>

          {/* Error State Overlay */}
          {(isFailed || isError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  color: "var(--color-danger)",
                }}
              >
                <AlertCircle className="w-5 h-5" />
                {job?.error_message || "An error occurred during analysis."}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="btn-secondary text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Progress Summary Card */}
          {!isFailed && !isError && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-[20px] md:rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 mb-8 max-sm:pb-8 max-sm:mb-10 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative z-10">
                {/* Left: Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-navy)", color: "#fff" }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>

                {/* Center: Activity */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-900 text-[1.05rem] mb-1 truncate max-sm:whitespace-normal">
                    {isCompleted ? "Analysis finished successfully." : displayedText}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <span>{isCompleted ? "Completed" : "This may take 1–2 minutes"}</span>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-teal)" }}></span>
                      <span>Step {isCompleted ? 8 : currentDisplayStep} of 8</span>
                    </div>
                  </div>
                </div>

                {/* Right: Percentage */}
                <div className="flex-shrink-0 text-right pl-4">
                  <span className="text-xl font-bold" style={{ color: "var(--color-teal)" }}>
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full relative !m-0"
                  style={{ background: "linear-gradient(90deg, var(--color-teal), #4fd1c5, var(--color-teal))", backgroundSize: "200% 100%" }}
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${progress}%`,
                    backgroundPosition: ["100% 0%", "-100% 0%"]
                  }}
                  transition={{ 
                    width: { duration: 0.5, ease: "easeOut" },
                    backgroundPosition: { repeat: Infinity, duration: 2, ease: "linear" }
                  }}
                >
                  <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)" }}></div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Main Timeline Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:bg-white md:rounded-[1.5rem] md:shadow-sm md:border md:border-gray-100 md:p-8 md:px-12 md:py-10 mb-8 max-sm:mb-12 relative md:overflow-hidden"
          >
            <div className="relative">
              {/* Vertical Connecting Line */}
              {/* 24px (num) + 24px (gap) + 28px (half icon) = 76px (4.75rem) from left */}
              <div 
                className="absolute top-8 bottom-8 left-[4.75rem] w-px bg-gray-100 hidden sm:block z-0" 
              />
              
              <div className="flex flex-col max-sm:gap-6 md:space-y-0 md:block relative z-10 max-sm:mt-8">
                {PIPELINE_STEPS.map((step, i) => {
                  const isDone = isCompleted || i < completedSteps;
                  const isActive = !isCompleted && !isFailed && i === completedSteps;
                  const StepIcon = step.icon;
                  const isLast = i === PIPELINE_STEPS.length - 1;

                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className={`flex flex-row items-start md:items-center gap-4 md:gap-6 py-5 max-sm:py-6 md:py-10 bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 max-sm:p-6 mb-3 max-sm:mb-0 md:bg-transparent md:rounded-none md:shadow-none md:border-none md:p-0 md:mb-0 ${
                        !isLast ? "md:border-b md:border-gray-50" : ""
                      }`}
                    >
                      {/* Step number (Left) */}
                      <span
                        className="text-[0.85rem] font-semibold w-6 text-right tabular-nums flex-shrink-0 hidden sm:block mt-0.5"
                        style={{ color: isDone || isActive ? "var(--color-teal)" : "#cbd5e1" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Circular Icon */}
                      <div className="flex-shrink-0 relative z-10 bg-white">
                        {isActive && (
                           <motion.div 
                             className="absolute inset-0 rounded-full"
                             style={{ border: "2px solid var(--color-teal)" }}
                             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                           />
                        )}
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center border transition-colors duration-300 relative z-10"
                          style={{
                            borderColor: isActive || isDone ? "rgba(43, 182, 168, 0.4)" : "rgba(226, 232, 240, 0.8)",
                            background: isActive || isDone ? "rgba(43, 182, 168, 0.08)" : "#F8FAFC",
                          }}
                        >
                          <StepIcon 
                            strokeWidth={isActive || isDone ? 2.5 : 2}
                            className="w-7 h-7" 
                            style={{ color: isActive || isDone ? "var(--color-teal)" : "#94a3b8" }} 
                          />
                        </div>
                      </div>

                      {/* Content: Title & Subtitle */}
                      <div className="flex-grow min-w-0 flex flex-col md:flex-row md:items-center">
                        <div className="flex-grow min-w-0 pr-0 md:pr-4 pt-1 md:pt-0">
                          <h4 
                            className="text-base font-semibold mb-1 md:mb-2"
                            style={{ color: isActive || isDone ? "var(--color-navy)" : "#475569" }}
                          >
                            {step.title}
                          </h4>
                          <p className="text-[15px] text-gray-500/90 font-medium leading-relaxed">
                            {step.subtitle}
                          </p>
                          
                          {/* Status Pill & Indicator (MOBILE ONLY) */}
                          <div className="flex items-center gap-5 mt-3 md:hidden">
                            {isDone ? (
                              <>
                                <div 
                                  className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold bg-gray-50/80"
                                  style={{ color: "#64748b" }}
                                >
                                  Completed
                                </div>
                                <Check className="w-[1.15rem] h-[1.15rem]" style={{ color: "var(--color-teal)" }} />
                              </>
                            ) : isActive ? (
                              <>
                                <div 
                                  className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold"
                                  style={{ background: "rgba(43, 182, 168, 0.12)", color: "var(--color-teal-dark)" }}
                                >
                                  In progress
                                </div>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                >
                                  <Loader2 className="w-[1.15rem] h-[1.15rem]" style={{ color: "var(--color-teal)" }} />
                                </motion.div>
                              </>
                            ) : (
                              <>
                                <div 
                                  className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold"
                                  style={{ background: "#F1F5F9", color: "#94a3b8" }}
                                >
                                  Pending
                                </div>
                                <div className="w-[1.15rem] h-[1.15rem] flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Pill & Indicator (DESKTOP ONLY) */}
                        <div className="hidden md:flex items-center gap-5 flex-shrink-0 mt-3 md:mt-0">
                          {isDone ? (
                            <>
                              <div 
                                className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold bg-gray-50/80"
                                style={{ color: "#64748b" }}
                              >
                                Completed
                              </div>
                              <Check className="w-[1.15rem] h-[1.15rem]" style={{ color: "var(--color-teal)" }} />
                            </>
                          ) : isActive ? (
                            <>
                              <div 
                                className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold"
                                style={{ background: "rgba(43, 182, 168, 0.12)", color: "var(--color-teal-dark)" }}
                              >
                                In progress
                              </div>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                              >
                                <Loader2 className="w-[1.15rem] h-[1.15rem]" style={{ color: "var(--color-teal)" }} />
                              </motion.div>
                            </>
                          ) : (
                            <>
                              <div 
                                className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold"
                                style={{ background: "#F1F5F9", color: "#94a3b8" }}
                              >
                                Pending
                              </div>
                              <div className="w-[1.15rem] h-[1.15rem] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Privacy Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-[1.25rem] p-5 sm:p-6 flex items-start sm:items-center gap-4 relative overflow-hidden mb-6"
            style={{ background: "rgba(43, 182, 168, 0.04)" }}
          >
            {/* Very subtle dots just for the privacy card */}
            <DotPattern className="-bottom-8 -right-8 opacity-40 scale-75 hidden sm:block text-teal-600/10" />
            
            <div 
              className="w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center bg-white shadow-sm border border-gray-100"
            >
              <Lock className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-0.5">
                Your data is safe with us
              </h4>
              <p className="text-[0.85rem] font-medium text-gray-500">
                We do not share your data with any third parties. Your privacy is our priority.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
