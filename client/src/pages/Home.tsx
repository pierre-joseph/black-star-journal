import heroImage from '@assets/generated_images/pink_room_illustration_with_mirror_and_shelf.png';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Text */}
          <div className="md:col-span-5 flex flex-col justify-center h-full pt-20">
            <h1 className="font-sans font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-black mb-8">
              THE<br />
              BLACK<br />
              STAR<br />
              JOURNAL
            </h1>
            
            <div className="mt-auto pt-12">
              <p className="font-serif text-lg leading-relaxed text-gray-800 max-w-md">
                The BSJ connects the vast collection of Black voices on Brown’s campus to build a stronger and better-informed community.
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="md:col-span-7">
            <div className="rounded-xl overflow-hidden shadow-sm">
              <img 
                src={heroImage} 
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
            <h2 className="font-heading font-bold text-4xl tracking-tight">Our Mission</h2>
            <div className="w-24 h-1 bg-primary" />
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              We strive to amplify the voices that often go unheard. Through rigorous journalism, creative storytelling, and cultural commentary, we document the Black experience at Brown University and beyond.
            </p>
            <Button variant="outline" className="group">
              Learn More About Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src={stockTexture} 
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
            <h2 className="font-heading font-black text-4xl md:text-5xl">The Moonflower Issue</h2>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group cursor-pointer h-full">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img 
                          src={`https://placehold.co/600x800/1a1a1a/FFF?text=Article+${index + 1}`} 
                          alt={`Article ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <span className="text-white font-bold text-sm">Read Article</span>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-card">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Culture</span>
                        <h3 className="font-serif font-bold text-xl mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          Echoes of Ancestry: Navigating Heritage in Modern Times
                        </h3>
                        <p className="text-sm text-muted-foreground">By Jordan Smith</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
