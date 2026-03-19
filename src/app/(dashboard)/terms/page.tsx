import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service — VAMS ELD",
};

export default function TermsOfServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Terms of Service</h1>
        <p className="scaffold-description mt-1">
          Last updated: March 19, 2025
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── Acceptance ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the VAMS ELD Scaffolding Platform
              (&quot;the App&quot;), you agree to be bound by these Terms of
              Service. If you do not agree, you may not use the App. The App is
              operated by Valor Academy Middle School, part of Bright Star
              Schools.
            </p>
          </CardContent>
        </Card>

        {/* ── Eligibility ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">2. Eligibility</h2>
            <p>
              The App is intended for authorized staff of Bright Star Schools.
              Access is restricted to users with a valid{" "}
              <code>@brightstarschools.org</code> email address. You are
              responsible for maintaining the confidentiality of your account
              credentials.
            </p>
          </CardContent>
        </Card>

        {/* ── Permitted Use ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">3. Permitted Use</h2>
            <p>You may use the App to:</p>
            <ul>
              <li>
                Generate linguistically scaffolded assignments for English
                Language Development students.
              </li>
              <li>
                Import and export assignment content via Google Docs.
              </li>
              <li>
                Manage student ELD profiles and view ELD standards resources.
              </li>
              <li>
                Store and retrieve scaffolded assignments in your personal
                library.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Prohibited Use ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">4. Prohibited Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Share your account credentials with anyone outside of Bright
                Star Schools.
              </li>
              <li>
                Use the App for any purpose unrelated to English Language
                Development instruction.
              </li>
              <li>
                Attempt to circumvent rate limits, authentication, or access
                controls.
              </li>
              <li>
                Upload or process content that is unlawful, harmful, or
                violates the rights of others.
              </li>
              <li>
                Extract, scrape, or systematically download data from the App.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── AI-Generated Content ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              5. AI-Generated Content
            </h2>
            <p>
              The App uses artificial intelligence to generate scaffolded
              assignments, word banks, and teacher instructions. While we strive
              for accuracy and pedagogical quality:
            </p>
            <ul>
              <li>
                AI-generated content is provided as a starting point and should
                be reviewed by the teacher before use with students.
              </li>
              <li>
                We do not guarantee that AI output will be free of errors,
                culturally inappropriate language, or factual inaccuracies.
              </li>
              <li>
                You retain responsibility for all content you distribute to
                students.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Google Account Integration ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              6. Google Account Integration
            </h2>
            <p>
              Connecting your Google account is optional. When you connect, you
              grant the App permission to read and create Google Docs and access
              your Google email address. You may revoke this access at any time
              from the Settings page or from your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Google Account permissions
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* ── Student Data Responsibilities ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              7. Student Data Responsibilities
            </h2>
            <p>
              By entering student information into the App, you affirm that you
              are authorized to do so in your capacity as a Bright Star Schools
              staff member. You agree to:
            </p>
            <ul>
              <li>
                Only enter student data that is necessary for ELD scaffold
                generation.
              </li>
              <li>
                Handle all student information in accordance with FERPA and
                applicable California state privacy laws.
              </li>
              <li>
                Report any suspected unauthorized access to student data
                immediately.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Intellectual Property ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              8. Intellectual Property
            </h2>
            <p>
              You retain ownership of any original assignment content you
              upload. AI-generated scaffolded output is provided for your
              educational use without restriction. The App itself, including its
              design, code, and branding, remains the property of Valor Academy
              Middle School and Bright Star Schools.
            </p>
          </CardContent>
        </Card>

        {/* ── Service Availability ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              9. Service Availability &amp; Limits
            </h2>
            <ul>
              <li>
                The App is provided on an &quot;as is&quot; basis. We do not
                guarantee uninterrupted or error-free operation.
              </li>
              <li>
                Daily scaffold generation is subject to rate limits that may
                change without notice.
              </li>
              <li>
                We reserve the right to modify, suspend, or discontinue the App
                at any time with reasonable notice.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ── Limitation of Liability ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              10. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Valor Academy Middle
              School, Bright Star Schools, and their staff shall not be liable
              for any indirect, incidental, or consequential damages arising
              from the use of the App, including but not limited to reliance on
              AI-generated content, loss of data, or service interruptions.
            </p>
          </CardContent>
        </Card>

        {/* ── Termination ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">11. Termination</h2>
            <p>
              We may suspend or terminate your access to the App at any time if
              you violate these terms or are no longer affiliated with Bright
              Star Schools. Upon termination, your stored assignments and
              connected Google tokens will be deleted.
            </p>
          </CardContent>
        </Card>

        {/* ── Changes to Terms ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these terms from time to time. Changes will be
              reflected by updating the &quot;Last updated&quot; date at the top
              of this page. Continued use of the App after changes constitutes
              acceptance of the revised terms.
            </p>
          </CardContent>
        </Card>

        {/* ── Contact ── */}
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2 className="text-base font-semibold">13. Contact</h2>
            <p>
              Questions about these terms? Reach out through the{" "}
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
