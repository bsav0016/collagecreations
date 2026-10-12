import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest has no globals here, so Testing Library cannot unmount between tests on its own.
afterEach(cleanup);
