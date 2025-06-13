import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { registerCourse } from "@/apis/course-api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@react-three/fiber";
import { SuccessDialog } from "./SuccessDialog";
import { useState } from "react";

interface RegisterFormData {
    name: string;
    age: number | null;
    occupation: string;
    note: string;
    email: string;
    phone: string;
}

interface RegisterPopupProps {
    courseId: number;
    title: string;
    open: boolean;
    onClose: () => void;
}

export function RegisterPopup({
    courseId,
    title,
    open,
    onClose,
}: RegisterPopupProps) {

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        defaultValues: {
            name: currentUser?.user_name,
            age: null,
            occupation: "",
            note: "",
            email: currentUser?.email,
            phone: currentUser?.phone,
        },
    });




    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerCourse(courseId, data);
            if (response.ok) {
                toast.success("Đăng ký thành công!");
                setShowSuccess(true); // 👉 show thank you dialog
                onClose();
            } else {
                toast.error("Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[540px] md:max-w-[740px] p-6 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Đăng ký khóa học: {title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6">
                        {/* Form */}
                        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Họ và tên <span className="text-red-300">*</span></Label>
                                            <Input
                                                id="name"
                                                {...register("name", { required: "Vui lòng nhập họ và tên" })}
                                                className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                                placeholder="Nhập họ và tên"
                                            />
                                            {errors.name && (
                                                <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email <span className="text-red-300">*</span></Label>
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
                                                className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                                placeholder="Nhập email"
                                            />
                                            {errors.email && (
                                                <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Số điện thoại <span className="text-red-300">*</span></Label>
                                            <Input
                                                id="phone"
                                                {...register("phone", {
                                                    required: "Vui lòng nhập số điện thoại",
                                                    pattern: {
                                                        value: /^\d{10,11}$/,
                                                        message: "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                                className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-300 text-xs mt-1">{errors.phone.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="age">Tuổi</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                {...register("age", {
                                                    valueAsNumber: true,
                                                    min: { value: 11, message: "Tuổi phải lớn hơn 10" },
                                                    max: { value: 69, message: "Tuổi phải nhỏ hơn 70" },
                                                })}
                                                className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                                placeholder="Nhập tuổi"
                                            />
                                            {errors.age && (
                                                <p className="text-red-300 text-xs mt-1">{errors.age.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="occupation">Nghề nghiệp</Label>
                                        <Input
                                            id="occupation"
                                            {...register("occupation")}
                                            className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                            placeholder="Nhập nghề nghiệp"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="note">Ghi chú</Label>
                                        <Textarea
                                            id="note"
                                            {...register("note")}
                                            className="mt-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
                                            placeholder="Nhập ghi chú (nếu có)"
                                            rows={4}
                                        />
                                    </div>

                                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            className="w-full sm:w-auto border-white text-white hover:bg-white/20"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
                                        >
                                            Gửi đăng ký
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Payment Info and QR */}
                        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-bold">Thông tin thanh toán</h3>
                                    <p className="text-sm mt-2">Vui lòng chuyển khoản đến:</p>
                                    <ul className="mt-2 text-sm space-y-1">
                                        <li><strong>Ngân hàng:</strong> ABC</li>
                                        <li><strong>Số tài khoản:</strong> 24432927</li>
                                        <li><strong>Chủ tài khoản:</strong> NGUYEN NGOC DUE</li>
                                    </ul>
                                </div>
                                <div className="flex justify-center items-center">
                                    <img
                                        src="https://minio.deepbim.net:9000/deepbim-fe/1749836342572-qr_nguyen_ngoc_due.jfif"
                                        alt="QR Code"
                                        className="w-56 h-56 md:w-64 md:h-64 object-contain rounded-lg border border-white/30"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
