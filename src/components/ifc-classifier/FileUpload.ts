import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UploadCloud, PlusSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIFCContext } from "@/context/ifc-context";

interface ModelSource {
  name: string;
  url: string;
}

interface FileUploadProps {
  isAdding?: boolean;
}

export default function FileUpload({ isAdding = false }: FileUploadProps) {
  const { replaceIFCModel, addIFCModel } = useIFCContext();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [demoModels, setDemoModels] = useState<ModelSource[]>([]);
  const [savedModels, setSavedModels] = useState<ModelSource[]>([]);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await fetch("/data/demo_models.json");
        if (res.ok) setDemoModels(await res.json());
      } catch (err) {
        console.error("Failed to load demo models", err);
      }
    };
    fetchDemo();
    const stored = localStorage.getItem("appSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedModels(parsed.modelUrls || []);
      } catch (e) {
        console.error("Failed to parse stored model urls", e);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (isAdding) addIFCModel(url, file.name);
      else replaceIFCModel(url, file.name);
    }
  };

  const handleLoadModel = (model: ModelSource) => {
    if (isAdding) addIFCModel(model.url, model.name);
    else replaceIFCModel(model.url, model.name);
  };

  const buttonStyle = isAdding ? "h-8 w-8" : "";
  const commonButtonContent = isAdding ? (
    <PlusSquare className="w-4 h-4" />
  ) : (
    <>
      <UploadCloud className="w-4 h-4 mr-2" /> {t('loadIFCFile')}
    </>
  );
  const commonButtonTitle = isAdding ? t('addAnotherModel') : t('loadInitialModel');

  const hasSavedModels = savedModels.length > 0;
  const savedModelUrls = new Set(savedModels.map(m => m.url));
  const uniqueDemoModels = demoModels.filter(dm => !savedModelUrls.has(dm.url));
  const hasUniqueDemoModels = uniqueDemoModels.length > 0;

  if (isAdding) {
    if (hasSavedModels) {
      const addButton = (
        <Button variant="ghost" size="icon" title={commonButtonTitle} className={buttonStyle}>
          {commonButtonContent}
        </Button>
      );
      const addMenu = (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{addButton}</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              {t('loadIFCFile')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">{t('myModels')}</DropdownMenuLabel>
            {savedModels.map((m) => (
              <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                {m.name}
              </DropdownMenuItem>
            ))}
            {hasUniqueDemoModels && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">{t('demoModels')}</DropdownMenuLabel>
                {uniqueDemoModels.map((m) => (
                  <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                    {m.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
      return (
        <>
          <input type="file" accept=".ifc" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          {addMenu}
        </>
      );
    } else {
      return (
        <>
          <input type="file" accept=".ifc" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} title={commonButtonTitle} className={buttonStyle}>
            {commonButtonContent}
          </Button>
        </>
      );
    }
  } else {
    if (hasSavedModels) {
      const mainPromptButton = (
        <Button variant="default" size="default" title={commonButtonTitle}>
          {commonButtonContent}
        </Button>
      );
      const mainPromptMenu = (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{mainPromptButton}</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              {t('loadIFCFile')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">{t('myModels')}</DropdownMenuLabel>
            {savedModels.map((m) => (
              <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                {m.name}
              </DropdownMenuItem>
            ))}
            {hasUniqueDemoModels && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">{t('demoModels')}</DropdownMenuLabel>
                {uniqueDemoModels.map((m) => (
                  <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                    {m.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
      return (
        <div className="text-center p-8">
          <div className="flex justify-center mb-4">
            <UploadCloud className="h-12 w-12 text-foreground/30" />
          </div>
          <p className="text-base font-medium text-foreground/80 mb-2">{t('ifcModelViewer')}</p>
          <p className="text-sm text-foreground/60 mb-6">{t('uploadIFCFile')}</p>
          <input type="file" accept=".ifc" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          {mainPromptMenu}
        </div>
      );
    } else {
      return (
        <div className="text-center p-8">
          <div className="flex justify-center mb-4">
            <UploadCloud className="h-12 w-12 text-foreground/30" />
          </div>
          <p className="text-base font-medium text-foreground/80 mb-2">{t('ifcModelViewer')}</p>
          <p className="text-sm text-foreground/60 mb-6">{t('uploadIFCFile')}</p>
          <input type="file" accept=".ifc" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <Button variant="default" size="default" onClick={() => fileInputRef.current?.click()} title={commonButtonTitle}>
            {commonButtonContent}
          </Button>
        </div>
      );
    }
  }
}