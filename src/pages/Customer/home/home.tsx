import imageCollage from "../../../assets/exampleImageCollage.png";
import textCollage from "../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../assets/exampleSymbolCollage.png";
import NavBar from "../../../layout/navBars/navBar";
import Footer from "../../../layout/footer/footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CollageCreationType } from "../collageCreationPage/enums/collageCreationType";
import { CollageCreationStep } from "../collageCreationPage/enums/collageCreationStep";
import { CollageTypeCard } from "../../../components/collageTypeCard/collageTypeCard";
import { ZoomableImage } from "../../../components/zoomableImage/zoomableImage";
import GeneralButton from "../../../components/generalButton/generalButton";
import { IS_DESKTOP } from "../../../utils/constants/constants";
import { cn } from "../../../lib/utils";

interface CollageOption {
  title: string;
  heroLabel: string;
  description: string;
  type: CollageCreationType;
  image: string;
  considerations: string[];
}

function Home() {
  const [logoClicked, setLogoClicked] = useState<number>(0);
  // Which example the hero image shows; defaults to Text since seeing "Family" resolve
  // into tiny photos on zoom is the clearest one-glance demo of what the product does.
  const [heroType, setHeroType] = useState<CollageCreationType>(CollageCreationType.Text);
  const navigate = useNavigate();

  const collageOptions: CollageOption[] = [
    {
      title: "Symbol Based Collage",
      heroLabel: "Symbols",
      description: "Create with symbols",
      type: CollageCreationType.Symbol,
      image: symbolCollage,
      considerations: [
        "Similar considerations as text collage",
        "There are a limited number of symbols to choose from",
        "You may request custom symbol if you do not like the options",
      ],
    },
    {
      title: "Custom Image Collage",
      heroLabel: "Photos",
      description: "Create with photos",
      type: CollageCreationType.Image,
      image: imageCollage,
      considerations: [
        "Only black and white",
        'You cannot select the small image size (0.3" x 0.3")',
        'Output image must be 24" x 24" or larger',
        "Most unique",
      ],
    },
    {
      title: "Text Based Collage",
      heroLabel: "Words",
      description: "Create with words",
      type: CollageCreationType.Text,
      image: textCollage,
      considerations: [
        "Can output in black and white or color",
        "Can use small, medium, or large image sizes in step 2",
        'Output image must be 12" x 12" or greater',
      ],
    },
  ];

  const heroOption = collageOptions.find((option) => option.type === heroType) ?? collageOptions[0];

  const updateClicked = () => {
    if (logoClicked >= 4) {
      navigate("/admin/login");
    }
    setLogoClicked((prev) => prev + 1);
  };

  const startCreating = () => {
    navigate(`/collage/${CollageCreationStep.SelectTypeStep}`);
  };

  return (
    <>
      <Helmet>
        <title>
          Collage Creations - Create Stunning Photo Collages | Collage Creations
        </title>
        <meta
          name="description"
          content="Create stunning photo collages using hundreds of your own pictures. Turn images, words, or symbols into high-resolution collages. Order custom prints today."
        />
        <meta
          name="keywords"
          content="photo mosaic, mosaic maker, photo collage, custom prints, mosaic art, photo wall art, image collage, text collage, symbol collage"
        />
        <meta
          property="og:title"
          content="Collage Creations - Create Stunning Photo Collages"
        />
        <meta
          property="og:description"
          content="Create stunning photo collages using hundreds of your own pictures. Turn images, words, or symbols into high-resolution mosaics."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://collagecreations.org/" />
        <meta
          property="og:image"
          content="https://collagecreations.org/collage-preview.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Collage Creations - Create Stunning Photo Collages"
        />
        <meta
          name="twitter:description"
          content="Create stunning photo collages using hundreds of your own pictures. Turn images, words, or symbols into high-resolution collages."
        />
        <link rel="canonical" href="https://collagecreations.org/" />
      </Helmet>

      <div>
        <NavBar />
        <main className="flex-col items-center justify-center">
          {/* Hero */}
          <section className="relative bg-muted/40 pt-10 pb-20 md:pt-16 md:pb-28">
            <div className="mx-auto max-w-6xl px-4">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div className="text-center lg:text-left">
                  <p
                    onClick={updateClicked}
                    className="text-sm font-semibold uppercase tracking-wide text-primary cursor-default select-none"
                  >
                    Collage Creations
                  </p>
                  <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    Turn Hundreds of Photos Into One Stunning Collage
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                    Upload your favorite pictures and we'll arrange them into a single
                    high-resolution mosaic — shaped as a photo, word, or symbol. Zoom in
                    and every picture is still there.
                  </p>
                  <div className="mt-8 flex justify-center lg:justify-start">
                    <GeneralButton
                      text="Start Creating"
                      onClick={startCreating}
                      variant="primary"
                      size="lg"
                      fullWidth={false}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-center gap-2 mb-3">
                    {collageOptions.map((option) => (
                      <button
                        type="button"
                        key={option.type}
                        onClick={() => setHeroType(option.type)}
                        aria-pressed={heroType === option.type}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                          heroType === option.type
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50",
                        )}
                      >
                        {option.heroLabel}
                      </button>
                    ))}
                  </div>
                  <ZoomableImage
                    src={heroOption.image}
                    alt={`Example of a ${heroOption.title.toLowerCase()}`}
                    className="max-w-xl mx-auto lg:max-w-none"
                  />
                  {IS_DESKTOP && (
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      Hover over the image to zoom in
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Type picker */}
          <section className="relative z-10 -mt-12 md:-mt-16 text-center px-4 pb-4">
            <h2 className="text-2xl font-bold text-foreground">Choose Your Collage Type</h2>
            <p className="text-muted-foreground mt-1 mb-8">
              Every collage starts with one of these three building blocks.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
              {collageOptions.map((option) => (
                <CollageTypeCard
                  key={option.type}
                  title={option.title}
                  description={option.description}
                  type={option.type}
                  image={option.image}
                  imageAlt={`Example of ${option.title.toLowerCase()}`}
                >
                  {option.considerations.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">Considerations:</p>

                      <ul className="list-disc list-inside space-y-1 text-left">
                        {option.considerations.map((consideration, index) => (
                          <li key={index}>
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CollageTypeCard>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
