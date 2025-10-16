import { auth } from "@/lib/auth";
import MainDashboard from "@/components/Dashboard/MainDashboard";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/config/database";
import User from "@/lib/models/User";
import Report from "@/lib/models/Report"; // Assuming you have a Report model

// Server-side function to get user data
async function getUserDashboardData(userId) {
  await dbConnect();
  
  // Use Promise.all to fetch user details and reports in parallel
  const [user, reports] = await Promise.all([
    User.findById(userId).lean(),
    Report.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean()
  ]);

  if (!user) {
    return null;
  }

  // Sanitize the data to pass to the client
  return {
    userDetails: {
      id: user._id.toString(),
      firstName: user.firstName,
      creditsLeft: user.creditsLeft,
      analyzedIdeas: user.reportsHistory.length,
      // Add other stats as needed
    },
    reports: reports.map(report => ({
      id: report._id.toString(),
      name: report.startupName, // Adjust field names as per your Report model
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
    // Handle case where user data could not be fetched
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