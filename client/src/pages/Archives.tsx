import { motion } from "framer-motion";

export default function Archives() {
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

      {/* Marquee Section */}
      <section className="py-20 border-b border-border bg-muted/20">
        <h2 className="text-center font-heading font-bold text-2xl mb-12 uppercase tracking-widest">Past Issues</h2>
        
        <div className="flex overflow-hidden relative w-full">
          <motion.div 
            className="flex gap-8 whitespace-nowrap px-8"
            animate={{ x: [0, -1000] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 20 
            }}
          >
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="w-[300px] h-[400px] bg-white border border-border shadow-xl shrink-0 flex items-center justify-center relative group cursor-pointer"
              >
                <div className="absolute inset-2 border border-black/10 flex flex-col items-center justify-between p-8">
                  <div className="text-center">
                    <div className="font-heading font-black text-4xl mb-2">BSJ</div>
                    <div className="text-xs uppercase tracking-widest">Vol. {i + 1}</div>
                  </div>
                  <div className="text-center font-serif italic text-muted-foreground">
                    "The Issue Title"
                  </div>
                  <div className="text-xs font-bold">
                    {2020 + i}
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-xl uppercase tracking-widest">Read Issue</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-full mb-8">
                <h3 className="font-heading font-bold text-3xl">Browse by Year</h3>
            </div>
            {['2024', '2023', '2022', '2021', '2020', '2019'].map(year => (
                <div key={year} className="bg-card border border-border p-8 hover:bg-muted transition-colors cursor-pointer group">
                    <h4 className="font-heading font-black text-6xl text-muted-foreground/20 group-hover:text-primary/20 transition-colors">{year}</h4>
                    <ul className="mt-4 space-y-2">
                        <li className="font-serif hover:underline">Spring Issue: Rebirth</li>
                        <li className="font-serif hover:underline">Fall Issue: Reflections</li>
                    </ul>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}
