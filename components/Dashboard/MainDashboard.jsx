"use client";

import React, { useState } from 'react';
import { Dashboard } from './Dashboard.jsx';
import { HistoryPage } from './HistoryPage.jsx';
import { SavedReportsPage } from '../Report/SavedReports.jsx';
import { LoadingState } from './LoadingState.jsx';
import { ReportPage } from '../Report/ReportPage.jsx';
import { HistoryLoadingState } from './HistoryLoadingState.jsx';
import { SavedReportsLoadingState } from './SavedReportsLoadingState.jsx';

export default function MainDashboard({ userDetails, initialReports }) {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigationLoading, setNavigationLoading] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [analysisError, setAnalysisError] = useState('');
    const [reports, setReports] = useState(initialReports || []);
    const [stats, setStats] = useState({
      creditsLeft: userDetails?.creditsLeft || 0,
      analyzedIdeas: userDetails?.analyzedIdeas || 0,
      savedReports: userDetails?.savedReports || 0,
      downloadedReports: userDetails?.downloadedReports || 0,
    });
    const [viewingReportId, setViewingReportId] = useState(null);

    const handleNavigate = (page) => {
        if (page === 'history' || page === 'saved-reports') {
            setNavigationLoading(page);
            setTimeout(() => {
                setCurrentPage(page);
                setNavigationLoading(null);
            }, 1500);
        } else {
            setCurrentPage(page);
            setViewingReportId(null);
            setReportData(null);
        }
    };

    const handleAnalysisStart = () => {
        setIsLoading(true);
        setAnalysisError('');
    };

    const handleAnalysisComplete = (newReportData) => {
        setReportData(newReportData);
        setReports(prev => [{
            id: newReportData.id,
            name: newReportData.startupIdea,
            date: new Date().toLocaleDateString(),
            score: newReportData.score
        }, ...prev].slice(0, 3)); 
        setStats(prev => ({
          ...prev,
          creditsLeft: prev.creditsLeft - 1,
          analyzedIdeas: prev.analyzedIdeas + 1,
        }));
        setCurrentPage('report');
        setIsLoading(false);
    };

    const handleAnalysisError = (error) => {
        setAnalysisError(error);
        setIsLoading(false);
        setCurrentPage('dashboard'); 
    };

    const handleReportSaved = () => {
        setStats(prev => ({...prev, savedReports: prev.savedReports + 1}));
    };
    
    const handleReportDownloaded = () => {
        setStats(prev => ({...prev, downloadedReports: prev.downloadedReports + 1}));
    };
    
    const handleViewReport = async (reportId) => {
        setNavigationLoading('report');
        try {
            const response = await fetch(`/api/report/${reportId}`);
            const result = await response.json();
            if (result.success) {
                setReportData(result.data);
                setCurrentPage('report');
            } else {
                throw new Error(result.error || 'Failed to fetch report');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setNavigationLoading(null);
        }
    };

    if (isLoading || isNavigationLoading === 'report') {
        return <LoadingState />;
    }

    if (isNavigationLoading === 'history') {
        return <HistoryLoadingState />;
    }

    if (isNavigationLoading === 'saved-reports') {
        return <SavedReportsLoadingState />;
    }
    
    const currentDetails = {
      ...userDetails,
      ...stats
    };

    switch (currentPage) {
        case 'dashboard':
            return (
                <Dashboard 
                    userDetails={currentDetails}
                    reports={reports}
                    onNavigate={handleNavigate} 
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisError={handleAnalysisError}
                    onViewReport={handleViewReport}
                />
            );
        case 'history':
            return <HistoryPage onNavigate={handleNavigate} onViewReport={handleViewReport} />;
        case 'saved-reports':
            return <SavedReportsPage onNavigate={handleNavigate} onViewReport={handleViewReport} />;
        case 'report':
            return (
              <ReportPage 
                report={reportData} 
                onNavigate={handleNavigate} 
                onReportSaved={handleReportSaved}
                onReportDownloaded={handleReportDownloaded}
              />
            );
        default:
            return <Dashboard onNavigate={handleNavigate} userDetails={currentDetails} reports={reports} onViewReport={handleViewReport} />;
    }
}