"use client";

import React, { useState } from 'react';
import { Dashboard } from './Dashboard.jsx';
import { HistoryPage } from './HistoryPage.jsx';
import { LoadingState } from './LoadingState.jsx';
import { ReportPage } from '../Report/ReportPage.jsx';

export default function MainDashboard({ userDetails, initialReports }) {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [analysisError, setAnalysisError] = useState('');
    const [reports, setReports] = useState(initialReports || []);
    const [credits, setCredits] = useState(userDetails?.creditsLeft || 0);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleAnalysisStart = () => {
        setIsLoading(true);
        setAnalysisError('');
    };

    const handleAnalysisComplete = (newReportData) => {
        setReportData(newReportData);
        // Add new report to the top of the list and update credits
        setReports(prev => [newReportData.summary, ...prev]); 
        setCredits(prev => prev - 1);
        setCurrentPage('report');
        setIsLoading(false);
    };

    const handleAnalysisError = (error) => {
        setAnalysisError(error);
        setIsLoading(false);
        setCurrentPage('dashboard'); 
    };

    if (isLoading) {
        return <LoadingState />;
    }
    
    switch (currentPage) {
        case 'dashboard':
            return (
                <Dashboard 
                    userDetails={{...userDetails, creditsLeft: credits}}
                    reports={reports}
                    onNavigate={handleNavigate} 
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisError={handleAnalysisError}
                />
            );
        case 'history':
            return <HistoryPage onNavigate={handleNavigate} />;
        case 'report':
            return <ReportPage report={reportData} onNavigate={handleNavigate} />;
        default:
            return <Dashboard onNavigate={handleNavigate} />;
    }
}