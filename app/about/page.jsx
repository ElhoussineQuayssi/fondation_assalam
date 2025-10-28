import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Target,
  Eye,
  BarChart,
  Users,
  Zap,
  Compass,
  CheckCircle,
  Award,
  Clock,
} from "lucide-react";
import { generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/seo";

// Import extracted components
import Container from "@/components/Container/Container.jsx";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary.jsx";

// Dynamic import for UnifiedHero with ssr: false to resolve image loading issues
const UnifiedHero = dynamic(() => import("@/components/UnifiedHero.jsx"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});
import SectionWithBackground from "@/components/SectionWithBackground/SectionWithBackground.jsx";
import ImageTextSectionAbout from "@/components/ImageTextSection/ImageTextSectionAbout.jsx";
import StatsCardAbout from "@/components/StatsCard/StatsCardAbout.jsx";
import MissionVisionCard from "@/components/MissionVisionCard/MissionVisionCard.jsx";
import ValueCard from "@/components/ValueCard/ValueCard.jsx";
import ContentCardAbout from "@/components/ContentCard/ContentCardAbout.jsx";
import TeamMemberCard from "@/components/TeamMemberCard/TeamMemberCard.jsx";
import {
  Timeline,
  TimelineItem,
  TimelineTime,
  TimelineCard,
  TimelineTitle,
  TimelineDescription,
} from "@/components/Timeline/Timeline.jsx";

export default function AboutUs() {


  // SEO Breadcrumbs for About page
  const breadcrumbs = [
    { name: "À Propos de Nous", url: "https://assalam.org/about" }
  ];

  // Enhanced organization schema for about page
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "À Propos de la Fondation Assalam",
    "description": "Découvrez l'histoire, la mission et les valeurs de la Fondation Assalam pour le Développement Social au Maroc.",
    "url": "https://assalam.org/about",
    "mainEntity": generateOrganizationSchema(),
    "breadcrumb": generateBreadcrumbSchema(breadcrumbs)
  };

// --- Design System Configuration (Minimalist Light Blue) ---
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const ACCENT = "#404040"; // Accent color
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// --- Design System Component Implementations (These have been removed as they are now imported) ---
// - ImageTextSection (Note: I'll assume you rename your import ImageTextSectionAbout to ImageTextSection below for consistency with the usage)
// - StatsCard (Note: I'll assume you rename your import StatsCardAbout to StatsCard below for consistency with the usage)
// - MissionVisionCard
// - ValueCard
// - ContentCard (Note: I'll assume you rename your import ContentCardAbout to ContentCard below for consistency with the usage)
// - TeamMemberCard
// - Timeline
// - TimelineItem
// - TimelineTime
// - TimelineContent
// - TimelineTitle
// - TimelineDescription

// --- Original Page Logic (Content is Replaced Here) ---

const partnershipsData = [
  {
    name: "Fondation Jadara",
    logo: "/partners/partner1.png",
    description:
      "Partenaire clé dans le soutien aux projets d'éducation et d'excellence académique (*Projet Imtiaz*).",
  },
  {
    name: "Association Mentor'Elles",
    logo: "/partners/partner2.png",
    description:
      "Collaborateur engagé dans l'autonomisation et le développement des compétences des femmes.",
  },
  {
    name: "Fondation Abdelkader Bensalah",
    logo: "/partners/partner3.png",
    description:
      "Un partenaire majeur pour des initiatives de développement social et communautaire au Maroc.",
  },
  {
    name: "Entraide Nationale",
    logo: "/partners/partner4.png",
    description:
      "Partenaire pour la certification officielle des diplômes de formation professionnelle (Couture et Pâtisserie).",
  },
];

  const impactStats = [
    {
      title: "Sections Opérationnelles",
      description:
        "Notre réseau national compte plus de 36 sections engagées dans les communautés locales à travers le Royaume.",
      value: "36+",
    },
    {
      title: "Bénéficiaires du programme Kafala",
      description:
        "Enfants et orphelins bénéficiant d'un soutien éducatif, social et médical complet pour s'épanouir.",
      value: "6,000+",
    },
    {
      title: "Personnes touchées chaque année",
      description:
        "Familles vulnérables, femmes et étudiants impactés positivement par nos projets d'autonomisation.",
      value: "10,000+",
    },
  ];

  const values = [
    {
      title: "Solidarité",
      description:
        "Nous sommes unis par un esprit d'entraide profonde pour soutenir les plus démunis et avancer ensemble, dans la compassion.",
      borderColor: "blue",
    },
    {
      title: "Autonomisation",
      description:
        "Notre action vise à donner aux femmes et aux jeunes les moyens de devenir acteurs de leur propre avenir (Empowerment).",
      borderColor: "green",
    },
    {
      title: "Dignité",
      description:
        "Assurer le respect de chaque individu, en offrant une assistance qui préserve l'honneur et l'estime de soi.",
      borderColor: "blue",
    },
    {
      title: "Éducation",
      description:
        "Clé de l'émancipation, nous la soutenons de l'enfance (Rihana) à l'insertion professionnelle (Imtiaz).",
      borderColor: "green",
    },
    {
      title: "Compassion",
      description:
        "Une approche humaine et chaleureuse guide toutes nos interactions et décisions envers les communautés.",
      borderColor: "blue",
    },
    {
      title: "Durabilité",
      description:
        "Nos projets sont conçus pour avoir un impact positif durable sur les communautés et l'environnement marocain.",
      borderColor: "green",
    },
  ];

  // State for random gallery images
    const [fallbackImages, setFallbackImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [imageError, setImageError] = useState(null);
    const [heroImages, setHeroImages] = useState([]);
  // Enhanced image fetching with better error handling
    useEffect(() => {
      const fetchImages = async () => {
        try {
          setImageError(null);
          // Get 6 random images for the fallback projects
          const images = await getRandomGalleryImages(6);
          setFallbackImages(images);
          // Get 6 random images for the hero
          const heroImgs = await getRandomGalleryImages(6);
          setHeroImages(heroImgs);
        } catch (error) {
          console.error('Failed to fetch gallery images:', error);
          setImageError('Impossible de charger les images. Utilisation des images par défaut.');
          // Fallback to placeholder
          setFallbackImages(Array(6).fill('/placeholder.svg?height=400&width=600'));
          setHeroImages(Array(4).fill('/placeholder.svg?height=400&width=600'));
        } finally {
          setLoadingImages(false);
        }
      };
  
      fetchImages();
    }, []);
  return (
    // Main background set with inline style
    <main style={{ backgroundColor: BACKGROUND }}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      {/* Header Section */}
      <UnifiedHero
        title="À Propos de Nous"
        subtitle="Découvrez l'histoire, la mission d'espoir et les valeurs de solidarité de la Fondation Assalam, créée en 1992."
        images={heroImages}
      />

      {/* Notre Histoire */}
      <section className="mb-20">
        <ErrorBoundary>
          {/* NOTE: Renamed to ImageTextSectionAbout to match your import name */}
          <ImageTextSectionAbout
            title="Notre Histoire"
            content={
              <>
                <p className="mb-4">
                  Fondée en **1992** au Maroc, la Fondation Assalam est née d'une
                  volonté profonde de **solidarité** et d'**entraide**. Nos
                  premières initiatives locales visaient à améliorer les
                  conditions de vie des familles les plus vulnérables. L'ONG a
                  rapidement pris de l'ampleur en s'appuyant sur l'engagement de
                  bénévoles.
                </p>
                <p>
                  Aujourd'hui, avec plus de **36 sections** à travers le Royaume,
                  nous nous engageons dans l'autonomisation des femmes,
                  l'éducation des enfants, et le soutien aux étudiants brillants,
                  transformant chaque défi en une opportunité de dignité et
                  d'autonomie.
                </p>
              </>
            }
            imageSrc={!galleryImagesData || galleryImagesData.length === 0 ? '/placeholder.svg?height=400&width=600' : galleryImagesData[0]}
            imageAlt="Histoire de la fondation Assalam"
            layout="image-left"
          />
        </ErrorBoundary>
      </section>

      {/* Timeline Section */}
      <SectionWithBackground variant="gray" className="py-16">
        <ErrorBoundary>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT }}>
              Les Étapes de Notre Engagement
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
              Découvrez les étapes clés qui ont marqué le parcours de la Fondation
              Assalam pour le Développement Social.
            </p>
          </div>

          <Timeline>
            {[
              {
                year: "1992",
                event: "Création de la Fondation Assalam au Maroc.",
              },
              {
                year: "2010",
                event: "Expansion Nationale",
              },
              {
                year: "2018",
                event: "Lancement des Programmes d'Autonomisation des Femmes",
              },
              {
                year: "2025",
                event:
                  "Transition Numérique & Lancement de la Nouvelle Plateforme",
              },
            ].map((item, index) => (
              <TimelineItem key={index} index={index}>
                <TimelineTime>{item.year}</TimelineTime>
                <TimelineCard>
                  <TimelineTitle>{item.event}</TimelineTitle>
                  <TimelineDescription>
                    {item.year === "1992"
                      ? "Lancement de l'organisation caritative nationale marocaine, reposant sur le volontariat et la solidarité."
                      : item.year === "2010"
                        ? "La Fondation étend sa présence avec de nouvelles sections pour couvrir davantage de régions vulnérables du Royaume."
                        : item.year === "2018"
                          ? "Inauguration de centres comme Fataer Al Baraka et Nadi Assalam pour l'autonomie économique durable."
                          : "Lancement de la nouvelle plateforme web Next.js pour optimiser la transparence et l'impact social."}
                  </TimelineDescription>
                </TimelineCard>
              </TimelineItem>
            ))}
          </Timeline>
        </ErrorBoundary>
      </SectionWithBackground>

      {/* Notre Mission et Vision */}
      <SectionWithBackground variant="none" className="mb-20 py-16">
        <ErrorBoundary>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT }}>
              Notre Mission et Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <MissionVisionCard
              type="mission"
              title="Notre Mission"
              description="Notre mission est d'améliorer les conditions de vie des individus et des familles vulnérables au Maroc. Nous agissons pour leur **bien-être, leur dignité** et leur **autonomie** à travers des initiatives d'éducation, de solidarité et d'**autonomisation économique**."
            />

            <MissionVisionCard
              type="vision"
              title="Notre Vision"
              description="Nous aspirons à un Maroc où chaque citoyen, en particulier les **femmes et les enfants**, peut vivre avec **dignité, autonomie et espoir**. Nous croyons en un développement inclusif, durable et centré sur l'être humain."
            />
          </div>
        </ErrorBoundary>
      </SectionWithBackground>

      {/* Impact Section */}
      <section className="py-16">
        <Container>
          <ErrorBoundary>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT }}>
                Notre Impact et Notre Rayonnement
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
                Grâce à votre soutien constant et l'engagement de nos bénévoles,
                nous avons pu transformer des vies et bâtir un avenir meilleur.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* NOTE: Renamed to StatsCardAbout to match your import name */}
              {impactStats.map((stat, index) => (
                <StatsCardAbout
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                />
              ))}
            </div>
          </ErrorBoundary>
        </Container>
      </section>

      {/* Nos Valeurs */}
      <section className="mb-20">
        <Container>
          <ErrorBoundary>
            <h2
              className="text-3xl font-bold mb-10 text-center"
              style={{ color: ACCENT }}
            >
              Nos Valeurs Fondatrices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  title={value.title}
                  description={value.description}
                  borderColor={value.borderColor}
                />
              ))}
            </div>
          </ErrorBoundary>
        </Container>
      </section>

      {/* Partnerships Section */}
      <SectionWithBackground variant="gray" className="py-16">
        <ErrorBoundary>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT }}>
              Nos Partenaires de Confiance
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: DARK_TEXT }}>
              Nous collaborons avec des fondations et organisations engagées pour
              maximiser notre impact social et éducatif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* NOTE: Renamed to ContentCardAbout to match your import name */}
            {partnershipsData.map((partner, index) => (
              <ContentCardAbout
                key={index}
                title={partner.name}
                description={partner.description}
                imageSrc={partner.logo}
                imageAlt={partner.name}
              />
            ))}
          </div>
        </ErrorBoundary>
      </SectionWithBackground>

      {/* Notre Équipe */}
      <section className="py-16">
        <Container>
          <ErrorBoundary>
            <h2
              className="text-3xl font-bold mb-10 text-center"
              style={{ color: ACCENT }}
            >
              Notre Équipe Dévouée
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((id) => (
                <TeamMemberCard
                  key={id}
                  name={
                    id === 1
                      ? "Mme. Fatema Zahra Alami"
                      : id === 2
                      ? "M. Youssef El Mansouri"
                      : id === 3
                        ? "Mme. Samira El Fassi"
                        : "M. Karim Bennani"
                  }
                  role={
                    id === 1
                      ? "Présidente de la Fondation"
                      : id === 2
                      ? "Directeur Général"
                      : id === 3
                        ? "Chef des Opérations Sociales"
                        : "Chef de la Transformation Numérique"
                  }
                  imageSrc={!galleryImagesData || galleryImagesData.length === 0 ? '/placeholder.svg?height=400&width=600' : galleryImagesData[id-1]}
                  imageAlt={`Membre de l'équipe ${id}`}
                />
              ))}
            </div>
          </ErrorBoundary>
        </Container>
      </section>
    </main>
  );
}
