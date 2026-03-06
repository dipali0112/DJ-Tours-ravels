'use client';

import { Calendar, DollarSign, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface TripProps {
    trip: {
        id: string;
        destination: string;
        dates: string;
        budget: number;
        originalBudget?: number;
        image: string;
        status: string;
        category?: string;
    };
    onClick?: (trip: any) => void;
}

export default function TripCard({ trip, onClick }: TripProps) {
    const [imgSrc, setImgSrc] = useState(trip.image);
    const fallbackImage = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000';

    // Update imgSrc if the trip prop changes
    useEffect(() => {
        setImgSrc(trip.image);
    }, [trip.image]);

    const getButtonLabel = () => {
        switch (trip.status) {
            case 'completed': return 'View Details';
            case 'upcoming': return 'Manage Trip';
            default: return 'Book Now';
        }
    };

    return (
        <div
            onClick={() => onClick?.(trip)}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Image
                    src={imgSrc}
                    alt={trip.destination}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={() => setImgSrc(fallbackImage)}
                />
                {trip.originalBudget && trip.originalBudget > trip.budget && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                        SAVED ₹{(trip.originalBudget - trip.budget).toLocaleString()}
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{trip.destination}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Map className="w-3 h-3" /> {trip.destination.split(',')[1]?.trim() || 'India'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded inline-block mb-1">
                            4.5/5
                        </div>
                        <div className="text-[10px] text-gray-400">120 Reviews</div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-3">
                    <div>
                        {trip.originalBudget && trip.originalBudget > trip.budget && (
                            <p className="text-[10px] text-gray-400 line-through">₹ {trip.originalBudget.toLocaleString('en-IN')}</p>
                        )}
                        <p className="text-xl font-bold text-black">₹ {trip.budget.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-gray-400">Total Price</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(trip);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold uppercase px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
                    >
                        {getButtonLabel()}
                    </button>
                </div>
            </div>
        </div>
    );
}
