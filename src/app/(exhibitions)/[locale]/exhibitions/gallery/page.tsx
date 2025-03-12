import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getGalleryTemplates } from '@/service/gallery';
import { ErrorBoundary } from 'react-error-boundary';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Gallery Templates',
  description: 'Manage your virtual gallery templates',
};

export default function GalleryTemplatesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Gallery Templates</h1>
          <p className="text-muted-foreground mt-1">Create and manage your virtual exhibition spaces</p>
        </div>
        <Button size="lg" asChild className="transition-all hover:scale-105">
          <Link href={`/${params.locale}/exhibitions/creator`}>
            <Plus className="mr-2 h-5 w-5" /> New Template
          </Link>
        </Button>
      </div>

      <ErrorBoundary
        fallback={
          <div className="rounded-md bg-destructive/10 p-6 my-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive p-2">
                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <p className="text-destructive-foreground font-medium">Failed to load gallery templates. Please try again later.</p>
            </div>
          </div>
        }
      >
        <Suspense fallback={<GalleryTemplatesSkeleton />}>
          <TemplatesGrid locale={params.locale} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

async function TemplatesGrid({ locale }: { locale: string }) {
  const templates = await getGalleryTemplates();

  if (templates.length === 0) {
    return (
      <div className="col-span-full text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-primary/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium">No gallery templates yet</h3>
          <p className="text-muted-foreground">Create your first template to get started with virtual exhibitions</p>
          <Button size="lg" asChild className="mt-2">
            <Link href={`/${locale}/exhibitions/gallery/creator`}>
              New Template
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden group hover:shadow-lg transition-all">
          <div className="aspect-video relative">
            {template.previewImage ? (
              <Image
                src={template.previewImage}
                alt={template.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <p className="text-slate-400 font-medium">No preview image</p>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {template.dimensions.xAxis}x{template.dimensions.zAxis}m
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{template.wallHeight}m walls</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
              <span>Model: {template.modelPath.split('/').pop()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            <Button variant="default" size="sm" className="flex-1" asChild>
              <Link href={`/${locale}/exhibitions/gallery/edit/${template.id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function GalleryTemplatesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
          <CardHeader>
            <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
          </CardContent>
          <CardFooter className="flex gap-2">
            <div className="h-9 flex-1 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-9 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-9 bg-slate-200 rounded animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}