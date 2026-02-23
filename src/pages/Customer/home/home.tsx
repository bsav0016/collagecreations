import imageCollage from "../../../assets/exampleImageCollage.png";
import textCollage from "../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../assets/exampleSymbolCollage.png";
import NavBar from "../../../layout/navBars/navBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MosaicMaker from "../../../assets/MosaicMakerNoText.png";
import { Helmet } from "react-helmet-async";
import { CollageCreationType } from "../collageCreationPage/enums/collageCreationType";
import { CollageTypeCard } from "../../../components/collageTypeCard/collageTypeCard";

interface CollageOption {
  title: string;
  description: string;
  type: CollageCreationType;
  image: string;
  considerations: string[];
}

function Home() {
  const [logoClicked, setLogoClicked] = useState<number>(0);
  const navigate = useNavigate();

  const collageOptions: CollageOption[] = [
    {
      title: "Symbol Based Mosaic",
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
      title: "Custom Image Mosaic",
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
      title: "Text Based Mosaic",
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

  const updateClicked = () => {
    if (logoClicked >= 4) {
      navigate("/admin/login");
    }
    setLogoClicked((prev) => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>
          Mosaic Maker - Create Stunning Photo Mosaics | Collage Creations
        </title>
        <meta
          name="description"
          content="Create stunning photo mosaics using hundreds of your own pictures. Turn images, words, or symbols into high-resolution mosaics. Order custom prints today."
        />
        <meta
          name="keywords"
          content="photo mosaic, mosaic maker, photo collage, custom prints, mosaic art, photo wall art, image mosaic, text mosaic, symbol mosaic"
        />
        <meta
          property="og:title"
          content="Mosaic Maker - Create Stunning Photo Mosaics"
        />
        <meta
          property="og:description"
          content="Create stunning photo mosaics using hundreds of your own pictures. Turn images, words, or symbols into high-resolution mosaics."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://collagecreations.org/" />
        <meta
          property="og:image"
          content="https://collagecreations.org/mosaic-preview.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mosaic Maker - Create Stunning Photo Mosaics"
        />
        <meta
          name="twitter:description"
          content="Create stunning photo mosaics using hundreds of your own pictures. Turn images, words, or symbols into high-resolution mosaics."
        />
        <link rel="canonical" href="https://collagecreations.org/" />
      </Helmet>

      <div>
        <NavBar />
        <main className="flex-col items-center justify-center">
          <section className="text-center py-5">
            <button onClick={updateClicked} className="border-0 bg-background w-full">
              <img
                src={MosaicMaker}
                alt="Mosaic Maker Logo"
                className="w-[15%] justify-self-center max-md:w-[60%]"
              />
            </button>
            <h1 className="text-center font-bold text-3xl">Mosaic Maker</h1>
            <p className="m-0 p-2.5">
              Create stunning photo mosaics using hundreds of your own pictures.
            </p>
            <p className="m-0">
              Turn images, words, or symbols into high-resolution mosaics and
              zoom in to see every photo.
            </p>
            <section className="flex flex-col md:flex-row gap-6 justify-center items-start mt-8 px-4">
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
                      {option.considerations.map((consideration, index) => (
                        <p className="text-base mb-1" key={index}>
                          • {consideration}
                        </p>
                      ))}
                    </div>
                  )}
                </CollageTypeCard>
              ))}
            </section>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
