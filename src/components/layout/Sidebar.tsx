
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageSquare, MessageCircle, Bell, Globe, ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { isCollapsed, toggleSidebar, isMobileOpen } = useSidebar();
  const { user, isAuthenticated } = useAuth();
  
  const mainNavItems = [
    { label: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { label: 'Answer Posts', icon: <MessageSquare className="h-5 w-5" />, href: '/answer-posts' },
    { label: 'Debates Now', icon: <MessageCircle className="h-5 w-5" />, href: '/debates' },
    { label: 'Notifications', icon: <Bell className="h-5 w-5" />, href: '/notifications' },
    { label: 'Explore', icon: <Globe className="h-5 w-5" />, href: '/explore' },
  ];

  const userNavItems = [
    { label: 'Profile', icon: <User className="h-5 w-5" />, href: '/profile' },
  ];

  const isNavLinkActive = (href: string) => {
    if (href === '/') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'sidebar',
        isCollapsed && 'sidebar-collapsed',
        isMobileOpen && 'sidebar-open',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between mb-6 py-3 border-b border-gray-700 px-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-debate-primary mr-2 text-white font-bold">
              DC
            </div>
            {!isCollapsed && <span className="font-bold text-xl">DebateConnect</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-sidebar-hover absolute right-3"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* User profile section */}
        {isAuthenticated && !isCollapsed && (
          <NavLink to="/profile" className="px-3 mb-6 hover:bg-sidebar-hover rounded-md mx-2 py-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-debate-primary">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            {user?.badges && user.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {user.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="bg-sidebar-hover text-xs font-normal text-gray-200">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </NavLink>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {mainNavItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'nav-link',
                      isNavLinkActive(item.href) ? 'nav-link-active' : 'nav-link-inactive',
                      isCollapsed ? 'flex items-center justify-center p-2 h-10 w-10' : 'flex items-center gap-3 p-3'
                    )
                  }
                >
                  <span className={cn("flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Navigation */}
        {isAuthenticated && (
          <div className="mb-2 px-3 mt-6">
            {!isCollapsed && (
              <h3 className="text-xs uppercase font-semibold text-gray-400 mb-1">User</h3>
            )}
            <ul className="space-y-1">
              {userNavItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'nav-link',
                        isNavLinkActive(item.href) ? 'nav-link-active' : 'nav-link-inactive',
                        isCollapsed ? 'flex items-center justify-center p-2 h-10 w-10' : 'flex items-center gap-3 p-3'
                      )
                    }
                  >
                    <span className={cn("flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start a Debate Button */}
        <div className="mt-auto pt-4 border-t border-gray-700 px-2 pb-4">
          <Button
            className="w-full bg-debate-primary hover:bg-debate-secondary flex items-center justify-center gap-2"
            size={isCollapsed ? "icon" : "default"}
            asChild
          >
            <NavLink to="/start-debate">
              {isCollapsed ? (
                <Plus className="h-5 w-5" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Start a Debate</span>
                </>
              )}
            </NavLink>
          </Button>
        </div>
      </div>
    </aside>
  );
}
