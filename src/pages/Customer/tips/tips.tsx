import React from 'react';
import NavBar from '../../../layout/navBars/navBar';
import ImageCollageTips from './components/imageCollageTips';
import TextCollageTips from './components/textCollageTips';
import SymbolCollageTips from './components/symbolCollageTips';
import imageCollage from "../../../assets/exampleImageCollage.png";
import textCollage from "../../../assets/exampleTextCollage.png";
import symbolCollage from "../../../assets/exampleSymbolCollage.png";
import { CollageCreationType } from "../collageCreationPage/enums/collageCreationType";
import { CollageTypeCard } from "../../../components/collageTypeCard/collageTypeCard";


function Tips(): React.ReactElement {
  return (
    <div>
      <NavBar />
      <div className="text-center py-5">
        <h1 className="text-4xl font-bold m-0 p-0">Helpful Tips</h1>
        
        <section className="flex flex-col md:flex-row gap-6 justify-center items-start mt-8 px-4">
          <CollageTypeCard
            title="Symbol Collage Tips"
            description="Tips for creating symbol-based mosaics"
            type={CollageCreationType.Symbol}
            image={symbolCollage}
            imageAlt="Example of symbol-based mosaic"
          >
            <SymbolCollageTips />
          </CollageTypeCard>

          <CollageTypeCard
            title="Image Collage Tips"
            description="Tips for creating image-based mosaics"
            type={CollageCreationType.Image}
            image={imageCollage}
            imageAlt="Example of custom image mosaic"
          >
            <ImageCollageTips />
          </CollageTypeCard>

          <CollageTypeCard
            title="Text Collage Tips"
            description="Tips for creating text-based mosaics"
            type={CollageCreationType.Text}
            image={textCollage}
            imageAlt="Example of text-based mosaic"
          >
            <TextCollageTips />
          </CollageTypeCard>
        </section>
      </div>
    </div>
  );
}

export default Tips;
