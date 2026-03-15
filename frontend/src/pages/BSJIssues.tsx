import { useEffect, useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { backendApiUrl } from "@/lib/api";

interface Media {
  url: string;
  alt?: string;
}

interface Issue {
  id: string;
  title: string;
  slug: string;
  issueNumber: number;
  publishDate: string;
  coverImage: Media;
  fullPdf: Media;
  description?: string;
}

export default function BSJIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Fetch issues
  useEffect(() => {
    fetch(backendApiUrl("/api/bsjissues?limit=100"))
      .then(res => res.json())
      .then(data => {
        const sortedIssues = [...data.docs].sort(
          (a, b) => a.issueNumber - b.issueNumber
        );
        setIssues(sortedIssues);
      })
      .catch(error => console.error("Error fetching issues:", error));
  }, []);

  // Lock body scroll + ESC close
  useEffect(() => {
    if (!selectedIssue) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIssue(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIssue]);

  const handleIssueClick = (issue: Issue) => {
    if (issue.fullPdf?.url) {
      setSelectedIssue(issue);
    }
  };

  const closeReader = () => setSelectedIssue(null);

  return (
    <div className="min-h-screen pb-20 overflow-hidden">
      {/* HERO */}
      <section className="bg-[#f97316] py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">
            Since 2021
          </p>
          <h1 className="font-heading font-black text-5xl md:text-8xl mb-6 text-white leading-tight">
            THE FULL BSJ ISSUES
          </h1>
          <div className="w-24 h-1 bg-white/40 mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of past issues — stories, art, and voices that have shaped our community at Brown.
          </p>
        </div>
      </section>

      {/* PDF READER MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeReader}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-7xl mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3">
              <div className="text-white text-sm opacity-80">
                Issue #{selectedIssue.issueNumber} — {selectedIssue.title}
              </div>
              <Button
                onClick={closeReader}
                variant="ghost"
                className="text-white"
              >
                Close
              </Button>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <PDFViewer
                pdfUrl={selectedIssue.fullPdf.url}
                onClose={closeReader}
              />
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      <section className="py-20 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl mb-12 uppercase tracking-widest">
            Past BSJ Issues
          </h2>

          <div className="relative">
            {/* Horizontal scrollable container */}
            <div className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
              <div className="relative inline-flex gap-16 px-8 min-w-full">
                {/* Horizontal timeline spine */}
                <div className="absolute top-[220px] left-0 right-0 h-1 bg-primary/30" />

                {issues.map((issue, index) => {
                  const isEven = index % 2 === 0;
                  const date = new Date(issue.publishDate);
                  const formattedDate = `${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}/${date.getFullYear()}`;

                  return (
                    <div
                      key={issue.id}
                      className="relative flex-shrink-0 w-[280px]"
                    >
                      {/* Vertical connector line from cover to timeline */}
                      <div
                        className={`absolute left-1/2 w-1 bg-primary/30 -translate-x-1/2 ${
                          isEven
                            ? "top-0 h-[220px]"
                            : "top-[268px] h-[calc(100%-268px)]"
                        }`}
                      />

                      {/* Content container - alternating top/bottom */}
                      <div
                        className={`flex flex-col ${
                          isEven ? "items-center" : "items-center flex-col-reverse"
                        }`}
                      >
                        {/* Cover */}
                        <div className={isEven ? "mb-12" : "mt-12"}>
                          <div
                            onClick={() => handleIssueClick(issue)}
                            className={`w-[240px] aspect-[3/4] bg-white border shadow-xl relative group cursor-pointer
                              hover:scale-105 transition-transform duration-300 ${
                                selectedIssue?.id === issue.id
                                  ? "border-primary border-4 ring-4 ring-primary/20"
                                  : "border-border"
                              }`}
                          >
                            {issue.coverImage?.url ? (
                              <>
                                <img
                                  src={issue.coverImage.url}
                                  alt={issue.coverImage.alt || issue.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-orange-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-4 gap-2">
                                  <div className="text-white tracking-widest uppercase text-sm">
                                    {formattedDate}
                                  </div>
                                  <div className="text-white text-lg italic">
                                    {issue.title}
                                  </div>
                                  <div className="text-white text-xs tracking-widest uppercase mt-2">
                                    Read Issue
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-4 border flex flex-col items-center justify-between p-6">
                                <div className="font-heading font-black text-3xl">
                                  BSJ
                                </div>
                                <div className="font-serif italic text-center text-sm">
                                  {issue.title}
                                </div>
                                <div className="text-xs font-bold">
                                  {date.getFullYear()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timeline dot */}
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-full border-4 bg-white border-primary/30 shadow-lg flex items-center justify-center">
                            <div className="text-xs font-bold text-primary">
                              #{issue.issueNumber}
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={isEven ? "mt-12" : "mb-12"}>
                          <div className="text-center w-[240px]">
                            <div className="text-2xl font-heading font-bold text-primary mb-2">
                              {formattedDate}
                            </div>
                            <div className="text-lg font-serif italic mb-2">
                              {issue.title}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">
                              Issue #{issue.issueNumber}
                            </div>
                            {issue.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                {issue.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scroll hint */}
            {issues.length > 3 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                ← Scroll to explore all issues →
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
