// import React from 'react';
// import Particles from 'react-tsparticles';
// import { loadFull  } from 'tsparticles'; // Use loadSlim instead of loadFull

// const ParticlesContainer: React.FC = () => {
//   // Hàm khởi tạo và cấu hình particles
//   const particlesInit = async (engine: any) => {
//     console.log('Particles initialized');
//     await loadFull(engine); // Load tất cả các tính năng của tsParticles
//   };

 
//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       options={{
//         background: {
//           color: '#000000', // Màu nền
//         },
//         fpsLimit: 60, // Giới hạn tốc độ khung hình
//         interactivity: {
//           events: {
//             onClick: {
//               enable: true,
//               mode: 'push', // Khi click, thêm hạt mới
//             },
//             onHover: {
//               enable: true,
//               mode: 'repulse', // Hạt di chuyển tránh con trỏ
//             },
//             resize: true, // Tự điều chỉnh kích thước khi cửa sổ thay đổi
//           },
//           modes: {
//             push: {
//               quantity: 4, // Số lượng hạt được thêm khi click
//             },
//             repulse: {
//               distance: 100, // Khoảng cách hạt tránh con trỏ
//               duration: 0.4,
//             },
//           },
//         },
//         particles: {
//           color: {
//             value: '#ffffff', // Màu sắc của hạt
//           },
//           links: {
//             color: '#ffffff',
//             distance: 150, // Khoảng cách giữa các hạt
//             enable: true,
//             opacity: 0.5,
//             width: 1,
//           },
//           collisions: {
//             enable: true, // Cho phép va chạm giữa các hạt
//           },
//           move: {
//             direction: 'none',
//             enable: true,
//             outModes: {
//               default: 'bounce', // Hạt bật ngược lại khi ra khỏi màn hình
//             },
//             random: false,
//             speed: 2, // Tốc độ di chuyển của hạt
//             straight: false,
//           },
//           number: {
//             density: {
//               enable: true,
//               area: 800, // Mật độ hạt trên diện tích
//             },
//             value: 80, // Số lượng hạt
//           },
//           opacity: {
//             value: 0.5, // Độ mờ đục của hạt
//           },
//           shape: {
//             type: 'circle', // Hình dạng của hạt (có thể là circle, square, triangle, v.v.)
//           },
//           size: {
//             value: { min: 1, max: 5 }, // Kích thước hạt
//           },
//         },
//         detectRetina: true, // Tối ưu hóa cho màn hình Retina
//       }}
//     />
//   );
// };

// export default ParticlesContainer;