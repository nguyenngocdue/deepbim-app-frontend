class ContainerManager {
  private containerRef: HTMLDivElement | null = null;
  private fallbackRef: HTMLDivElement;

  constructor() {
    this.fallbackRef = document.createElement("div");
    this.fallbackRef.style.display = "none";
  }

  setRef(ref: HTMLDivElement | null) {
    this.containerRef = ref;
  }

  getRef(): HTMLDivElement | null {
    return this.containerRef;
  }

  getRefOrFallback(): HTMLDivElement {
    return this.containerRef ?? this.fallbackRef;
  }

  getRefOrThrow(): HTMLDivElement {
    if (!this.containerRef) {
      throw new Error("ContainerManager: containerRef is null!");
    }
    return this.containerRef;
  }

  clearRef() {
    this.containerRef = null;
  }

  hasRef(): boolean {
    return this.containerRef !== null;
  }
}

export const containerManager = new ContainerManager();
