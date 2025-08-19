import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  RssIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Threat Feeds', href: '/feeds', icon: RssIcon },
  { name: 'IOCs', href: '/iocs', icon: MagnifyingGlassIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile sidebar */}
      <Dialog as="div" className="relative z-50 lg:hidden" open={open} onClose={setOpen}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-800/95 backdrop-blur-xl px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
                <span className="ml-2 text-xl font-bold text-gradient">ThreatIntel</span>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                                isActive
                                  ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }`
                            }
                            onClick={() => setOpen(false)}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-800/95 backdrop-blur-xl px-6 pb-4 ring-1 ring-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-gradient">ThreatIntel</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive
                              ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
