import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

const ARTICLES = {
  'bot-detection-101': {
    title: 'Bot Detection 101',
    content:
      'Modern bots mimic human behavior. BotGuard combines behavioral signals, session metadata, and risk scoring to classify traffic in real time.',
  },
  'session-replay-guide': {
    title: 'Session Replay Guide',
    content:
      'Use session replay to visualize mouse paths, clicks, and navigation events when investigating flagged sessions from your dashboard.',
  },
};

function ArticleDetail() {
  const { slug } = useParams();
  const article = ARTICLES[slug] || {
    title: slug?.replace(/-/g, ' ') || 'Article',
    content: 'Article content not found.',
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/blog" className="text-sm text-teal hover:underline">
          ← Back to Blog
        </Link>
        <PageHeader title={article.title} />
        <Card>
          <p className="leading-relaxed text-gray-700">{article.content}</p>
        </Card>
      </div>
    </section>
  );
}

export default memo(ArticleDetail);
