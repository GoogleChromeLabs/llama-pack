/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Feature} from './Feature';
import {AppsFlyerFeature} from './AppsFlyerFeature';
import {TwaManifest} from '../TwaManifest';

export class FeatureManager {
  build = {
    repositories: new Set<string>(),
    dependencies: new Set<string>(),
  };
  androidManifest = {
    permissions: new Set<string>(),
    components: new Array<string>(),
  };
  applicationClass = {
    imports: new Set<string>(),
    variables: new Array<string>(),
    onCreate: new Array<string>(),
  };
  launcherActivity = {
    imports: new Set<string>(),
    launchUrl: new Array<string>(),
  };

  constructor(twaManifest: TwaManifest) {
    if (twaManifest.features.appsFlyer !== undefined) {
      this.addFeature(new AppsFlyerFeature(twaManifest.features.appsFlyer));
    }

    // The WebView fallback needs the INTERNET permission.
    if (twaManifest.fallbackType === 'webview') {
      this.androidManifest.permissions.add('android.permission.INTERNET');
    }
  }

  addFeature(feature: Feature): void {
    // Adds properties to build
    feature.build.repositories.forEach((repo) => {
      this.build.repositories.add(repo);
    });

    feature.build.dependencies.forEach((dep) => {
      this.build.dependencies.add(dep);
    });

    // Adds properties to application
    feature.application.imports.forEach((imp) => {
      this.applicationClass.imports.add(imp);
    });

    feature.application.variables.forEach((imp) => {
      this.applicationClass.variables.push(imp);
    });

    if (feature.application.onCreate) {
      this.applicationClass.onCreate.push(feature.application.onCreate);
    }

    // Adds properties to AndroidManifest.xml
    feature.androidManifest.permissions.forEach((permission) => {
      this.androidManifest.permissions.add(permission);
    });

    feature.androidManifest.components.forEach((component) => {
      this.androidManifest.components.push(component);
    });

    // Adds properties to launcherActivity
    feature.launcherActivity.imports.forEach((imp) => {
      this.launcherActivity.imports.add(imp);
    });

    if (feature.launcherActivity?.launchUrl) {
      this.launcherActivity.launchUrl.push(feature.launcherActivity.launchUrl);
    }
  }
}
