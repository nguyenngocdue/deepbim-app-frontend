import { motion } from "framer-motion";

interface SolutionCardProps {
  title: string;
  description: string;
  image: string;
  className: string;
}

const SolutionCard = ({ title, description, image, className }: SolutionCardProps) => {
  return (
    <div className={className}>
      <motion.div
        className="relative p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center border border-transparent overflow-hidden transition-all"
        whileHover={{
          scale: 1.05, // Hiệu ứng zoom nhẹ khi hover
          borderColor: "#22c55e", // Đổi màu viền sang xanh lá khi hover
          boxShadow: "0px 10px 30px rgba(34, 197, 94, 0.4)", // Hiệu ứng bóng đổ xanh phát sáng
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Ảnh */}
        <motion.div
          className="w-full h-44 overflow-hidden rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }} // Hiệu ứng ảnh lớn hơn khi hover
          transition={{ duration: 0.3 }}
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Tiêu đề với hiệu ứng gạch chân */}
        <motion.div className="relative mt-4">
          <h4 className="text-xl font-bold transition-all dark:text-gray-700">{title}</h4>

          {/* Hiệu ứng gạch chân xuất hiện khi hover */}
          <motion.div
            className="absolute left-0 bottom-[-3px] h-[3px] bg-green-500 rounded-full"
            initial={{ width: "0%" }} // Ẩn ban đầu
            whileHover={{ width: "100%" }} // Mở rộng khi hover
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Mô tả */}
        <motion.p
          className="mt-2 text-gray-600 transition-all"
          whileHover={{ color: "#16a34a" }} // Đổi màu chữ khi hover
          transition={{ duration: 0.4 }}
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SolutionCard;
