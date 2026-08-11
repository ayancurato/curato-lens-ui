import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Mail, ShieldCheck, Send, Lock, Edit3, Sparkles } from "lucide-react";

const DotPattern = ({ className }: { className?: string }) => (
  <svg className={className} width="72" height="72" fill="none" viewBox="0 0 72 72">
    <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
    </pattern>
    <rect width="72" height="72" fill="url(#dots)" />
  </svg>
);

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-8">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-50/40 via-white to-white pointer-events-none" />
      
      {/* Concentric Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-200/40 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-slate-200/40 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-slate-200/40 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] border border-slate-200/40 rounded-full pointer-events-none" />
      
      {/* Decorative Dot Patterns */}
      <div className="absolute top-24 left-1/4 opacity-20 text-teal-600 pointer-events-none hidden lg:block">
        <DotPattern />
      </div>
      <div className="absolute bottom-24 right-1/4 opacity-20 text-teal-600 pointer-events-none hidden lg:block">
        <DotPattern />
      </div>

      <div className="relative z-10 w-full max-w-[760px] flex flex-col items-center mx-auto px-4">
        {/* Branding */}
        <div className="flex items-center gap-2.5 mb-8">
          <Sparkles className="w-7 h-7 text-blue-600" fill="currentColor" />
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Curato <span className="text-teal-700 font-normal">Lens</span></h1>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:px-24 sm:py-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center box-border">
          
          {/* Icon */}
          <div className="w-[84px] h-[84px] rounded-full bg-blue-50/50 flex items-center justify-center mb-8 relative">
            <div className="w-[68px] h-[68px] rounded-full bg-blue-50 flex items-center justify-center relative shadow-sm border border-white">
              <Mail className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-[3px] border-2 border-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <h2 className="text-[28px] font-serif font-bold text-slate-900 mb-4 text-center tracking-tight">Verify your email</h2>
          <p className="text-slate-500 text-[15px] mb-10 text-center max-w-sm leading-relaxed">
            We've sent a verification code to your work email<br className="hidden sm:block" />to help secure your account.
          </p>

          <div className="w-full box-border">
            {step === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-4 w-full">
                <div className="space-y-2.5">
                  <label className="block text-[13px] font-bold text-slate-800 tracking-wide">Work Email</label>
                  <div className="relative box-border">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[64px] box-border bg-white border border-slate-200 rounded-xl px-6 text-slate-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                      placeholder="name@company.com"
                      required
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                      <Edit3 className="w-[18px] h-[18px]" strokeWidth={2} />
                    </div>
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[64px] box-border bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2.5 text-[15px] mt-4"
                >
                  {loading ? "Sending..." : "Send verification code"}
                  <Send className="w-4 h-4" strokeWidth={2} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4 w-full">
                <div className="space-y-2.5">
                  <label className="block text-[13px] font-bold text-slate-800 tracking-wide">Verification Code</label>
                  <div className="relative box-border">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full h-[64px] box-border bg-white border border-slate-200 rounded-xl px-6 text-slate-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-center tracking-widest placeholder:text-slate-400"
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[64px] box-border bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2.5 text-[15px] mt-4"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </form>
            )}
            
            <div className="mt-5 mb-2 flex items-center justify-center gap-2 text-slate-400">
              <Lock className="w-[14px] h-[14px]" />
              <p className="text-[13px]">Your information is secure and will never be shared.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
