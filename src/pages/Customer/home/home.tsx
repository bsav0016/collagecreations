import imageCollage from "../../../assets/exampleImageCollage.png";
import textCollage from "../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../assets/exampleSymbolCollage.png";
import NavBar from "../../../layout/navBars/navBar";
import styles from "./home.module.css";
import appStyles from "../../../App.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MosaicMaker from "../../../assets/MosaicMakerNoText.png";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../../../components/ui/card";
import { Helmet } from "react-helmet-async";

function Home() {
  const [logoClicked, setLogoClicked] = useState<number>(0);
  const navigate = useNavigate();

  const updateClicked = () => {
    if (logoClicked >= 4) {
      navigate("/admin/login");
    }
    setLogoClicked((prev) => prev + 1);
  };

  const imagesToDisplay: string[] = [symbolCollage, textCollage, imageCollage];

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
          <section className={appStyles.App}>
            <button onClick={updateClicked} className={styles.bigLogo}>
              <img
                src={MosaicMaker}
                alt="Mosaic Maker Logo"
                style={{ width: "15%" }}
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
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="lg"
                className="bg-blue-500 text-white w-fit bg-gradient-to-r from-blue-700 via-purple-700 to-red-700 rounded-full"
                onClick={() => navigate("/collage")}
              >
                Get Started
              </Button>
            </div>
            <section className="flex gap-6 justify-center mt-8">
              <article>
                <Card className="w-85">
                  <CardHeader>
                    <CardTitle>Custom Image Mosaic</CardTitle>
                    <CardDescription>Create with photos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={imageCollage}
                      alt="Example of custom image mosaic made from hundreds of photos"
                      className="w-full rounded-md mb-4"
                    />
                    <p>Build stunning mosaics from your photo collection</p>
                  </CardContent>
                </Card>
              </article>

              <article>
                <Card className="w-85">
                  <CardHeader>
                    <CardTitle>Text Based Mosaic</CardTitle>
                    <CardDescription>Create with words</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={textCollage}
                      alt="Example of text-based mosaic using words and typography"
                      className="w-full rounded-md mb-4"
                    />
                    <p>Design mosaics using text and typography</p>
                  </CardContent>
                </Card>
              </article>

              <article>
                <Card className="w-85">
                  <CardHeader>
                    <CardTitle>Symbol Based Mosaic</CardTitle>
                    <CardDescription>Create with symbols</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={symbolCollage}
                      alt="Example of symbol-based mosaic using shapes and symbols"
                      className="w-full rounded-md mb-4"
                    />
                    <p>Craft mosaics using shapes and symbols</p>
                  </CardContent>
                </Card>
              </article>
            </section>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
