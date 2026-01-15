import { MetadataRoute } from 'next'

const TRENDING_TOPICS = [
    "AI Agents",
    "LLM Tools",
    "React Libraries",
    "Next.js Starters",
    "Rust Utilities",
    "Python Automation",
    "Cybersecurity",
    "Web3",
    "SaaS Boilerplates",
]

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://velocityhunt.vercel.app'

    const topicEntries = TRENDING_TOPICS.map((topic) => ({
        url: `${baseUrl}/?q=${encodeURIComponent(topic)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...topicEntries,
    ]
}
