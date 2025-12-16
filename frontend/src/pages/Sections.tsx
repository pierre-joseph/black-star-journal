import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: "Echoes of My Ancestors",
    author: "Jordan Smith",
    category: "Arts & Culture",
    excerpt: "Exploring the deep connection between modern art and ancestral roots.",
    image: "https://placehold.co/600x400/2a2a2a/FFF?text=Arts"
  },
  {
    id: 2,
    title: "Inside Soul Food Night at The Ratty",
    author: "Maya Angelou II",
    category: "Local",
    excerpt: "A culinary journey through the most anticipated dining event of the semester.",
    image: "https://placehold.co/600x400/3b3b3b/FFF?text=Local"
  },
  {
    id: 3,
    title: "Finding History: Discovering a Lost Heritage",
    author: "James Baldwin Jr.",
    category: "Stories",
    excerpt: "Uncovering the forgotten narratives of the local community.",
    image: "https://placehold.co/600x400/4c4c4c/FFF?text=Stories"
  },
  {
    id: 4,
    title: "The Future of Campus Activism",
    author: "Angela Davis III",
    category: "Society & News",
    excerpt: "How student movements are shaping university policy in 2025.",
    image: "https://placehold.co/600x400/5d5d5d/FFF?text=Society"
  },
  {
    id: 5,
    title: "Poetry in Motion",
    author: "Langston Hughes IV",
    category: "Columns",
    excerpt: "Weekly musings on life, art, and the pursuit of happiness.",
    image: "https://placehold.co/600x400/6e6e6e/FFF?text=Columns"
  }
];

const CATEGORIES = ["All", "Arts & Culture", "Stories", "Local", "Columns", "Society & News"];

export default function Sections() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All" 
    ? SAMPLE_ARTICLES 
    : SAMPLE_ARTICLES.filter(article => article.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h2 className="font-heading font-bold text-xl mb-4 uppercase tracking-wider">Sections</h2>
            <div className="flex flex-col gap-2 items-start">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "text-lg hover:text-primary transition-colors text-left w-full px-2 py-1 rounded",
                    activeCategory === category ? "font-bold bg-muted" : "text-muted-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl mb-4 uppercase tracking-wider">Issues</h2>
            <ul className="space-y-2 font-mono text-muted-foreground">
              {['06', '05', '04', '03', '02', '01'].map(issue => (
                <li key={issue} className="hover:text-foreground cursor-pointer transition-colors">
                  Issue #{issue}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-8 border-b border-border pb-4">
            <h1 className="font-heading font-black text-4xl">{activeCategory === "All" ? "All Sections" : activeCategory}</h1>
            <p className="text-muted-foreground mt-2">{filteredArticles.length} articles found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none bg-muted/20">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5 space-y-3">
                  <Badge variant="secondary" className="rounded-none font-normal uppercase tracking-widest text-[10px]">
                    {article.category}
                  </Badge>
                  <h3 className="font-serif font-bold text-xl leading-tight hover:text-primary cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  <p className="text-xs font-bold text-foreground/60 pt-2">By {article.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
