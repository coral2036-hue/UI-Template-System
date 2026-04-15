import type { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  inputBar: ReactNode;
  subPanel?: ReactNode;
}

export default function AppLayout({ sidebar, header, children, inputBar, subPanel }: AppLayoutProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-brq-background">
      {/* Sidebar */}
      {sidebar}

      {/* Main area */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Content column */}
        <div className="flex flex-col flex-1 min-w-0">
          {header}
          <main className="flex-1 overflow-y-auto flex flex-col">
            {children}
          </main>
          {inputBar}
        </div>

        {/* SubPanel */}
        {subPanel}
      </div>
    </div>
  );
}
