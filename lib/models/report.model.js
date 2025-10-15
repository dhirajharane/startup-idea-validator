import mongoose, { Schema } from 'mongoose';

const CompetitorSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
}, { _id: false });

const MarketTrendSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
}, { _id: false });

const ReportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startupIdea: {
        type: String,
        required: [true, 'Startup idea is required.'],
        trim: true,
        index: true,
    },
    summary: {
        type: String,
        required: true,
        trim: true,
    },
    swot: {
        type: new Schema({
            strengths: { type: [String], default: [] },
            weaknesses: { type: [String], default: [] },
            opportunities: { type: [String], default: [] },
            threats: { type: [String], default: [] },
        }, { _id: false }),
        default: () => ({}),
    },
    conclusion: {
        type: String,
        trim: true,
        default: '',
    },
    monetization: {
        type: [String],
        default: [],
    },
    actionableInsights: {
        type: [String],
        default: [],
    },
    pitchDeckOutline: {
        type: [String],
        default: [],
    },
    competitors: {
        type: [CompetitorSchema],
        default: [],
    },
    marketTrends: {
        type: new Schema({
            trends: { type: [MarketTrendSchema], default: [] },
            trendSummary: { type: String, default: '', trim: true },
        }, { _id: false }),
        default: () => ({}),
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
        default: 50,
    },
    pieChartData: {
        type: new Schema({
            marketPotential: { type: Number, default: 0 },
            feasibility: { type: Number, default: 0 },
            competition: { type: Number, default: 0 },
            monetization: { type: Number, default: 0 },
            innovation: { type: Number, default: 0 },
        }, { _id: false }),
        default: () => ({}),
    },
    warnings: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    collection: 'reports',
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
