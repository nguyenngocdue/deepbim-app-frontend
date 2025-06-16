import { EntitySearchAndActions } from "@/features/tutorials/functions/EntitySearchAndActions";

interface EnrollmentSearchAndActionsProps {
  filter: string;
  setFilter: (value: string) => void;
  openCreateModal: () => void;
}

export const EnrollmentSearchAndActions = ({
  filter,
  setFilter,
  openCreateModal,
}: EnrollmentSearchAndActionsProps) => (
  <EntitySearchAndActions
    filter={filter}
    setFilter={setFilter}
    openCreateModal={openCreateModal}
    createLabel="Create Enrollment"
    searchPlaceholder="Search enrollments..."
  />
);
