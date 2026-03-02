import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import updates from "@/data/updates";

export function UpdatesCard() {
  const visible = updates.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">What&apos;s New</CardTitle>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eld-almond-silk/30">
          <Megaphone className="h-6 w-6 text-eld-space-indigo dark:text-eld-almond-silk" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visible.map((u) => (
            <div key={u.version} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-eld-dusty-grape/10 px-2.5 py-0.5 text-xs font-semibold text-eld-dusty-grape dark:bg-eld-dusty-grape/20 dark:text-eld-almond-silk">
                {u.version}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-foreground">{u.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{u.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
