export function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Configuración inicial</h1>
      <p className="text-sm text-neutral-700">
        El catálogo todavía no está configurado. Necesitás crear el archivo{" "}
        <code className="rounded bg-neutral-200 px-1">.env.local</code> a partir de{" "}
        <code className="rounded bg-neutral-200 px-1">.env.example</code> con dos valores:
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
        <li>
          <code className="rounded bg-neutral-200 px-1">DATABASE_URL</code>: la cadena de conexión de
          tu proyecto de Neon.
        </li>
        <li>
          <code className="rounded bg-neutral-200 px-1">AUTH_SECRET</code>: un secreto aleatorio para
          la sesión de administración (<code className="rounded bg-neutral-200 px-1">openssl rand -base64 32</code>).
        </li>
      </ul>
      <p className="text-sm text-neutral-700">
        Después corrí <code className="rounded bg-neutral-200 px-1">schema.sql</code> en tu base y
        reiniciá el servidor. Los pasos completos están en el README.
      </p>
    </main>
  );
}
