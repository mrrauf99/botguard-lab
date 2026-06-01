import { memo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

const posts = [
  { slug: 'bot-detection-101', title: 'Bot Detection 101', excerpt: 'Understanding modern bot threats.' },
  { slug: 'session-replay-guide', title: 'Session Replay Guide', excerpt: 'How to investigate suspicious sessions.' },
];

function Blog() {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PageHeader title="Blog" subtitle="Insights on bot detection and web security" />
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="block hover:opacity-90">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{post.excerpt}</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Blog);
