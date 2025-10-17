"use client";
import { useState } from "react";
import { Download, Eye, Lightbulb } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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

export function RecentHistory({ reports = [], isLoading = false, onViewReport }) {
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownload = async (reportId) => {
      setDownloadingId(reportId);
      try {
        const res = await fetch(`/api/report/${reportId}`);
        const reportData = await res.json();

        if (!reportData.success) throw new Error('Failed to fetch report data');

        const { startupIdea } = reportData.data;

        // This is a simplified approach. In a real app, you would generate
        // the HTML on the server or have a dedicated download page.
        const response = await fetch('/api/download-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              htmlContent: `<h1>Report for ${startupIdea}</h1><p>Details...</p>`, 
              cssContent: 'body { font-family: sans-serif; }'
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate PDF on the server.');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${startupIdea.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Download failed:", error);
      } finally {
        setDownloadingId(null);
      }
    };
  
    if (isLoading) {
        return (
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h3 className="mb-6 text-white">Recent History</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-800/30 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h3 className="mb-6 text-white">Recent History</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                        <Lightbulb className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-400 max-w-md" style={{ fontSize: "14px" }}>
                        Your validated ideas will appear here. Let's analyze your first one!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h3 className="mb-6 text-white">Recent History</h3>
            <div className="overflow-hidden rounded-lg border border-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                            <TableHead className="text-gray-400">Idea</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Score</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(reports || []).map((report) => (
                            <TableRow key={report.id} className="border-gray-800 hover:bg-gray-800/30 transition-colors group">
                                <TableCell className="text-white max-w-md">
                                    <div className="truncate">{report.name}</div>
                                </TableCell>
                                <TableCell className="text-gray-400" style={{ fontSize: "14px" }}>
                                    {report.date}
                                </TableCell>
                                <TableCell>
                                    <ScoreBadge score={report.score} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => onViewReport(report.id)}
                                            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors border border-indigo-500/30"
                                            style={{ fontSize: "14px", fontWeight: 500 }}
                                        >
                                            <Eye className="w-4 h-4 inline mr-1.5" strokeWidth={1.5} />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownload(report.id)}
                                            disabled={downloadingId === report.id}
                                            className="p-2 bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Download className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}