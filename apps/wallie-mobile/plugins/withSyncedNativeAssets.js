const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

/** Keep ios AppIcon + splash in sync with assets/icon.png on every prebuild. */
function withSyncedNativeAssets(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;
      const projectName = config.modRequest.projectName;
      const iconSource = path.join(projectRoot, "assets", "icon.png");

      if (!fs.existsSync(iconSource)) {
        return config;
      }

      const xcassets = path.join(platformRoot, projectName, "Images.xcassets");

      const appIconTarget = path.join(
        xcassets,
        "AppIcon.appiconset",
        "App-Icon-1024x1024@1x.png",
      );
      if (fs.existsSync(path.dirname(appIconTarget))) {
        fs.copyFileSync(iconSource, appIconTarget);
      }

      const splashDir = path.join(xcassets, "SplashScreenLogo.imageset");
      if (fs.existsSync(splashDir)) {
        for (const name of ["image.png", "image@2x.png", "image@3x.png"]) {
          fs.copyFileSync(iconSource, path.join(splashDir, name));
        }
      }

      return config;
    },
  ]);
}

module.exports = withSyncedNativeAssets;
