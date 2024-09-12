/**
 * v0 by Vercel.
 * @see https://v0.dev/t/rGsTXDIkNql
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Component() {
  return (
    <div className="flex w-full h-screen">
      <div className="bg-background p-6 border-r border-muted-foreground/10 w-64 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          📅
          <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
        </div>
        <div className="flex flex-col gap-2">
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Mon</div>
            <div className="text-2xl font-semibold">6</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Tue</div>
            <div className="text-2xl font-semibold">7</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Wed</div>
            <div className="text-2xl font-semibold">8</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Thu</div>
            <div className="text-2xl font-semibold">9</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Fri</div>
            <div className="text-2xl font-semibold">10</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Sat</div>
            <div className="text-2xl font-semibold">11</div>
          </Card>
          <Card className="p-4 flex flex-col gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="text-sm font-medium text-muted-foreground">Sun</div>
            <div className="text-2xl font-semibold">12</div>
          </Card>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            📅
            <h2 className="text-2xl font-semibold">Schedule</h2>
          </div>
          <Button variant="outline">Add Appointment</Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>9:00 AM</CardTitle>
              <CardDescription>Meeting with John</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="John" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">Product Manager</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                ✏️ Edit
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                🗑️ Delete
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>11:00 AM</CardTitle>
              <CardDescription>Brainstorming Session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Jane" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-sm text-muted-foreground">Product Designer</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                ✏️ Edit
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                🗑️ Delete
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2:00 PM</CardTitle>
              <CardDescription>Client Presentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Michael" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Michael Johnson</div>
                  <div className="text-sm text-muted-foreground">Client Representative</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                ✏️ Edit
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                🗑️ Delete
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4:00 PM</CardTitle>
              <CardDescription>Team Sync</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Sarah" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Sarah Lee</div>
                  <div className="text-sm text-muted-foreground">Project Manager</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                ✏️ Edit
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                🗑️ Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
