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

export function ReportPage({ report, onNavigate }) {
    const [activePage, setActivePage] = useState("report");
    const [isDownloading, setIsDownloading] = useState(false);
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

    const handleDownload = async () => {
        setIsDownloading(true);
        if (!reportContainerRef.current) {
            console.error("Report container not found.");
            setIsDownloading(false);
            return;
        }

        try {
            const styleSheets = Array.from(document.styleSheets);
            let cssContent = "";

            for (const sheet of styleSheets) {
                try {
                    if (sheet.cssRules) {
                        cssContent += Array.from(sheet.cssRules)
                            .map((rule) => rule.cssText)
                            .join("\n");
                    } else if (sheet.href) {
                        const res = await fetch(sheet.href);
                        if (res.ok) {
                            const text = await res.text();
                            cssContent += text;
                        }
                    }
                } catch (e) {
                    console.warn("Could not read stylesheet:", e);
                }
            }

            const htmlContent = reportContainerRef.current.innerHTML;

            const response = await fetch('/api/download-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent, cssContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF on the server.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            
            const fileName = (report?.startupIdea || 'startup_report')
              .replace(/[^a-z0-9]/gi, '_')
              .toLowerCase();
            a.download = `${fileName}.pdf`;
            
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSave = () => {
        console.log("Saving report:", report.startupIdea);
    };

    return (
        <div className="min-h-screen bg-gray-950">
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
                                disabled={isDownloading}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            >
                                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                                {isDownloading ? 'Downloading...' : 'Download Report'}
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
                            >
                                <Bookmark className="w-4 h-4 mr-2" strokeWidth={2} />
                                Save Report
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
                           <CoreFindings summary={report.summary} conclusion={report.conclusion} />
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
