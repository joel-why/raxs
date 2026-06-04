import { getAllSignups, getWaitlistCount } from "@/app/actions/waitlist"
import { checkAdminAuth } from "@/app/actions/admin"
import { AdminDashboard } from "@/components/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [signups, totalCount, isAuthenticated] = await Promise.all([
    getAllSignups(),
    getWaitlistCount(),
    checkAdminAuth(),
  ])

  return (
    <AdminDashboard 
      signups={signups} 
      totalCount={totalCount} 
      initialAuth={isAuthenticated}
    />
  )
}
