// app/dashboard/components/extension-card.tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExtensionDto } from '@/types/interfaces';
import Link from 'next/link';

interface ExtensionCardProps {
  extension: ExtensionDto;
}

export function ExtensionCard({ extension }: ExtensionCardProps) {
  return (
    <Card key={extension.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="truncate">{extension.name}</CardTitle>
        <CardDescription className="truncate">
          By {extension.uploader?.user?.username || 'Unknown'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {extension.description || 'No description provided'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1">
          {extension.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
          {extension.tags.length === 0 && (
            <Badge variant="outline">No tags</Badge>
          )}
        </div>
        <div className="flex justify-between w-full mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/extensions/${extension.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href={`/dashboard/extensions/${extension.id}/edit`}>
              Edit
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}