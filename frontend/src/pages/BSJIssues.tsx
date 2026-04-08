import { useState } from "react";
import { Button } from "@/components/ui/button";
import PDFViewer from "@/components/PDFViewer";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Issue {
  id: string;
  title: string;
  issueNumber: number;
  publishDate: string;
  coverImage: string;
  fullPdf: string;
}

const ISSUES_DATA: Issue[] = [
  { id: '01', title: 'Issue 01', issueNumber: 1, publishDate: '2022-02-01', coverImage: '/images/issue-covers/Issue-01.png', fullPdf: '/pdfs/Issue-01.pdf.pdf' },
  { id: '02', title: 'Issue 02', issueNumber: 2, publishDate: '2022-04-01', coverImage: '/images/issue-covers/Issue-02.png', fullPdf: '/pdfs/Issue-02.pdf.pdf' },
  { id: '03', title: 'Issue 03', issueNumber: 3, publishDate: '2022-11-01', coverImage: '/images/issue-covers/Issue-03.png', fullPdf: '/pdfs/Issue-03.pdf.pdf' },
  { id: '04', title: 'Issue 04', issueNumber: 4, publishDate: '2023-02-01', coverImage: '/images/issue-covers/Issue-04.png', fullPdf: '/pdfs/Issue-04.pdf.pdf' },
  { id: '05', title: 'Issue 05', issueNumber: 5, publishDate: '2023-10-01', coverImage: '/images/issue-covers/Issue-05.png', fullPdf: '/pdfs/Issue-05.pdf.pdf' },
  { id: '06', title: 'Issue 06', issueNumber: 6, publishDate: '2023-12-01', coverImage: '/images/issue-covers/Issue-06.png', fullPdf: '/pdfs/Issue-06.pdf.pdf' },
  { id: '07', title: 'Issue 07', issueNumber: 7, publishDate: '2024-03-01', coverImage: '/images/issue-covers/Issue-07.png', fullPdf: '/pdfs/Issue-07.pdf.pdf' },
  { id: '08', title: 'Issue 08', issueNumber: 8, publishDate: '2024-04-01', coverImage: '/images/issue-covers/Issue-08.png', fullPdf: '/pdfs/Issue-08.pdf.pdf' },
  { id: '09', title: 'Issue 09', issueNumber: 9, publishDate: '2024-10-01', coverImage: '/images/issue-covers/Issue-09.png', fullPdf: '/pdfs/Issue-09.pdf.pdf' },
  { id: '10', title: 'Issue 10', issueNumber: 10, publishDate: '2025-02-01', coverImage: '/images/issue-covers/Issue-10.png', fullPdf: '/pdfs/Issue-10.pdf.pdf' },
  { id: '11', title: 'Issue 11', issueNumber: 11, publishDate: '2025-04-01', coverImage: '/images/issue-covers/Issue-11.png', fullPdf: '/pdfs/Issue-11.pdf.pdf' },
  { id: '12', title: 'Issue 12', issueNumber: 12, publishDate: '2025-09-01', coverImage: '/images/issue-covers/Issue-12.png', fullPdf: '/pdfs/Issue-12.pdf.pdf' },
  { id: 'special', title: 'Special Issue 01', issueNumber: 0, publishDate: '2024-06-01', coverImage: '/images/issue-covers/Special Issue-01.png', fullPdf: '/pdfs/Special Issue-01.pdf.pdf' },
];

export default function BSJIssues() {
  usePageTitle('BSJ Issues');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const closeReader = () => setSelectedIssue(null);
  const selectedIssuePdfUrl = selectedIssue?.fullPdf;

  return (
    <div className="min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-[#f97316] py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-4">Since 2021</p>
          <h1 className="font-heading font-black text-5xl md:text-8xl mb-6 text-white leading-tight">THE FULL BSJ ISSUES</h1>
          <div className="w-24 h-1 bg-white/40 mx-auto mb-6" />
          <p className="font-serif text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of past issues — stories, art, and voices that have shaped our community at Brown.
          </p>
        </div>
      </section>

      {/* PDF READER MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeReader} />
          <div className="relative w-full max-w-7xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 bg-black/40">
              <div className="text-white text-sm opacity-80">Issue #{selectedIssue.issueNumber} — {selectedIssue.title}</div>
              <Button onClick={closeReader} variant="ghost" className="text-white">Close</Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl h-[70vh]">
              {selectedIssuePdfUrl && <PDFViewer pdfUrl={selectedIssuePdfUrl} onClose={closeReader} />}
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      <section className="py-20 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl mb-12 uppercase tracking-widest">Past BSJ Issues</h2>
          <div className="overflow-x-auto pb-8">
            <div className="relative inline-flex gap-12 px-8 min-w-full">
              {/* Timeline spine */}
              <div className="absolute top-[240px] left-0 right-0 h-1 bg-primary/30" />

              {ISSUES_DATA.map((issue, index) => {
                const isEven = index % 2 === 0;
                const dateStr = new Date(issue.publishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                return (
                  <div key={issue.id} className="relative flex-shrink-0 w-[240px]">
                    {/* Vertical line */}
                    <div className={`absolute left-1/2 w-0.5 bg-primary/30 -translate-x-1/2 ${isEven ? 'top-0 h-[240px]' : 'top-[288px] h-[140px]'}`} />

                    {/* Content */}
                    <div className={`flex flex-col ${isEven ? 'items-center' : 'items-center flex-col-reverse'}`}>
                      {/* Cover */}
                      <div className={isEven ? 'mb-8' : 'mt-8'}>
                        <div
                          onClick={() => setSelectedIssue(issue)}
                          className={`w-[200px] aspect-[3/4] bg-white border shadow-lg relative group cursor-pointer hover:scale-105 transition-transform duration-300 ${
                            selectedIssue?.id === issue.id ? 'border-primary border-4 ring-4 ring-primary/20' : 'border-border'
                          }`}
                        >
                          <img src={issue.coverImage} alt={issue.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-orange-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center px-3 gap-1">
                            <div className="text-white text-sm italic">{issue.title}</div>
                            <div className="text-white text-xs tracking-widest uppercase">Read</div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="relative z-10 -my-2">
                        <div className="w-10 h-10 rounded-full border-4 bg-white border-primary shadow-lg flex items-center justify-center">
                          <div className="text-xs font-bold text-primary">#{issue.issueNumber}</div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className={isEven ? 'mt-8' : 'mb-8'}>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary mb-1">{dateStr}</div>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">{issue.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
