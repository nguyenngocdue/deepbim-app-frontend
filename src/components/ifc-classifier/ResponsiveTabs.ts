import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Filter, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ClassificationPanel } from "./classification-panel";
import { RulePanel } from "./rule-panel";
import { SettingsPanel } from "./settings-panel";

export default function ResponsiveTabs({ onSettingsChanged }: { onSettingsChanged: () => void }) {
  const { t } = useTranslation();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState<'full' | 'textOnly' | 'iconOnly'>('full');

  const updateDisplayMode = useCallback((width: number) => {
    if (width < 200) {
      setDisplayMode('iconOnly');
    } else if (width < 300) {
      setDisplayMode('textOnly');
    } else {
      setDisplayMode('full');
    }
  }, []);

  useLayoutEffect(() => {
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    const initialWidth = tabsElement.getBoundingClientRect().width;
    if (initialWidth > 0) {
      updateDisplayMode(initialWidth);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        updateDisplayMode(width);
      }
    });

    resizeObserver.observe(tabsElement);
    return () => resizeObserver.disconnect();
  }, [updateDisplayMode]);

  return (
    <Tabs defaultValue="classifications" className="flex flex-col h-full shadow-lg bg-gradient-to-l from-[hsl(var(--card))] to-transparent" ref={tabsRef}>
      <TabsList className="w-full shrink-0 border-b border-border/50 p-1 bg-[hsl(var(--background))/85] backdrop-blur-sm">
        <TabsTrigger
          value="classifications"
          className="flex-1 text-sm py-1.5 px-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-sm flex items-center justify-center"
          title={displayMode === 'iconOnly' ? t('navigation.classificationsTab') : undefined}
        >
          {displayMode !== 'textOnly' && <Layers className={`w-4 h-4 ${displayMode === 'full' ? 'mr-1.5' : ''}`} />}
          {displayMode !== 'iconOnly' && <span className={displayMode === 'textOnly' ? 'truncate' : ''}>{t('navigation.classificationsTab')}</span>}
        </TabsTrigger>
        <TabsTrigger
          value="rules"
          className="flex-1 text-sm py-1.5 px-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-sm flex items-center justify-center"
          title={displayMode === 'iconOnly' ? t('rulesPanel') : undefined}
        >
          {displayMode !== 'textOnly' && <Filter className={`w-4 h-4 ${displayMode === 'full' ? 'mr-1.5' : ''}`} />}
          {displayMode !== 'iconOnly' && <span className={displayMode === 'textOnly' ? 'truncate' : ''}>{t('rulesPanel')}</span>}
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="flex-1 text-sm py-1.5 px-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-sm flex items-center justify-center"
          title={displayMode === 'iconOnly' ? t('settingsPanel') : undefined}
        >
          {displayMode !== 'textOnly' && <Settings className={`w-4 h-4 ${displayMode === 'full' ? 'mr-1.5' : ''}`} />}
          {displayMode !== 'iconOnly' && <span className={displayMode === 'textOnly' ? 'truncate' : ''}>{t('settingsPanel')}</span>}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="classifications" className="p-2 flex-grow overflow-y-auto">
        <ClassificationPanel />
      </TabsContent>
      <TabsContent value="rules" className="p-4 flex-grow overflow-y-auto">
        <RulePanel />
      </TabsContent>
      <TabsContent value="settings" className="p-4 flex-grow overflow-y-auto">
        <SettingsPanel onSettingsChanged={onSettingsChanged} />
      </TabsContent>
    </Tabs>
  );
}