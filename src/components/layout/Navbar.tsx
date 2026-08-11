import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
      }}
    >
      <div className="w-full px-12 md:px-20 lg:px-28 flex items-center h-[80px]">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="Curato Logo" 
            className="h-16 object-contain mix-blend-multiply" 
          />
        </Link>
      </div>
    </motion.nav>
  );
}
