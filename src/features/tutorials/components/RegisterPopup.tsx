import { useForm } from "react-hook-form";
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
import AppButton2 from "@/components/bim-viewer/common/AppButton2";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setIsSubmitting(true);
        if (!currentUser) {
            toast.error("Please log in to register for this course.");
            setIsSubmitting(false);
            return;
        }
        try {
            const response = await registerCourse(courseId, data);
            if (response.ok) {
                toast.success(response.data.message || "Successfully registered for the course.");
                setShowSuccess(true);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            const errMsg = (error instanceof Error) ? error.message : String(error);
            toast.error(`An error occurred. Please try again. ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <SuccessDialog open={showSuccess} onClose={() =>{
                setShowSuccess(false)
                onClose()
            }} />
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    className="sm:max-w-[960px] w-full max-h-screen overflow-y-auto p-4 sm:p-6 md:lg:rounded-xl bg-[#0f172a] text-white  md:lg:border border-[#40dbcb]/30 shadow-xl"
                >

                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-[#40DBCB]">
                            Đăng ký khóa học: {title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Form */}
                        <Card className="bg-[#1e293b]/90 backdrop-blur-md md:lg:border border-[#40dbcb]/20 md:lg:rounded-lg">
                            <CardContent className="p-4 sm:p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="full_name" className="text-slate-200">Họ và tên <span className="text-orange-300">*</span></Label>
                                            <Input
                                                id="full_name"
                                                {...register("full_name", { required: "Vui lòng nhập họ và tên" })}
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Nhập họ và tên"
                                            />
                                            {errors.full_name && <p className="text-orange-300 text-xs mt-1">{errors.full_name.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-slate-200">Email <span className="text-orange-300">*</span></Label>
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
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Nhập email"
                                            />
                                            {errors.email && <p className="text-orange-300 text-xs mt-1">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone" className="text-slate-200">Số điện thoại <span className="text-orange-300">*</span></Label>
                                            <Input
                                                id="phone"
                                                {...register("phone", {
                                                    required: "Vui lòng nhập số điện thoại",
                                                    pattern: {
                                                        value: /^\d{10,11}$/,
                                                        message: "Số điện thoại không hợp lệ",
                                                    },
                                                })}
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.phone && <p className="text-orange-300 text-xs mt-1">{errors.phone.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="age" className="text-slate-200">Tuổi</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                {...register("age", {
                                                    valueAsNumber: true,
                                                    min: { value: 11, message: "Tuổi phải lớn hơn 10" },
                                                    max: { value: 69, message: "Tuổi phải nhỏ hơn 70" },
                                                })}
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Nhập tuổi"
                                            />
                                            {errors.age && <p className="text-orange-300 text-xs mt-1">{errors.age.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="occupation" className="text-slate-200">Nghề nghiệp</Label>
                                        <Input
                                            id="occupation"
                                            {...register("occupation")}
                                            className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                            placeholder="Nhập nghề nghiệp"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="zalo_link" className="text-slate-200">Zalo Link</Label>
                                            <Input
                                                id="zalo_link"
                                                {...register("zalo_link")}
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Link Zalo cá nhân"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="linked_link" className="text-slate-200">Linked Link</Label>
                                            <Input
                                                id="linked_link"
                                                {...register("linked_link")}
                                                className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                                placeholder="Link Linked cá nhân"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="note" className="text-slate-200">Ghi chú</Label>
                                        <Textarea
                                            id="note"
                                            {...register("note")}
                                            className="mt-1 bg-slate-800 border border-[#40dbcb]/30 text-white placeholder:text-slate-400 focus:border-[#40DBCB] focus:ring-[#40DBCB]"
                                            placeholder="Nhập ghi chú (nếu có)"
                                            rows={4}
                                        />
                                    </div>

                                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                                        <AppButton2 falseName="Huỷ bỏ" btnType="cancel" onClick={onClose} />
                                        <AppButton2
                                            type="submit"
                                            falseName="Gửi đăng ký"
                                            trueName="Đang gửi..."
                                            isLoading={isSubmitting}
                                            btnType="create"
                                        />
                                    </DialogFooter>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card className="bg-[#1e293b]/90 backdrop-blur-md border border-[#40dbcb]/20 rounded-lg">
                            <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full text-white">
                                <div>
                                    <h3 className="text-lg font-bold text-[#40DBCB]">Thông tin thanh toán</h3>
                                    <p className="text-sm mt-2">Vui lòng chuyển khoản đến:</p>
                                    <ul className="mt-2 text-sm space-y-1">
                                        <li><strong>Ngân hàng:</strong> ABC</li>
                                        <li><strong>Số tài khoản:</strong> 24432927</li>
                                        <li><strong>Chủ tài khoản:</strong> NGUYEN NGOC DUE</li>
                                    </ul>
                                </div>
                                <div className="flex justify-center items-center mt-4 sm:mt-6">
                                    <img
                                        src="https://minio.deepbim.net:9000/deepbim-fe/1749836342572-qr_nguyen_ngoc_due.jfif"
                                        alt="QR Code"
                                        className="w-56 sm:w-72 h-auto object-contain rounded-lg border border-[#40dbcb]/30 shadow-md"
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
