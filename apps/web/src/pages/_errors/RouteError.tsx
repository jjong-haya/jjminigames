import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>라우터 오류</h1>
        <p style={{ marginTop: 8 }}>status: {error.status}</p>
        <p>statusText: {error.statusText}</p>
        {error.data && <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{String(error.data)}</pre>}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>예상치 못한 오류</h1>
      <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {error instanceof Error ? (error.stack || error.message) : String(error)}
      </pre>
    </div>
  );
}
