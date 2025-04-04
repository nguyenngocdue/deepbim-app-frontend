import * as OBC from "@thatopen/components";

/**
 * Class ModelManager manages loading and storing models from a buffer.
 */
class ModelManager {
    private model: any;
    private modelReadyResolver?: (model: any) => void;
    private modelReadyPromise: Promise<any>;
  
    constructor() {
      this.modelReadyPromise = new Promise((resolve) => {
        this.modelReadyResolver = resolve;
      });
    }
  
    async setModel(buffer: any, components: OBC.Components): Promise<void> {
      try {
        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        if (!fragmentIfcLoader) throw new Error("IfcLoader not found in components.");
        await fragmentIfcLoader.setup();
        const fragmentGroup2 = await fragmentIfcLoader.load(buffer);
  
        this.model = fragmentGroup2;
  
        // Khi model sẵn sàng => resolve promise
        if (this.modelReadyResolver) {
          this.modelReadyResolver(fragmentGroup2);
          this.modelReadyResolver = undefined; // cleanup
        }
      } catch (error) {
        console.error("Error setting reference for model:", error);
        throw error;
      }
    }
  
    getModel(): any | null {
      return this.model || null;
    }
  
    async waitForModel(): Promise<any> {
      return this.model ? this.model : this.modelReadyPromise;
    }
  }
  

// Create a singleton instance of ModelManager
export const modelManager = new ModelManager();