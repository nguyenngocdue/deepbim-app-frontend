import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      contact_us:{
        title: 'Contact Us',
        subtitle: "We’re always happy to hear from you. Whether you have a question, need assistance, or want to share feedback, our team is ready to support you. Feel free to connect with us through any of the channels below.",
        contact_info: {
          phone: "+84 339 001 600",
          email: "deepbim@gmail.com",
          address: "HO CHI MINH CITY, VietNam"
        }
      },
      connector: {
        title: 'Connectors',
        subtitle: "Bridge your design tools with Viralution by uploading BIM models through our dedicated connectors.",
        items: {
          item_1: {
            title: "Revit",
            subtitles: "Revit Connector enables direct BIM data transfer from Autodesk Revit to Viralution, streamlining your workflow and centralizing project collaboration in the cloud."
          },
          item_2: {
            title: "Tekla Structures (Coming soon)",
            subtitles: "Tekla Connector allows you to upload detailed structural BIM models and metadata from Tekla Structures to Viralution, supporting seamless integration and data continuity."
          },
          item_3: {
            title: "Archicad (Coming soon)",
            subtitles: "With the Archicad Connector, architects and designers will be able to send BIM models and design data directly from Graphisoft Archicad to Viralution for centralized project access."
          }
        }
      },      
      navbar: {
        home: "Home",
        connect: "Connectors",
        features: "Features",
        how_it_works: "How it works",
        contact: "Contact Us",
        auth:"Sign In",
      },
      panel_alert: {
        message: "You are currently browsing as a guest. Sign in to access advanced features.",
        action_text: "Sign In"
      },
      hero: {
        welcome: "Optimize and accelerate your project ",
        subtitle: "seamlessly",
        description:
          "Enhance your 3D model workflow, ensure absolute data control, and leverage powerful BIM analytics. By applying AI, automatically detect design conflicts, predict risks, and optimize costs, enabling higher efficiency and smarter decision-making for investors, businesses, and engineers. Elevate your projects with AI & BIM technology! 🚀",
        start: "Discovery",
        deploy: "Deploy Yourself",
      },

      benefits: {
        title: "Enhance your workflow",
        description: "Experience next-gen 3D visualization and collaboration for better teamwork.",
        items: {
          visualization: {
            title: "Visualization",
            desc: "View and interact with BIM models and real-time cloud points with strong rendering capabilities, delivering a smooth experience.",
          },
          data_ownership: {
            title: "Data Ownership",
            desc: "Gain full control of your data by storing it in your private system, ensuring security, privacy, and absolute ownership.",
          },
          bim_utilization: {
            title: "BIM Data Utilization",
            desc: "Maximize the use of your BIM data with powerful tools for analysis, extraction, and accurate decision-making.",
          },
        },
      },

      features: {
        title: "Main Features",
        items: {
          feature_1: {
            title: "Comprehensive BIM Data",
            desc: "Leverage the power of BIM models with seamless integration and real-time data synchronization throughout the project lifecycle.",
          },
          feature_2: {
            title: "Version Control",
            desc: "Manage and track all project changes effectively, ensuring each update is stored, accessible, and easy to restore.",
          },
          feature_3: {
            title: "Model Comparison",
            desc: "Instantly detect changes between different model versions, helping control errors and improving design accuracy.",
          },
          feature_4: {
            title: "Model Integration",
            desc: "Merge multiple models into a unified environment, facilitating collaboration and reducing design conflicts.",
          },
        },
      },

      problems: {
        title: "Your Problems",
        description: "Let's explore the key challenges that DeepBim helps you solve.",
        items: {
          platform_dependency: {
            title: "Platform Dependency",
            desc: "Users face risks when relying on third-party platforms, reducing control and flexibility.",
          },
          communication_challenges: {
            title: "Project Communication Challenges",
            desc: "Ineffective communication leads to misunderstandings, delays, and disrupted collaboration.",
          },
          downtime_disruptions: {
            title: "Downtime & Interruptions",
            desc: "Unexpected outages can disrupt workflows, reduce productivity, and slow project progress.",
          },
        },
      },

      solutions: {
        title: "Our Solutions",
        description: "With DeepBim, you have the tools and platform to manage projects easily.",
        items: {
          own_data: {
            title: "Full Data Ownership",
            desc: "Gain full control over your data, infrastructure, and workflow—ensuring security, privacy, and absolute ownership.",
          },
          data_utilization: {
            title: "Data Utilization & Connectivity",
            desc: "Leverage powerful tools to extract, analyze, and connect your BIM data, enhancing collaboration and efficiency.",
          },
        },
      },

      how_it_works: {
        title: "How It Works",
        description: "Simply upload BIM models via connectors or directly using IFC files.",
        download: "Download Connectors Now",
      },

      cta: {
        title: "Ready to enhance your workflow?",
        description: "Join thousands of experts using DeepBim to optimize their projects.",
        placeholder: "Enter your email",
        button: "Sign Up Now",
        error: "Please enter a valid email address.",
        success: "Thank you for signing up!",
      },

      footer: {
        copyright: "All rights reserved to DeepBim.",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        contact: "Contact",
      },

      
    },
  },

  vi: {
    translation: {
      contact_us: {
        title: 'Liên hệ với chúng tôi',
        subtitle: "Chúng tôi luôn sẵn sàng lắng nghe bạn. Dù bạn có câu hỏi, cần hỗ trợ hay muốn đóng góp ý kiến, đội ngũ của chúng tôi luôn ở đây để đồng hành cùng bạn. Đừng ngần ngại liên hệ qua bất kỳ kênh nào bên dưới.",
        contact_info: {
          phone: "+84 339 001 600",
          email: "deepbim@gmail.com",
          address: "TP. Hồ Chí Minh, Việt Nam"
        }
      },      
      connector: {
        title: 'Trình Kết nối',
        subtitle: "Kết nối các công cụ thiết kế của bạn với Viralution bằng cách tải mô hình BIM thông qua các trình kết nối chuyên dụng.",
        items: {
          item_1: {
            title: "Revit",
            subtitles: "Revit Connector cho phép truyền dữ liệu BIM trực tiếp từ Autodesk Revit lên Viralution, giúp tối ưu quy trình làm việc và tập trung hợp tác dự án trên nền tảng đám mây."
          },
          item_2: {
            title: "Tekla Structures (Sắp ra mắt)",
            subtitles: "Tekla Connector giúp bạn tải mô hình kết cấu chi tiết và dữ liệu từ Tekla Structures lên Viralution, hỗ trợ tích hợp liền mạch và duy trì tính liên tục của dữ liệu."
          },
          item_3: {
            title: "Archicad (Sắp ra mắt)",
            subtitles: "Với Archicad Connector, các kiến trúc sư và nhà thiết kế sẽ có thể gửi mô hình BIM và dữ liệu thiết kế trực tiếp từ Graphisoft Archicad lên Viralution để truy cập dự án tập trung."
          }
        }
      },      
      navbar: {
        home: 'Trang Chủ',
        connect: "Trình kết nối",
        features: "Tính năng",
        how_it_works: "Cách thức hoạt động",
        contact: "Liên hệ",
        auth:"Đăng nhập",
      },
      panel_alert: {
        message: "Bạn đang dùng chế độ khách. Đăng nhập để truy cập các chức năng nâng cao",
        action_text: "Đăng nhập",
      },
      hero: {
        welcome: "Tăng tốc dự án của bạn một",
        subtitle: "cách đơn giản",
        description:
          "Tối ưu quy trình làm việc với mô hình 3D, đảm bảo quyền kiểm soát dữ liệu tuyệt đối và nâng cao phân tích BIM mạnh mẽ. Ứng dụng AI giúp tự động phát hiện lỗi thiết kế, dự đoán rủi ro, tối ưu chi phí, mang lại hiệu suất cao hơn và quyết định chính xác hơn cho chủ đầu tư, doanh nghiệp và kỹ sư. Nâng tầm dự án của bạn với công nghệ AI & BIM!🚀",
        start: "Khám phá",
        deploy: "Tự triển khai",
      },

      benefits: {
        title: "Nâng tầm quy trình làm việc",
        description:
          "Trải nghiệm thế hệ mới trực quan hóa mô hình 3D và cộng tác, giúp làm việc nhóm hiệu quả hơn với công nghệ tiên tiến.",
        items: {
          visualization: {
            title: "Trực quan hóa",
            desc: "Xem và tương tác với mô hình BIM và đám mây điểm theo thời gian thực với khả năng kết xuất mạnh mẽ, mang đến trải nghiệm mượt mà.",
          },
          data_ownership: {
            title: "Tự lưu trữ & Toàn quyền sở hữu dữ liệu",
            desc: "Toàn quyền kiểm soát dữ liệu của bạn bằng cách tự lưu trữ trên hệ thống riêng, đảm bảo bảo mật, quyền riêng tư và quyền sở hữu tuyệt đối.",
          },
          bim_utilization: {
            title: "Khai thác dữ liệu BIM",
            desc: "Tận dụng tối đa dữ liệu BIM của bạn với các công cụ mạnh mẽ để phân tích, trích xuất và đưa ra quyết định chính xác.",
          },
        },
      },

      features: {
        title: "Tính năng chính",
        items: {
          feature_1: {
            title: "Dữ liệu BIM toàn diện",
            desc: "Tận dụng sức mạnh của mô hình BIM với khả năng tích hợp liền mạch và đồng bộ dữ liệu theo thời gian thực trong suốt vòng đời dự án.",
          },
          feature_2: {
            title: "Kiểm soát phiên bản",
            desc: "Quản lý và theo dõi tất cả các thay đổi dự án một cách hiệu quả, đảm bảo mỗi bản cập nhật đều được lưu trữ, truy xuất và khôi phục dễ dàng.",
          },
          feature_3: {
            title: "So sánh mô hình",
            desc: "Phát hiện ngay lập tức các thay đổi giữa các phiên bản mô hình, giúp kiểm soát sai sót và cải thiện độ chính xác trong thiết kế.",
          },
          feature_4: {
            title: "Kết hợp mô hình",
            desc: "Hợp nhất nhiều mô hình vào một môi trường chung, tạo điều kiện cho sự phối hợp giữa các bộ phận và giảm thiểu xung đột thiết kế.",
          },
        },
      },

      problems: {
        title: "Vấn đề của bạn",
        description: "Hãy cùng tìm hiểu những vấn đề chính DeepBim đang giải quyết.",
        items: {
          platform_dependency: {
            title: "Phụ thuộc vào nền tảng",
            desc: "Người dùng đối mặt với rủi ro khi phụ thuộc vào nền tảng bên thứ ba, làm giảm quyền kiểm soát và tính linh hoạt.",
          },
          communication_challenges: {
            title: "Thách thức trong giao tiếp dự án",
            desc: "Giao tiếp kém hiệu quả dẫn đến hiểu lầm, trì hoãn và gián đoạn sự hợp tác.",
          },
          downtime_disruptions: {
            title: "Thời gian chết & gián đoạn",
            desc: "Sự cố ngừng hoạt động bất ngờ có thể làm gián đoạn quy trình, gây mất năng suất và chậm tiến độ dự án.",
          },
        },
      },

      solutions: {
        title: "Giải pháp của chúng tôi",
        description: "Với DeepBim, bạn sẽ có công cụ/nền tảng để quản lý dự án dễ dàng hơn.",
        items: {
          own_data: {
            title: "Bạn Toàn Quyền Sở Hữu",
            desc: "Kiểm soát hoàn toàn dữ liệu, hạ tầng và quy trình làm việc của bạn—đảm bảo bảo mật, quyền riêng tư và quyền sở hữu tuyệt đối.",
          },
          data_utilization: {
            title: "Khai thác dữ liệu & Kết nối con người",
            desc: "Tận dụng các công cụ mạnh mẽ để khai thác dữ liệu mô hình BIM và kết nối mọi người, thúc đẩy hợp tác và hiệu quả.",
          },
        },
      },

      how_it_works: {
        title: "Cách thức hoạt động",
        description: "Rất đơn giản! Tải lên mô hình BIM thông qua các trình kết nối hoặc tải trực tiếp tệp IFC.",
        download: "Tải các trình kết nối ngay",
      },

      cta: {
        title: "Sẵn sàng nâng cao quy trình làm việc của bạn?",
        description: "Tham gia cùng hàng nghìn chuyên gia đang sử dụng DeepBim để tối ưu hóa dự án của họ.",
        placeholder: "Nhập email của bạn",
        button: "Đăng ký ngay",
        error: "Vui lòng nhập địa chỉ email hợp lệ.",
        success: "Cảm ơn bạn đã đăng ký!",
      },

      footer: {
        copyright: "Bản quyền thuộc về DeepBim.",
        terms: "Điều khoản dịch vụ",
        privacy: "Chính sách bảo mật",
        contact: "Liên hệ",
      },


    },
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
});

export default i18n;
