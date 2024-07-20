import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './styles.css';  // Импорт CSS файла

import glock17Obj from './models/Glock_17.obj';  // Импорт OBJ файла
import texture1 from './textures/hohloma.png';    // Импорт текстуры

// Создание сцены
const scene = new THREE.Scene();

// Создание камеры
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Создание рендера
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-d-container').appendChild(renderer.domElement);

// Добавление света
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Загрузка текстур
const textureLoader = new THREE.TextureLoader();
const textures = {
    texture1: textureLoader.load(texture1),
    // Добавьте остальные текстуры, если есть
};

let model; // Переменная для хранения загруженной модели

// Загрузка модели
const objLoader = new OBJLoader();
objLoader.load(glock17Obj, (object) => {
    // Применение текстур к объекту (если необходимо)
    object.traverse((child) => {
        if (child.isMesh) {
            child.material.map = textures.texture1;
        }
    });

    // Масштабирование и позиционирование модели
    object.scale.set(0.3, 0.3, 0.3);  // Уменьшение модели в 10 раз
    object.position.set(-3, -1, 0);    // Позиционирование модели
    object.rotation.set(0, 0, 0);  // Вращение модели, чтобы дуло смотрело вниз

    model = object; // Сохранение модели в переменную
    scene.add(model);
});

// Добавление управления орбитой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Включение инерции
controls.dampingFactor = 0.05;  // Коэффициент инерции
controls.screenSpacePanning = true;  // Включение панорамирования
controls.maxPolarAngle = Math.PI;  // Ограничение угла обзора на 180 градусов
controls.minPolarAngle = 0;  // Позволяет просматривать объект снизу

// Анимация сцены
function animate() {
    requestAnimationFrame(animate);

    controls.update();  // Обновление управления орбитой

    renderer.render(scene, camera);
}

animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
