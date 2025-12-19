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
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/issues?limit=100")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched issues:", data.docs.length, "issues");
        // Sort by issue number in ascending order (oldest first)
        const sortedIssues = [...data.docs].sort((a, b) => a.issueNumber - b.issueNumber);
        setIssues(sortedIssues);
      })
      .catch(error => console.error("Error fetching issues:", error));
  }, []);

  const handleIssueClick = (issue: Issue) => {
    if (issue.fullPdf?.url) {
      setSelectedPdf(issue.fullPdf.url);
      setSelectedIssue(issue);
      // Smooth scroll to the reader
      setTimeout(() => {
        document.getElementById('pdf-reader')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleCloseReader = () => {
    setSelectedPdf(null);
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen pb-20 overflow-hidden">
      <section className="bg-black text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-black text-6xl md:text-8xl mb-6">ARCHIVES</h1>
          <p className="font-serif text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            A history of our stories, our struggles, and our triumphs.
          </p>
        </div>
      </section>

      {/* Embedded PDF Reader Section */}
      {selectedPdf && selectedIssue && (
        <section id="pdf-reader" className="py-12 bg-gradient-to-b from-stone-900 to-muted/20 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Now Reading</span>
              <h2 className="font-heading font-black text-3xl md:text-4xl mb-2">BSJ ISSUE #{selectedIssue.issueNumber}</h2>
              <p className="font-serif text-lg text-muted-foreground">{selectedIssue.title}</p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <PDFViewer 
                pdfUrl={selectedPdf} 
                onClose={handleCloseReader} 
              />
              <div className="text-center mt-6">
                <Button 
                  onClick={handleCloseReader}
                  variant="outline"
                  className="font-semibold"
                >
                  Close Reader & Return to Archives
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section className="py-20 border-b border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading font-bold text-2xl mb-12 uppercase tracking-widest">
            {selectedPdf ? 'Browse Other Issues' : 'Past Issues'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {issues.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => handleIssueClick(issue)}
                className={`aspect-[3/4] bg-white border shadow-xl flex items-center justify-center relative group cursor-pointer hover:scale-105 transition-transform duration-300 ${
                  selectedIssue?.id === issue.id ? 'border-primary border-4 ring-4 ring-primary/20' : 'border-border'
                }`}
              >
                {issue.coverImage?.url ? (
                  <>
                    <img 
                      src={issue.coverImage.url} 
                      alt={issue.coverImage.alt || issue.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded font-bold text-sm">
                      #{issue.issueNumber}
                    </div>
                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-xl uppercase tracking-widest">
                        {selectedIssue?.id === issue.id ? 'Currently Reading' : 'Read Issue'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-2 border border-black/10 flex flex-col items-center justify-between p-8">
                    <div className="text-center">
                      <div className="font-heading font-black text-4xl mb-2">BSJ</div>
                      <div className="text-xs uppercase tracking-widest">Issue #{issue.issueNumber}</div>
                    </div>
                    <div className="text-center font-serif italic text-muted-foreground">
                      "{issue.title}"
                    </div>
                    <div className="text-xs font-bold">
                      {new Date(issue.publishDate).getFullYear()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
