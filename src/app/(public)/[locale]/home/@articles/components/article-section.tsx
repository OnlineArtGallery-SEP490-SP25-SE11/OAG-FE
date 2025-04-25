import { Button } from '@/components/ui/button';
import { ClockIcon, CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/types/blog';
import { calculateReadingTime } from '@/app/utils';
// import { Heart } from 'lucide-react';

interface ArticleSectionProps {
  articles: Blog[];
}

export function ArticleSection({ articles }: ArticleSectionProps) {
  // Sort articles by heart count to get most popular
  const sortedArticles = [...articles].sort((a, b) => b.heartCount - a.heartCount);
  
  // Most hearted article becomes featured
  const featuredArticle = sortedArticles[0];
  // Rest of the articles
  const regularArticles = sortedArticles.slice(1);

  return (
    <div className="mx-auto px-4">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold">Favourite Articles</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          View All Articles
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Article */}
        {featuredArticle && (
          <FeaturedArticle article={featuredArticle} />
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {regularArticles.map(article => (
            <RegularArticle key={article._id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedArticle({ article }: { article: Blog }) {
  return (
    <div className="group">
      <Link href={`/blog/${article._id}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden mb-6">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full inline-block">
            Most Popular
          </span>
          {/* <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4 fill-current text-red-500" />
            <span className="text-sm">{article.heartCount}</span>
          </div> */}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 mb-4">
          {article.title}
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Image
              src={article.author.image || "/default-avatar.jpg"}
              alt={article.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">{article.author.name}</span>
          </div>
        </div>
        <ArticleMeta article={article} />
      </Link>
    </div>
  );
}

function RegularArticle({ article }: { article: Blog }) {
  return (
    <Link href={`/articles/${article._id}`} className="group">
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
          <Heart className="w-3 h-3 fill-current text-red-500" />
          <span className="text-xs">{article.heartCount}</span>
        </div> */}
      </div>
      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={article.author.image || "/default-avatar.jpg"}
          alt={article.author.name}
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="text-xs text-gray-600">{article.author.name}</span>
      </div>
      <ArticleMeta article={article} />
    </Link>
  );
}

function ArticleMeta({ article }: { article: Blog }) {
  return (
    <div className="flex items-center gap-4 text-gray-500 text-sm">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4" />
        <span>{calculateReadingTime(article.content)} min read</span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}