import { createHashRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Home } from '@/components/home/Home';
import { CategoryView } from '@/components/category/CategoryView';
import { BlockPage } from '@/components/block/BlockPage';
import { AnnotationStudio } from '@/components/studio/AnnotationStudio';
import { BackupPanel } from '@/components/backup/BackupPanel';
import { Settings } from '@/components/settings/Settings';
import { Licenses } from '@/components/settings/Licenses';
import { NotFound } from '@/components/layout/NotFound';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'c/:categoryId', element: <CategoryView /> },
      { path: 'b/:blockId/:tab?', element: <BlockPage /> },
      { path: 'studio/:blockId', element: <AnnotationStudio /> },
      { path: 'backup', element: <BackupPanel /> },
      { path: 'settings', element: <Settings /> },
      { path: 'licenses', element: <Licenses /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
