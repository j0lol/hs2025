mod game;

use std::error::Error;
use std::os::macos::raw::stat;
use axum::extract::WebSocketUpgrade;
use axum::extract::ws::{Message, WebSocket};
use axum::response::{Html, Response};
use axum::{Extension, Router};
use axum::routing::{any, get};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;
use crate::game::{Game, Player};

#[derive(Clone, Debug)]
struct State {
    players: Vec<Player>,
    game: Option<Game>
}

impl State {
    fn new() -> Self {
        State { players: vec![], game: None }
    }
}

#[derive(Deserialize, Serialize, Debug)]
enum WsMessage {
    Accelerometer { content: f64 },
    JoinRequest,
}

#[derive(Deserialize, Serialize, Debug)]
enum WsResponse {
    JoinAllowed { identifier: u32 },
    JoinDenied
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

async fn handle_socket(Extension(mut state): Extension<State>, mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            // client disconnected
            return;
        };

        let data = msg.to_text().unwrap();
        let data: WsMessage = serde_json::from_str(data).unwrap();
        match data {
            WsMessage::Accelerometer { content } => { dbg!(content); }
            WsMessage::JoinRequest => {
                let player = Player {};
                let identifier = state.players.len() as u32;
                state.players.push(player);

                let data = WsResponse::JoinAllowed { identifier };
                let data = serde_json::to_string(&data).unwrap();
                let data = Message::Text(data.into());

                if socket.send(data).await.is_err() {
                    return;
                };
            }
        }

    }
}
