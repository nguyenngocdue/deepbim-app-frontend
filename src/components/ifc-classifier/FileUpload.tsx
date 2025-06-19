import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadCloud, PlusSquare } from "lucide-react";
import { useIFCContext } from "@/context/ifc-context";
import { useTranslation } from "react-i18next";
import { LoadingOverlay } from "../common/LoadingOverlay";

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Uploading");


  // Load demo and saved models on mount
  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await fetch("/data/demo_models.json");
        if (!res.ok) throw new Error("Failed to fetch demo models");
        const models = await res.json();
        setDemoModels(models);
      } catch (err) {
        console.error("Failed to load demo models:", err);
        setError(t("error.loadDemoModels"));
      }
    };
    fetchDemo();

    const stored = localStorage.getItem("appSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.modelUrls)) {
          setSavedModels(parsed.modelUrls);
        }
      } catch (err) {
        console.error("Failed to parse stored model URLs:", err);
        setError(t("error.loadSavedModels"));
      }
    }
  }, [t]);

  // Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke any lingering Object URLs if component unmounts
      // This assumes handleFileChange stores URLs if needed
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      setError(t("error.noFileSelected"));
      return;
    }

    const file = e.target.files[0];
    if (!file.name.toLowerCase().endsWith(".ifc")) {
      setError(t("error.invalidFileType"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    
    setIsLoading(true);
    setLoadingMessage(t("uploadingFile"));

    try {
      if (isAdding) {
        await  addIFCModel(url, file.name);
      } else {
        await  replaceIFCModel(url, file.name);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load IFC model:", err);
      setError(t("error.loadModel"));
      URL.revokeObjectURL(url);
    }finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

  };

  const handleLoadModel = async(model: ModelSource) => {
    setIsLoading(true);
    setLoadingMessage(t("loadingModel"));
    try {
      if (isAdding) {
        await addIFCModel(model.url, model.name);
      } else {
        await replaceIFCModel(model.url, model.name);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load model:", err);
      setError(t("error.loadModel"));
    }finally {
      setIsLoading(false);
    }
  };

  const hasSavedModels = savedModels.length > 0;
  const savedModelUrls = new Set(savedModels.map((m) => m.url));
  const uniqueDemoModels = demoModels.filter((dm) => !savedModelUrls.has(dm.url));
  const hasUniqueDemoModels = uniqueDemoModels.length > 0;

  if (isAdding) {
    // Sidebar "Add" button
    if (hasSavedModels || hasUniqueDemoModels) {
      // Show dropdown if there are saved or demo models
      return (
        <div className="relative">
          <LoadingOverlay open={isLoading} message={loadingMessage} progress={0}/>
          <input
            type="file"
            accept=".ifc"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title={t("addAnotherModel")}
                className="h-8 w-8"
              >
                <PlusSquare className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-color-standard">
              <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
                {t("loadIFCFile")}
              </DropdownMenuItem>
              {hasSavedModels && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs">{t("myModels")}</DropdownMenuLabel>
                  {savedModels.map((m) => (
                    <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                      {m.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              {hasUniqueDemoModels && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs">{t("demoModels")}</DropdownMenuLabel>
                  {uniqueDemoModels.map((m) => (
                    <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                      {m.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {error && (
            <div className="absolute top-full mt-2 p-2 bg-destructive/90 text-destructive-foreground text-xs rounded-md shadow-md">
              {error}
            </div>
          )}
        </div>
      );
    } else {
      // No saved or demo models: direct file upload button
      return (
        <div className="relative">
          <input
            type="file"
            accept=".ifc"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title={t("addAnotherModel")}
            className="h-8 w-8"
          >
            <PlusSquare className="w-4 h-4" />
          </Button>
          {error && (
            <div className="absolute top-full mt-2 p-2 bg-destructive/90 text-destructive-foreground text-xs rounded-md shadow-md">
              {error}
            </div>
          )}
        </div>
      );
    }
  } else {
    // Main canvas prompt (isAdding=false)
    return (
      <div className="text-center p-8 bg-background/90 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <UploadCloud className="h-12 w-12 text-foreground/30" />
        </div>
        <p className="text-base font-medium text-foreground/80 mb-2">{t("ifcModelViewer")}</p>
        <p className="text-sm text-foreground/60 mb-6">{t("uploadIFCFile")}</p>
        <input
          type="file"
          accept=".ifc"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {hasSavedModels || hasUniqueDemoModels ? (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="default"
                  title={t("loadInitialModel")}
                >
                  <UploadCloud className="w-4 h-4 mr-2" /> {t("loadIFCFile")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-color-standard">
                <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
                  {t("loadIFCFile")}
                </DropdownMenuItem>
                {hasSavedModels && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">{t("myModels")}</DropdownMenuLabel>
                    {savedModels.map((m) => (
                      <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                        {m.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                {hasUniqueDemoModels && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">{t("demoModels")}</DropdownMenuLabel>
                    {uniqueDemoModels.map((m) => (
                      <DropdownMenuItem key={m.url} onSelect={() => handleLoadModel(m)}>
                        {m.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {error && (
              <div className="mt-2 p-2 bg-destructive/90 text-destructive-foreground text-xs rounded-md shadow-md">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Button
              variant="default"
              size="default"
              onClick={() => fileInputRef.current?.click()}
              title={t("loadInitialModel")}
            >
              <UploadCloud className="w-4 h-4 mr-2" /> {t("loadIFCFile")}
            </Button>
            {error && (
              <div className="mt-2 p-2 bg-destructive/90 text-destructive-foreground text-xs rounded-md shadow-md">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}