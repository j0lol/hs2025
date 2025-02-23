use bevy::prelude::*;
use bevy_rapier3d::prelude::*;
#[derive(Component)]
struct Car;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(RapierPhysicsPlugin::<NoUserData>::default())
        .add_plugins(RapierDebugRenderPlugin::default())
        .add_systems(Startup, (spawn_plane/*, spawn_ramp*/, spawn_car))
        .add_systems(Update, (move_car, clamp_car.after(move_car)))
        .run();
}


fn spawn_plane(mut commands: Commands,
                             asset_server: Res<AssetServer>,
                             mut meshes: ResMut<Assets<Mesh>>,
                             mut materials: ResMut<Assets<StandardMaterial>>
) {
    let texture_handle = asset_server.load("3vosolo9qrr61.jpg");

    let material_handle = materials.add(StandardMaterial {
        base_color_texture: Some(texture_handle.clone()),
        alpha_mode: AlphaMode::Blend,
        unlit: true,
        ..default()
    });

    commands.spawn(Collider::cuboid(74.0, 0.1, 40.0)).insert((
        Mesh3d(meshes.add(Plane3d::new(Vec3::Y, Vec2::new(74.0, 40.0)))),
        MeshMaterial3d(material_handle),
        Transform::from_xyz(0.0, -1.0, 0.0)
    ));
}

fn spawn_ramp(mut commands: Commands,
                             asset_server: Res<AssetServer>,
                             mut meshes: ResMut<Assets<Mesh>>,
                             mut materials: ResMut<Assets<StandardMaterial>>
) {
    let texture_handle = asset_server.load("3vosolo9qrr61.jpg");

    let material_handle = materials.add(StandardMaterial {
        base_color_texture: Some(texture_handle.clone()),
        alpha_mode: AlphaMode::Blend,
        unlit: true,
        ..default()
    });

    commands.spawn(RigidBody::Fixed).insert(Collider::cuboid(5.0, 0.1, 10.0)).insert((
        Mesh3d(meshes.add(Plane3d::new(Vec3::Y, Vec2::new(5.0, 10.0)))),
        MeshMaterial3d(material_handle),
        Transform::from_xyz(0.0, 0.0, 0.0).with_rotation(Quat::from_rotation_x(0.2))
    ));
}

fn spawn_car(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn(RigidBody::Dynamic)
        .insert(Collider::cuboid(0.50, 0.50, 0.50))
        .insert(Velocity::default())
        .insert(ExternalForce {
            force: Vec3::splat(0.0),
            torque: Vec3::splat(0.0),
        })
        .insert(Damping {
            angular_damping: 10.0,
            linear_damping: 1.0,
        })
        .insert(GravityScale(2.0))
        .insert((
            Car,
            SceneRoot(asset_server.load(
                GltfAssetLabel::Scene(0).from_asset("cruck.glb")
            )),
            Transform::from_xyz(0.0, 0.0, 0.0)
                .looking_to(Vec3::NEG_Z, Vec3::Y)
        ))
        .with_children(|parent| {
            parent.spawn((
                Camera3d::default(),
                Transform::from_xyz(0.0, 1.5, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
            ));
        });
}

fn move_car(
          keys: Res<ButtonInput<KeyCode>>,
          mut query: Query<(&Transform, &mut ExternalForce), With<Car>>,
) {
    // Turn left
    if keys.pressed(KeyCode::KeyA) {
        for (_, mut ext_force) in &mut query {
            ext_force.torque = Vec3::new(0.0, 1.50, 0.0);
        }
    }

    // Turn right
    if keys.pressed(KeyCode::KeyD) {
        for (_, mut ext_force) in &mut query{
            ext_force.torque = Vec3::new(0.0, -1.50, 0.0);
        }
    }

    if !keys.pressed(KeyCode::KeyD) && !keys.pressed(KeyCode::KeyA) {
        for (_, mut ext_force) in &mut query {
            ext_force.torque = Vec3::splat(0.0)
        }
    }

    // Drive
    if keys.pressed(KeyCode::KeyW) {
        for (transform, mut ext_force) in &mut query {
            let forward = transform.forward();
            ext_force.force = forward * 80.0;
        }
    }

    // Reverse
    if keys.pressed(KeyCode::KeyS) {
        for (transform, mut ext_force) in &mut query {
            let forward = transform.forward();
            ext_force.force = forward * -5.0;
        }
    }

    if !keys.pressed(KeyCode::KeyW) && !keys.pressed(KeyCode::KeyS) {
        for (_, mut ext_force) in &mut query {
            ext_force.force = Vec3::splat(0.0);
        }
    }
}

fn clamp_car(
    mut query: Query<&mut Velocity, With<Car>>,
) {
    for mut velocity in &mut query {
        velocity.linvel = velocity.linvel.clamp_length_max(20.0);
    }
}