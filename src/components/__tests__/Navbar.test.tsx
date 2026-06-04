import type React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../Navbar";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({
        push: pushMock,
    }),
    useSearchParams: () => new URLSearchParams(""),
}));

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        ...props
    }: {
        href: string;
        children: React.ReactNode;
    }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock("next/image", () => ({
    default: ({
        src,
        alt,
        width,
        height,
        className,
    }: {
        src: string;
        alt: string;
        width: number;
        height: number;
        className?: string;
    }) => (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
        />
    ),
}));

vi.mock("@/components/SearchBarMini", () => ({
    default: () => <div data-testid="search-bar-mini">SearchBarMini</div>,
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        asChild,
        className,
        variant,
        onClick,
    }: {
        children: React.ReactNode;
        asChild?: boolean;
        className?: string;
        variant?: string;
        onClick?: () => void;
    }) => (
        <button
            type="button"
            className={className}
            data-as-child={asChild ? "true" : "false"}
            data-variant={variant || "default"}
            onClick={onClick}
        >
            {children}
        </button>
    ),
}));

vi.mock("@/components/ui/sheet", () => ({
    Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SheetHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SheetTitle: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
    ),
    SheetTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock("@/lib/constants", () => ({
    CATEGORY_OPTIONS: [
        { value: "makanan", label: "Makanan" },
        { value: "minuman", label: "Minuman" },
    ],
}));

describe("DUPL-05-03 - Unit Testing Dropdown Lokasi pada Navbar", () => {
    it("menampilkan dropdown lokasi ketika tombol lokasi diklik", async () => {
        const user = userEvent.setup();

        render(<Navbar />);

        expect(screen.queryByText("Pilih Lokasi Toko")).not.toBeInTheDocument();

        const locationButton = screen.getByRole("button", {
            name: /lokasi/i,
        });

        await user.click(locationButton);

        expect(screen.getByText("Pilih Lokasi Toko")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contoh: Semarang")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /batal/i })).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /terapkan/i })
        ).toBeInTheDocument();
    });
});