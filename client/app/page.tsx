import { Button } from "@/components/ui/atoms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/molecules/card"

export default function Home() {
  return (
    <div className="p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>DoDesk Client with shadcn/ui</CardTitle>
          <CardDescription>Next.js setup complete! 🚀</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
}