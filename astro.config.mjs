import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), icon({
    include: {
      'fa6-regular': ['*'],
      'fa6-brands': ['*']
    }
  })]
});