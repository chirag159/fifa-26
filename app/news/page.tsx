
import { getNews } from "../actions";
import NewsFeed from "@/components/NewsFeed";

export default async function NewsPage() {
    const news = await getNews();

    return <NewsFeed initialNews={news} />;
}
