import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { SIDE_NAV_ITEMS } from "../../constants/SideNavConstants";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function SideNav({ className }: { className: string }) {
  // const { pathname } = useRouter();
  const { data: sessionData } = useSession();

  console.log(sessionData);
  if (!sessionData) {
    return null;
  }
  return (
    <NavigationMenu.Root className={className} orientation="horizontal">
      <div>
        <Image className="h-100 w-100" src="" alt="Sportz Life" />
      </div>

      <NavigationMenu.List>
        {SIDE_NAV_ITEMS.map(({ label, route }) => (
          <NavigationMenu.Link key={label} href={`${route}`}>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>{label}</NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.Link>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}