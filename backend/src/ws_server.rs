use async_tungstenite::tungstenite::{Message, Utf8Bytes};
use bevy::prelude::*;
use bevy_ws_server::{ReceiveError, WsConnection, WsListener};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use serde_json::from_str;
use std::error::Error;

#[derive(Component, Debug)]
pub struct Player {
    id: u32,
    accelerometer: f32,
}
#[derive(Component, Debug)]
pub struct Lobby {
    players: Vec<u32>,
    player_max_size: u32,
}

#[derive(Component)]
pub struct PlayersText;

#[derive(Deserialize, Serialize, Debug)]
pub enum WsMessage {
    Accelerometer { 
        id: u32, 
        content: f64
     },
    JoinRequest,
}

#[derive(Deserialize, Serialize, Debug)]
pub enum WsResponse {
    JoinAllowed { identifier: u32 },
    JoinDenied,
}

pub fn startup(listener: Res<WsListener>) {
    listener.listen("0.0.0.0:3000");
}

pub fn add_player(mut commands: Commands) {
    commands.spawn(Lobby {
        players: vec![],
        player_max_size: const { 4 }
    });

    commands.spawn(Player {
        id: 0,
        accelerometer: 0.0,
    });
    commands.spawn((Text::new("Weh!"), PlayersText));
}

pub fn update_players_text(mut text: Query<&mut Text, With<PlayersText>>, players: Query<&Player>) {
    let players = players.iter().map(|x| format!("{x:#?}")).join(", ");

    for mut t in &mut text {
        **t = players.clone();
    }
}

pub fn receive_message(
    mut commands: Commands,
    mut players: Query<&mut Player>,
    mut lobby: Query<&mut Lobby>,
    connections: Query<(Entity, &WsConnection)>,
) {
    for (entity, conn) in connections.iter() {
        loop {
            match conn.receive() {
                Ok(message) => {
                    handle_message(conn, message, &mut players, &mut lobby, &mut commands).unwrap();
                }
                Err(ReceiveError::Empty) => break,
                Err(ReceiveError::Closed) => {
                    commands.entity(entity).despawn();
                    break;
                }
            }
        }
    }
}

pub fn handle_message(
    conn: &WsConnection,
    payload: Message,
    players: &mut Query<&mut Player>,
    lobby: &mut Query<&mut Lobby>,
    commands: &mut Commands,

) -> Result<(), Box<dyn Error>> {
    let payload = payload.to_text()?;
    dbg!(&payload);
    let payload = from_str(payload)?;

    let mut lobby = lobby.single_mut();

    match payload {
        WsMessage::Accelerometer { id, content } => {
            for mut player in players {
                if player.id == id {
                    player.accelerometer = content as f32;
                    conn.send(Message::Text(Utf8Bytes::from("Updated.")));
                }
            }
        }
        WsMessage::JoinRequest => {
            if lobby.players.len() >= lobby.player_max_size as usize {
                let resp = serde_json::ser::to_string(&WsResponse::JoinDenied).unwrap();
                conn.send(Message::Text(Utf8Bytes::from(resp)));
            }
            let id = lobby.players.len();
            lobby.players.push(id as u32);
            commands.spawn(Player { id: id as u32, accelerometer: 0.0 });

            let resp = serde_json::ser::to_string(&WsResponse::JoinAllowed {identifier: id as u32 }).unwrap();
            conn.send(Message::Text(Utf8Bytes::from(resp)));
        }
    }

    Ok(())
}
