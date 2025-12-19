import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const staffData = [
  {
    id: "editors-in-chief",
    title: "Editors-in-Chief",
    members: [
      { name: "Nelia Tiemtore", role: "Editor-in-Chief" },
      { name: "Kourtney Beauvais", role: "Editor-in-Chief" }
    ]
  },
  {
    id: "advisor",
    title: "Advisor",
    members: [{ name: "Destiny Wilson", role: "Advisor" }]
  },
  {
    id: "arts-culture",
    title: "Arts & Culture",
    members: [
      "Zola Narisetti", "Maisie Bennett", "Nina Jeffries-El", "Chanel Baxter",
      "Emmanuel Chery", "Nyiah Harrison", "Mountika Katta", "Natalie Payne",
      "Daniel Malikba", "Arya Gibson"
    ].map(name => ({ name, role: "Arts & Culture" }))
  },
  {
    id: "columns",
    title: "Columns",
    members: [
      "Destiny Kristine", "Paris Carney", "Favour Akpokere", "Yennie Berta",
      "Riki Dourthia", "Richery Jassath", "Sonam Shulman"
    ].map(name => ({ name, role: "Columnist" }))
  },
  {
    id: "society-news",
    title: "Society & News",
    members: ["Don Shumbusho", "Ava Sharma", "Rashaun Bertrand", "Inu Obilo"]
      .map(name => ({ name, role: "Society & News" }))
  },
  {
    id: "stories",
    title: "Stories Team",
    members: [
      "Zahira Branch", "Sienna Amenumey", "Mara Dufrin Clark",
      "Janna Maguire", "Michelle Toptas"
    ].map(name => ({ name, role: "Stories" }))
  },
  {
    id: "content",
    title: "Content Team",
    members: [
      "Aurora Idahosa", "Riki Beryene", "Farhiya Omar", "Moana Marr",
      "Jordan Kinley", "Yennie Berta", "Kierra Reese"
    ].map(name => ({ name, role: "Content" }))
  },
  {
    id: "copy-editor",
    title: "Copy Editor",
    members: [{ name: "Enjola Olan", role: "Copy Editor" }]
  },
  {
    id: "layout",
    title: "Layout Team",
    members: ["Sydney Johnson", "Nina Jeffries-El"].map(name => ({ name, role: "Layout" }))
  },
  {
    id: "social",
    title: "Social Team",
    members: [{ name: "Ramataoulaye Tall", role: "Social" }]
  },
  {
    id: "website",
    title: "Website Team",
    members: ["Zamora McBride", "Pierre Joseph", "Mamadou Konyate"]
      .map(name => ({ name, role: "Website" }))
  },
  {
    id: "community-liaisons",
    title: "Community Liaisons",
    members: ["Sage Freeman", "Imani Morenyang", "Felker Wolde"]
      .map(name => ({ name, role: "Community Liaison" }))
  },
  {
    id: "treasurer",
    title: "Treasurer",
    members: [{ name: "Kaliyah Graham", role: "Treasurer" }]
  },
  {
    id: "archivists",
    title: "Archivists",
    members: ["Marc Bustamante-Dorawa", "Vera Koontz"].map(name => ({ name, role: "Archivist" }))
  }
];

export default function Team() {
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
        {/* Masthead */}
        <section>
          <h2 className="font-heading font-bold text-3xl mb-8 border-b border-border pb-4 text-[#f97316]">Our BSJ Team</h2>
          
          <Accordion type="multiple" defaultValue={staffData.map(section => section.id)} className="w-full">
            {staffData.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-lg font-bold text-primary">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                    {section.members.map((member, i) => (
                      <div key={i} className="text-center group">
                        <div className="aspect-square bg-muted rounded-full mb-4 overflow-hidden relative mx-auto max-w-[150px]">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=e5e7eb&color=6b7280&bold=true`}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="font-bold text-lg text-[#f97316]">{member.name}</h4>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider text-xs">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
