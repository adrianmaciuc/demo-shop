import "@testing-library/jest-dom";

declare const jest: any;
declare const global: any;

interface ImportMetaEnv {
  VITE_API_URL: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

// Mock import.meta
global.importMeta = {
  env: {
    VITE_API_URL: "http://localhost:1337/api",
  },
} as ImportMeta;

// Mock TextEncoder and TextDecoder if not available
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      return new TextEncoder().encode(input);
    }
    decode(input?: unknown): string {
      return new TextDecoder().decode(
        input as Parameters<TextDecoder["decode"]>[0],
      );
    }
  } as unknown as typeof TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = class TextDecoder {
    decode(input?: unknown): string {
      return new TextDecoder().decode(
        input as Parameters<TextDecoder["decode"]>[0],
      );
    }
    readonly encoding: string = "utf-8";
    readonly fatal: boolean = false;
    readonly ignoreBOM: boolean = false;
  } as unknown as typeof TextDecoder;
}

// Mock window.matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver - works as constructor and triggers synchronously
class MockIntersectionObserver {
  private callback: (
    entries: IntersectionObserverEntry[],
    observer: unknown,
  ) => void;
  private observedElements: Set<Element>;

  constructor(
    callback: (entries: IntersectionObserverEntry[], observer: unknown) => void,
  ) {
    this.callback = callback;
    this.observedElements = new Set<Element>();
  }

  observe(target: Element): void {
    this.observedElements.add(target);
    const entry: IntersectionObserverEntry = {
      isIntersecting: true,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      target,
      time: Date.now(),
    };
    this.callback([entry], this);
  }

  disconnect(): void {
    this.observedElements.clear();
  }

  unobserve(target: Element): void {
    this.observedElements.delete(target);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

(
  global as unknown as { IntersectionObserver: typeof IntersectionObserver }
).IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
