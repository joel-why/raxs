import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Information We Collect</h2>
            <p>
              When you sign up for our waitlist, we collect your name and email address. This information is used solely to notify you about our launch and provide updates about our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Send you updates about our launch</li>
              <li>Notify you of important announcements</li>
              <li>Communicate with you about our services</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. Your data is stored securely and we do not sell or share your information with third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. To exercise these rights, please contact us through our social media channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us on our social media platforms.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
