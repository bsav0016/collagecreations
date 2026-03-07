import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../../../layout/navBars/navBar";
import MediumLogoHeader from "../../../layout/mediumLogoHeader/mediumLogoHeader";
import { ThemeSettings } from "../../../components/themeSettings/themeSettings";
import { TextSizeSettings } from "../../../components/textSizeSettings/textSizeSettings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";

function Settings(): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>Settings | Collage Creations</title>
        <meta
          name="description"
          content="Customize your Mosaic Maker experience. Adjust theme preferences and other settings."
        />
      </Helmet>

      <div>
        <NavBar />
        <MediumLogoHeader title="Settings" />

        <main className="flex justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how Mosaic Maker looks on your device.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSettings />
                <TextSizeSettings />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

export default Settings;
