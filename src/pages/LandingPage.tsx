import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  BarChart3,
  Target,
  Shield,
  FileText,
  ArrowRight,
  Sparkles,
  Lock,
  Link,
  Camera,
  AtSign,
  Users,
  Play,
  Zap,
  Brain,
  TrendingUp,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { useCreateAnalysis } from "@/hooks/useApi";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

/* ── Form Schema ─────────────────────────────────────────────────────── */

const schema = z.object({
  website_url: z.string().url("Please enter a valid website URL"),
  linkedin_url: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  instagram_url: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  twitter_url: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  facebook_url: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  youtube_url: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

/* ── Animation variants ──────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Features Data ───────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Brain,
    title: "AI Brand Analysis",
    description:
      "Deep learning models analyze your brand's digital footprint across every touchpoint to uncover valuable insights.",
  },
  {
    icon: Search,
    title: "SEO Intelligence",
    description:
      "Comprehensive search visibility audit with actionable optimization strategies to improve rankings and organic performance.",
  },
  {
    icon: Eye,
    title: "Social Intelligence",
    description:
      "Cross-platform social presence analysis with engagement benchmarking and audience sentiment insights.",
  },
  {
    icon: Target,
    title: "Brand Positioning",
    description:
      "Understand where your brand stands in the competitive landscape and identify opportunities to stand out.",
  },
  {
    icon: Shield,
    title: "Authority Analysis",
    description:
      "Evaluate your domain authority, trust signals, backlink profile, and digital credibility against industry benchmarks.",
  },
  {
    icon: FileText,
    title: "Executive Recommendations",
    description:
      "Receive prioritized, impact-ranked recommendations with clear roadmaps that drive measurable growth.",
  },
];

/* ── Steps Data ──────────────────────────────────────────────────────── */

const STEPS = [
  {
    num: "01",
    title: "Enter Your URL",
    description: "Share your website and social media\nlinks to start the analysis.",
    pillText: "Secure & private",
    pillIcon: Shield,
    mainIcon: Link,
  },
  {
    num: "02",
    title: "AI Analysis",
    description: "Our AI agents scan, analyze and\nuncover key insights across every channel.",
    pillText: "Powered by advanced AI",
    pillIcon: Sparkles,
    mainIcon: Search,
  },
  {
    num: "03",
    title: "Intelligence Report",
    description: "Get a comprehensive, actionable\nreport to grow your brand.",
    pillText: "Insights you can act on",
    pillIcon: BarChart3,
    mainIcon: FileText,
  },
];

/* ── Page Component ──────────────────────────────────────────────────── */

export function LandingPage() {
  const navigate = useNavigate();
  const createAnalysis = useCreateAnalysis();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      website_url: "",
      linkedin_url: "",
      instagram_url: "",
      twitter_url: "",
      facebook_url: "",
      youtube_url: "",
    },
  });

  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (!session) navigate("/auth");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => api.getMe(),
    enabled: !!session,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createAnalysis.mutateAsync({
        website_url: data.website_url,
        linkedin_url: data.linkedin_url || null,
        instagram_url: data.instagram_url || null,
        twitter_url: data.twitter_url || null,
        facebook_url: data.facebook_url || null,
        youtube_url: data.youtube_url || null,
      });
      navigate(`/analysis/${result.job_id}`);
    } catch {
      // Error is handled by React Query
    }
  };

  const isLoading = isSubmitting || createAnalysis.isPending;

  if (loadingSession || (session && loadingProfile)) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const company = userProfile?.company;
  const isExhausted = company && company.free_audits_used >= company.free_audits_total;

  return (
    <div style={{ background: "var(--color-bg)" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative block w-full" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
        <div className="container-premium relative z-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start lg:items-center">
              {/* Left – Copy */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="pt-4 text-left min-w-0 flex flex-col items-start gap-6 [&_*]:!m-0"
              >
                <motion.div variants={fadeUp} custom={0}>
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider"
                    style={{ background: "#F1F5F9", color: "var(--color-navy)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--color-teal)" }} />
                    AI-POWERED INTELLIGENCE
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1]"
                  style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)" }}
                >
                  AI Brand<br />
                  Intelligence<br />
                  <span style={{ color: "var(--color-teal)" }}>Platform</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-lg md:text-xl max-w-[600px] leading-relaxed pb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Analyze any company's digital presence and receive a
                  comprehensive <span style={{ color: "var(--color-teal)" }}>AI-powered intelligence</span> report in minutes.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold" style={{ color: "var(--color-navy)" }}>
                    <Zap className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
                    Instant analysis
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold" style={{ color: "var(--color-navy)" }}>
                    <TrendingUp className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
                    Executive reports
                  </div>
                </motion.div>
              </motion.div>

              {/* Right – Form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                className="w-full max-w-xl mx-auto lg:ml-auto min-w-0 [&_*]:!m-0"
              >
                <div
                  className="shadow-2xl flex flex-col gap-6"
                  style={{
                    padding: "2.5rem",
                    background: "var(--color-navy)",
                    borderRadius: "24px",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(43, 182, 168, 0.15)" }}
                    >
                      <Sparkles className="w-6 h-6" style={{ color: "var(--color-teal)" }} />
                    </div>
                    <h3
                      className="text-2xl md:text-3xl"
                      style={{ fontFamily: "var(--font-serif)", color: "#ffffff" }}
                    >
                      Analyze Your Brand
                    </h3>
                  </div>

                  {company && (
                    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 flex justify-between items-center text-sm">
                      <div>
                        <p className="text-neutral-400">Company</p>
                        <p className="font-medium text-white capitalize">{company.domain.split('.')[0]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-400">Audits Remaining</p>
                        <p className="font-medium text-white">
                          {Math.max(0, company.free_audits_total - company.free_audits_used)} of {company.free_audits_total}
                        </p>
                      </div>
                    </div>
                  )}

                  {isExhausted ? (
                    <div className="text-center py-8 flex flex-col gap-4">
                      <p className="text-xl text-white">Your {company?.free_audits_total} free audits have been used.</p>
                      <p className="text-neutral-400 pb-2">Want deeper intelligence and additional audits for your company?</p>
                      <button className="bg-white text-neutral-900 font-medium px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors w-full">
                        Talk to Curato
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="text-left" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Website URL */}
                    <div style={{ background: "#ffffff", borderRadius: "16px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "var(--color-navy)", margin: 0 }}>
                        <Globe className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
                        Website URL <span style={{ color: "var(--color-danger)" }}>*</span>
                      </label>
                      <input
                        {...register("website_url")}
                        type="url"
                        placeholder="https://example.com"
                        style={{ width: "100%", fontSize: "15px", border: "none", outline: "none", background: "transparent", color: "var(--color-navy)", fontWeight: 500, padding: 0 }}
                        disabled={isLoading}
                      />
                      {errors.website_url && (
                        <p className="text-xs m-0" style={{ color: "var(--color-danger)", marginTop: "4px" }}>
                          {errors.website_url.message}
                        </p>
                      )}
                    </div>

                    {/* Social URLs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {[
                        { name: "linkedin_url" as const, icon: Link, placeholder: "LinkedIn URL", label: "LinkedIn" },
                        { name: "instagram_url" as const, icon: Camera, placeholder: "Instagram URL", label: "Instagram" },
                        { name: "twitter_url" as const, icon: AtSign, placeholder: "X / Twitter URL", label: "X / Twitter" },
                        { name: "facebook_url" as const, icon: Users, placeholder: "Facebook URL", label: "Facebook" },
                      ].map((field) => (
                        <div key={field.name} style={{ background: "#ffffff", borderRadius: "16px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "var(--color-navy)", margin: 0 }}>
                            <field.icon className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
                            {field.label}
                          </label>
                          <input
                            {...register(field.name)}
                            type="url"
                            placeholder={field.placeholder}
                            style={{ width: "100%", fontSize: "15px", border: "none", outline: "none", background: "transparent", color: "var(--color-navy)", fontWeight: 500, padding: 0 }}
                            disabled={isLoading}
                          />
                          {errors[field.name] && (
                            <p className="text-xs m-0" style={{ color: "var(--color-danger)", marginTop: "4px" }}>
                              {errors[field.name]?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* YouTube */}
                    <div style={{ background: "#ffffff", borderRadius: "16px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "var(--color-navy)", margin: 0 }}>
                        <Play className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
                        YouTube
                      </label>
                      <input
                        {...register("youtube_url")}
                        type="url"
                        placeholder="YouTube URL"
                        style={{ width: "100%", fontSize: "15px", border: "none", outline: "none", background: "transparent", color: "var(--color-navy)", fontWeight: 500, padding: 0 }}
                        disabled={isLoading}
                      />
                      {errors.youtube_url && (
                        <p className="text-xs m-0" style={{ color: "var(--color-danger)", marginTop: "4px" }}>
                          {errors.youtube_url?.message}
                        </p>
                      )}
                    </div>

                    {/* Error */}
                    {createAnalysis.isError && (
                      <div
                        className="p-3 rounded-xl text-sm"
                        style={{
                          background: "rgba(239, 68, 68, 0.06)",
                          color: "var(--color-danger)",
                        }}
                      >
                        {(createAnalysis.error as any)?.body?.detail || "Failed to start analysis. Please try again."}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full text-base py-4 mt-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "12px" }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          Analyze Brand
                          <ArrowRight className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs mt-4 flex items-center justify-center gap-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                      <Lock className="w-3 h-3" />
                      Powered by AI Agents
                    </p>
                  </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="relative block w-full pt-20 pb-40 bg-slate-50/30">
        <div className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col items-center text-center mb-24 w-full"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/80 mb-8 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" fill="currentColor" />
              <span className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">Features</span>
            </motion.div>
            
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl lg:text-[56px] leading-tight font-serif font-bold text-slate-900 tracking-tight mb-6"
            >
              Comprehensive <span className="relative inline-block text-teal-700">
                Brand
                <svg width="100%" height="10" viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1 left-0 text-teal-600 w-full" preserveAspectRatio="none">
                  <path d="M3 7C35 2 85 2 117 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span> Intelligence
            </motion.h2>
            
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-[20px] text-slate-500 max-w-[680px] mx-auto leading-relaxed mt-2"
            >
              Our AI agents analyze every facet of your digital presence<br className="hidden md:block" />to deliver actionable intelligence that drives growth.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[36px] gap-x-[40px]"
            style={{ width: "100%", maxWidth: "1380px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="bg-white shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-200/60 flex flex-col relative group w-full box-border"
                style={{ padding: "28px 28px 26px", borderRadius: "22px", minHeight: "210px" }}
              >
                {/* Number Badge */}
                <div className="absolute top-7 right-7 w-[34px] h-[34px] rounded-full bg-teal-50 flex items-center justify-center text-[13px] font-bold text-teal-700">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon Container */}
                <div className="w-[70px] h-[70px] rounded-full bg-[#0b1f33] flex items-center justify-center shrink-0 shadow-sm" style={{ marginBottom: "22px" }}>
                  <feature.icon className="w-[28px] h-[28px] text-teal-400" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <div style={{ marginBottom: "10px" }}>
                  <h4 className="text-[22px] font-serif font-bold text-slate-900 m-0" style={{ lineHeight: "1.15" }}>
                    {feature.title}
                  </h4>
                  <svg width="36" height="6" viewBox="0 0 36 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-600" style={{ marginTop: "10px" }}>
                    <path d="M2 4C12 2 24 2 34 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Description */}
                <p className="text-[15px] text-slate-500 font-medium m-0" style={{ marginTop: "8px", lineHeight: "1.65" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative block w-full bg-white pt-32 pb-24">
        
        {/* Decorative dots top-left */}
        <div className="absolute top-16 left-8 lg:left-16 opacity-40 hidden md:block z-0">
          <svg width="120" height="120" fill="none" viewBox="0 0 100 100">
            <pattern id="dots-pattern-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#14B8A6" opacity="0.3" />
            </pattern>
            <rect width="100" height="100" fill="url(#dots-pattern-1)" />
          </svg>
        </div>
        
        {/* Decorative dots top-right */}
        <div className="absolute top-16 right-8 lg:right-16 opacity-40 hidden md:block z-0">
          <svg width="120" height="120" fill="none" viewBox="0 0 100 100">
            <pattern id="dots-pattern-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#14B8A6" opacity="0.3" />
            </pattern>
            <rect width="100" height="100" fill="url(#dots-pattern-2)" />
          </svg>
        </div>

        {/* STRICTLY CENTERED PROCESS CONTAINER */}
        <div className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col items-center text-center mb-16 w-full"
          >
            {/* Header Pill */}
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50/70 mb-6 border border-teal-100">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" fill="currentColor" />
              <span className="text-[11px] font-bold tracking-[0.1em] text-slate-800 uppercase">How It Works</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-[56px] leading-tight font-serif font-bold text-slate-900 tracking-tight mb-6">
              Three <span className="relative inline-block text-teal-600">
                Simple
                <svg width="100%" height="12" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-1.5 left-0 text-teal-500 w-full" preserveAspectRatio="none">
                  <path d="M2 9C35 2 85 2 118 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span> Steps
            </motion.h2>

            <motion.p variants={fadeUp} custom={2} className="text-[17px] md:text-[20px] text-slate-500 max-w-2xl mx-auto leading-relaxed mt-2 font-medium">
              From URL to actionable insights in minutes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="relative mt-20 lg:mt-32 block"
            style={{ width: "100%", maxWidth: "1380px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px", boxSizing: "border-box" }}
          >
            {/* Connecting Line (Desktop Only) */}
            <div className="absolute top-[70px] left-[16.66%] right-[16.66%] h-[3px] bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 hidden lg:block rounded-full z-0 opacity-70">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                    <path d="M9 18l6-6-6-6" />
                 </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[48px] relative z-10 w-full">
              {STEPS.map((step, i) => (
                <motion.div key={step.num} variants={fadeUp} custom={i} className="relative flex flex-col items-center w-full box-border">
                  
                  {/* Icon Container */}
                  <div className="relative z-20 flex justify-center items-start" style={{ height: "150px", marginBottom: "24px" }}>
                    <div className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center p-3 relative">
                      {/* Outer Ring */}
                      <div className="absolute inset-0 rounded-full border border-teal-100 bg-teal-50/40"></div>
                      {/* Inner Circle */}
                      <div className="w-full h-full rounded-full bg-white border border-teal-200/80 shadow-[0_4px_24px_rgb(20,184,166,0.15)] flex items-center justify-center relative z-10">
                          <step.mainIcon className="w-[38px] h-[38px] text-teal-600" strokeWidth={1.5} />
                          
                          {/* Number Badge */}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-11 h-6 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-[12px] font-bold shadow-md border border-white/20 tracking-wide">
                            {step.num}
                          </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* White Card */}
                  <div className="bg-white pt-[28px] pb-[24px] px-[28px] w-full shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/80 flex flex-col items-center relative z-10 text-center transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] box-border"
                       style={{ minHeight: "150px", borderRadius: "22px" }}
                  >
                    <h4 className="text-[26px] font-serif font-bold text-slate-900 m-0" style={{ marginBottom: "10px", lineHeight: "1.2" }}>
                      {step.title}
                    </h4>
                    <p className="text-[16px] text-slate-500 font-medium w-full m-0 whitespace-pre-line" style={{ marginBottom: "18px", lineHeight: "1.6" }}>
                      {step.description}
                    </p>
                    
                    <div className="mt-auto pt-2">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-50/60 text-teal-800 text-[13.5px] font-semibold border border-teal-100/50">
                        <step.pillIcon className="w-[18px] h-[18px] text-teal-600" strokeWidth={2} />
                        {step.pillText}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
