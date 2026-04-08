import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@/components/FadeIn";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const ISSUES_DATA = {
  '01': { title: 'Issue 01', month: 'February', year: 2022, color: '#e74c3c', pdf: 'Issue-01.pdf.pdf', cover: '/images/issue-covers/Issue-01.png' },
  '02': { title: 'Issue 02', month: 'April', year: 2022, color: '#3498db', pdf: 'Issue-02.pdf.pdf', cover: '/images/issue-covers/Issue-02.png' },
  '03': { title: 'Issue 03', month: 'November', year: 2022, color: '#2ecc71', pdf: 'Issue-03.pdf.pdf', cover: '/images/issue-covers/Issue-03.png' },
  '04': { title: 'Issue 04', month: 'February', year: 2023, color: '#f39c12', pdf: 'Issue-04.pdf.pdf', cover: '/images/issue-covers/Issue-04.png' },
  '05': { title: 'Issue 05', month: 'October', year: 2023, color: '#9b59b6', pdf: 'Issue-05.pdf.pdf', cover: '/images/issue-covers/Issue-05.png' },
  '06': { title: 'Issue 06', month: 'December', year: 2023, color: '#1abc9c', pdf: 'Issue-06.pdf.pdf', cover: '/images/issue-covers/Issue-06.png' },
  '07': { title: 'Issue 07', month: 'Spring', year: 2024, color: '#e67e22', pdf: 'Issue-07.pdf.pdf', cover: '/images/issue-covers/Issue-07.png' },
  '08': { title: 'Issue 08', month: 'April', year: 2024, color: '#34495e', pdf: 'Issue-08.pdf.pdf', cover: '/images/issue-covers/Issue-08.png' },
  '09': { title: 'Issue 09', month: 'October', year: 2024, color: '#c0392b', pdf: 'Issue-09.pdf.pdf', cover: '/images/issue-covers/Issue-09.png' },
  '10': { title: 'Issue 10', month: 'February', year: 2025, color: '#16a085', pdf: 'Issue-10.pdf.pdf', cover: '/images/issue-covers/Issue-10.png' },
  '11': { title: 'Issue 11', month: 'April', year: 2025, color: '#8e44ad', pdf: 'Issue-11.pdf.pdf', cover: '/images/issue-covers/Issue-11.png' },
  '12': { title: 'Issue 12', month: 'Fall', year: 2025, color: '#2980b9', pdf: 'Issue-12.pdf.pdf', cover: '/images/issue-covers/Issue-12.png' },
  'SPECIAL': { title: 'Special Issue 01', month: 'Special Edition', year: 2024, color: '#f1c40f', pdf: 'Special Issue-01.pdf.pdf', cover: '/images/issue-covers/Special Issue-01.png' }
};

// Display order: Issue 01 → 12, then Special
const ISSUES_ORDER = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'SPECIAL'] as const;

export default function IssuePage() {
  const { id } = useParams();
  const issue = ISSUES_DATA[id as keyof typeof ISSUES_DATA];
  const [showPDF, setShowPDF] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addViewed } = useRecentlyViewed();
  usePageTitle(issue?.title ?? 'Issue Not Found');

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: issue?.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/sections" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft size={20} />
          Back to Sections
        </Link>
        <h1 className="text-3xl font-bold">Issue not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Issues', href: '/bsjissues' },
        { label: issue.title },
      ]} />

      <Link to="/sections" className="flex items-center gap-2 text-primary hover:text-primary/80 mt-4 mb-8">
        <ArrowLeft size={20} />
        Back to Sections
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Issue Header */}
        <FadeIn direction="up">
        <div className="mb-12 pb-8 border-b border-border">
          <Badge className="mb-4" style={{ backgroundColor: issue.color }}>
            {issue.month} {issue.year}
          </Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-heading font-black text-5xl mb-2">{issue.title}</h1>
              <p className="text-lg text-muted-foreground">
                {id === 'SPECIAL' ? 'A special edition of Black Star Journal' : `Published in ${issue.month} ${issue.year}`}
              </p>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
        </FadeIn>

        {/* PDF Viewer */}
        <div className="mb-12">
          {!showPDF ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <img
                src={issue.cover}
                alt={`${issue.title} Cover`}
                className="max-h-[600px] w-auto object-contain rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
              <button
                onClick={() => {
                  setShowPDF(true);
                  if (id && issue) addViewed(id, issue.title, issue.cover);
                }}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-4 text-lg rounded-lg transition-colors"
              >
                Open & Read Issue
              </button>
            </div>
          ) : (
            <PDFViewer
              pdfUrl={`/pdfs/${issue.pdf}`}
              onClose={() => setShowPDF(false)}
              initialPage={1}
            />
          )}
        </div>

        {/* Issue Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Issue Number
            </h3>
            <p className="text-2xl font-bold">{id === 'SPECIAL' ? 'Special' : `#${id}`}</p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Publication Date
            </h3>
            <p className="text-2xl font-bold">{issue.month}</p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-2 text-muted-foreground">
              Year
            </h3>
            <p className="text-2xl font-bold">{issue.year}</p>
          </div>
        </div>

        {/* Other Issues Timeline */}
        <div className="mt-12 pt-12 border-t border-border">
          <h2 className="font-heading font-bold text-2xl mb-8 uppercase tracking-wider">All Issues</h2>
          <div className="overflow-x-auto pb-4">
            <div className="relative inline-flex gap-6 px-4 min-w-full">
              {/* Horizontal spine */}
              <div className="absolute top-[90px] left-0 right-0 h-0.5 bg-border" />

              {ISSUES_ORDER.map((key) => {
                const data = ISSUES_DATA[key];
                const isCurrent = key === id;
                return (
                  <Link
                    key={key}
                    to={`/issue/${key}`}
                    className={`relative flex-shrink-0 flex flex-col items-center group ${isCurrent ? 'pointer-events-none' : ''}`}
                  >
                    {/* Cover thumbnail */}
                    <div className={`w-[100px] h-[130px] rounded overflow-hidden shadow-md transition-all duration-300 ${
                      isCurrent ? 'ring-2 ring-[#f97316] scale-105' : 'group-hover:scale-110 group-hover:shadow-xl'
                    }`}>
                      <img
                        src={data.cover}
                        alt={data.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Timeline dot */}
                    <div className={`mt-3 w-3 h-3 rounded-full border-2 ${
                      isCurrent ? 'bg-[#f97316] border-[#f97316]' : 'bg-white border-stone-400 group-hover:border-[#f97316]'
                    }`} />

                    {/* Label */}
                    <div className={`mt-2 text-center text-xs font-medium ${
                      isCurrent ? 'text-[#f97316] font-bold' : 'text-muted-foreground group-hover:text-foreground'
                    }`}>
                      {key === 'SPECIAL' ? 'Special' : `#${key}`}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
