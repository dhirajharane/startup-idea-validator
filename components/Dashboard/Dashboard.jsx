"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ValidatorHub } from "./ValidatorHub";
import { QuickStats } from "./QuickStats";
import { RecentHistory } from "./RecentHistory";

export function Dashboard({ onNavigate, onAnalysisStart, onAnalysisComplete, onAnalysisError }) {
    const [activePage, setActivePage] = useState("dashboard");
    const [userDetails, setUserDetails] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [detailsRes, reportsRes] = await Promise.all([
                    fetch('/api/user-details'),
                    fetch('/api/user-reports')
                ]);

                if (!detailsRes.ok || !reportsRes.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }

                const detailsData = await detailsRes.json();
                const reportsData = await reportsRes.json();

                if (detailsData.success) {
                    setUserDetails(detailsData.data);
                } else {
                    throw new Error(detailsData.error || 'Could not fetch user details.');
                }

                if (reportsData.success) {
                    setReports(reportsData.data);
                } else {
                    throw new Error(reportsData.error || 'Could not fetch user reports.');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNavigate = (page) => {
        setActivePage(page);
        onNavigate(page);
    };

    const handleViewReport = (id) => {
        console.log("Viewing report:", id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <p>Loading Dashboard...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }

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