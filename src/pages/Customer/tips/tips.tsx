import React from 'react';
import NavBar from '../../../layout/navBars/navBar';
import ImageCollageTips from './components/imageCollageTips';
import TextCollageTips from './components/textCollageTips';
import SymbolCollageTips from './components/symbolCollageTips';
import imageCollage from "../../../assets/exampleImageCollage.png";
import textCollage from "../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../assets/exampleSymbolCollage.png";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import MosaicMakerLogo from "../../../assets/MosaicMakerNoText.png";


function Tips(): React.ReactElement {
  return (
    <div>
      <NavBar />
      <div className="text-center py-5">
        <div className="justify-center p-0">
          <div className="text-center mb-5">
            <img
              src={MosaicMakerLogo}
              alt="Mosaic Maker Logo"
              className="w-[15%] mx-auto"
            />
          </div>
          <h1 className="text-[32px] font-bold m-0 p-0">Helpful Tips</h1>
        </div>
        
        <section className="flex flex-col md:flex-row gap-6 justify-center items-start mt-8 px-4">
          <article>
            <Card className="w-85">
              <CardHeader>
                <CardTitle>Image Collage Tips</CardTitle>
                <CardDescription>Tips for creating image-based mosaics</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={imageCollage}
                  alt="Example of custom image mosaic"
                  className="w-full rounded-md mb-4"
                />
                <ImageCollageTips />
              </CardContent>
            </Card>
          </article>

          <article>
            <Card className="w-85">
              <CardHeader>
                <CardTitle>Text Collage Tips</CardTitle>
                <CardDescription>Tips for creating text-based mosaics</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={textCollage}
                  alt="Example of text-based mosaic"
                  className="w-full rounded-md mb-4"
                />
                <TextCollageTips />
              </CardContent>
            </Card>
          </article>

          <article>
            <Card className="w-85">
              <CardHeader>
                <CardTitle>Symbol Collage Tips</CardTitle>
                <CardDescription>Tips for creating symbol-based mosaics</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={symbolCollage}
                  alt="Example of symbol-based mosaic"
                  className="w-full rounded-md mb-4"
                />
                <SymbolCollageTips />
              </CardContent>
            </Card>
          </article>
        </section>
      </div>
    </div>
  );
}

export default Tips;
