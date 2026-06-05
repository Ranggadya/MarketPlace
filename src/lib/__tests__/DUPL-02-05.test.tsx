import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

vi.mock("lucide-react", () => ({
  Mail: () => React.createElement("span", { "data-testid": "icon-mail" }),
  Lock: () => React.createElement("span", { "data-testid": "icon-lock" }),
  ArrowRight: () => React.createElement("span", { "data-testid": "icon-arrow" }),
  Loader2: () => React.createElement("span", { "data-testid": "icon-loader" }),
  ShoppingBag: () => React.createElement("span", { "data-testid": "icon-bag" }),
  User: () => React.createElement("span", { "data-testid": "icon-user" }),
  Shield: () => React.createElement("span", { "data-testid": "icon-shield" }),
}));

vi.mock("@/components/AnimatedIconRow", () => ({
  default: () => React.createElement("div", { "data-testid": "animated-icons" }),
}));

describe("DUPL-02-05 | Component Unit: UniversalLoginForm – email kosong diblokir", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 401 })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("TC-01: email kosong, password terisi → pesan error email muncul dan fetch tidak dipanggil", async () => {
    const { default: UniversalLoginForm } = await import("@/components/UniversalLoginForm");
    const { container } = render(React.createElement(UniversalLoginForm));

    const passwordInput = screen.getByPlaceholderText("Masukkan password");
    await userEvent.type(passwordInput, "password123");

    const formEl = container.querySelector("form")!;
    fireEvent.submit(formEl);

    await waitFor(() => {
      expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("TC-02: submit dua kali dengan email kosong dan password terisi – fetch tidak pernah dipanggil", async () => {
    const { default: UniversalLoginForm } = await import("@/components/UniversalLoginForm");
    const { container } = render(React.createElement(UniversalLoginForm));

    const passwordInput = screen.getByPlaceholderText("Masukkan password");
    await userEvent.type(passwordInput, "password123");

    const formEl = container.querySelector("form")!;

    fireEvent.submit(formEl);
    await waitFor(() => {
      expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    });

    fireEvent.submit(formEl);
    await waitFor(() => {
      expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
