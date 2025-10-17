import { NextResponse } from 'next/server';
import dbConnect from '@/lib/config/database';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export const runtime = "nodejs";

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
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, error: 'Invalid User ID' }, { status: 400 });
        }

        const userDetails = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $project: {
                    _id: 0,
                    firstName: 1,
                    lastName: 1,
                    creditsLeft: 1,
                    analyzedIdeas: {
                        $cond: { if: { $isArray: "$reportsHistory" }, then: { $size: "$reportsHistory" }, else: 0 }
                    },
                    savedReports: {
                        $cond: { if: { $isArray: "$savedReports" }, then: { $size: "$savedReports" }, else: 0 }
                    },
                    downloadedReports: { $ifNull: ["$downloads", 0] },
                }
            }
        ]);

        if (!userDetails || userDetails.length === 0) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: userDetails[0] });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
    }
}
