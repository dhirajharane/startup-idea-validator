"use client";
import { useState, useRef } from "react";
import { Download, Bookmark } from "lucide-react";
import { Sidebar } from "../Dashboard/Sidebar";
import { ScoreChart } from "./ScoreChart";
import { CoreFindings } from "./CoreFindings";
import { SwotAnalysis } from "./SwotAnalysis";
import { MonetizationStrategies } from "./MonetizationStrategies";
import { ActionableInsights } from "./ActionableInsights";
import { PitchDeckTimeline } from "./PitchDeckTimeline";
import { CompetitiveLandscape } from "./CompetitiveLandscape";
import { MarketTrends } from "./MarketTrends";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Toaster, toast } from 'sonner';

export function ReportPage({ report, onNavigate, onReportSaved, onReportDownloaded }) {
    const [activePage, setActivePage] = useState("report");
    const [isDownloading, setIsDownloading] = useState(false); // Kept for potential future use
    const [isSaving, setIsSaving] = useState(false);
    const reportContainerRef = useRef(null);

    if (!report) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <p>Loading report data...</p>
            </div>
        );
    }

    const handleNavigate = (page) => {
        setActivePage(page);
        if (onNavigate) onNavigate(page);
    };

    // --- MODIFIED CODE ---
    // The download logic is replaced with a toast notification.
    const handleDownload = () => {
        toast.info("Buy Premium to download the report");
    };
    // --- END OF MODIFICATION ---

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/saved-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId: report.id }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong.');
            }
            if (onReportSaved) onReportSaved();
            toast.success("Report saved successfully!");

        } catch (error) {
            console.error("Failed to save report:", error);
            toast.error("Failed to save report.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Toaster richColors position="top-center" />
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />

            <div className="ml-[72px] transition-all duration-300">
                <div ref={reportContainerRef} className="max-w-7xl mx-auto p-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12"
                    >
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/30 mb-4 print-hidden">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-indigo-400 text-sm">Analysis Complete</span>
                            </div>
                            <h2 className="text-white mb-2">{report.startupIdea}</h2>
                            <p className="text-gray-400">
                                Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>
                        </div>

                        <div className="flex gap-3 print-hidden">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading} // This can be removed if you no longer need the disabled state
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            >
                                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                                {isDownloading ? 'Downloading...' : 'Download Report'}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
                            >
                                <Bookmark className="w-4 h-4 mr-2" strokeWidth={2} />
                                {isSaving ? 'Saving...' : 'Save Report'}
                            </Button>
                        </div>
                    </motion.div>

                    <div className="space-y-16">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <ScoreChart score={report.score} pieChartData={report.pieChartData} />
                        </motion.section>

                        <section>
                           <CoreFindings summary={report.summary} />
                        </section>

                        <section>
                            <h3 className="text-white mb-6">SWOT Analysis</h3>
                            <SwotAnalysis swot={report.swot} />
                        </section>

                        <section>
                           <MonetizationStrategies monetization={report.monetization} />
                        </section>

                        <section>
                           <ActionableInsights actionableInsights={report.actionableInsights} />
                        </section>

                        <section>
                            <PitchDeckTimeline pitchDeckOutline={report.pitchDeckOutline} />
                        </section>

                        <section>
                            <CompetitiveLandscape competitors={report.competitors} />
                        </section>

                        <section>
                            <MarketTrends
                                trendSummary={report.marketTrends.trendSummary}
                                trends={report.marketTrends.trends}
                            />
                        </section>
                        
                        <section>
                            <CoreFindings conclusion={report.conclusion} />
                        </section>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 text-center print-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-8">
                            <h3 className="text-white mb-4">Ready to validate another idea?</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Use your remaining credits to analyze more startup concepts and discover opportunities.
                            </p>
                            <Button
                                onClick={() => onNavigate("dashboard")}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-8"
                            >
                                Analyze Another Idea
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}