use bevy::input::keyboard::KeyboardInput;
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        //.add_systems(Update, ())
        .run();
}

fn setup(mut commands: Commands,
         mut asset_server: Res<AssetServer>
) {

    commands.spawn(SceneRoot(asset_server.load(
        GltfAssetLabel::Scene(0).from_asset("cruck.glb")
    )));

    // spawn camera
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(0.0, 1.0, 1.0).looking_at(Vec3::ZERO, Vec3::Y),
        ));
}

fn update(input: Res<ButtonInput<KeyCode>>) {
    if input.pressed(KeyCode::KeyW) {

    }
    if input.pressed(KeyCode::KeyS) {

    }
    if input.pressed(KeyCode::KeyA) {

    }
    if input.pressed(KeyCode::KeyD) {

    }
}