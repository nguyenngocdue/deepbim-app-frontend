import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/SearchBox";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

interface LessonSearchAndActionsProps {
  filter: string;
  setFilter: (value: string) => void;
  openCreateModal: () => void;
}

export const LessonSearchAndActions = ({
  filter,
  setFilter,
  openCreateModal,
}: LessonSearchAndActionsProps) => (
  <div className="flex gap-4">
    <Button
      onClick={openCreateModal}
      className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
    >
      + Create Lesson
    </Button>
    <SearchBox
      value={filter}
      onChange={setFilter}
      placeholder="Search lesson..."
    />
  </div>
);