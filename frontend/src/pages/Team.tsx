import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageTitle } from "@/hooks/usePageTitle";

const staffData = [
  {
    id: "editors-in-chief",
    title: "Editors-in-Chief",
    members: [
      { role: "Editor-in-Chief", name: "Nelsa Tiemtore" },
      { role: "Editor-in-Chief", name: "Kourtney Beauvais" }
    ]
  },
  {
    id: "managing-editor",
    title: "Managing Editor",
    members: [
      { role: "Managing Editor", name: "Destiny Kristina" },
      { role: "Managing Editor", name: "Don Shombusho" }
    ]
  },
  {
    id: "advisor",
    title: "Advisor",
    members: [{ role: "Advisor", name: "Destiny Wilson" }]
  },
  {
    id: "treasurer",
    title: "Treasurer",
    members: [{ role: "Treasurer", name: "Kaliyah Graham" }]
  },
  {
    id: "copy-editor",
    title: "Copy Editor",
    members: [{ role: "Copy Editor", name: "Eniola Okon" }]
  },
  {
    id: "arts-culture",
    title: "Arts & Culture",
    members: [
      { role: "Section Editor", name: "Nina Jeffries-El" },
      { role: "Section Editor", name: "Mansie Bennett" },
      { role: "Staff Writer", name: "Emmanuel Chery" },
      { role: "Staff Writer", name: "Nyjah Harrison" },
      { role: "Staff Writer", name: "Mounika Katta" },
      { role: "Staff Writer", name: "Chanel Baxter" },
      { role: "Staff Writer", name: "Daniel Nkalubo" },
      { role: "Staff Writer", name: "Natalie Payne" },
      { role: "Staff Writer", name: "Asya Gipson" },
      { role: "Staff Writer", name: "Alexandria Goodman" }
    ]
  },
  {
    id: "columns",
    title: "Columns",
    members: [
      { role: "Section Editor", name: "Destiny Kristina" },
      { role: "Section Editor", name: "Paris Carney" },
      { role: "Staff Writer", name: "Yenee Berta" },
      { role: "Staff Writer", name: "Sonam Shulman" },
      { role: "Staff Writer", name: "Favour Akpokiere" },
      { role: "Staff Writer", name: "Rohey Jasseh" },
      { role: "Staff Writer", name: "Riki Doumbia" }
    ]
  },
  {
    id: "stories",
    title: "Stories",
    members: [
      { role: "Section Editor", name: "Zahira Walker" },
      { role: "Staff Writer", name: "Jannah Maguire" },
      { role: "Staff Writer", name: "Nyria Delph" },
      { role: "Staff Writer", name: "Julie Hajducky" }
    ]
  },
  {
    id: "society-news",
    title: "Society & News",
    members: [
      { role: "Section Editor", name: "Don Shumbusho" },
      { role: "Section Editor", name: "Ava Sharma" },
      { role: "Staff Writer", name: "Izu Obialo" },
      { role: "Staff Writer", name: "Rashaun Bertrand" },
      { role: "Staff Writer", name: "Zoe Plunkett" }
    ]
  },
  {
    id: "content",
    title: "Content",
    members: [
      { role: "Content Lead", name: "Nina Jeffries-El" },
      { role: "Content Creator", name: "Aisosa Idahosa" },
      { role: "Content Creator", name: "Rita Beyene" },
      { role: "Content Creator (Photographer)", name: "Farhiyo Omar" },
      { role: "Content Creator", name: "Moana Marx" },
      { role: "Content Creator", name: "Jordan Kinley" },
      { role: "Content Creator", name: "Kierra Reese" },
      { role: "Content Creator", name: "Yenee Berta" },
      { role: "Content Creator", name: "Kayla Randolph" },
      { role: "Content Creator", name: "Shamari Reed" },
      { role: "Content Creator (Photographer)", name: "Laeticia Paul" }
    ]
  },
  {
    id: "social",
    title: "Social",
    members: [
      { role: "Social Lead", name: "Ramatoulaye Tall" },
      { role: "Social Media Content Creator", name: "Kierra Reese" },
      { role: "Social Media Content Creator", name: "Laeticia Paul" }
    ]
  },
  {
    id: "website",
    title: "Website",
    members: [
      { role: "Website Co-Lead", name: "Mamadou Kouyate" },
      { role: "Website Co-Lead", name: "Pierre Joseph" }
    ]
  },
  {
    id: "layout",
    title: "Layout",
    members: [
      { role: "Team Member", name: "Nina Jeffries-El" },
      { role: "Team Member", name: "Sydney Johnson" }
    ]
  },
  {
    id: "community-liaison-event-coordinator",
    title: "Community Liaison / Event Coordinator",
    members: [
      { role: "Coordinator", name: "Sage Freeman" },
      { role: "Coordinator", name: "Imani Moneyang" },
      { role: "Coordinator", name: "Feker Wolde" }
    ]
  },
  {
    id: "archiving",
    title: "Archiving",
    members: [
      { role: "Co-Archivist", name: "Vera Koontz" },
      { role: "Co-Archivist", name: "Mares Bustamante-Donawa" }
    ]
  }
];

export default function Team() {
  usePageTitle('Our Team');
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
