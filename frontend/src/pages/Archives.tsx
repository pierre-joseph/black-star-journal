import { useEffect, useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";

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

export default function Archives() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Fetch issues
  useEffect(() => {
    fetch("http://localhost:3000/api/issues?limit=100")
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
      <section className="relative bg-black text-white py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/abstract_paper.jpg)" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-heading font-bold text-4xl md:text-7xl mb-6 text-black">
            ARCHIVES
          </h1>
          <p className="font-serif text-xl md:text-2xl text-black max-w-2xl mx-auto">
            A history of our stories, our struggles, and our triumphs.
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

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 -translate-x-1/2 hidden md:block" />

            {issues.map((issue, index) => {
              const isEven = index % 2 === 0;
              const date = new Date(issue.publishDate);
              const formattedDate = `${String(
                date.getMonth() + 1
              ).padStart(2, "0")}/${date.getFullYear()}`;

              return (
                <div
                  key={issue.id}
                  className={`relative mb-16 md:mb-24 flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col`}
                >
                  {/* Cover */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isEven ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div
                      onClick={() => handleIssueClick(issue)}
                      className={`aspect-[3/4] bg-white border shadow-xl relative group cursor-pointer
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
                            <div className="text-white tracking-widest uppercase">
                              {formattedDate}
                            </div>
                            <div className="text-white text-xl italic">
                              {issue.title}
                            </div>
                            <div className="text-white text-sm tracking-widest uppercase mt-4">
                              Read Issue
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-4 border flex flex-col items-center justify-between p-8">
                          <div className="font-heading font-black text-4xl">
                            BSJ
                          </div>
                          <div className="font-serif italic text-center">
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
                  <div className="hidden md:flex items-center justify-center w-2/12 z-10">
                    <div className="w-16 h-16 rounded-full border-4 bg-white border-primary/30 shadow-lg flex items-center justify-center">
                      <div className="text-xs font-bold text-primary">
                        #{issue.issueNumber}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isEven ? "md:pl-12" : "md:pr-12"
                    } mt-4 md:mt-0`}
                  >
                    <div
                      className={`${
                        isEven ? "md:text-left" : "md:text-right"
                      } text-center`}
                    >
                      <div className="text-3xl font-heading font-bold text-primary mb-2">
                        {formattedDate}
                      </div>
                      <div className="text-xl font-serif italic mb-2">
                        {issue.title}
                      </div>
                      <div className="text-sm uppercase tracking-widest text-muted-foreground">
                        Issue #{issue.issueNumber}
                      </div>
                      {issue.description && (
                        <p className="text-sm text-muted-foreground mt-3">
                          {issue.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
