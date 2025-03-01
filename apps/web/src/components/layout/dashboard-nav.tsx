import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GitPullRequest, 
  History,
  Settings
} from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />
    },
    {
      name: "PR Analyzer",
      href: "/dashboard/pr-analyzer",
      icon: <GitPullRequest className="h-4 w-4 mr-2" />
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: <History className="h-4 w-4 mr-2" />
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4 mr-2" />
    }
  ];

  return (
    <nav className="grid gap-2 p-4">
      {navItems.map((item) => (
        <Link href={item.href} key={item.href} className="w-full">
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "justify-start w-full",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {item.icon}
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
