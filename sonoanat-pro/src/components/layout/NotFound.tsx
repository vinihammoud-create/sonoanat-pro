import { Link, useRouteError } from 'react-router-dom';
import { TopBar } from './TopBar';
import { EmptyState } from '@/components/common/Card';

export function NotFound() {
  const error = useRouteError() as { statusText?: string; message?: string } | undefined;
  return (
    <div className="mx-auto w-full max-w-md px-4">
      <TopBar title="SonoAnat Pro" showBack backTo="/" />
      <EmptyState icon="warning" title="Página não encontrada">
        {error?.statusText || error?.message || 'O endereço não corresponde a nenhum bloqueio ou tela.'}
        <div className="mt-3">
          <Link to="/" className="text-amber-300 underline">
            Voltar ao início
          </Link>
        </div>
      </EmptyState>
    </div>
  );
}
