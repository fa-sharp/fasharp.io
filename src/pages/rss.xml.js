import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET() {
    return rss({
        title: 'Farshad Zadeh | Blog',
        description: "Farshad Zadeh's blog",
        site: 'https://fasharp.io',
        items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
        customData: `<language>en-us</language>`,
    });
}