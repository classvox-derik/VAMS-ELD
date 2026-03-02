# VAMS-ELD Feature Mindmap

![VAMS-ELD Logo](file:///c:/VAMS-ELD/eldlogo.png)

This mindmap provides a hierarchical overview of the core features and technical capabilities of the VAMS-ELD platform, as extracted from the project codebase.

```mermaid
mindmap
  root((VAMS-ELD Platform))
    Authentication & Security
      Domain Guard :: Restricted to @brightstarschools.org
      Middleware Enforcement :: Server-side session and domain validation
      Regex Validation :: Client-side email format checking
      Secure Auth Flow :: Supabase email confirmation
      Data Privacy :: Protection of sensitive student SSID and proficiency records
    Roster Management
      Student Profiles :: SSID, grade, and college-themed homerooms (USC, UCLA, CSUN)
      ELPAC Domain Tracking :: Granular overall, oral, and written proficiency scores
      Bulk Operations :: CSV-based student roster import
      Data Discovery :: Multiselect filtering and sorting by grade, level, or name
      Planning Support :: Recommended scaffold types based on student roster level
    AI Scaffolding Engine
      Three-Tier System :: Emerging (Amber), Expanding (Orange), and Bridging (Green) tiers
      Scaffold Strategies
        Color Coding :: Highlighting main ideas, evidence, and transitions
        Chunking :: Section-based and paragraph-by-paragraph text division
        Sentence Frames :: Tiered writing starters (Opinion, Summary, Analytical)
        Word Banks :: AI-generated tiered definitions for academic vocabulary
        Visual Organizers :: Graphic organizers like Venn diagrams and Main Idea maps
      Assignment Workflow :: Input source selection, detail setting, and student batch selection
      Source Integration :: Paste text, PDF/Docx upload, or Google Docs URL parsing
      AI Intelligence :: gemini-2.5-flash for structured instructional generation
      Management :: Daily per-user generation limits and RPM rate limiting
    Export & Delivery
      PDF Delivery :: One-click printable formatting with no UI chrome
      Google Integration :: Direct export of scaffolded content to Google Docs
      Personal Library :: Permanent storage for saved differentiated assignments
      Teacher Metadata :: Auto-saved private notes for each generated assignment
      Batch Review :: Tabbed preview interface for viewing multiple EL level outputs
    Support & Help
      ELD Guide :: California Standards, legal requirements, and strategy repository
      Bug Reporting :: Form-based issue classification and severity tracking
      Instructional Aids :: Teacher Instructions cards generated for every assignment
      Communications :: Direct contact form to message ELD teachers
      User Insights :: Dashboard greeting, live stats, and AI usage counters
```
