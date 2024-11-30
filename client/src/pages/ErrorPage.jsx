function ErrorPage({ code, message}) {
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
      <h1>Error {code}</h1>
      <p>{message}</p>
    </div>
  );
}

export default ErrorPage;
