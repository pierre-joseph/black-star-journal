export default function About() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="/images/about_us_banner.png" 
          alt="The Team" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <img 
            src="/images/who_are_us.png" 
            alt="Who We Are" 
            className="max-w-3xl mx-auto w-full"
          />
          <p className="font-serif text-xl max-w-2xl mx-auto text-gray-200">
            The voices, the stories, and the people behind The Black Star Journal.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-20">
        {/* Mission / Intro */}
        <section className="prose prose-lg dark:prose-invert mx-auto">
          <p className="lead font-serif text-2xl italic text-center">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>

        {/* Masthead */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 border-b border-border pb-4">Masthead</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="text-center group">
                <div className="aspect-square bg-muted rounded-full mb-4 overflow-hidden relative mx-auto max-w-[150px]">
                  <img 
                    src={`https://placehold.co/400x400/e2e8f0/475569?text=Editor+${i+1}`}
                    alt={`Editor ${i+1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>
                <h3 className="font-bold text-lg">Alex Johnson</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider text-xs">Editor in Chief</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Policy */}
        <section className="bg-muted/30 p-8 rounded-xl border border-border">
          <h2 className="font-heading font-bold text-2xl mb-4">Editorial Policy</h2>
          <p className="font-serif text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </section>

        {/* Contributing */}
        <section>
          <h2 className="font-heading font-bold text-2xl mb-4">Contributing</h2>
          <p className="font-serif text-muted-foreground mb-4">
            We are always looking for new voices. Whether you are a writer, photographer, or artist, we want to hear from you.
          </p>
          <a href="mailto:contact@bsj.brown.edu" className="font-bold text-primary hover:underline">
            Get in touch with us &rarr;
          </a>
        </section>
      </div>
    </div>
  );
}
