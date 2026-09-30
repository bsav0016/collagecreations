import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import Footer from '../../../layout/footer/footer';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../../components/generalButton/generalButton';
import { IS_DESKTOP } from '../../../utils/constants/constants';
import { useConstants } from '../../../context/constantsContext';
import QuantitySelection from '../../../components/quantitySelection';
import { processImageString } from '../../../utils/modifyImage';
import { toastRef } from '../../../context/toastContext/toastContext';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { useOrderContext } from '../../../context/orderContext';
import AdminNavBar from '../../../layout/navBars/adminNavBar';
import { cn } from '../../../lib/utils';

interface PreviewProps {
  isAdmin?: boolean;
}

const ZOOM_LEVELS = ['1', '2', '4', '6'];

function Preview({ isAdmin = false }: PreviewProps): React.ReactElement {
  const [collageImage, setCollageImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<string>('1');
  const [chosenZoom, setChosenZoom] = useState<string>('1');

  const navigate = useNavigate();
  const { constants } = useConstants();
  const { watermarkCollage, baseCost, quantity, setQuantity } = useOrderContext();

  const isPrintAvailable = constants?.PRINT_AVAILABLE_MESSAGE === 'AVAILABLE';

  // The purchase panel becomes a bar fixed to the bottom of the screen on mobile (see the
  // "fixed" classes below), which takes it out of document flow. Without a spacer, its
  // content -- and the Footer after it -- would sit underneath the bar. The bar's height
  // isn't a fixed constant (it changes with the quantity row showing/hiding, and with the
  // user's own Text Size setting under Settings), so it's measured directly rather than
  // guessed at with a static padding value.
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const updateHeight = () => setPanelHeight(panel.offsetHeight);
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(panel);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let imageURL: string | null;
    const fetchData = async (): Promise<void> => {
      try {
        const blob = await processImageString(watermarkCollage);
        imageURL = URL.createObjectURL(blob);
        setCollageImage(imageURL);
        window.scrollTo(0, 0);
      } catch (error) {
        navigate('/');
        imageURL = null;
      }
    };

    fetchData();

    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [navigate, watermarkCollage, baseCost]);

  function navigateToOrder(): void {
    navigate('/order/');
  }

  function navigateToDownload(): void {
    navigate('/download/');
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>): void => {
    setZoomScale(chosenZoom);
    const image = e.currentTarget;
    const offsetX = e.nativeEvent.offsetX / image.offsetWidth;
    const offsetY = e.nativeEvent.offsetY / image.offsetHeight;
    image.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>): void => {
    const image = e.currentTarget;
    image.style.transformOrigin = '50% 50%';
    setZoomScale('1');
  };

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity >= 1 && newQuantity <= 30) {
      setQuantity(newQuantity);
    } else {
      toastRef.current?.("Quantity must be between 1 and 30");
    }
  };

  return (
    <div>
      {constants?.AMOUNT_DOWNLOAD === null ? (
        <LoadingScreen />
      ) : (
        <div>
          {isAdmin ? <AdminNavBar /> : <NavBar />}
          <div className="py-5">
            <MediumLogoHeader title={"Collage Preview"} />

            <div
              className={cn(
                "mt-4 mx-auto px-4",
                isAdmin
                  ? "max-w-3xl"
                  : "max-w-6xl grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start",
              )}
            >
              {/* Collage image */}
              <div>
                {IS_DESKTOP && (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-sm text-muted-foreground">Zoom:</span>
                    {ZOOM_LEVELS.map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setChosenZoom(level)}
                        aria-pressed={chosenZoom === level}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                          chosenZoom === level
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50",
                        )}
                      >
                        {level}x
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <img
                    src={collageImage || ''}
                    alt="Collage"
                    className="w-full h-auto"
                    style={{ transform: `scale(${zoomScale})` }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>

                {IS_DESKTOP && (
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Hover over the image to zoom in
                  </p>
                )}
              </div>

              {/* Purchase panel: sticky column on desktop, fixed bar on mobile */}
              {!isAdmin && (
                <div
                  ref={panelRef}
                  className={cn(
                    "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]",
                    "lg:static lg:rounded-xl lg:border lg:shadow-sm lg:p-5",
                  )}
                >
                  <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:mx-0 lg:max-w-none">
                    {isPrintAvailable && (
                      <div className="flex items-center justify-between lg:flex-col lg:items-center lg:gap-1.5">
                        <span className="text-sm font-medium text-foreground">Quantity</span>
                        <QuantitySelection quantity={quantity} handleQuantityChange={handleQuantityChange} />
                      </div>
                    )}

                    <div className="flex flex-col gap-2 lg:gap-3">
                      {isPrintAvailable ? (
                        <GeneralButton
                          onClick={navigateToOrder}
                          text={<>Place Order — ${(parseFloat(String(baseCost / 100)) * quantity).toFixed(2)}</>}
                          variant="primary"
                          fullWidth
                        />
                      ) : (
                        <div className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground text-center">
                          {constants?.PRINT_AVAILABLE_MESSAGE}
                        </div>
                      )}

                      <GeneralButton
                        onClick={navigateToDownload}
                        text={<>Download — ${parseFloat(String(constants?.AMOUNT_DOWNLOAD ?? 0)) / 100}</>}
                        variant={isPrintAvailable ? "ghost" : "primary"}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isAdmin && <Footer />}
          {/* Because the bar is fixed, it always covers the bottom of the *viewport*, not
              the document -- a spacer before the Footer would only push the Footer down,
              not stop it from still ending up flush with the fixed bar once fully scrolled.
              This spacer has to be the very last thing on the page, so scrolling to the true
              bottom leaves this much room below the Footer for the bar to occupy. */}
          {!isAdmin && <div className="lg:hidden" style={{ height: panelHeight }} />}
        </div>
      )}
    </div>
  );
}

export default Preview;
