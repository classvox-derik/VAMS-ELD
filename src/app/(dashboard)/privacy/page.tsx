import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy — VAMS ELD",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Privacy Policy</h1>
        <p className="scaffold-description mt-1">
          Last updated: March 19, 2025
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── Overview ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">1. Overview</h2>
            <p>
              The VAMS ELD Scaffolding Platform (&quot;the App&quot;) is
              operated by Valor Academy Middle School, part of Bright Star
              Schools. The App helps educators generate linguistically
              scaffolded assignments for English Language Development (ELD)
              students. This policy explains what information we collect, how we
              use it, and how we protect it.
            </p>
          </CardContent>
        </Card>

        {/* ── Information We Collect ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              2. Information We Collect
            </h2>

            <h3 className="text-sm font-semibold">
              a. Teacher &amp; Staff Accounts
            </h3>
            <ul>
              <li>
                <strong>Email address</strong> — used for authentication;
                restricted to <code>@brightstarschools.org</code> accounts.
              </li>
              <li>
                <strong>First and last name</strong> — optionally provided in
                your profile.
              </li>
              <li>
                <strong>Usage data</strong> — number of scaffold requests per
                day (used for rate-limiting, not shared externally).
              </li>
            </ul>

            <h3 className="text-sm font-semibold">b. Student Information</h3>
            <ul>
              <li>
                <strong>Name, grade, homeroom, primary language</strong> —
                entered by administrators.
              </li>
              <li>
                <strong>ELD proficiency levels</strong> (overall, oral, written)
                — used to select appropriate scaffolds.
              </li>
              <li>
                <strong>Student ID (SSID)</strong> — optional identifier.
              </li>
            </ul>
            <p>
              Student data is used solely to generate appropriately leveled
              scaffolded assignments. We do not sell, rent, or share student
              information with third parties for marketing or advertising
              purposes.
            </p>

            <h3 className="text-sm font-semibold">c. Assignment Content</h3>
            <ul>
              <li>
                Original assignment text (entered or imported from Google Docs).
              </li>
              <li>
                AI-generated scaffolded output, word banks, and teacher
                instructions.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── How We Use Your Information ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              3. How We Use Your Information
            </h2>
            <ul>
              <li>
                <strong>Scaffold generation</strong> — assignment text and
                student ELD levels are sent to an AI service to produce
                scaffolded content.
              </li>
              <li>
                <strong>Google Docs integration</strong> — if you connect your
                Google account, we use your authorization to import from and
                export to Google Docs on your behalf.
              </li>
              <li>
                <strong>Rate limiting &amp; analytics</strong> — we track
                aggregate scaffold usage to enforce daily limits and monitor
                system health.
              </li>
              <li>
                <strong>Communication</strong> — contact and bug-report forms
                send your message to the site administrator.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Third-Party Services ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              4. Third-Party Services
            </h2>
            <p>The App relies on the following external services:</p>
            <ul>
              <li>
                <strong>Supabase</strong> — cloud-hosted PostgreSQL database and
                authentication. Your account credentials and application data
                are stored here with row-level security policies.
              </li>
              <li>
                <strong>Google APIs</strong> (Docs, Drive) — used only when you
                explicitly connect your Google account. We request access to
                read/write Google Docs and view your email address. A refresh
                token is stored so you stay connected across sessions; you can
                disconnect at any time from Settings.
              </li>
              <li>
                <strong>OpenRouter (AI)</strong> — assignment text and ELD
                levels are sent to generate scaffolded content. No student names
                or personally identifiable student information is included in AI
                requests.
              </li>
              <li>
                <strong>Vercel Analytics</strong> — collects anonymous page-view
                and performance metrics. No personal data is shared.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Cookies ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">5. Cookies</h2>
            <p>We use a small number of essential cookies:</p>
            <ul>
              <li>
                <strong>Session cookies</strong> — Supabase authentication
                tokens (httpOnly, secure in production).
              </li>
              <li>
                <strong>Google token cookie</strong> — stores your Google
                refresh token so Google Docs integration persists across page
                loads (httpOnly, secure in production, 1-year expiry).
              </li>
            </ul>
            <p>
              We do not use advertising, tracking, or third-party marketing
              cookies.
            </p>
          </CardContent>
        </Card>

        {/* ── Data Protection ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">6. Data Protection</h2>
            <ul>
              <li>
                All data is transmitted over HTTPS.
              </li>
              <li>
                Database access is protected by row-level security — teachers
                can only access their own assignments and tokens.
              </li>
              <li>
                Access is restricted to verified{" "}
                <code>@brightstarschools.org</code> email addresses.
              </li>
              <li>
                Sensitive tokens are stored in httpOnly cookies that cannot be
                read by client-side scripts.
              </li>
              <li>
                Server-side API keys are never exposed to the browser.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── FERPA & Student Privacy ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              7. FERPA &amp; Student Privacy
            </h2>
            <p>
              We are committed to compliance with the Family Educational Rights
              and Privacy Act (FERPA). Student education records entered into
              the App are used exclusively for the purpose of generating
              scaffolded ELD assignments. Access to student data is limited to
              authenticated staff within the Bright Star Schools organization.
            </p>
            <p>
              When assignment content is sent to the AI service for scaffold
              generation, personally identifiable student information (such as
              names or IDs) is not included in the request.
            </p>
          </CardContent>
        </Card>

        {/* ── Data Retention ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">8. Data Retention</h2>
            <ul>
              <li>
                Scaffolded assignments are retained in your library (up to 50
                per teacher) until you delete them.
              </li>
              <li>
                Google account connections persist until you disconnect from
                Settings.
              </li>
              <li>
                If your Supabase account is deleted, associated profile data and
                Google tokens are automatically removed.
              </li>
              <li>
                Usage analytics are retained for system monitoring and may be
                periodically purged.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Your Rights ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">9. Your Rights</h2>
            <p>You may at any time:</p>
            <ul>
              <li>
                <strong>Disconnect your Google account</strong> from Settings,
                which deletes your stored Google token.
              </li>
              <li>
                <strong>Delete assignments</strong> from your library.
              </li>
              <li>
                <strong>Request data deletion</strong> by contacting the site
                administrator.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Changes to This Policy ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will
              be reflected by updating the &quot;Last updated&quot; date at the
              top of this page. Continued use of the App after changes
              constitutes acceptance of the revised policy.
            </p>
          </CardContent>
        </Card>

        {/* ── Contact ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">11. Contact</h2>
            <p>
              If you have questions about this privacy policy or wish to
              exercise your rights, please reach out through the{" "}
              <a href="/contact" className="underline underline-offset-2">
                Contact
              </a>{" "}
              page or email{" "}
              <a
                href="mailto:dvandiest@brightstarschools.org"
                className="underline underline-offset-2"
              >
                dvandiest@brightstarschools.org
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
