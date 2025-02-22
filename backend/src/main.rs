use std::error::Error;
use axum::extract::WebSocketUpgrade;
use axum::extract::ws::WebSocket;
use axum::response::{Html, Response};
use axum::{Extension, Router};
use axum::routing::{any, get};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;

#[derive(Clone, Debug)]
struct Player {}

#[derive(Clone, Debug)]
struct State {
    players: Vec<Player>
}

impl State {
    fn new() -> Self {
        State { players: vec![] }
    }
}

#[derive(Deserialize, Serialize)]
#[derive(Debug)]
enum WsMessage {
    Accelerometer { content: f64 }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    
    let state = State::new();
    
    let app = Router::new()
        .route("/ws", any(ws_handler))
        .route("/testclient", get(test_client))
        .route("/", get(root))
        .layer(Extension(state));

    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root(Extension(state): Extension<State>) -> String {
    format!("{state:?}")
}

async fn test_client() -> Html<String> {
    Html(String::from(include_str!("./test.html")))
}

async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            // client disconnected
            return;
        };

        let data = msg.to_text().unwrap();
        let data: WsMessage = serde_json::from_str(data).unwrap();
        dbg!(data);

        if socket.send(msg).await.is_err() {
            // client disconnected
            return;
        }

    }
}
