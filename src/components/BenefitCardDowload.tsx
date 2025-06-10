import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BenefitCardDownloadProps {
  icon?: React.ReactNode; // icon là tùy chọn nếu có src
  src?: string; // Thêm prop src cho đường dẫn hình ảnh
  title: string;
  description: string;
  downloadLink?: string;
  disableDownload?: boolean;
}

const BenefitCardDownload = ({
  icon,
  src,
  title,
  description,
  downloadLink = "#",
  disableDownload = false,
}: BenefitCardDownloadProps) => {
  return (
    <motion.div
      className="relative p-4 bg-white shadow-lg shadow-zinc-500 rounded-lg flex flex-col justify-between text-left transition-all overflow-hidden h-full border border-transparent"
      whileHover={
        disableDownload
          ? {
              scale: 1.05,
              borderColor: "#22c55e", // Green border on hover
              boxShadow: "0px 10px 30px rgba(34, 197, 94, 0.4)", // Glowing green effect
            }
          : undefined
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Nội dung chính (icon hoặc hình ảnh, tiêu đề, mô tả) */}
      <div className="flex flex-col">
        {/* Hiển thị hình ảnh nếu có src, nếu không thì hiển thị icon */}
        {src ? (
          <motion.img
            src={src}
            alt={`${title} illustration`}
            className="w-24 h-12 object-contain mb-4" // Kích thước tương tự icon (text-5xl ~ 48px)
            whileHover={
              disableDownload ? { filter: "brightness(0.8)" } : undefined // Hiệu ứng hover nhẹ cho hình ảnh
            }
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            className="text-green-500 text-5xl transition-all mb-4"
            whileHover={
              disableDownload ? { color: "#16a34a" } : undefined
            }
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title with Underline Effect */}
        <motion.div className="relative">
          <h4 className="text-xl font-bold transition-all text-zinc-800">{title}</h4>
          <motion.div
            className="absolute left-0 bottom-[-3px] h-[3px] bg-green-500 rounded-full"
            initial={{ width: "0%" }}
            whileHover={
              disableDownload ? { width: "100%" } : undefined
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-1 transition-all text-zinc-900"
          whileHover={
            disableDownload ? { color: "#16a34a" } : undefined
          }
          transition={{ duration: 0.4 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Download Button - Căn góc phải */}
      <motion.div
        className="mt-6 self-end"
        whileHover={
          disableDownload ? { scale: 1.05 } : undefined
        }
        transition={{ duration: 0.3 }}
      >
        <Button
          asChild
          className={`${
            disableDownload
              ? "bg-green-900 text-white hover:bg-green-800"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          } transition-colors`}
          disabled={!disableDownload}
        >
          <a
            href={downloadLink}
            download={disableDownload ? true : undefined}
            aria-label={`Download ${title}`}
            onClick={(e) => !disableDownload && e.preventDefault()}
          >
            Download
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default BenefitCardDownload;