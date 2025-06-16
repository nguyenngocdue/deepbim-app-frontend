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
    full_name: string;
    age: number | null;
    occupation: string;
    note: string;
    email: string;
    phone: string;
    linked_link: string;
    zalo_link: string;
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
            full_name: currentUser?.user_name,
            age: null,
            occupation: "",
            note: "",
            linked_link: "",
            zalo_link: "",
            email: currentUser?.email,
            phone: currentUser?.phone,
        },
    });


    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerCourse(courseId, data);
            console.log(response);
            if (response.ok) {
                toast.success(response.data.message);
                setShowSuccess(true);
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
                <DialogContent className="sm:max-w-[960px] p-6 rounded-xl bg-gradient-to-br from-blue-700 to-purple-600 dark:from-blue-900 dark:to-purple-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Đăng ký khóa học: {title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Form */}
                        <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="full_name">Họ và tên <span className="text-orange-300">*</span></Label>
                                            <Input
                                                id="full_name"
                                                {...register("full_name", { required: "Vui lòng nhập họ và tên" })}
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Nhập họ và tên"
                                            />
                                            {errors.full_name && (
                                                <p className="text-orange-300 text-xs mt-1">{errors.full_name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email <span className="text-orange-300">*</span></Label>
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
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Nhập email"
                                            />
                                            {errors.email && (
                                                <p className="text-orange-300 text-xs mt-1">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Số điện thoại <span className="text-orange-300">*</span></Label>
                                            <Input
                                                id="phone"
                                                {...register("phone", {
                                                    required: "Vui lòng nhập số điện thoại",
                                                    pattern: {
                                                        value: /^\d{10,11}$/,
                                                        message: "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.phone && (
                                                <p className="text-orange-300 text-xs mt-1">{errors.phone.message}</p>
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
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Nhập tuổi"
                                            />
                                            {errors.age && (
                                                <p className="text-orange-300 text-xs mt-1">{errors.age.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="occupation">Nghề nghiệp</Label>
                                        <Input
                                            id="occupation"
                                            {...register("occupation")}
                                            className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                            placeholder="Nhập nghề nghiệp"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="note">Zalo Link</Label>
                                            <Input
                                                id="zalo_link"
                                                {...register("zalo_link")}
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Link Zalo cá nhân"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="note">Linked Link</Label>
                                            <Input
                                                id="linked_link"
                                                {...register("linked_link")}
                                                className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                                placeholder="Link Linked cá nhân"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="note">Ghi chú</Label>
                                        <Textarea
                                            id="note"
                                            {...register("note")}
                                            className="mt-1 bg-gray-900 border border-gray-600 text-white placeholder:text-gray-400"
                                            placeholder="Nhập ghi chú (nếu có)"
                                            rows={4}
                                        />
                                    </div>

                                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                            className="w-full sm:w-auto border-gray-600 text-white hover:bg-gray-700/50"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-500"
                                        >
                                            Gửi đăng ký
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Payment Info and QR */}
                        <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-lg font-bold">Thông tin thanh toán</h3>
                                    <p className="text-sm mt-2">Vui lòng chuyển khoản đến:</p>
                                    <ul className="mt-2 text-sm space-y-1">
                                        <li><strong>Ngân hàng:</strong> ABC</li>
                                        <li><strong>Số tài khoản:</strong> 24432927</li>
                                        <li><strong>Chủ tài khoản:</strong> NGUYEN NGOC DUE</li>
                                    </ul>
                                </div>
                                <div className="flex justify-center items-center mt-6">
                                    <img
                                        src="https://minio.deepbim.net:9000/deepbim-fe/1749836342572-qr_nguyen_ngoc_due.jfif"
                                        alt="QR Code"
                                        className="w-72 h-72 object-contain rounded-lg border border-gray-600"
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
