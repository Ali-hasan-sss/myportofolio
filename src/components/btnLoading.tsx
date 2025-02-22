import { motion } from "framer-motion";

export default function BtnLoading() {
  return (
    <div className=" inset-0 flex items-center justify-center p-1 bg-opacity-50 z-50">
      <div className="flex space-x-2">
        {["#ef4444", "#000000", "#10b981", "#f59e0b"].map((color, index) => (
          <motion.div
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
            className="w-4 h-4 rounded-md"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
