'use client';

import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ReportContext.Provider value={{ reportData, setReportData, loading, setLoading, error, setError }}>
      {children}
    </ReportContext.Provider>
  );
}

ReportProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useReport() {
  return useContext(ReportContext);
}