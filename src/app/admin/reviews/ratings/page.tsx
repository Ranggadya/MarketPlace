"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  product_name: string;
  product_image: string | null;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: string;
}

export default function AdminRatingsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/admin/reports?type=LATEST_REVIEWS");
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Group reviews by Star Rating (5, 4, 3, 2, 1)
  const groupedReviews = reviews.reduce((acc, review) => {
    const star = Math.floor(review.rating).toString(); // 5, 4, 3...
    if (!acc[star]) {
      acc[star] = [];
    }
    acc[star].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  // Ensure order 5 down to 1
  const sortedStars = ["5", "4", "3", "2", "1"];

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
          Detail Rating Pengunjung
        </h1>
        <p className="text-gray-500">
          Ulasan pengunjung dikelompokkan berdasarkan bintang rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStars.map((star) => {
          const items = groupedReviews[star] || [];
          if (items.length === 0) return null;

          return (
            <div
              key={star}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-yellow-500 shadow-sm">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{star} Bintang</h2>
                  <p className="text-xs text-gray-500">{items.length} Ulasan</p>
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto">
                <ul className="space-y-4">
                  {items.map((review, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {review.product_name}
                        </h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(review.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-xs text-gray-600 italic mb-2 line-clamp-2">
                          "{review.comment}"
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <UserAvatar name={review.reviewer} />
                        <span>{review.reviewer}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {reviews.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">Belum ada rating dari pengunjung.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
      {name.charAt(0)}
    </div>
  );
}
