// components/common/EntitySearchAndActions.tsx
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/SearchBox";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

interface EntitySearchAndActionsProps {
  filter: string;
  setFilter: (value: string) => void;
  openCreateModal: () => void;
  createLabel?: string;
  searchPlaceholder?: string;
}

export const EntitySearchAndActions = ({
  filter,
  setFilter,
  openCreateModal,
  createLabel = "Create Item",
  searchPlaceholder = "Search...",
}: EntitySearchAndActionsProps) => (
  <div className="flex gap-4">
    <Button
      onClick={openCreateModal}
      className={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
    >
      + {createLabel}
    </Button>
    <SearchBox
      value={filter}
      onChange={setFilter}
      placeholder={searchPlaceholder}
    />
  </div>
);
