import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // Sử dụng `loadSlim` để tải phiên bản nhẹ của particles

const ParticlesContainer: React.FC = () => {
  const [init, setInit] = useState<boolean>(false);

  // Khởi tạo engine particles
  useEffect(() => {
    const initializeEngine = async (): Promise<void> => {
      await initParticlesEngine(async (engine: Engine): Promise<void> => {
        await loadSlim(engine);
      });
      setInit(true);
    };

    initializeEngine();
  }, []);

  // Định nghĩa callback để trả về tùy chọn particles
  const particlesLoaded = useCallback(
    async (container: Container | undefined): Promise<void> => {
      console.log("Particles container loaded", container);
    },
    []
  );

  // Cấu hình options cho particles
  const options: any = {
    fpsLimit: 60, // Giới hạn tốc độ khung hình
    interactivity: {
      events: {
        onClick: {
          enable: true, // Cho phép tương tác khi click
          mode: "push", // Thêm hạt mới khi click
        },
        onHover: {
          enable: true, // Cho phép tương tác khi hover
          mode: "repulse", // Đẩy hạt ra khi hover
        },
        resize: true, // Tự động điều chỉnh khi cửa sổ thay đổi kích thước
      },
      modes: {
        push: {
          quantity: 6, // Số lượng hạt thêm vào khi click
        },
        repulse: {
          distance: 50, // Khoảng cách đẩy hạt
          duration: 0.4, // Thời gian hiệu ứng
        },
      },
    },
    particles: {
      color: {
        value: ["#0074D9", "#8A2BE2", "#FF69B4"], // Gradient màu xanh, tím, hồng
      },
      links: {
        color: "#ffffff", // Màu của đường nối giữa các hạt
        distance: 150, // Khoảng cách giữa các hạt để tạo liên kết
        enable: true, // Bật liên kết giữa các hạt
        opacity: 0.1, // Độ mờ của liên kết (giảm xuống để trông nhẹ nhàng hơn)
        width: 1, // Độ rộng của liên kết
      },
      move: {
        direction: "none", // Hướng di chuyển của hạt
        enable: true, // Bật di chuyển
        outModes: {
          default: "bounce", // Hạt bật ngược lại khi chạm viền
        },
        random: false, // Di chuyển ngẫu nhiên
        speed: 1, // Giảm tốc độ để trông chậm rãi, chuyên nghiệp hơn
        straight: false, // Không di chuyển theo đường thẳng
      },
      number: {
        density: {
          enable: true, // Bật mật độ hạt
          area: 500, // Khu vực phân bố hạt
        },
        value: 150, // Giảm số lượng hạt để tránh quá tải
      },
      opacity: {
        value: 0.4, // Tăng độ mờ để trông mềm mại hơn
      },
      shape: {
        type: "circle", // Hình dạng của hạt (tam giác)
        options: {
          triangle: {
            nbSides: 3, // Số cạnh của tam giác
            radius: 2, // Điều chỉnh kích thước tam giác nhỏ hơn
          },
        },
      },
      size: {
        random: true, // Kích thước ngẫu nhiên
        value: { min: 1, max: 3 }, // Kích thước ngẫu nhiên
        animation: {
          enable: true, // Bật hiệu ứng animation cho kích thước
          speed: 4, // Tốc độ animation
          sync: false, // Không đồng bộ animation
        },
      },
      // size: {
      //   value: { min: 1, max: 3 }, // Giảm kích thước hạt để trông mỏng hơn
      // },
    },
    detectRetina: true, // Tự động điều chỉnh độ phân giải
  };

  return (
    <div className="w-full h-full absolute top-0 left-0 z-[-1] bg-behind" >
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      )}
    </div>
  );
};

export default ParticlesContainer;