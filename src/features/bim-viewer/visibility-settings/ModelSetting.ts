import { UserManager } from "@/services/UserManager";
import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { createHighlightMaterial } from "../utils/HighlightMaterial";

interface UserSettingProps {
    selectedModel: FRAGS.FragmentsSelectedModel;
    configs?: Record<string, any>;
}


export async function updateUserSettings({ selectedModel, configs = {} }: UserSettingProps) {
    const settings = UserManager.get();
    if (!settings) return selectedModel;
    const visibilities = configs.length  ? configs : settings.view?.visibility;
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get("v");

    if (visibilities) {
        for (const [id, configs] of Object.entries(visibilities)) {
            if(id != viewId)  continue;
            for (const [key, cates] of Object.entries(configs)) {
                const { color, isShow, transparency } = cates;
                const selectedElements = await selectedModel.getItemsOfCategory(key);
                const idsLocal = selectedElements.map(item => item._localId);
                if (selectedElements) {
                    if (!isShow) {
                        await selectedModel?.setVisible(idsLocal, false)
                    } else {
                        if(color) await selectedModel?.highlight(idsLocal, createHighlightMaterial(color))
                        if(transparency) await selectedModel?.highlight(idsLocal, createHighlightMaterial(color, transparency))
                    }
                }
    
            }
        }
        
    
    }
}