import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/database';
import User from '@/lib/models/User';
import Report from '@/lib/models/Report';
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

async function getUserIdFromRequest(req) {
    const session = await auth(req);
    if (!session || !session.user || !session.user.id) {
        return null;
    }
    return session.user.id;
}

export async function GET(req) {
    await dbConnect();

    try {
        const userId = await getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userWithSavedReports = await User.findById(userId)
            .populate({
                path: 'savedReports',
                select: 'startupIdea score createdAt',
                options: { sort: { createdAt: -1 } }
            })
            .lean();

        if (!userWithSavedReports) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (!userWithSavedReports.savedReports || userWithSavedReports.savedReports.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        const formattedReports = userWithSavedReports.savedReports.map(report => ({
            id: report._id.toString(),
            name: report.startupIdea,
            date: new Date(report.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }),
            score: report.score,
        }));

        return NextResponse.json({ success: true, data: formattedReports });
    } catch (error) {
        console.error('Error fetching saved reports:', error);
        return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
    }
}


export async function POST(req) {
    await dbConnect();

    try {
        const userId = await getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { reportId } = await req.json();

        if (!reportId) {
            return NextResponse.json({ success: false, error: 'Report ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (user.savedReports.includes(reportId)) {
            return NextResponse.json({ success: true, message: 'Report already saved' });
        }

        user.savedReports.push(reportId);
        await user.save();

        return NextResponse.json({ success: true, message: 'Report saved successfully' });

    } catch (error) {
        console.error('Error saving report:', error);
        return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
    }
}