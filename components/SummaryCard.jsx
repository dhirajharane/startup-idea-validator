import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function SummaryCard({ summary }) {
  if (!summary) return <EmptyState message="No summary available." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
      <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
      <p className="text-text-light">{summary}</p>
    </motion.div>
  );
}

SummaryCard.propTypes = {
  summary: PropTypes.string,
};