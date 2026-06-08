/**
 * Admin Login Page — Email/password auth with Firebase.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdmin } from "@/contexts/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  pageTransition,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import { AlertCircle, Lock, Mail, Loader } from "lucide-react";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const from = (location.state as { from?: string })?.from || "/admin";
      navigate(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Qiyas
          </div>
          <p className="text-slate-400">Admin Portal</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50"
        >
          <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>

          {error && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
            >
              <AlertCircle size={18} className="text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 gap-2"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Only registered admins can access this panel
          </p>
        </motion.div>

        {/* Demo credentials */}
        <motion.p
          variants={staggerItem}
          className="text-xs text-slate-600 text-center mt-8"
        >
          Demo: Use your Firebase admin credentials
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
