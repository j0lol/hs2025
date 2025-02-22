use std::error::Error;
use axum::Router;
use axum::routing::get;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let app = Router::new()
        .route("/", get(root));

    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root() -> &'static str {
    "Hello HackSussex!"
}