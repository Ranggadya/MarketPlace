"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Banner = {
    id: string;
    imageUrl: string;
    href: string;
};

const BANNERS: Banner[] = [
    {
        id: "banner-1",
        imageUrl: "/image/banner1.png",
        href: "/product?promo=1",
    },
    {
        id: "banner-2",
        imageUrl: "/image/banner2.png",
        href: "/product?promo=2",
    },
    {
        id: "banner-3",
        imageUrl: "/image/banner3.png",
        href: "/product?promo=3",
    },
];

const AUTO_PLAY = 5000; // 5 detik

export default function HeroBannerCarousel() {
    const [index, setIndex] = useState(0);
    const [hover, setHover] = useState(false);

    const total = BANNERS.length;

    const next = () => setIndex((prev) => (prev + 1) % total);
    const prev = () => setIndex((prev) => (prev - 1 + total) % total);

    // Auto-slide
    useEffect(() => {
        if (hover) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % total);
        }, AUTO_PLAY);

        return () => clearInterval(timer);
    }, [hover, total]);

    return (
        <div
            className="relative mx-auto mt-6 max-w-7xl px-4 md:px-6 lg:px-8"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-video bg-gray-100">
                {/* Slide container */}
                <div
                    className="flex h-full transition-transform duration-500"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {BANNERS.map((b, i) => (
                        <div key={b.id} className="relative min-w-full aspect-video">
                            <Link href={b.href}>
                                <Image
                                    src={b.imageUrl}
                                    alt={`Banner promo ${i + 1}`}
                                    fill
                                    className="object-cover cursor-pointer"
                                    priority={i === 0}
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Prev button */}
                <button
                    type="button"
                    onClick={prev}
                    aria-label="Banner sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                {/* Next button */}
                <button
                    type="button"
                    onClick={next}
                    aria-label="Banner berikutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {BANNERS.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Pilih banner ${i + 1}`}
                            className={`h-2 w-2 rounded-full transition-all ${index === i ? "bg-white shadow-md scale-125" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
