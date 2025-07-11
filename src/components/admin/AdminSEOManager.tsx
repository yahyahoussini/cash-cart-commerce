import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminSEOManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Manager</CardTitle>
        <CardDescription>
          Manage search engine optimization settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-500">SEO management features coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};