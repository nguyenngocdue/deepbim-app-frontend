export default function NoLessonFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
      {/* Hình minh họa */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6">
        <img
          src="https://minio.deepbim.net:9000/deepbim-fe/1749812541845-empty_box.gif"
          alt="No lessons"
          className="w-full h-full object-contain drop-shadow-2xl rounded-xl"
        />
      </div>

      {/* Tiêu đề nổi bật */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Không có nội dung khóa học
      </h2>

      {/* Mô tả nhẹ nhàng */}
      <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed">
        Chúng tôi chưa tìm thấy bài học nào trong khóa học này.<br />
        Vui lòng kiểm tra lại sau hoặc liên hệ với quản trị viên để được hỗ trợ.
      </p>
    </div>
  );
}
