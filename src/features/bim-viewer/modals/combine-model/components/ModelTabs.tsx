import ModelTabsTemplate from "@/components/bim-viewer/common/ModelTabsTemplate";
import AppMediaPage from "@/features/bim-viewer/management-home/components/AppMediaPage";
import UserMediaPage from "@/features/bim-viewer/management-me/components/UserMediaPage";

const tabs = [
  { label: "Public Models", value: "public", content: <AppMediaPage hasAction={false}/> },
  { label: "My Models", value: "private", content: <UserMediaPage hasAction={false}/> },
];

export default function App() {
  return (
      <ModelTabsTemplate tabs={tabs} contentHeight="min-h-[500px]"/>
  );
}
