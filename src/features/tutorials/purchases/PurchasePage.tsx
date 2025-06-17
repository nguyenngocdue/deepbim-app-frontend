import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { registerCourse } from "@/apis/course-api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@react-three/fiber";
import { useState } from "react";
import { SuccessDialog } from "../components/SuccessDialog";
import { PromptCard } from "@/features/learning/lessons-for-newbie/components/PromptCard";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { Loader2 } from "lucide-react";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

interface RegisterFormData {
  full_name: string;
  age: number | null;
  occupation: string;
  note: string;
  email: string;
  phone: string;
  linked_link: string;
  zalo_link: string;
}

interface PurchasePageProps {
  courseId: number;
  title: string;
}

export function PurchasePage({ courseId, title }: PurchasePageProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background ">
        <PromptCard
          title="Bạn cần đăng nhập"
          description={`Vui lòng đăng nhập để đăng ký khóa học "${title}".`}
          imageUrl="https://minio.deepbim.net:9000/deepbim-fe/1750073553293-login.gif"
          action={
            <AppButton
              isLoading={false}
              onClick={() => (window.location.href = "/sign-in")}
              falseName="Đăng nhập nhé"
              loadingIcon={<Loader2 className="w-4 h-4 animate-spin" />}
              className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON}
            />
          }
        />
      </div>
    );
  }


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      full_name: currentUser?.user_name || "",
      age: null,
      occupation: "",
      note: "",
      linked_link: "",
      zalo_link: "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerCourse(courseId, data);
      if (response.ok) {
        toast.success(response.data.message);
        setShowSuccess(true);
        setTimeout(() => {
        window.history.back();
      }, 2000);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      let message = "Không xác định";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(`Có lỗi xảy ra. Vui lòng thử lại, ${message}`);
    }
  };

  return (
    <>
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
      <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-emerald-400 font-smooth">
            Đăng ký khóa học: {title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        {...register("name", { required: "Vui lòng nhập họ và tên" })}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Nhập họ và tên"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Vui lòng nhập email",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Email không hợp lệ",
                          },
                        })}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Nhập email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^\d{10,11}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        })}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                        Tuổi
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        {...register("age", {
                          valueAsNumber: true,
                          min: { value: 11, message: "Tuổi phải lớn hơn 10" },
                          max: { value: 69, message: "Tuổi phải nhỏ hơn 70" },
                        })}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Nhập tuổi"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="occupation" className="text-gray-700 dark:text-gray-300">
                      Nghề nghiệp
                    </Label>
                    <Input
                      id="occupation"
                      {...register("occupation")}
                      className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                      placeholder="Nhập nghề nghiệp"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zalo_link" className="text-gray-700 dark:text-gray-300">
                        Zalo Link
                      </Label>
                      <Input
                        id="zalo_link"
                        {...register("zalo_link")}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Link Zalo cá nhân"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linked_link" className="text-gray-700 dark:text-gray-300">
                        LinkedIn Link
                      </Label>
                      <Input
                        id="linked_link"
                        {...register("linked_link")}
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Link LinkedIn cá nhân"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="note" className="text-gray-700 dark:text-gray-300">
                      Ghi chú
                    </Label>
                    <Textarea
                      id="note"
                      {...register("note")}
                      className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                      placeholder="Nhập ghi chú (nếu có)"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                      Gửi đăng ký
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Info Section */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Thông tin thanh toán
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Vui lòng chuyển khoản đến:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Ngân hàng:</strong> ABC</li>
                    <li><strong>Số tài khoản:</strong> 24432927</li>
                    <li><strong>Chủ tài khoản:</strong> NGUYEN NGOC DUE</li>
                  </ul>
                </div>
                <div className="flex justify-center items-center mt-6">
                  <img
                    src="https://minio.deepbim.net:9000/deepbim-fe/1749836342572-qr_nguyen_ngoc_due.jfif"
                    alt="QR Code"
                    className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}