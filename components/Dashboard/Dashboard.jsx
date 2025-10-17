"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ValidatorHub } from "./ValidatorHub";
import { QuickStats } from "./QuickStats";
import { RecentHistory } from "./RecentHistory";

export function Dashboard({ userDetails, reports, onNavigate, onAnalysisStart, onAnalysisComplete, onAnalysisError, onViewReport }) {
    const [activePage, setActivePage] = useState("dashboard");

    const handleNavigate = (page) => {
        setActivePage(page);
        onNavigate(page);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />
            
            <div className="ml-[72px] transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8 space-y-8">
                    <div 
                        className="opacity-0"
                        style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}
                    >
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
                            onViewReport={onViewReport}
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