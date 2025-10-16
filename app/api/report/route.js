import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Report from '@/lib/models/Report';
import { runIdeaValidatorChains } from '@/lib/chains';
import { structuredOutputSchema } from '@/lib/utils/structuredOutputSchema';

const validationSchema = z.object({
    startupIdea: z
        .string({ invalid_type_error: "Startup idea must be a string." })
        .min(10, { message: "Startup idea must be at least 10 characters long." }),
    userId: z.string({ required_error: "User ID is required." }),
});

export async function POST(req) {
    await dbConnect();
    const session = await mongoose.startSession();

    try {
        const body = await req.json();
        const validationResult = validationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, error: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { startupIdea, userId } = validationResult.data;

        const user = await User.findById(userId).session(session);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
        }

        if (user.creditsLeft <= 0) {
            return NextResponse.json({ success: false, error: 'Insufficient credits.' }, { status: 402 });
        }

        const reportData = await runIdeaValidatorChains(startupIdea);

        if (!reportData) {
            throw new Error("Failed to generate report data.");
        }

        const validatedReport = structuredOutputSchema.parse(reportData);
        let newReport;

        await session.withTransaction(async () => {
            [newReport] = await Report.create([{
                ...validatedReport,
                startupIdea,
                userId,
            }], { session });

            const updatedUser = await User.findByIdAndUpdate(userId, {
                $push: { reportsHistory: newReport._id },
                $inc: { creditsLeft: -1 },
            }, { session, new: true });
            
            if (!updatedUser) {
                throw new Error('Failed to update user details during transaction.');
            }
        });
        
        await session.endSession();

        return NextResponse.json({ success: true, data: validatedReport });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        await session.endSession();

        console.error("Error in /api/report:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: "Generated report data is invalid." }, { status: 500 });
        }

        return NextResponse.json(
            { success: false, error: "An internal server error occurred." },
            { status: 500 }
        );
    }
}

