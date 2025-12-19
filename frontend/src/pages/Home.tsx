import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PDFViewer from "@/components/PDFViewer";

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

export default function Home() {
  const [showPDF, setShowPDF] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/issues")
      .then(res => res.json())
      .then(data => {
        // Sort by issue number in descending order (newest first)
        const sortedIssues = [...data.docs].sort((a, b) => b.issueNumber - a.issueNumber);
        setIssues(sortedIssues);
      });
  }, []);
  return (
    <div className="flex flex-col gap-12 pb-20 pt-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Text */}
          <div className="md:col-span-5 flex flex-col justify-center h-full pt-20">
            <h1 className="font-sans font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-black mb-6">
              THE<br />
              BLACK<br />
              STAR<br />
              JOURNAL
            </h1>
            
            <div className="mt-auto">
              <p className="font-serif text-lg leading-relaxed text-gray-800 max-w-md">
                Amplifying Black voices. Celebrating Black excellence. Building community at Brown.
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="md:col-span-7">
            <div className="rounded-xl overflow-hidden shadow-sm">
              <img 
                src="/images/pink_room.png" 
                alt="Artistic illustration of a room" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wider text-[#f97316] uppercase">
                Established 2021
              </p>
              <h2 className="font-heading font-bold text-4xl tracking-tight">Our Mission</h2>
              <div className="w-24 h-1 bg-primary" />
            </div>
            <p className="font-serif text-xl italic leading-relaxed">
              "The BSJ is a source of Black news, life, existence, and culture where Black voices on Brown's campus build community."
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Founded in 2021, we are more than a publication—we are a safe space and platform dedicated to documenting the Black experience at Brown University. Through journalism, storytelling, and creative expression, we hold space for joy, resilience, struggle, and triumph.
            </p>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              Every piece we publish is an act of reclamation and representation, building an archive of our own stories, told with the authenticity and care they deserve.
            </p>
          </div>
          <div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/images/abstract_paper.jpg" 
              alt="Abstract Texture" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
        </div>
      </section>

      {/* Featured Issue Section */}
      <section className="bg-muted/30 py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-2 block">Current Edition</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl">BSJ ISSUE #13</h2>
          </div>
          
          {!showPDF ? (
            <div className="flex flex-col items-center gap-6 mb-12">
              <img src={issues[0]?.coverImage.url} alt="Cover of the current issue" className="h-[800px] object-cover shadow-2xl" />
              <Button 
                onClick={() => setShowPDF(true)}
                disabled={!issues[0]?.fullPdf?.url}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-6 text-lg"
              >
                Open & Read
              </Button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {issues[0]?.fullPdf?.url && (
                <PDFViewer 
                  pdfUrl={issues[0].fullPdf.url} 
                  onClose={() => setShowPDF(false)} 
                />
              )}
              <div className="text-center mt-6">
                <Button 
                  onClick={() => setShowPDF(false)}
                  variant="outline"
                  className="font-semibold"
                >
                  Close Reader
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
