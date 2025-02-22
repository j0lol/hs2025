use bevy::prelude::*;
use bevy_rapier3d::prelude::*;
#[derive(Component)]
struct Car;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(RapierPhysicsPlugin::<NoUserData>::default())
        .add_plugins(RapierDebugRenderPlugin::default())
        .add_systems(Startup, (make_a_big_ass_flat_plane, hi_car))
        .add_systems(Update, (update_car, move_camera))
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

    commands.spawn(Collider::cuboid(40.0, 0.1, 40.0)).insert((
        Mesh3d(meshes.add(Plane3d::new(Vec3::Y, Vec2::new(40.0, 40.0)))),
        MeshMaterial3d(material_handle),
        Transform::from_xyz(0.0, -1.0, 0.0)
    ));
}

fn hi_car(mut commands: Commands,
         mut asset_server: Res<AssetServer>
) {

    commands.spawn(RigidBody::Dynamic)
        .insert(Collider::cuboid(0.50, 0.50, 0.50))
        .insert(ExternalForce {
            force: Vec3::splat(0.0),
            torque: Vec3::splat(0.0),
        })
        .insert((
            Car,
            SceneRoot(asset_server.load(
                GltfAssetLabel::Scene(0).from_asset("cruck.glb")
            )),
            Transform::from_xyz(0.0, 0.0, 0.0)
                .looking_to(Vec3::NEG_Z, Vec3::Y)
    ));

    // spawn camera
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(0.0, 2.0, 1.0).looking_at(Vec3::ZERO, Vec3::Y),
        ));
}

fn update_car(
          keys: Res<ButtonInput<KeyCode>>,
          mut query: Query<(&Transform, &mut ExternalForce), With<Car>>,
) {
    // Turn left
    if keys.pressed(KeyCode::KeyA) {
        for (_, mut ext_force) in &mut query {
            ext_force.torque = Vec3::new(0.0, 0.05, 0.0);
        }
    }

    // Turn right
    if keys.pressed(KeyCode::KeyD) {
        for (_, mut ext_force) in &mut query{
            ext_force.torque = Vec3::new(0.0, -0.05, 0.0);
        }
    }

    // Drive
    if keys.pressed(KeyCode::KeyW) {
        for (transform, mut ext_force) in &mut query {
            let forward = transform.forward();
            ext_force.force = forward * 10.0;
        }
    }

    // Reverse
    if keys.pressed(KeyCode::KeyS) {
        for (transform, mut ext_force) in &mut query {
            let forward = transform.forward();
            ext_force.force = forward * -0.5;
        }
    }
}

fn move_camera(
    mut query_cam: Query<&mut Transform, (With<Camera>, Without<Car>)>,
    query_car: Query<&Transform, (With<Car>, Without<Camera>)>,
) {
    // Follow behind the car with the camera.
    let car_transform = query_car.single();
    for mut camera_transform in &mut query_cam {
        camera_transform.translation = car_transform.translation
            - car_transform.forward() * 6.0 // Camera behind the car.
            + Vec3::new(0.0, 2.0, 0.0); // And 1 unit up in the air.
        camera_transform.look_at(car_transform.translation, Vec3::Y)
    }
}