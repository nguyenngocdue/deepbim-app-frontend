import * as OBC from "@thatopen/components";
import { fragmentManager } from "./FragmentManager";

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
  
    async setModel(model: any): Promise<void> {
      try {
        this.model = model;
  
        // Khi model sẵn sàng => resolve promise
        if (this.modelReadyResolver) {
          this.modelReadyResolver(model);
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