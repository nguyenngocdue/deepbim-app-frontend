
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TableContent } from "@/components/model-table/TableContent";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { EntityForm } from "@/components/bim-viewer/common/EntityForm";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { SearchBox } from "@/components/SearchBox";
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { LinkId } from "@/components/common/LinkId";
import { AvatarUser } from "@/components/AvatarUser";

// Fake APIs (thay thế bằng thật)
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} from "@/apis/course-api";
import { EntityListLayout } from "@/features/bim-viewer/modals/managements/components/EntityListLayout";
import { getUsers } from "@/apis/user-api";
import CustomBadge from "@/components/common/CustomBadge";
import { getStatuses } from "@/apis/status-api";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { PriceDisplay } from "@/components/bim-viewer/common/PriceDisplay";
import { BooleanDisplay } from "@/components/bim-viewer/common/BooleanDisplay";

type Mode = "create" | "edit" | "view" | null;

interface Course {
    id: number;
    name: string;
    description: string;
    level?: string;
    owner?: any;
    creator?: any;
    created_at?: string;
}

export default function AdminCoursesPage() {
    const [data, setData] = useState<Course[] | null>(null);
    const [filter, setFilter] = useState("");
    const [mode, setMode] = useState<Mode>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenDel, setModalOpenDel] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Course | null>(null);
    const [statuses, setStatus] = useState([]);
    const [allUsers, setAllUser] = useState([]);


    // Form
    const fetchFormData = useCallback(async () => {
        try {
            const users = await getUsers();
            const optionUsers = users?.data.map((user: any) => ({
                label: user.user_name,
                value: user.id.toString(),
            }));

            const statuses = await getStatuses();
            const optionStatuses = statuses?.data.map((user: any) => ({
                label: user.name,
                value: user.id.toString(),
            }));

            setAllUser(optionUsers);
            setStatus(optionStatuses);
        } catch (err) {
            setAllUser([]);
            setStatus([]);
        }
    }, [])
    useEffect(() => {
        if (modalOpen) {
            fetchFormData();
        }
    }, [modalOpen, fetchFormData]);



    const fetchData = useCallback(async () => {
        try {
            const res = await getCourses();
            const formatted = res.data.map((item: any) => ({
                ...item,
                created_at: formatDate(item.created_at),
            }));
            setData(formatted);
        } catch (err) {
            toast.error("Failed to fetch courses");
            setData([]);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);






    const formatDate = (str: string) => new Date(str).toISOString().slice(0, 10);

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item) =>
            item?.title?.toLowerCase().includes(filter.toLowerCase())
        );
    }, [data, filter]);


    const openCreateModal = () => {
        setSelectedRow(null);
        setMode("create");
        setModalOpen(true);
    };

    const openEditModal = (row: Course) => {
        setSelectedRow(row);
        setMode("edit");
        setModalOpen(true);
    };

    const openViewModal = (row: Course) => {
        setSelectedRow(row);
        setMode("view");
        setModalOpen(true);
    };

    const openDeleteModal = (row: Course) => {
        setSelectedRow(row);
        setModalOpenDel(true);
    };

    const closeModal = () => {
        setSelectedRow(null);
        setMode(null);
        setModalOpen(false);
        setModalOpenDel(false);
    };

    const handleDeleteCourse = async () => {
        try {
            const res = await deleteCourse(selectedRow.id);
            if (res.ok) {
                toast.success("Course deleted successfully");
            } else {
                toast.error("Failed to delete course");
            }
            await fetchData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleCreate = async (formData: any) => {
        try {
            await createCourse(formData);
            toast.success("Created course successfully");
            await fetchData();
            closeModal();
        } catch {
            toast.error("Error creating course");
        }
    };

    const handleEdit = async (formData: any) => {
        try {
            if (!selectedRow) return;
            await updateCourse(selectedRow.id, formData);
            toast.success("Updated course successfully");
            await fetchData();
            closeModal();
        } catch {
            toast.error("Error updating course");
        }
    };

    const handleSubmit = (formData: any) => {
        mode === "edit" ? handleEdit(formData) : handleCreate(formData);
    };


    const columns = useMemo<ColumnDef<Course>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <LinkId id={`${row.original.id}`} href="/managements/courses" tail="/dashboard" />
            ),
        },
        { accessorKey: "title", header: "Title" },


        {
            accessorKey: "old_price",
            header: "Old Price",
            cell: ({ row }) => {
                return (
                    <PriceDisplay price={row.original.old_price} />
                )
            }
        },

        {
            accessorKey: "new_price",
            header: "New Price",
            cell: ({ row }) => {
                return (
                    <PriceDisplay price={row.original.new_price} />
                )
            }
        },


        {
            accessorKey: "is_free",
            header: "Is Free",
            cell: ({ row }) => {
                return (
                    <BooleanDisplay price={row.original.is_free} />
                )
            }
        },

        { accessorKey: "students_count", header: "Students Count" },

        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => {
                return (
                    <DateTimeDisplay isoDate={row.original.updated_at} />
                )
            }
        },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "description", header: "Description" },
        {
            accessorKey: "owner",
            header: "Owner",
            cell: ({ getValue }) => {
                const val = getValue() as any;
                return <AvatarUser name={val?.user_name} img={val?.picture} id={val?.id} email={val.email} />;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const val = getValue() as any;
                return <CustomBadge text={val.name} className={`${val.class_name}`} />
            },
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TableRowActions
                    row={row.original}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onView={openViewModal}
                />
            ),
        },
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const freeItems = [{ label: "True", value: true }, { label: "False", value: false }];

    const courseFields = [
        { name: "name", label: "Course Name", placeholder: "Enter course name", type: "text", required: true },
        { name: "title", label: "Title", placeholder: "Enter course title", type: "text", required: true },
        { name: "description", label: "Description", placeholder: "Enter course description", type: "textarea", required: true },
        { name: "status_id", label: "Status", placeholder: "Select a status of course...", type: "select", options: statuses, required: true },
        { name: "owner_id", label: "Owner", placeholder: "Select a host of course...", type: "select", options: allUsers, required: true, castType: "number", },
        { name: "is_free", label: "Is Free", placeholder: "Select free", type: "select", options: freeItems, castType: "boolean" },
        { name: "old_price", label: "Old Price", placeholder: "Enter old price", type: "text", required: true },
        { name: "new_price", label: "New Price", placeholder: "Enter new price", type: "text", required: true },
    ];

    const formRef = useRef<{ submit: () => void }>(null);
    const formSubmitHandler = () => formRef.current?.submit();
    const editDefaultValues = selectedRow ?
        {
            ...selectedRow,
            owner_id: selectedRow.owner_id
                ? allUsers.find(opt => opt.value === String(selectedRow.owner_id))?.value || "" : "",
            status_id: selectedRow.status_id
                ? statuses.find(opt => opt.value === String(selectedRow.status_id))?.value || "" : "",
            is_free: selectedRow?.is_free,
        }
        : {};

    const dialog = (
        <DialogTemplate
            open={modalOpen}
            onClose={closeModal}
            title={mode === "edit" ? "Edit Course" : "Create New Course"}
            description={mode === "edit" ? "Update course details." : "Fill in details to create new course."}
            disableOutsideClose
            iconType={mode}
            className="max-w-3xl"
            onApply={formSubmitHandler}
            onApplyText="Apply"
            onCancelText="Cancel"
            applyType="button"
        >
            <EntityForm
                ref={formRef}
                fields={courseFields}
                defaultValues={editDefaultValues}
                onSubmit={handleSubmit}
                mode={mode}
                onCancel={closeModal}
                cancelLabel="Cancel"
                showFooter
            />
        </DialogTemplate>
    );

    return (
        <>
            <EntityListLayout
                title="Courses"
                description="Manage your published and draft courses."
                searchBar={
                    <>
                        <Button onClick={openCreateModal} className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}>
                            + Create Course
                        </Button>
                        <SearchBox value={filter} onChange={setFilter} placeholder="Search courses..." />
                    </>
                }
                countInfo={`Showing ${filteredData.length} of ${data?.length ?? 0}`}
                dialog={dialog}
            >
                {data === null ? <LoadingState /> : <TableContent table={table} key={filteredData.length} />}
            </EntityListLayout>

            <ConfirmDeleteDialog
                open={modalOpenDel}
                onClose={closeModal}
                onConfirm={handleDeleteCourse}
                itemName="this course"
            />
        </>
    );
}
