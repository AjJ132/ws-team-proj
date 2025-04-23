// app/dashboard/extensions/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExtension } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ChevronLeft, Edit, Download } from 'lucide-react';

interface ExtensionDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ExtensionDetailPageProps): Promise<Metadata> {
  try {
    const extensionResponse = await getExtension(params.id);
    
    return {
      title: `${extensionResponse.data.name} | Extension Repository`,
      description: extensionResponse.data.description || 'Extension details',
    };
  } catch (error) {
    console.error('Error fetching extension:', error);
    return {
      title: 'Extension Not Found',
      description: 'The requested extension could not be found',
    };
  }
}

export default async function ExtensionDetailPage({ params }: ExtensionDetailPageProps) {
  let extension;
  
  try {
    const response = await getExtension(params.id);
    extension = response.data;
  } catch (error) {
    console.error('Error fetching extension:', error);
    notFound();
  }

  // Sort versions by name (usually contains version numbers)
  const sortedVersions = [...(extension.versionDetails || [])].sort((a, b) => 
    b.versionName.localeCompare(a.versionName, undefined, { numeric: true })
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{extension.name}</h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <span>By {extension.uploader?.user?.username || 'Unknown'}</span>
              </div>
            </div>
            <Button asChild>
              <Link href={`/dashboard/extensions/${extension.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {extension.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
            {extension.tags.length === 0 && (
              <Badge variant="outline">No tags</Badge>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {extension.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="versions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="versions">
              <Card>
                <CardHeader>
                  <CardTitle>Versions</CardTitle>
                  <CardDescription>
                    All available versions of this extension
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedVersions.length > 0 ? (
                      sortedVersions.map((version) => (
                        <Card key={version.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">
                                {version.versionName}
                              </CardTitle>
                              <Badge
                                variant={
                                  version.status === 'Approved'
                                    ? 'default'
                                    : version.status === 'Pending'
                                    ? 'outline'
                                    : 'destructive'
                                }
                              >
                                {version.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm">
                              {version.description || 'No description provided.'}
                            </p>
                            
                            {version.dependencies && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-1">Dependencies</h4>
                                <p className="text-sm text-muted-foreground">
                                  {version.dependencies}
                                </p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 pb-4">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">No versions available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>
                    Files included in the latest version
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedVersions.length > 0 && sortedVersions[0].files?.length > 0 ? (
                    <ul className="space-y-2">
                      {sortedVersions[0].files.map((file) => (
                        <li key={file.id} className="flex justify-between p-2 rounded border">
                          <span className="truncate flex-1">{file.filePath.split('/').pop()}</span>
                          <span className="text-muted-foreground ml-4">
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No files available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Extension Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Uploader</h3>
                  <p className="text-sm text-muted-foreground">
                    {extension.uploader?.user?.username || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Versions</h3>
                  <p className="text-sm text-muted-foreground">
                    {extension.versionDetails?.length || 0} available
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Latest Version</h3>
                  <p className="text-sm text-muted-foreground">
                    {sortedVersions.length > 0 ? sortedVersions[0].versionName : 'None'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Status</h3>
                  <Badge
                    variant={
                      sortedVersions.length > 0 && sortedVersions[0].status === 'Approved'
                        ? 'default'
                        : sortedVersions.length > 0 && sortedVersions[0].status === 'Pending'
                        ? 'outline'
                        : 'destructive'
                    }
                    className="mt-1"
                  >
                    {sortedVersions.length > 0 ? sortedVersions[0].status : 'No Version'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/extensions/${extension.id}/versions/create`}>
                  Add New Version
                </Link>
              </Button>
              
              {sortedVersions.length > 0 && (
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Latest
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}