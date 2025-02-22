use std::ops::{Add, AddAssign};
use bevy::prelude::*;

#[derive(Component)]
struct Car;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, (make_a_big_ass_flat_plane, hi_car))
        .add_systems(Update, update_car)
        .run();
}


fn make_a_big_ass_flat_plane(mut commands: Commands,
                             asset_server: Res<AssetServer>,
                             mut meshes: ResMut<Assets<Mesh>>,
                             mut materials: ResMut<Assets<StandardMaterial>>
) {
    let texture_handle = asset_server.load("./check.jpg");

    let material_handle = materials.add(StandardMaterial {
        base_color_texture: Some(texture_handle.clone()),
        alpha_mode: AlphaMode::Blend,
        unlit: true,
        ..default()
    });

    commands.spawn((
        Mesh3d(meshes.add(Plane3d::new(Vec3::Y, Vec2::new(10.0, 10.0)))),
        MeshMaterial3d(material_handle),
        Transform::from_xyz(0.0, -1.0, 0.0)
    ));
}

fn hi_car(mut commands: Commands,
         mut meshes: ResMut<Assets<Mesh>>,
         mut materials: ResMut<Assets<StandardMaterial>>,
) {

    commands.spawn((
        Car,
        Mesh3d(meshes.add(Cuboid::new(0.25, 0.25, 0.25))),
        MeshMaterial3d(materials.add(Color::WHITE)),
        Transform::from_xyz(0.0, 0.0, 0.0).looking_to(Vec3::NEG_Z, Vec3::Y)
    ));

    // spawn camera
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(0.0, 1.0, 1.0).looking_at(Vec3::ZERO, Vec3::Y),
        ));
}

fn update_car(
          keys: Res<ButtonInput<KeyCode>>,
          mut query: Query<&mut Transform, With<Car>>,
) {
    // Turn left
    if keys.pressed(KeyCode::KeyA) {
        for mut transform in &mut query {
            transform.rotate_y(0.05)
        }
    }

    // Turn right
    if keys.pressed(KeyCode::KeyD) {
        for mut transform in &mut query {
            transform.rotate_y(-0.05)
        }
    }

    // Drive
    if keys.pressed(KeyCode::KeyW) {
        for mut transform in &mut query {
            let forward = transform.forward();
            transform.translation.add_assign(forward * 0.01);
        }

    }

    // Reverse
    if keys.pressed(KeyCode::KeyS) {
        for mut transform in &mut query {
            let forward = transform.forward();
            transform.translation.add_assign(forward * -0.01);
        }
    }
}