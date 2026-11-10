export default function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="route-progress__spin" aria-hidden="true" />
      <span>Загрузка страницы…</span>
    </div>
  );
}
