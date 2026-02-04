import { Injectable, signal } from '@angular/core';
import * as THREE from 'three';

export interface GlobeNode {
  id: string;
  position: THREE.Vector3;
  propertyId: string;
  isHovered: boolean;
  isSelected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GlobeService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private globe: THREE.Mesh | null = null;
  private animationId: number | null = null;

  private nodes = signal<GlobeNode[]>([]);
  private selectedNode = signal<GlobeNode | null>(null);
  private hoveredNode = signal<GlobeNode | null>(null);

  readonly nodes$ = this.nodes.asReadonly();
  readonly selectedNode$ = this.selectedNode.asReadonly();
  readonly hoveredNode$ = this.hoveredNode.asReadonly();

  initializeGlobe(container: HTMLElement): void {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(7, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.createGlobe();
    this.addLights();
    this.animate();
  }

  private createGlobe(): void {
    const geometry = new THREE.SphereGeometry(4, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    
    const material = new THREE.MeshPhongMaterial({
      map: textureLoader.load('/earth.png'),
      bumpMap: textureLoader.load('/earth.png'),
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
      shininess: 25
    });

    this.globe = new THREE.Mesh(geometry, material);
    this.scene?.add(this.globe);
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene?.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    this.scene?.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFFD700, 1.2, 25);
    pointLight.position.set(-6, 0, 0);
    this.scene?.add(pointLight);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.globe) {
      this.globe.rotation.y += 0.0005;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  addPropertyNode(propertyId: string, lat: number, lng: number): void {
    const position = this.latLngToVector3(lat, lng, 4.1);
    const node: GlobeNode = {
      id: `node-${propertyId}`,
      position,
      propertyId,
      isHovered: false,
      isSelected: false
    };

    this.nodes.update(nodes => [...nodes, node]);
    this.createNodeMesh(node);
  }

  private createNodeMesh(node: GlobeNode): void {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(node.position);
    mesh.userData = { nodeId: node.id };
    
    this.scene?.add(mesh);
  }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  selectNode(nodeId: string): void {
    const node = this.nodes().find(n => n.id === nodeId);
    if (node) {
      this.selectedNode.set(node);
    }
  }

  hoverNode(nodeId: string | null): void {
    const node = nodeId ? this.nodes().find(n => n.id === nodeId) : null;
    this.hoveredNode.set(node ?? null);
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.renderer?.dispose();
    this.scene?.clear();
  }

  onResize(width: number, height: number): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }
}
