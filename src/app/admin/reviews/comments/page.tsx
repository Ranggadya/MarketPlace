"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";

interface Review {
  id: string;
  product_name: string;
  product_image: string | null;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: string;
}

export default function AdminCommentsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/admin/reports?type=LATEST_REVIEWS");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter only reviews with comments
          setReviews(
            data.filter((r) => r.comment && r.comment.trim().length > 0)
          );
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Group reviews by Sentiment
  const groupedReviews = reviews.reduce((acc, review) => {
    let sentiment = "Netral";
    if (review.rating >= 4) sentiment = "Positif";
    else if (review.rating < 3) sentiment = "Negatif";

    if (!acc[sentiment]) {
      acc[sentiment] = [];
    }
    acc[sentiment].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positif":
        return "bg-green-50 border-green-100 text-green-700";
      case "Negatif":
        return "bg-red-50 border-red-100 text-red-700";
      default:
        return "bg-gray-50 border-gray-100 text-gray-700";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positif":
        return <ThumbsUp className="w-4 h-4" />;
      case "Negatif":
        return <ThumbsDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Detail Komentar Pengunjung
        </h1>
        <p className="text-gray-500">
          Komentar tertulis dikelompokkan berdasarkan sentimen (Rating).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Positif", "Netral", "Negatif"].map((sentiment) => {
          const items = groupedReviews[sentiment] || [];
          // Show empty groups too to maintain layout structure, or hide if preferred.
          // User asked for consistency, Shops page hides empty provinces but shows available ones.
          // Let's show all 3 columns for sentiment to see the distribution clearly.

          return (
            <div
              key={sentiment}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full"
            >
              <div
                className={`px-6 py-4 border-b flex items-center gap-3 ${getSentimentColor(
                  sentiment
                )}`}
              >
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {getSentimentIcon(sentiment)}
                </div>
                <div>
                  <h2 className="font-bold">{sentiment}</h2>
                  <p className="text-xs opacity-80">{items.length} Komentar</p>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto max-h-[600px]">
                {items.length > 0 ? (
                  <ul className="space-y-4">
                    {items.map((review, idx) => (
                      <li
                        key={idx}
                        className="p-4 rounded-lg bg-gray-50 border border-gray-100 relative"
                      >
                        <div className="absolute top-4 right-4 text-xs font-bold text-gray-400">
                          {review.rating} ★
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 pr-8 mb-1">
                          {review.product_name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          {new Date(review.created_at).toLocaleDateString(
                            "id-ID",
                            { dateStyle: "long" }
                          )}
                        </p>
                        <div className="bg-white p-3 rounded border border-gray-100 text-sm text-gray-700 italic relative">
                          <span className="absolute -top-2 left-2 text-2xl text-gray-200 leading-none">
                            "
                          </span>
                          {review.comment}
                          <span className="absolute -bottom-4 right-2 text-2xl text-gray-200 leading-none">
                            "
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            {review.reviewer.charAt(0)}
                          </div>
                          {review.reviewer}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm italic py-8">
                    Tidak ada komentar {sentiment.toLowerCase()}.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
