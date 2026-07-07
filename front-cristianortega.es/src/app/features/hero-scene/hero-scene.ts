import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import type * as THREE_NS from 'three';

/**
 * Escena 3D real (WebGL / Three.js) para el Hero: un "ordenador" y un "móvil"
 * con la pantalla renderizada con el contenido real de la web, y dos tarjetas
 * con los datos reales orbitando alrededor con profundidad y oclusión 3D de verdad
 * (se esconden detrás del monitor de forma correcta gracias al z-buffer, no con trucos de CSS).
 *
 * Se carga de forma perezosa (import dinámico de "three") para no penalizar
 * el peso inicial del resto de la web, y solo se activa en escritorio (lg+).
 */
@Component({
  selector: 'app-hero-scene',
  template: `<canvas #canvas class="block h-full w-full"></canvas>`,
})
export class HeroScene implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private THREE?: typeof THREE_NS;
  private renderer?: THREE_NS.WebGLRenderer;
  private scene?: THREE_NS.Scene;
  private camera?: THREE_NS.PerspectiveCamera;
  private sceneGroup?: THREE_NS.Group;
  private badgeA?: THREE_NS.Group;
  private badgeB?: THREE_NS.Group;
  private badgeC?: THREE_NS.Group;
  private desktopShine?: THREE_NS.Mesh;
  private mobileShine?: THREE_NS.Mesh;
  private frame?: number;
  private resizeObserver?: ResizeObserver;
  private destroyed = false;

  private targetRotX = 0;
  private targetRotY = 0;
  private currentRotX = 0;
  private currentRotY = 0;
  private startTime = 0;

  /** Radio de la órbita, recalculado en cada resize para que nunca se salga del encuadre. */
  private orbitRadiusX = 3.6;
  private orbitRadiusZ = 2.0;

  private readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.reducedMotion) {
      return;
    }
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.targetRotY = (x - 0.5) * 0.5;
    this.targetRotX = (y - 0.5) * -0.25;
  };

  private readonly onPointerLeave = (): void => {
    this.targetRotX = 0;
    this.targetRotY = 0;
  };

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      return;
    }
    void this.init();
  }

  private async init(): Promise<void> {
    const THREE = await import('three');
    if (this.destroyed) {
      return;
    }
    this.THREE = THREE;

    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement ?? canvas;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.35, 9);
    this.camera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5.5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.radius = 4;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-3, 2, 4);
    scene.add(fill);
    const blueLight = new THREE.PointLight(0x2563eb, 4, 22);
    blueLight.position.set(-4.5, 1.5, 3.5);
    scene.add(blueLight);
    const emeraldLight = new THREE.PointLight(0x059669, 3.5, 22);
    emeraldLight.position.set(4.5, -1.5, 3.5);
    scene.add(emeraldLight);

    const sceneGroup = new THREE.Group();
    this.sceneGroup = sceneGroup;
    scene.add(sceneGroup);

    sceneGroup.add(this.buildMonitor(THREE));

    const phone = this.buildPhone(THREE);
    phone.position.set(2.5, -0.75, 0.9);
    phone.rotation.y = -0.35;
    sceneGroup.add(phone);

    this.badgeA = this.buildBadge(THREE, '+3', 'años de experiencia', '#0f172a');
    this.badgeB = this.buildBadge(THREE, '+10', 'proyectos completados', '#059669');
    this.badgeC = this.buildBadge(THREE, '24-48h', 'Respuesta garantizada', '#2563eb');
    sceneGroup.add(this.badgeA);
    sceneGroup.add(this.badgeB);
    sceneGroup.add(this.badgeC);
    this.positionBadges(0);

    sceneGroup.add(this.buildGroundShadow(THREE));

    this.handleResize();
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    container.addEventListener('pointermove', this.onPointerMove);
    container.addEventListener('pointerleave', this.onPointerLeave);

    this.startTime = performance.now();
    this.animate();
  }

  private positionBadges(t: number): void {
    if (!this.THREE || !this.camera || !this.badgeA || !this.badgeB || !this.badgeC) {
      return;
    }
    const speed = 0.3;
    const radiusX = this.orbitRadiusX;
    const radiusZ = this.orbitRadiusZ;
    const phaseStep = (Math.PI * 2) / 3; // 3 tarjetas repartidas a partes iguales en la órbita

    const badges = [this.badgeA, this.badgeB, this.badgeC];
    badges.forEach((badge, i) => {
      const angle = t * speed + phaseStep * i;
      badge.position.set(
        Math.cos(angle) * radiusX,
        0.85 + Math.sin(angle * 0.6 + i) * 0.35,
        Math.sin(angle) * radiusZ
      );
      badge.lookAt(this.camera!.position);
    });
  }

  /** Destello periódico que cruza cada pantalla, como el brillo de un cristal. */
  private updateScreenShine(t: number): void {
    this.applyShineSweep(this.desktopShine, t, 0, 4.1);
    this.applyShineSweep(this.mobileShine, t, 2.6, 0.93);
  }

  private applyShineSweep(mesh: THREE_NS.Mesh | undefined, t: number, phaseOffset: number, screenWidth: number): void {
    if (!mesh) {
      return;
    }
    const cycle = 5.5;
    const duration = 1.2;
    const localT = (t + phaseOffset) % cycle;
    if (localT > duration) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    const progress = localT / duration;
    const travel = screenWidth * 1.3;
    mesh.position.x = -travel + progress * travel * 2;
  }

  /**
   * Ajusta la distancia de la cámara para que el ordenador y el móvil quepan
   * siempre enteros (sin cortarse), y calcula cuánto sitio real queda para
   * que las tarjetas orbiten sin salirse nunca del encuadre.
   */
  private handleResize(): void {
    if (!this.renderer || !this.camera) {
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement ?? canvas;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;

    const vFovRad = (this.camera.fov * Math.PI) / 180;

    // La cámara está desplazada hacia arriba (y = 0.35), así que el encuadre NO es
    // simétrico respecto al contenido: hay que medir por separado cuánto sitio hace
    // falta por encima del punto más alto (el borde del monitor) y por debajo del
    // punto más bajo (la base), y quedarnos con el que más exija.
    const cameraY = 0.35;
    const contentTop = 1.4; // borde superior del monitor
    const contentBottom = -2.2; // borde inferior de la base/peana
    const staticHalfHeight = Math.max(contentTop - cameraY, cameraY - contentBottom) + 0.45; // margen de seguridad
    const staticHalfWidth = 3.4; // cubre el monitor + el móvil con margen

    const distForHeight = staticHalfHeight / Math.tan(vFovRad / 2);
    const distForWidth = staticHalfWidth / (Math.tan(vFovRad / 2) * this.camera.aspect);
    const distance = Math.max(distForHeight, distForWidth, 8) * 1.08;
    this.camera.position.z = distance;
    this.camera.updateProjectionMatrix();

    const visibleHalfHeight = distance * Math.tan(vFovRad / 2);
    const visibleHalfWidth = visibleHalfHeight * this.camera.aspect;
    const badgeHalfWidth = 1.1;
    const badgeHalfHeight = 0.65;
    this.orbitRadiusX = Math.max(2.6, visibleHalfWidth - badgeHalfWidth - 0.3);
    this.orbitRadiusZ = Math.max(1.6, Math.min(2.6, (visibleHalfHeight - badgeHalfHeight - 0.3) * 0.9));
  }

  private readonly animate = (): void => {
    if (this.destroyed || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    this.frame = requestAnimationFrame(this.animate);
    const t = (performance.now() - this.startTime) / 1000;

    if (!this.reducedMotion) {
      this.positionBadges(t);
      this.updateScreenShine(t);

      const idle = Math.sin(t * 0.25) * 0.04;
      this.currentRotX += (this.targetRotX - this.currentRotX) * 0.05;
      this.currentRotY += (this.targetRotY - this.currentRotY) * 0.05;
      if (this.sceneGroup) {
        this.sceneGroup.rotation.x = this.currentRotX;
        this.sceneGroup.rotation.y = this.currentRotY + idle;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  // ---- Construcción de la geometría 3D ----

  /** Caja con las esquinas realmente redondeadas (no un cubo con textura, geometría de verdad). */
  private createRoundedBoxGeometry(
    THREE: typeof THREE_NS,
    width: number,
    height: number,
    depth: number,
    radius: number
  ): THREE_NS.ExtrudeGeometry {
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);

    const shape = new THREE.Shape();
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: Math.min(radius * 0.3, depth * 0.4),
      bevelSize: Math.min(radius * 0.25, depth * 0.35),
      bevelSegments: 3,
      curveSegments: 10,
    });
    geometry.translate(0, 0, -depth / 2);
    geometry.computeVertexNormals();
    return geometry;
  }

  private buildMonitor(THREE: typeof THREE_NS): THREE_NS.Group {
    const group = new THREE.Group();

    const bezelMaterial = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.55, roughness: 0.3 });
    const bezel = new THREE.Mesh(this.createRoundedBoxGeometry(THREE, 4.5, 2.75, 0.16, 0.14), bezelMaterial);
    bezel.castShadow = true;
    group.add(bezel);

    const screenMaterial = new THREE.MeshBasicMaterial({ map: this.createDesktopScreenTexture(THREE) });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 2.35), screenMaterial);
    screen.position.z = 0.16;
    group.add(screen);

    this.desktopShine = this.buildShineMesh(THREE, 4.1, 2.35, 0.17);
    group.add(this.desktopShine);

    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.75, 0.22), standMaterial);
    neck.position.set(0, -1.68, -0.02);
    neck.castShadow = true;
    group.add(neck);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.1, 40), standMaterial);
    base.position.set(0, -2.1, -0.02);
    base.castShadow = true;
    group.add(base);

    return group;
  }

  private buildPhone(THREE: typeof THREE_NS): THREE_NS.Group {
    const group = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
    const body = new THREE.Mesh(this.createRoundedBoxGeometry(THREE, 1.05, 2.05, 0.13, 0.16), bodyMaterial);
    body.castShadow = true;
    group.add(body);

    const screenMaterial = new THREE.MeshBasicMaterial({ map: this.createMobileScreenTexture(THREE) });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.93, 1.88), screenMaterial);
    screen.position.z = 0.14;
    group.add(screen);

    this.mobileShine = this.buildShineMesh(THREE, 0.93, 1.88, 0.15);
    group.add(this.mobileShine);

    return group;
  }

  private buildBadge(THREE: typeof THREE_NS, big: string, small: string, accentColor: string): THREE_NS.Group {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      map: this.createBadgeTexture(THREE, big, small, accentColor),
      transparent: true,
      roughness: 0.5,
      metalness: 0,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 1.17), material);
    plane.castShadow = true;
    group.add(plane);
    return group;
  }

  private buildGroundShadow(THREE: typeof THREE_NS): THREE_NS.Mesh {
    const material = new THREE.ShadowMaterial({ opacity: 0.28 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -2.15;
    mesh.receiveShadow = true;
    return mesh;
  }

  /** Franja de luz que cruza una pantalla, como un reflejo de cristal. */
  private buildShineMesh(THREE: typeof THREE_NS, screenWidth: number, screenHeight: number, z: number): THREE_NS.Mesh {
    const geometry = new THREE.PlaneGeometry(screenWidth * 0.16, screenHeight * 1.8);
    const material = new THREE.MeshBasicMaterial({
      map: this.createShineTexture(THREE),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = -0.35;
    mesh.position.z = z;
    mesh.visible = false;
    return mesh;
  }

  // ---- Texturas dibujadas en canvas 2D (texto siempre nítido y real) ----

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private createDesktopScreenTexture(THREE: typeof THREE_NS): THREE_NS.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 585;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pillWidth = 360;
    const pillX = canvas.width / 2 - pillWidth / 2;
    ctx.fillStyle = '#f8fafc';
    this.roundRect(ctx, pillX, 70, pillWidth, 46, 23);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    this.roundRect(ctx, pillX, 70, pillWidth, 46, 23);
    ctx.stroke();
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(pillX + 28, 93, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Diseño y desarrollo web', pillX + 46, 99);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 44px "Space Grotesk", Inter, sans-serif';
    ctx.fillText('¿Tu web no te está trayendo clientes?', canvas.width / 2, 225);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('Vamos a arreglarlo.', canvas.width / 2, 282);

    const btnWidth = 330;
    const btnX = canvas.width / 2 - btnWidth / 2;
    ctx.fillStyle = '#2563eb';
    this.roundRect(ctx, btnX, 335, btnWidth, 66, 13);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillText('Pide tu presupuesto gratis', canvas.width / 2, 376);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private createMobileScreenTexture(THREE: typeof THREE_NS): THREE_NS.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 840;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 56);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('cristianortega.es', canvas.width / 2, 34);

    ctx.fillStyle = '#0f172a';
    ctx.font = '700 34px "Space Grotesk", Inter, sans-serif';
    ctx.fillText('¿Tu web no te está', canvas.width / 2, 220);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('trayendo clientes?', canvas.width / 2, 265);

    const btnWidth = 260;
    const btnX = canvas.width / 2 - btnWidth / 2;
    ctx.fillStyle = '#2563eb';
    this.roundRect(ctx, btnX, 330, btnWidth, 58, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 19px Inter, sans-serif';
    ctx.fillText('Pide presupuesto', canvas.width / 2, 366);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private createShineTexture(THREE: typeof THREE_NS): THREE_NS.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  }

  private createBadgeTexture(
    THREE: typeof THREE_NS,
    big: string,
    small: string,
    accentColor: string
  ): THREE_NS.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 520;
    canvas.height = 296;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'rgba(15,23,42,0.28)';
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = '#ffffff';
    this.roundRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    this.roundRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 30);
    ctx.stroke();

    ctx.textAlign = 'center';
    const maxBigWidth = canvas.width - 90;
    let bigSize = 78;
    ctx.font = `700 ${bigSize}px "Space Grotesk", Inter, sans-serif`;
    while (ctx.measureText(big).width > maxBigWidth && bigSize > 40) {
      bigSize -= 4;
      ctx.font = `700 ${bigSize}px "Space Grotesk", Inter, sans-serif`;
    }
    ctx.fillStyle = accentColor;
    ctx.fillText(big, canvas.width / 2, 155);

    const maxSmallWidth = canvas.width - 70;
    let smallSize = 34;
    ctx.font = `500 ${smallSize}px Inter, sans-serif`;
    while (ctx.measureText(small).width > maxSmallWidth && smallSize > 20) {
      smallSize -= 2;
      ctx.font = `500 ${smallSize}px Inter, sans-serif`;
    }
    ctx.fillStyle = '#64748b';
    ctx.fillText(small, canvas.width / 2, 210);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
    }
    this.resizeObserver?.disconnect();
    const canvas = this.canvasRef?.nativeElement;
    const container = canvas?.parentElement ?? canvas;
    container?.removeEventListener('pointermove', this.onPointerMove);
    container?.removeEventListener('pointerleave', this.onPointerLeave);

    this.scene?.traverse((obj: THREE_NS.Object3D) => {
      const mesh = obj as THREE_NS.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      const material = (mesh as unknown as { material?: THREE_NS.Material | THREE_NS.Material[] }).material;
      if (Array.isArray(material)) {
        material.forEach((m) => this.disposeMaterial(m));
      } else if (material) {
        this.disposeMaterial(material);
      }
    });
    this.renderer?.dispose();
  }

  private disposeMaterial(material: THREE_NS.Material): void {
    const mat = material as THREE_NS.MeshStandardMaterial;
    mat.map?.dispose();
    mat.dispose();
  }
}
