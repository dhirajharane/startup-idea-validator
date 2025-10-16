import { auth } from "@/lib/auth";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/config/database";
import User from "@/lib/models/User";
import Report from "@/lib/models/Report";

async function getUserDashboardData(userId) {
  await dbConnect();

  const [user, reports] = await Promise.all([
    User.findById(userId).lean(),
    Report.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  if (!user) {
    return null;
  }

  return {
    userDetails: {
      id: user._id.toString(),
      firstName: user.firstName,
      creditsLeft: user.creditsLeft,
      analyzedIdeas: user.reportsHistory.length,
    },
    reports: reports.map((report) => ({
      id: report._id.toString(),
      name: report.startupName,
      date: new Date(report.createdAt).toLocaleDateString(),
    })),
  };
}

export default async function UserDashboard() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const data = await getUserDashboardData(session.user.id);

  if (!data) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <MainDashboard
        userDetails={data.userDetails}
        initialReports={data.reports}
      />
    </div>
  );
}