"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ValidatorHub } from "./ValidatorHub";
import { QuickStats } from "./QuickStats";
import { RecentHistory } from "./RecentHistory";

// 1. Remove all useEffect and data-fetching state. Accept props instead.
export function Dashboard({ userDetails, reports, onNavigate, onAnalysisStart, onAnalysisComplete, onAnalysisError }) {
    const [activePage, setActivePage] = useState("dashboard");

    const handleNavigate = (page) => {
        setActivePage(page);
        onNavigate(page);
    };

    const handleViewReport = (id) => {
        console.log("Viewing report:", id);
    };

    // The loading and error states are now handled by Next.js's loading.js/error.js files
    // and the parent server component.

    return (
        <div className="min-h-screen bg-gray-950">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />
            
            <div className="ml-[72px] transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8 space-y-8">
                    <div 
                        className="opacity-0"
                        style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}
                    >
                        {/* 2. Pass the props directly to ValidatorHub */}
                        <ValidatorHub
                            firstName={userDetails?.firstName}
                            creditsLeft={userDetails?.creditsLeft}
                            userId={userDetails?.id}
                            onAnalysisStart={onAnalysisStart}
                            onAnalysisComplete={onAnalysisComplete}
                            onAnalysisError={onAnalysisError}
                        />
                    </div>

                    <div
                        className="opacity-0"
                        style={{ animation: "slideUp 0.6s ease-out 0.2s both" }}
                    >
                        <QuickStats
                            numberOfIdeasAnalysed={userDetails?.analyzedIdeas}
                            noOfDownloadedReports={userDetails?.downloadedReports}
                            creditsLeft={userDetails?.creditsLeft}
                            numberOfSavedReports={userDetails?.savedReports}
                        />
                    </div>

                    <div
                        className="opacity-0"
                        style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}
                    >
                        <RecentHistory
                            reports={reports}
                            onViewReport={handleViewReport}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}