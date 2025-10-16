"use client";
import { useState } from "react";
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

    if (!report) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <p>Loading report data...</p>
            </div>
        );
    }

    const handleNavigate = (page) => {
        setActivePage(page);
        onNavigate(page);
    };

    const handleDownload = () => {
        console.log("Downloading report:", report.ideaName);
    };

    const handleSave = () => {
        console.log("Saving report:", report.ideaName);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />

            <div className="ml-[72px] transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12"
                    >
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/30 mb-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-indigo-400 text-sm">Analysis Complete</span>
                            </div>
                            <h2 className="text-white mb-2">{report.ideaName}</h2>
                            <p className="text-gray-400">
                                Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            >
                                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                                Download Report
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
                            >
                                <h3 className="text-white mb-4">Summary</h3>
                                <p className="text-gray-300" style={{ fontSize: "18px", lineHeight: 1.7 }}>
                                    {report.summary}
                                </p>
                            </motion.div>
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 border-l-4 border-l-indigo-500 rounded-2xl p-8"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white">Conclusion</h3>
                                </div>
                                <p className="text-gray-300" style={{ fontSize: "18px", lineHeight: 1.7 }}>
                                    {report.conclusion}
                                </p>
                            </motion.div>
                        </section>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 text-center"
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