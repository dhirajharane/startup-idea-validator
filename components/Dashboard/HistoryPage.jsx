"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Toaster, toast } from 'sonner';

const ScoreBadge = ({ score }) => {
    let colorClass = "bg-gray-500";
    if (score >= 80) colorClass = "bg-green-500";
    else if (score >= 60) colorClass = "bg-blue-500";
    else if (score >= 40) colorClass = "bg-yellow-500";
    else if (score > 0) colorClass = "bg-red-500";

    return (
        <div className="inline-flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${colorClass} animate-pulse`} />
            <span className="text-white" style={{ fontWeight: 600 }}>
                {score}
            </span>
            <span className="text-gray-500">/100</span>
        </div>
    );
};

export function HistoryPage({ onNavigate, onViewReport }) {
    const [activePage, setActivePage] = useState("history");
    const [allReports, setAllReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/user-reports');
                if (!response.ok) {
                    throw new Error('Failed to fetch reports.');
                }
                const data = await response.json();
                if (data.success) {
                    setAllReports(Array.isArray(data.data) ? data.data : []);
                } else {
                    throw new Error(data.error || 'Could not fetch reports.');
                }
            } catch (err) {
                setError(err.message);
                setAllReports([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleNavigate = (page) => {
        setActivePage(page);
        onNavigate(page);
    };

    const handleDownload = async (reportId) => {
        toast.info("Buy Premium to download the report");
    };
    
    const safeAllReports = Array.isArray(allReports) ? allReports : [];
    const filteredReports = safeAllReports.filter((report) =>
        report.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

    // if (isLoading) {
    //     return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white"><p>Loading History...</p></div>;
    // }
    
    if (error) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500"><p>Error: {error}</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />
            <div className="ml-[72px] transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8">
                    <div className="mb-8">
                        <h1 className="mb-2 text-white">Validation History</h1>
                        <p className="text-gray-400">Review all your analyzed startup ideas and their performance scores</p>
                    </div>

                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={1.5} />
                        <Input type="text" placeholder="Search your ideas..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-12 bg-gray-900/30 border-gray-800 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                    </div>

                    <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                        <div className="overflow-hidden rounded-lg border border-gray-800">
                            <Table>
                                <TableHeader><TableRow className="border-gray-800 hover:bg-transparent"><TableHead className="text-gray-400">Idea</TableHead><TableHead className="text-gray-400">Date</TableHead><TableHead className="text-gray-400">Score</TableHead><TableHead className="text-gray-400 text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {paginatedReports.map((report) => (
                                        <TableRow key={report.id} className="border-gray-800 hover:bg-gray-800/30 transition-colors group">
                                            <TableCell className="text-white max-w-md"><div className="truncate">{report.name}</div></TableCell>
                                            <TableCell className="text-gray-400" style={{ fontSize: "14px" }}>{report.date}</TableCell>
                                            <TableCell><ScoreBadge score={report.score} /></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button onClick={() => onViewReport(report.id)} className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors border border-indigo-500/30" style={{ fontSize: "14px", fontWeight: 500 }}><Eye className="w-4 h-4 inline mr-1.5" strokeWidth={1.5} />View Report</button>
                                                    <button onClick={() => handleDownload(report.id)} className="p-2 bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"><Download className="w-4 h-4" strokeWidth={1.5} /></button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-gray-400" style={{ fontSize: "14px" }}>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} results</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-5 h-5" strokeWidth={1.5} /></button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg transition-colors ${currentPage === page ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white"}`} style={{ fontSize: "14px", fontWeight: 500 }}>{page}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-5 h-5" strokeWidth={1.5} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}