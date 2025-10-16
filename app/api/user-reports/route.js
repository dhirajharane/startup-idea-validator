import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/database';
import User from '@/lib/models/User';
import Report from '@/lib/models/Report';


async function getUserIdFromRequest(req) {
    const user = await User.findOne().lean();
    return user ? user._id : null;
}

export async function GET(req) {
    await dbConnect();

    try {
        const userId = await getUserIdFromRequest(req);

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userWithReports = await User.findById(userId)
            .populate({
                path: 'reportsHistory',
                select: 'startupIdea score createdAt',
                options: { sort: { createdAt: -1 } }
            })
            .lean();

        if (!userWithReports) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (!userWithReports.reportsHistory || userWithReports.reportsHistory.length === 0) {
            return NextResponse.json({ success: true, data: 'No reports yet' });
        }

        const formattedReports = userWithReports.reportsHistory.map(report => ({
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
        console.error('Error fetching user reports:', error);
        return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
    }
}
