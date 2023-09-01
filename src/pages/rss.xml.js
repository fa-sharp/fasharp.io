import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
    const blogPosts = await getCollection('blog', post => post.data.status === 'published');
    return rss({
        title: 'fa-sharp | blog',
        description: "Farshad's blog",
        site: 'https://fasharp.io',
        items: blogPosts.map(({ data, slug }) => ({
            title: data.title,
            pubDate: data.pubDate,
            description: data.description,
            categories: data.tags,
            link: `/blog/${slug}`
        })),
        customData: `<language>en-us</language>`,
    });
}