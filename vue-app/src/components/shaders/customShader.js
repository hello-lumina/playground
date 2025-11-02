export const vertexShader = `
uniform float uTime;

varying vec3 vNormal;

void main() {
  vNormal = normal;
  
 
  vec3 pos = position;
  float wave = sin(position.x * 2.0 + uTime) * 0.15;
  wave += sin(position.z * 2.0 + uTime * 1.5) * 0.15;
  pos.y += wave;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export const fragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform bool uToonShading;

varying vec3 vNormal;

void main() {
  // Puls koloru (sin od uTime)
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  vec3 color = uColor * (0.7 + pulse * 0.3);
  
  if (uToonShading) {
    // Prosty toon - stepy jasności
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = dot(normalize(vNormal), lightDir);
    
    
    if (diff > 0.7) {
      color *= 1.0;
    } else if (diff > 0.3) {
      color *= 0.6;
    } else {
      color *= 0.3;
    }
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`