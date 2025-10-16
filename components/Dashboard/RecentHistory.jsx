"use client";
import { Download, Eye, Lightbulb } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function RecentHistory({ reports = [], isLoading = false, onViewReport }) {
  
  if (!isLoading && reports.length === 0) {
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

  if (isLoading) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
        <h3 className="mb-6 text-white">Recent History</h3>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-800/30 rounded-lg animate-pulse" 
              style={{
                animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes shimmer {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}</style>
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
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(Array.isArray(reports) ? reports : []).slice(0, 3).map((report) => (
              <TableRow 
                key={report.id}
                className="border-gray-800 hover:bg-gray-800/30 transition-colors group"
              >
                <TableCell className="text-white max-w-md">
                  <div className="truncate">{report.name}</div>
                </TableCell>
                <TableCell className="text-gray-400" style={{ fontSize: "14px" }}>
                  {report.date}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onViewReport(report.id)}
                      className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors border border-indigo-500/30"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <Eye className="w-4 h-4 inline mr-1.5" strokeWidth={1.5} />
                      View Report
                    </button>
                    <button
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