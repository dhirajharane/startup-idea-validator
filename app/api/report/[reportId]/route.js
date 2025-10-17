import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/database';
import Report from '@/lib/models/Report';
import { auth } from "@/lib/auth";
import mongoose from 'mongoose';

export const runtime = "nodejs";

export async function GET(req, { params }) {
    const { reportId } = await params;

    await dbConnect();

    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return NextResponse.json({ success: false, error: 'Invalid Report ID' }, { status: 400 });
        }

        const report = await Report.findOne({ _id: reportId, userId }).lean();

        if (!report) {
            return NextResponse.json({ success: false, error: 'Report not found or access denied' }, { status: 404 });
        }

        const formattedReport = {
            ...report,
            id: report._id.toString(),
            userId: report.userId.toString(),
        };

        return NextResponse.json({ success: true, data: formattedReport });

    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
    }
}


